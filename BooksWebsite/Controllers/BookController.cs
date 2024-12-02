using BooksWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BooksWebsite.Controllers
{
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
    }
}