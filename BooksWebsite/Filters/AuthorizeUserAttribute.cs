using System;
using System.Web;
using System.Web.Mvc;
using BooksWebsite.Models;

namespace BooksWebsite.Filters
{
    public class AuthorizeUserAttribute : ActionFilterAttribute
    {
        private readonly string _requiredRole;

        // Constructor to accept a required role (e.g., "Admin")
        public AuthorizeUserAttribute(string requiredRole = null)
        {
            _requiredRole = requiredRole;
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // Check if the user is logged in
            if (HttpContext.Current.Session["user"] == null)
            {
                // Redirect to the login page
                filterContext.Result = new RedirectToRouteResult(
                    new System.Web.Routing.RouteValueDictionary(new { controller = "Login", action = "Index" }));
                return;
            }

            // Check if a specific role is required
            if (!string.IsNullOrEmpty(_requiredRole))
            {
                // Assuming the user's role is stored in the session
                var user = (User)HttpContext.Current.Session["user"];
                var userRole = user.role.ToString();

                // If the user does not have the required role, redirect to an access denied page
                if (userRole != _requiredRole)
                {
                    filterContext.Result = new RedirectToRouteResult(
                        new System.Web.Routing.RouteValueDictionary(new { controller = "Error", action = "AccessDenied" }));
                    return;
                }
            }

            base.OnActionExecuting(filterContext);
        }
    }
}
