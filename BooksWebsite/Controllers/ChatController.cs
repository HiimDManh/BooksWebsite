using BooksWebsite.Filters;
using BooksWebsite.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BooksWebsite.Controllers
{
    [AuthorizeUser]
    public class ChatController : Controller
    {
        private BookReadingEntities db = new BookReadingEntities();
        // GET: Chat
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult ListChat()
        {
            try
            {
                var user = (User)Session["user"];
                var data = db.Chats
                            .Where(m => m.Sender == user.username || m.Recipient == user.username) // Lọc tin nhắn của Tung
                            .GroupBy(m => m.Sender == user.username ? m.Recipient : m.Sender) // Gom nhóm theo user còn lại
                            .Select(g => g.OrderByDescending(m => m.CreateDate).FirstOrDefault()) // Lấy tin nhắn gần nhất trong mỗi nhóm
                            .Select(m => new
                            {
                                username = m.Sender == user.username ? m.Recipient : m.Sender,
                                Message = m.Message,
                                CreateDate = m.CreateDate
                            })
                            .ToList()
                            .Select(x =>
                            {
                                // Tính toán chênh lệch thời gian sau khi truy vấn xong
                                var timeDifference = DateTime.Now - x.CreateDate.Value;
                                return (new
                                {
                                    username = x.username,
                                    Message=x.Message,
                                    CreateDate=timeDifference.TotalMinutes
                                });
                            })
                            .ToList();
                return Json(new { code = 200, data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { code = 500, msg = "Sai !!!" + e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult InfoChat(string otherUser)
        {
            try
            {
                var user = (User)Session["user"];
                var data = db.Chats
                                 .Where(m => (m.Sender == user.username && m.Recipient == otherUser) || (m.Sender == otherUser && m.Recipient == user.username))
                                 .OrderByDescending(m => m.CreateDate) // Sắp xếp theo thời gian gửi tin nhắn
                                 .Select(m => new
                                 {
                                     Sender = m.Sender,
                                     Recipient = m.Recipient,
                                     Message = m.Message,
                                     CreateDate = m.CreateDate,
                                     IsMyMessage = m.Sender == user.username
                                 })
                                 .ToList()
                                  .Select(x =>
                                  {
                                      // Tính toán chênh lệch thời gian sau khi truy vấn xong
                                      var timeDifference = DateTime.Now - x.CreateDate.Value;
                                      return (new
                                      {
                                          Sender = x.Sender,
                                          Recipient = x.Recipient,
                                          Message = x.Message,
                                          CreateDate = timeDifference.TotalMinutes,
                                          IsMyMessage = x.Sender == user.username
                                      });
                                  });
                return Json(new { code = 200, data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { code = 500, msg = "Sai !!!" + e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}