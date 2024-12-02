using BooksWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BooksWebsite.Controllers
{
    public class BookQuestionController : Controller
    {
        // GET: BookQuestion
        BookReadingEntities _entities = new BookReadingEntities();
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetQnA(int ID)
        {
            try
            {
                var questionList = _entities.BookQuestions.Where(x => x.BookID == ID).ToList();
                var answerList = new List<BookAnswer>();
                foreach (var question in questionList)
                {
                    var answer = _entities.BookAnswers.Where(x => x.QuestionID == question.ID).ToList();
                    foreach (var ans in answer)
                    {
                        answerList.Add(ans);
                    }
                }

                return Json(new { code = 200, question = questionList, answer = answerList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { code = 500, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}