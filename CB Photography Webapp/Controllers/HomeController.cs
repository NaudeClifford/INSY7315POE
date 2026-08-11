using CB_Photography_Webapp.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace CB_Photography_Webapp.Controllers
{
    // Controller handling primary website routes (Home, Privacy, and Error display)
    public class HomeController : Controller
    {
        // GET: / (Renders home page view)
        public IActionResult Index()
        {
            return View();
        }

        // GET: /Home/Privacy (Renders privacy policy view)
        public IActionResult Privacy()
        {
            return View();
        }

        // GET: /Home/Error (Renders error response with diagnostic request identifier)
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

