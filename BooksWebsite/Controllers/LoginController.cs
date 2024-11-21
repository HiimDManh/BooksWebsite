using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BooksWebsite.Models;
using System.Security.Cryptography;
using System.Text;
using BooksWebsite.Filters;

namespace BooksWebsite.Controllers
{
    
    public class LoginController : Controller
    {
        private BookReadingEntities db = new BookReadingEntities();
        // GET: Login
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View();
        }

        public static string ToMD5(string str)
        {
            string result = "";
            byte[] buffer = Encoding.UTF8.GetBytes(str);
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
            buffer = md5.ComputeHash(buffer);
            for (int i = 0; i < buffer.Length; i++)
            {
                result += buffer[i].ToString("x2");
            }
            return result;
        }

        [HttpPost]
        public JsonResult Login()
        {
            try
            {
                if (Request.Params.Count > 0)
                {
                    var user = Request.Form["user"];
                    var pass = Request.Form["pass"];
                    //var checkUser = db.Users.SingleOrDefault(x => x.User1 == user);
                    var checkUser = (from i in db.Users
                                     where i.username == user
                                     select i).FirstOrDefault();
                    if (checkUser != null)
                    {
                        if (checkUser.password == ToMD5(pass))
                        {
                            checkUser.login_time = DateTime.Now;
                            db.SaveChanges();
                            Session["user"] = checkUser;
                            //Session["roleadmin"] = db.RoleAdmins.Find(checkUser.RoleAdmin);
                            //Session["role"] = db.Roles.Find(checkUser.Role);

                            return Json(new { code = 200, msg = "Đăng Nhập Thành Công", url = "/Home/Index" });
                        }
                        else
                        {
                            return Json(new
                            {
                                code = 500,
                                msg = "Mật Khẩu Không Đúng !!!"
                            }, JsonRequestBehavior.AllowGet);
                        }
                    }
                    else
                    {
                        return Json(new { code = 500, msg = "Tài Khoản Không Tồn Tại !!!", data = Request.Params });
                    }
                }
                else
                {
                    return Json(new { code = 500, msg = "Không Có Dữ Liệu !!!" });
                }

            }
            catch (Exception e)
            {
                return Json(new { code = 500, msg = "Sai !!!" + e.Message });
            }
        }

        [HttpPost]
        public JsonResult Register()
        {
            try
            {
                if (Request.Params.Count > 0)
                {
                    var user = Request.Form["re_user"];
                    var pass = Request.Form["re_pass"];
                    var check = Request.Form["select"];
                    var confirmPass = Request.Form["re_confirm_pass"];
                    //var checkUser = db.Users.SingleOrDefault(x => x.User1 == user);
                    var checkUser = (from i in db.Users
                                     where i.username == user
                                     select i).FirstOrDefault();
                    if (checkUser == null)
                    {
                        var newUser = new User();
                        newUser.login_time = DateTime.Now;
                        newUser.password = ToMD5(pass);
                        newUser.username = user;
                        if (check.Any() && check == "on")
                            newUser.role = 2;
                        else newUser.role = 1;
                        db.Users.Add(newUser);
                        db.SaveChanges();
                        Session["user"] = newUser;
                        //Session["roleadmin"] = db.RoleAdmins.Find(checkUser.RoleAdmin);
                        //Session["role"] = db.Roles.Find(checkUser.Role);
                        return Json(new { code = 200, msg = "Đăng ký thành công", url = "/BeforeStart/Index" });
                    }
                    else
                    {
                        return Json(new { code = 500, msg = "Tài khoản đã tồn tại !!!", data = Request.Params });
                    }
                }
                else
                {
                    return Json(new { code = 500, msg = "Không Có Dữ Liệu !!!" });
                }

            }
            catch (Exception e)
            {
                return Json(new { code = 500, msg = "Sai !!!" + e.Message });
            }
        }
    }
}