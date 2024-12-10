using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BooksWebsite.Models
{
    public class DataForm
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
            public int No { get; set; }
            public string Type { get; set; }
            public string count { get; set; }   
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