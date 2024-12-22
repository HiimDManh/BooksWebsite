using BooksWebsite.Filters;
using BooksWebsite.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace BooksWebsite.Controllers
{
    [AuthorizeUser]
    public class BookController : Controller
    {
        // GET: Book
        BookReadingEntities _entities = new BookReadingEntities();
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetBook(int ID)
        {
            try
            {
                var book = _entities.Books.Where(b => b.ID == ID).FirstOrDefault();

                return Json(new { code = 200, book = book }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { code = 500, message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        
        [HttpGet]
        public JsonResult GetComment(int bookID)
        {
            try
            {
                var book = _entities.BookReviews.Where(b => b.BookID == bookID)
                    .Select(x => new
                    {
                        x.Id,
                        x.Comment,
                        x.BookID,
                        x.Voice,
                        x.UserID,
                        x.Date,
                    })
                    .ToList()
                    .Select(x => 
                    {
                        var elapsed = DateTime.Now - x.Date.Value;
                        string time;

                        if (elapsed.TotalSeconds <= 60)
                        {
                            time = $"{Math.Floor(elapsed.TotalSeconds)} giây";
                        }
                        else if (elapsed.TotalMinutes <= 60)
                        {
                            time = $"{Math.Floor(elapsed.TotalMinutes)} phút";
                        }
                        else if (elapsed.TotalHours <= 24)
                        {
                            time = $"{Math.Floor(elapsed.TotalHours)} giờ";
                        }
                        else
                        {
                            time = $"{Math.Floor(elapsed.TotalDays)} ngày";
                        }

                        return (new {
                            x.Id,
                            x.Comment,
                            x.BookID,
                            x.Voice,
                            x.UserID,
                            Time = time,
                            VoiceUrl = x.Voice != null ? Url.Action("GetVoice", "Book", new { id = x.BookID }) : null, // Assuming GetVoice is the action to get the audio
                        });              
                    }).ToList().OrderBy(t => t.Time);

                return Json(new { code = 200, book = book }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { code = 500, message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetVoice(int id)
        {
            var voiceRecord = _entities.BookReviews.FirstOrDefault(x => x.Id == id);

            if (voiceRecord == null || voiceRecord.Voice == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.NotFound, "Voice not found");
            }

            return File(voiceRecord.Voice, "audio/mpeg");
        }


        [HttpPost]
        public ActionResult UploadVoice(HttpPostedFileBase voiceFile, int bookID)
        {
            if (voiceFile == null || voiceFile.ContentLength <= 0)
            {
                return Json(new { success = false, message = "No file uploaded or file is empty." });
            }

            try
            {
                // Convert the file to binary for saving in the database
                byte[] fileBytes;
                using (var memoryStream = new MemoryStream())
                {
                    voiceFile.InputStream.CopyTo(memoryStream);
                    fileBytes = memoryStream.ToArray();
                }

                var user = Session["user"] as User;
                if (user == null)
                {
                    return Json(new { success = false, message = "User session is invalid. Please log in again." });
                }

                // Save the file to the database
                var voiceRecord = new BookReview
                {
                    BookID = bookID,
                    Voice = fileBytes,
                    UserID = user.username,
                    Date = DateTime.Now,
                };

                _entities.BookReviews.Add(voiceRecord);
                _entities.SaveChanges();

                return Json(new { success = true, message = "File uploaded and saved successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred: " + ex.Message });
            }
        }


        [HttpPost]
        public JsonResult SendPreviewComment(int bookID, string comment)
        {
            try
            {
                var user = (User)Session["user"];
                var book = _entities.Books.Where(b => b.ID == bookID).FirstOrDefault();

                var com = new BookReview
                {
                    BookID = bookID,
                    Comment = comment,
                    UserID = user.username,
                    Date = DateTime.Now,
                };

                _entities.BookReviews.Add(com);
                _entities.SaveChanges();

                return Json(new { code = 200, msg = "Thành công!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { code = 500, message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}