using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PicONE.Models
{
    // Is this object needed?
    public class Game
    {
        public string Id { get; set; }
        
        public string[] Players { get; set; }
        public string GameAdmin { get; set; }

        public string Difficulty { get; set; }
        public string[] ItemsToDraw { get; set; }
        public string CurrentItem { get; set; }
    }
}
