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
    public class CardProgressController : ControllerBase
    {
        private readonly SrsContext Context;

        public CardProgressController(SrsContext context)
        {
            Context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CardProgress>> GetCardProgress(int id)
        {
            var cardProgress = await Context.CardProgresses.FindAsync(id);

            if (cardProgress == null)
            {
                return NotFound();
            }

            return cardProgress;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CardProgress>> PutCardProgress(int id, CardProgress cardProgress)
        {
            if (id != cardProgress.Id)
            {
                return BadRequest();
            }

            if (!CardProgressExists(id))
            {
                return await PostCardProgress(cardProgress);
            }

            Context.Entry(cardProgress).State = EntityState.Modified;

            try
            {
                await Context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CardProgressExists(id))
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
        public async Task<ActionResult<CardProgress>> PostCardProgress(CardProgress cardProgress)
        {
            Context.CardProgresses.Add(cardProgress);
            try
            {
                await Context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CardProgressExists(cardProgress.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCardProgress", new { id = cardProgress.Id }, cardProgress);
        }

        private bool CardProgressExists(int id)
        {
            return Context.CardProgresses.Any(e => e.Id == id);
        }
    }
}
