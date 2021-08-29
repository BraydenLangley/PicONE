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
using Newtonsoft.Json.Linq;

namespace PicONE.Models
{
    public class APICall
    {
        HttpClient client = new HttpClient();

        public async Task<string> CallRegisterPlayer(Player player)
        {
            string url = $"https://semicolonswebgamebackend.azurewebsites.net/reg?username={player.Username}";

            //get json response
            string json = await this.Get(url);

            return ParseReponse(json);

        }

        public async Task<string> CallCreateGame(Player player)
        {
            string url = $"https://semicolonswebgamebackend.azurewebsites.net/game/new?username={player.Username}";

            //get json response
            string json = await this.Get(url);

            return ParseReponse(json);

        }

        public async Task<string> CallJoinGame(Player player)
        {
            string url = $"https://semicolonswebgamebackend.azurewebsites.net/game/{player.GameId}/join?username={player.Username}";

            //get json response
            string json = await this.Get(url);

            return ParseReponse(json);
        }

        public async Task<string> CallStart(Player player)
        {
            string url = $"https://semicolonswebgamebackend.azurewebsites.net/game/{player.GameId}/start?username={player.Username}";

            //get json response
            string json = await this.Get(url);

            return ParseReponse(json);
        }

        public async Task<string> CallDraw(Player player)
        {
            string url = $"https://semicolonswebgamebackend.azurewebsites.net/game/{player.GameId}/draw?username={player.Username}";

            //get json response
            string json = await this.Get(url);

            return ParseReponse(json);
        }

        public async Task<string> CallHasStarted(Player player)
        {
            string url = $"https://semicolonswebgamebackend.azurewebsites.net/game/{player.GameId}/hasStarted";

            //get json response
            string json = await this.Get(url);

            return ParseReponse(json);
        }



        private async Task<string> Get(string url)
        {
            //sent get request
            HttpResponseMessage response = await client.GetAsync(url);

            //read response to string
            string responseString = await response.Content.ReadAsStringAsync();

            //return response as json string
            return responseString;

        }

        private string ParseReponse(string json)
        {
            if (json != null && json != "Bad Request")
            {

            
                //parse to JObject
                JObject responseObject = JObject.Parse(json);

                //create list of response items
                IList<JToken> responseContents = responseObject.Children().ToList();

                //get the selection from the list as a string
                string responseString = (string)responseContents[2];

                //return the selection
                return responseString;

                
            }
            else
            {
                //return failure message
                return "Error or failed to get response from server.";
            }
        }


    }
}