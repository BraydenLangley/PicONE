using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PicONE.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PicONE.Controllers
{
    [Route("GameCreation")]
    public class GameCreationController : Controller
    {
        private readonly ILogger<GameCreationController> _logger;

        public GameCreationController(ILogger<GameCreationController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet, Route("CreateGame")]
        public IActionResult CreateGame()
        {
            return View();
        }

        [HttpGet, Route("JoinGame")]
        public IActionResult JoinGame()
        {
            // When is this called?
            return View();
        }

        [HttpPost, Route("JoinGame")]
        public async Task<IActionResult> JoinGame(Player player)
        {
            //APICall call = new APICall();

            //if (await call.CallJoinGame(player.GameID) != null)
            //{
            //    ViewData["Player"] = player;
            //    // Return the next view. Do the wait there until it's ready?
            //    return View("Guess");
            //}
            //else
            //{
            return null;
            //}
        }

        [HttpGet, Route("StartGame")]
        public IActionResult StartGame()
        {
            //[ViewData]
            return View();
        }

        /// <summary>
        /// HttpPost enables the program to differentiate between
        /// the two CreateGame routes.
        /// </summary>
        /// <param name="player"></param>
        /// <returns></returns>
        [HttpPost, Route("CreateGame")]
        public async Task<IActionResult> CreateGame(Player player)
        {
            APICall call = new APICall();

            if (await call.CallRegisterPlayer(player) != null
                && await call.CallCreateGame(player) != null)
            {
                ViewData["AdminPlayer"] = player;
                // Return the next view.
                return View("StartGame");
            }
            else
            {
                return null;
            }
        }
    }
}
