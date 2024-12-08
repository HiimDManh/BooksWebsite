using BooksWebsite.Filters;
using BooksWebsite.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BooksWebsite.Controllers
{
    [AuthorizeUser]
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

        private class RequestData
        {
            public int QuestionID { get; set; }
            public int AnswerID { get; set; }
            public int BookID { get; set; }
        }

        [HttpPost]
        public JsonResult SetBookAnswer(string data)
        {
            try
            {
                var user = (User)Session["user"];
                var listAnswer = JsonConvert.DeserializeObject<List<RequestData>>(data);
                var book = 0;

                foreach(var item in listAnswer)
                {
                    var answer = new UserBookAnswer
                    {
                        UserID = user.id,
                        AnswerID = item.AnswerID,
                        QuestionID = item.QuestionID,
                        BookID = item.BookID,
                    };

                    book = answer.BookID;

                    var check = _entities.UserBookAnswers.Where(u => u.BookID == answer.BookID && u.UserID == answer.UserID && u.QuestionID == answer.QuestionID).FirstOrDefault();
                    
                    if(check == null)
                    {
                        _entities.UserBookAnswers.Add(answer);
                    }
                    else
                    {
                        check = answer;
                    }
                }

                _entities.SaveChanges();

                var answerList = _entities.UserBookAnswers.Where(u => u.UserID == user.id).ToList();
                var sum = _entities.BookQuestions.Where(b => b.BookID == book).Count();
                var count = 0;
                foreach (var ans in answerList)
                {
                    if (ans.BookID == book)
                    {
                        var check = _entities.BookQuestions.Where(b => b.ID == ans.QuestionID).FirstOrDefault();
                        if (check.CorrectAnswer == ans.AnswerID || check.CorrectAnswer == 0)
                        {
                            count++;
                        }
                    }
                }

                return Json(new { code = 200, sum = sum, count = count }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { code = 500, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}