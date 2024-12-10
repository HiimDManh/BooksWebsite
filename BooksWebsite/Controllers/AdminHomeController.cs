using BooksWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static BooksWebsite.Models.DataForm;
using System.Linq.Dynamic.Core;

namespace BooksWebsite.Controllers
{
    public class AdminHomeController : Controller
    {
        BookReadingEntities _entities = new BookReadingEntities();
        // GET: AdminHome
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ShowDetailList(pagination pagination, Sort sort, query query)
        {
            try
            {
                var sortField = sort == null ? "Starting_Date_Time" : (sort.field == null ? "Starting_Date_Time" : sort.field);

                //danh sach cac PO

                var typeList = from p in _entities.Types
                               join o in _entities.Users on p.ID equals o.type
                               group o by new { p.Type1 } into grouped
                               select new query()
                               {
                                   Type = grouped.Key.Type1,
                                   count = grouped.Count().ToString(),
                               };

                typeList = typeList.OrderBy($"{sortField} DESC");
                if (sort.sort == "asc")
                {
                    // Sắp xếp giảm dần
                    typeList = typeList.OrderBy(sortField);
                }

                var data = typeList.Skip((pagination.page - 1) * pagination.perpage).Take(pagination.perpage).ToList();
                var pages = (int)Math.Ceiling((double)typeList.Count() / pagination.perpage);
                var total = typeList.Count();

                // Return the result for KTDatatable
                return Json(new
                {
                    code = 200,
                    meta = new meta()
                    {
                        page = pagination.page,
                        pages = pages,
                        perpage = pagination.perpage,
                        total = total,
                        sort = sort.sort,
                        field = sort.field
                    },
                    data
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { code = 500, msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }

    }
}