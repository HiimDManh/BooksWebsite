﻿using BooksWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BooksWebsite.Controllers
{
    public class UserController : Controller
    {
        private BookReadingEntities db = new BookReadingEntities();
        // GET: User
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult Account(string id)
        {
            try
            {
                if (!string.IsNullOrEmpty(id))
                {
                    var ss = (User)Session["user"];
                    var users = db.Users.Where(x => x.username.Contains(id) && x.username != ss.username).ToList();
                    var userMessages = users.Select(user =>
                    {
                        // Tìm tin nhắn cuối cùng của user trong bảng Chat
                        var lastMessage = db.Chats
                            .Where(m => (m.Sender == user.username && m.Recipient == ss.username)
                                     || (m.Recipient == user.username && m.Sender == ss.username))
                            .OrderByDescending(m => m.CreateDate)
                            .FirstOrDefault();

                        // Nếu không có tin nhắn, trả về giá trị rỗng
                        return new
                        {
                            username = user.username,
                            Message = lastMessage?.Message ?? string.Empty, // Nội dung tin nhắn hoặc rỗng nếu không có
                            CreateDate = lastMessage?.CreateDate ?? null    // Ngày tạo hoặc null nếu không có
                        };
                    }).ToList()
                     .Select(x =>
                     {
                         // Tính toán thời gian chênh lệch nếu có CreateDate
                         var timeDifference = x.CreateDate.HasValue
                             ? (DateTime.Now - x.CreateDate.Value).TotalMinutes
                             : 0;

                         return new
                         {
                             username = x.username,
                             Message = x.Message,
                             CreateDate = timeDifference
                         };
                     })
                     .ToList();
                    if (userMessages != null)
                    {
                        return Json(new { code = 200,user= userMessages }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { code = 500, msg = "Người liên hệ không tồn tại" },JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json(new { code = 500, msg = "Người liên hệ không tồn tại" }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception e)
            {
                return Json(new { code = 500, msg = "Sai !!!" + e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult GetCurrentUser()
        {
            try
            {
                var ss = (User)Session["user"];
                if (ss != null)
                {
                    return Json(new { code = 200, acc = ss.username }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { code = 500, msg = "Người liên hệ không tồn tại" }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception e)
            {
                return Json(new { code = 500, msg = "Sai !!!" + e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}