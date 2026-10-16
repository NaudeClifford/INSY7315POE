using CB_Photography_Webapp.Models;
using CB_Photography_Webapp.Services;
using Microsoft.AspNetCore.Mvc;

namespace CB_Photography_Webapp.Controllers
{
    // API endpoints for managing studio operating expenses and net profit calculations
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly IDataStoreService _dataStore;

        public ExpensesController(IDataStoreService dataStore)
        {
            _dataStore = dataStore;
        }

        // Returns all recorded studio expenses
        [HttpGet]
        public ActionResult<IEnumerable<Expense>> GetExpenses()
        {
            return Ok(_dataStore.GetExpenses());
        }

        // Log a new studio expense
        [HttpPost]
        public ActionResult<Expense> CreateExpense([FromBody] Expense expense)
        {
            if (string.IsNullOrWhiteSpace(expense.Title) || expense.AmountZAR <= 0)
            {
                return BadRequest(new { message = "Expense title and a positive amount (ZAR) are required." });
            }

            if (string.IsNullOrWhiteSpace(expense.Date))
            {
                expense.Date = DateTime.UtcNow.ToString("yyyy-MM-dd");
            }

            var created = _dataStore.CreateExpense(expense);
            return Ok(created);
        }

        // Delete an expense record
        [HttpDelete("{id}")]
        public IActionResult DeleteExpense(string id)
        {
            var success = _dataStore.DeleteExpense(id);
            if (!success)
            {
                return NotFound(new { message = $"Expense {id} not found." });
            }
            return NoContent();
        }
    }
}
