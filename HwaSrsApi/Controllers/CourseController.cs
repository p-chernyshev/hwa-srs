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
    public class CourseController : ControllerBase
    {
        private readonly SrsContext Context;

        public CourseController(SrsContext context)
        {
            Context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseListViewModel>>> GetCourses()
        {
            return await GetCourseListQuery().ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CourseListViewModel>> GetCourse(int id)
        {
            var course = await GetCourseListQuery().FirstAsync(course => course.Id == id);

            if (course == null)
            {
                return NotFound();
            }

            return course;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourse(int id, Course course)
        {
            if (id != course.Id)
            {
                return BadRequest();
            }

            Context.Entry(course).State = EntityState.Modified;

            try
            {
                await Context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseExists(id))
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
        public async Task<ActionResult<Course>> PostCourse(Course course)
        {
            Context.Courses.Add(course);
            await Context.SaveChangesAsync();

            return CreatedAtAction("GetCourse", new { id = course.Id }, course);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Course>> DeleteCourse(int id)
        {
            var course = await Context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            Context.Courses.Remove(course);
            await Context.SaveChangesAsync();

            return course;
        }

        private IQueryable<CourseListViewModel> GetCourseListQuery()
        {
            return Context.Courses
                .Select(course => new CourseListViewModel
                {
                    Id = course.Id,
                    Name = course.Name,
                    Description = course.Description,
                    Due = Context.Cards
                        .Include(card => card.Progress)
                        .Count(card => card.CourseId == course.Id && card.Progress != null && card.Progress.Status == CardStatus.Reviewing && card.Progress.DueDate.Value.Date <= DateTime.Today),
                    New = Context.Cards
                        .Include(card => card.Progress)
                        .Count(card => card.CourseId == course.Id && card.Progress == null && (string.IsNullOrWhiteSpace(card.ActivationCondition) || card.Progress != null && card.Progress.Status == CardStatus.Activated)),
                });
        }

        private bool CourseExists(int id)
        {
            return Context.Courses.Any(e => e.Id == id);
        }
    }
}
