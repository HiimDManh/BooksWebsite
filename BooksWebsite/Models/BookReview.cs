//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BooksWebsite.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class BookReview
    {
        public int Id { get; set; }
        public int BookID { get; set; }
        public string Comment { get; set; }
        public byte[] Voice { get; set; }
        public Nullable<System.DateTime> Date { get; set; }
        public string UserID { get; set; }
    }
}
