using BooksWebsite.Filters;
using GenerativeAI.Methods;
using GenerativeAI.Models;
using GenerativeAI.Types;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace BooksWebsite.Controllers
{
    [AuthorizeUser]
    public class AIChattingController : Controller
    {
        // GET: AIChatting
        public ActionResult Index()
        {
            return View();
        }

        ChatSession _chatSession;
        public string apiKey = "AIzaSyD0jhUGJ70IJuNUmWOfl4Amu86YK7M_qX8";

        public AIChattingController()
        {
            var model = new GenerativeModel(apiKey);
            _chatSession = model.StartChat(new StartChatParams());
        }
        
 [HttpPost]
    public async Task<ActionResult> SendMessage(string message)
    {
        if (string.IsNullOrWhiteSpace(message))
        {
            return Json(new { success = false, response = "Message cannot be empty." });
        }

        // Send the message to the chat session
        var result = await _chatSession.SendMessageAsync(message);

        // Return the AI's response
        return Json(new { success = true, response = result });
    }
    }
}