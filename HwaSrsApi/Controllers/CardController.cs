using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HwaSrsApi.Db;
using HwaSrsApi.Models;

namespace HwaSrsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardController : ControllerBase
    {
        private readonly SrsContext Context;

        public CardController(SrsContext context)
        {
            Context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Card>>> GetCards()
        {
            return await Context.Cards
                .Include(card => card.Fields)
                .Include(card => card.CardType).ThenInclude(cardType => cardType.Fields)
                .ToListAsync();
        }

        [HttpGet("Review/{courseId}")]
        public async Task<ActionResult<CourseReviewViewModel>> GetCourseReview(int courseId)
        {
            var course = await Context.Courses
                .Select(course => new CourseReviewViewModel
                {
                    Id = course.Id,
                    Due = Context.Cards
                        .Include(card => card.Progress)
                        .Include(card => card.Fields)
                        .Include(card => card.CardType).ThenInclude(cardType => cardType.Fields)
                        .Where(card => card.CourseId == course.Id && card.Progress != null && card.Progress.DueDate >= DateTime.Today && card.Progress.Status == CardStatus.Reviewing)
                        .ToList(),
                    New = Context.Cards
                        .Include(card => card.Progress)
                        .Include(card => card.Fields)
                        .Include(card => card.CardType).ThenInclude(cardType => cardType.Fields)
                        .Where(card => card.CourseId == course.Id && (string.IsNullOrWhiteSpace(card.ActivationCondition) || card.Progress != null && card.Progress.Status == CardStatus.Activated))
                        .ToList(),
                })
                .FirstAsync(course => course.Id == courseId);

            if (course == null)
            {
                return NotFound();
            }

            return course;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Card>> GetCard(int id)
        {
            var card = await Context.Cards
                .Include(card => card.Fields)
                .Include(card => card.CardType).ThenInclude(cardType => cardType.Fields)
                .FirstAsync(card => card.Id == id);

            if (card == null)
            {
                return NotFound();
            }

            return card;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCard(int id, Card card)
        {
            if (id != card.Id)
            {
                return BadRequest();
            }

            Context.Entry(card).State = EntityState.Modified;

            try
            {
                await Context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CardExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Card>> PostCard(Card card)
        {
            Context.Cards.Add(card);
            await Context.SaveChangesAsync();

            return CreatedAtAction("GetCard", new { id = card.Id }, card);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Card>> DeleteCard(int id)
        {
            var card = await Context.Cards.FindAsync(id);
            if (card == null)
            {
                return NotFound();
            }

            Context.Cards.Remove(card);
            await Context.SaveChangesAsync();

            return card;
        }

        private bool CardExists(int id)
        {
            return Context.Cards.Any(e => e.Id == id);
        }
    }
}
