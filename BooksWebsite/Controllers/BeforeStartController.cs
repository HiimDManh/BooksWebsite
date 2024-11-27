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
    public class BeforeStartController : Controller
    {
        // GET: BeforeStart
        BookReadingEntities _entities = new BookReadingEntities();
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetQnA()
        {
            try
            {
                var questionList = _entities.Questions.ToList();
                var answerList = _entities.Answers.ToList();
                return Json(new { code = 200, question = questionList, answer = answerList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { code = 500, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult SetBehaviour(int ID)
        {
            try
            {
                var user = (User)Session["user"];
                var answer = new UserBehavior
                {
                    UserID = user.id,
                    AnswerID = ID,
                };

                _entities.UserBehaviors.Add(answer);
                _entities.SaveChanges();
                return Json(new { code = 200, message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { code = 500, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
            
        }
    }
}