using BooksWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BooksWebsite.Controllers
{
    public class GroupChatController : Controller
    {
        private BookReadingEntities db = new BookReadingEntities();
        // GET: GroupChat
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult Add(string name)
        {
            try
            {
                var user = (User)Session["user"];
                if (name != null)
                {
                    GroupChat chat = new GroupChat()
                    {
                        NameGroup = name,
                        LateTime = DateTime.Now,
                        Status = true,
                    };
                    db.GroupChats.Add(chat);
                    db.SaveChanges();
                    DetailGroupChat chatDetail = new DetailGroupChat()
                    {
                        IdUser = user.username,
                        IdGroupChat = chat.ID,
                        Status = true,
                    };
                    db.DetailGroupChats.Add(chatDetail);
                    db.SaveChanges();
                    return Json(new { code = 200, }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { code = 500, msg = "Tên nhóm không tồn tại" }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception e)
            {
                return Json(new { code = 500, msg = "Sai !!!" + e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}