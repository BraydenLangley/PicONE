using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PicONE.Models
{
    public class Player
    {
        [Required]  // test for input validation. 
        public string Username { get; set; }
        public int Score { get; set; }
        public string Guess { get; set; }
        public string ItemToDraw { get; set; }
        public string GameId { get; set; } // Is this needed?
        public bool IsAdmin { get; set; }
    }
}
