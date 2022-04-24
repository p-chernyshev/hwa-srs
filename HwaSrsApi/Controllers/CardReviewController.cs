using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HwaSrsApi.Db;
using HwaSrsApi.Models;

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

            return CreatedAtAction("GetCardReview", new { id = cardReview.Id }, cardReview);
        }
    }
}
