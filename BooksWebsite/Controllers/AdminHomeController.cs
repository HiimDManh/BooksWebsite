using BooksWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static BooksWebsite.Models.DataForm;
using System.Linq.Dynamic.Core;
using BooksWebsite.Filters;

namespace BooksWebsite.Controllers
{
    [AuthorizeUser("3")]
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
                var sortField = sort == null ? "No" : (sort.field == null ? "No" : sort.field);

                if (query == null)
                    query = new query();
                //danh sach cac PO

                var typeList = from p in _entities.Types
                               join o in _entities.Users on p.ID equals o.type
                               group o by new { p.Type1, p.ID } into grouped
                               select new query()
                               {
                                   No = grouped.Key.ID.ToString(),
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
        
        [HttpPost]
        public JsonResult DetailList(pagination pagination, Sort sort, query query)
        {
            try
            {
                var sortField = sort == null ? "username" : (sort.field == null ? "username" : sort.field);

                if(query == null)
                    query = new query();

                if (query.No == null)
                    query.No = "";
                //danh sach cac PO

                var typeList = from  o in _entities.Users
                               where o.type.ToString() == query.No
                               select new query()
                               {
                                   No = o.id.ToString(),
                                   username = o.username,
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

        public ActionResult GetAvatarID(string userId)
        {
            var user = _entities.Users.Where(u => u.username == userId).FirstOrDefault();
            if (user != null && user.avatar != null)
            {
                return File(user.avatar, "image/png"); // Return the avatar as an image
            }

            return HttpNotFound("Avatar not found.");
        }

        [HttpGet]
        public JsonResult GetCurrentUser()
        {
            try
            {
                var ss = (User)Session["user"];
                if (ss != null)
                {
                    return Json(new { code = 200, acc = ss.username }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { code = 500, msg = "Người liên hệ không tồn tại" }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception e)
            {
                return Json(new { code = 500, msg = "Sai !!!" + e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}