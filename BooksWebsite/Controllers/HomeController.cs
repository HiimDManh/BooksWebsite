using BooksWebsite.Filters;
using BooksWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BooksWebsite.Controllers
{
    [AuthorizeUser]
    public class HomeController : Controller
    {
        BookReadingEntities _entities = new BookReadingEntities();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Logout()
        {
            Session.Remove("user");
            Session.Abandon();
            return RedirectToAction("Login", "Login");
        }

        [HttpGet]
        public JsonResult GetListBook()
        {
            var user = (User)Session["user"];
            try
            {
                var typeList = _entities.UserBehaviors.Where(u => u.UserID == user.id).ToList();
                var bookList = new List<Book>();
                foreach(var type in typeList)
                {
                    var ans = _entities.Answers.Where(a => a.ID == type.AnswerID).FirstOrDefault();
                    if(ans.Type != null)
                    {
                        var books = _entities.Books.Where(b => b.Type == ans.Type).ToList();
                        foreach(var item in books)
                        {
                            bookList.Add(item);
                        }
                    }
                }

                return Json(new { code = 200, book = bookList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { code = 500, message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}