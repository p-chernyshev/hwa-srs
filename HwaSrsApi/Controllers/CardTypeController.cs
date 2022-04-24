using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HwaSrsApi.Db;
using HwaSrsApi.Models;

namespace HwaSrsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardTypeController : ControllerBase
    {
        private readonly SrsContext Context;

        public CardTypeController(SrsContext context)
        {
            Context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CardType>>> GetCardTypes()
        {
            return await Context.CardTypes
                .Include(cardType => cardType.Fields)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CardType>> GetCardType(int id)
        {
            var cardType = await Context.CardTypes
                .Include(cardType => cardType.Fields)
                .FirstAsync(cardType => cardType.Id == id);

            if (cardType == null)
            {
                return NotFound();
            }

            return cardType;
        }

        [HttpPost]
        public async Task<ActionResult<CardType>> PostCardType(CardType cardType)
        {
            Context.CardTypes.Add(cardType);
            await Context.SaveChangesAsync();

            return CreatedAtAction("GetCardType", new { id = cardType.Id }, cardType);
        }
    }
}
