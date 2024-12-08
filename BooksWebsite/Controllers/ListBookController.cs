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
    public class ListBookController : Controller
    {
        BookReadingEntities _entities = new BookReadingEntities();
        // GET: ListBook
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetListBook()
        {
            try
            {
                var bookList = _entities.Books.OrderBy(x => x.Type).Select(b => new
                {
                    b.ID,
                    b.Name,
                    b.CoverSrc,
                    Type = _entities.Types.Where(t => t.ID == b.Type).FirstOrDefault().Type1
                }).ToList();

                return Json(new { code = 200, book = bookList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { code = 500, message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}