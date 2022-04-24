using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HwaSrsApi.Db;
using HwaSrsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HwaSrsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardReviewController : ControllerBase
    {
        private readonly SrsContext Context;

        public CardReviewController(SrsContext context)
        {
            Context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CardReview>> GetCardReview(int id)
        {
            var cardReview = await Context.Reviews.FindAsync(id);

            if (cardReview == null)
            {
                return NotFound();
            }

            return cardReview;
        }

        [HttpPost]
        public async Task<ActionResult<CardReview>> PostCardReview(CardReview cardReview)
        {
            Context.Reviews.Add(cardReview);
            await Context.SaveChangesAsync();

            await CheckActivation();

            return CreatedAtAction("GetCardReview", new { id = cardReview.Id }, cardReview);
        }

        private async Task CheckActivation()
        {
            var inactiveCards =
                (await Context.Cards
                    .Include(card => card.Progress)
                    .Where(card => card.Progress == null && !string.IsNullOrWhiteSpace(card.ActivationCondition))
                    .ToListAsync())
                .GroupBy(card => card.ActivationCondition);

            foreach (var conditionGroup in inactiveCards)
            {
                var conditionParts = conditionGroup.Key
                    .Split('&')
                    .Select(subcondition =>
                    {
                        var parts = subcondition.Split('=');
                        return new
                        {
                            Key = parts[0].Trim(),
                            Value = parts[1].Trim(),
                        };
                    })
                    .ToList();

                var typeConditions = conditionParts
                    .Where(condition => condition.Key.ToLower() == "type")
                    .Select(condition => condition.Value)
                    .ToArray();
                var typeCondition = typeConditions.Length == 1
                    ? typeConditions[0]
                    : null;

                var tagConditions = conditionParts
                    .Where(condition => condition.Key.ToLower() == "tag")
                    .Select(condition => condition.Value)
                    .ToArray();

                var cardsSatisfyingCondition =
                    (await Context.Cards
                        .Include(card => card.Progress)
                        .Include(card => card.CardType)
                        .Where(card => card.Progress != null)
                        .ToListAsync())
                    .Where(card =>
                        (typeCondition == null || card.CardType.Name == typeCondition)
                        && (tagConditions.Length == 0 || tagConditions.All(condition => card.Tags.Contains(condition))))
                    .ToArray();

                var countCompleteCardsSatisfying = cardsSatisfyingCondition
                    .Count(card => card.Progress.Status == CardStatus.Completed || card.Progress.Interval.HasValue && card.Progress.Interval.Value.TotalDays > 14);

                if ((double)countCompleteCardsSatisfying / cardsSatisfyingCondition.Count() > 0.9)
                {
                    foreach (var card in conditionGroup)
                    {
                        Context.CardProgresses.Add(new CardProgress()
                        {
                            Card = card,
                            Status = CardStatus.Activated,
                        });
                    }
                }
            }

            await Context.SaveChangesAsync();
        }
    }
}
