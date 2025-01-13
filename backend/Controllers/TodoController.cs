using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using TodoApp.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace TodoApp.Controllers
{
    [ApiController]
    [Route("api/v1/todos")]
    [Authorize]
    public class TodoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TodoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTodos()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var todos = await _context.TodoItems.Where(t => t.UserId == userId).ToListAsync();
            return Ok(todos);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTodo(TodoItem model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            model.UserId = userId;
            _context.TodoItems.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodo(int id, TodoItem model)
        {
            var todo = await _context.TodoItems.FindAsync(id);
            if (todo == null || todo.UserId != User.FindFirstValue(ClaimTypes.NameIdentifier))
            {
                return NotFound();
            }

            todo.Title = model.Title;
            todo.Description = model.Description;
            todo.Status = model.Status;
            todo.DueDate = model.DueDate;
            await _context.SaveChangesAsync();

            return Ok(todo);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var todo = await _context.TodoItems.FindAsync(id);
            if (todo == null || todo.UserId != User.FindFirstValue(ClaimTypes.NameIdentifier))
            {
                return NotFound();
            }

            _context.TodoItems.Remove(todo);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
