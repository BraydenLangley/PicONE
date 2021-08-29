using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PicONE.Models;

namespace PicONE.Controllers
{
    public class GamePlayController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Draw(Player player)
        {
            ViewData["AdminPlayer"] = player;

            return View();
        }

        public IActionResult Guess()
        {
            return View();
        }

        public IActionResult Results()
        {
            return View();
        }
    }
}