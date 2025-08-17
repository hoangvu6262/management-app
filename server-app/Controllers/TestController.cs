using Microsoft.AspNetCore.Mvc;
using ManagementApp.DTOs;

namespace ManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpPost("simple-login")]
        public ActionResult<object> SimpleLogin([FromBody] object request)
        {
            try
            {
                return Ok(new
                {
                    success = true,
                    message = "Simple login test working",
                    data = new
                    {
                        token = "fake-jwt-token-for-testing",
                        user = "admin"
                    },
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Error: {ex.Message}",
                    data = (object?)null
                });
            }
        }

        [HttpGet("status")]
        public ActionResult<object> GetStatus()
        {
            return Ok(new
            {
                success = true,
                message = "Test controller working",
                services = new
                {
                    database = "checking...",
                    auth = "checking...",
                    jwt = "checking..."
                }
            });
        }
    }
}
