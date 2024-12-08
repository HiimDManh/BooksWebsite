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
        public ActionResult All()
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
                                .Select(g => new
                                {
                                    LatestMessage = g.OrderByDescending(m => m.CreateDate).FirstOrDefault(), // Lấy tin nhắn gần nhất trong nhóm
                                    UnreadCount = g.Count(m => m.Recipient == user.username && m.StatusRead == false) // Đếm số tin nhắn chưa đọc
                                })
                                .Select(g => new
                                {
                                    username = g.LatestMessage.Sender == user.username ? g.LatestMessage.Recipient : g.LatestMessage.Sender,
                                    Message = g.LatestMessage.Message,
                                    CreateDate = g.LatestMessage.CreateDate,
                                    UnreadCount = g.UnreadCount
                                })
                            .ToList()
                            .Select(x =>
                            {
                                // Tính toán chênh lệch thời gian sau khi truy vấn xong
                                var timeDifference = DateTime.Now - x.CreateDate.Value;
                                return (new
                                {
                                    username = x.username,
                                    Message = x.Message,
                                    CreateDate = timeDifference.TotalMinutes,
                                    UnreadCount = x.UnreadCount
                                });
                            })
                            .ToList().OrderBy(x => x.CreateDate);

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
                                 .ToList().OrderBy(x => x.CreateDate).Take(200)
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
        [HttpGet]
        public JsonResult InfoChatAll()
        {
            try
            {
                var user = (User)Session["user"];
                var userList = db.Users
                 .Where(u => u.type == user.type)
                 .Select(u => u.username) // Select only the username field
                 .ToList();
                var teacherList = db.Users
                    .Where(t => t.role == 2)
                    .Select(t => t.username)
                    .ToList();

                // Query the MessageChats where d.IdUser is in the list of usernames
                var data = db.MessageChats
                             .Where(d => userList.Contains(d.IdUser) || teacherList.Contains(d.IdUser))
                                 .OrderBy(m => m.CreateDate) // Sắp xếp theo thời gian gửi tin nhắn
                                 .Select(m => new
                                 {
                                     Sender = m.IdUser,
                                     Message = m.Message,
                                     CreateDate = m.CreateDate,
                                     IsMyMessage = m.IdUser == user.username
                                 })
                                 .ToList().Take(500)
                                  .Select(x =>
                                  {
                                      // Tính toán chênh lệch thời gian sau khi truy vấn xong
                                      var timeDifference = DateTime.Now - x.CreateDate.Value;
                                      return (new
                                      {
                                          Sender = x.Sender,
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
        [HttpPost]
        public JsonResult ChangeStatusRead(string id)
        {
            try
            {
                var user = (User)Session["user"];
                var status = db.Chats.Where(x => x.Sender == id).ToList();
                status.ForEach(x =>
                {
                    x.StatusRead = true;
                });
                db.SaveChanges();
                return Json(new { code = 200, }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { code = 500, msg = "Sai !!!" + e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}