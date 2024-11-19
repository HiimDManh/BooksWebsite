using BooksWebsite.Filters;
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
        public ActionResult Index()
        {
            return View();
        }
    }
}