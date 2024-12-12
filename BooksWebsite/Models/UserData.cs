using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BooksWebsite.Models
{
    public class UserData
    {
        public class pagination
        {
            public int page { get; set; }
            public int pages { get; set; }
            public int perpage { get; set; }
            public int total { get; set; }
        }
        public class Sort
        {
            public string sort { get; set; }
            public string field { get; set; }
        }
        public class query
        {
            public string username { get; set; }
            public int id { get; set; }
            public string role { get; set; }
            public DateTime? login_time { get; set; }
            public string type { get; set; }
            public byte[] avatar { get; set; }
        }
        public class meta
        {
            public string field { get; set; }
            public int page { get; set; }
            public int perpage { get; set; }
            public int pages { get; set; }
            public string sort { get; set; }
            public int total { get; set; }
        }
    }
}