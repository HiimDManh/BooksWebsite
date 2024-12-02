using BooksWebsite.Filters;
using BooksWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BooksWebsite.Controllers
{
    //[AuthorizeUser]
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
                var questionList = _entities.Questions.OrderBy(x => x.ID).Take(6).ToList();
                var answerList = _entities.Answers.OrderBy(x => x.ID).Take(23).ToList();
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

                var ans = _entities.Answers.Where(a => a.ID == ID).FirstOrDefault();
                var ques = _entities.Questions.Where(q => q.ID == ans.QuestionID).FirstOrDefault();
                var nextQues = _entities.Questions.Where(x => x.AnsewerMapping == ID).FirstOrDefault();

                var exist = _entities.UserBehaviors.Where(u => u.UserID == user.id && u.QuestionID == ques.ID).FirstOrDefault();

                if(exist == null)
                {
                    var answer = new UserBehavior
                    {
                        UserID = user.id,
                        AnswerID = ID,
                        QuestionID = ques.ID,
                    };

                    _entities.UserBehaviors.Add(answer);
                    _entities.SaveChanges();
                }
                else
                {
                    exist.AnswerID = ID;
                    _entities.SaveChanges();
                }
                
                if (nextQues != null)
                {
                    var answerList = _entities.Answers.Where(x => x.QuestionID == nextQues.ID).ToList();
                    return Json(new { code = 200, question = nextQues, answer = answerList, message = "Success" }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { code = 200, message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { code = 500, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
            
        }
    }
}