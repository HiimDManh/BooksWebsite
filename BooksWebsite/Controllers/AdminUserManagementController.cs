using BooksWebsite.Filters;
using BooksWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Web;
using System.Web.Mvc;
using static BooksWebsite.Models.UserData;

namespace BooksWebsite.Controllers
{
    [AuthorizeUser("3")]
    public class AdminUserManagementController : Controller
    {
        // GET: AdminUserManagement
        BookReadingEntities _entities = new BookReadingEntities();
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ShowList(pagination pagination, Sort sort, query query)
        {
            try
            {
                var sortField = sort == null ? "id" : (sort.field == null ? "id" : sort.field);

                if (query == null)
                    query = new query();
                //danh sach cac PO

                var userList = from p in _entities.Users
                               select new query()
                               {
                                   username = p.username,
                                   id = p.id,
                                   role = p.role == 1 ? "Học sinh" : "Giáo viên",
                                   login_time = p.login_time,
                                   type = _entities.Types.Where(t => t.ID == p.type).FirstOrDefault().Type1,
                               };

                userList = userList.OrderBy($"{sortField} DESC");
                if (sort.sort == "asc")
                {
                    // Sắp xếp giảm dần
                    userList = userList.OrderBy(sortField);
                }

                var data = userList.Skip((pagination.page - 1) * pagination.perpage).Take(pagination.perpage).ToList();
                var pages = (int)Math.Ceiling((double)userList.Count() / pagination.perpage);
                var total = userList.Count();

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