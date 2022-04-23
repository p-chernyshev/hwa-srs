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
    public class CardReviewController : ControllerBase
    {
        private readonly SrsContext Context;

        public CardReviewController(SrsContext context)
        {
            Context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CardReview>>> GetReviews()
        {
            return await Context.Reviews.ToListAsync();
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

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCardReview(int id, CardReview cardReview)
        {
            if (id != cardReview.Id)
            {
                return BadRequest();
            }

            Context.Entry(cardReview).State = EntityState.Modified;

            try
            {
                await Context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CardReviewExists(id))
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
        public async Task<ActionResult<CardReview>> PostCardReview(CardReview cardReview)
        {
            Context.Reviews.Add(cardReview);
            await Context.SaveChangesAsync();

            return CreatedAtAction("GetCardReview", new { id = cardReview.Id }, cardReview);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<CardReview>> DeleteCardReview(int id)
        {
            var cardReview = await Context.Reviews.FindAsync(id);
            if (cardReview == null)
            {
                return NotFound();
            }

            Context.Reviews.Remove(cardReview);
            await Context.SaveChangesAsync();

            return cardReview;
        }

        private bool CardReviewExists(int id)
        {
            return Context.Reviews.Any(e => e.Id == id);
        }
    }
}
