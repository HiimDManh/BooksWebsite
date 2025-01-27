﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class BookReadingEntities : DbContext
    {
        public BookReadingEntities()
            : base("name=BookReadingEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Answer> Answers { get; set; }
        public virtual DbSet<Book> Books { get; set; }
        public virtual DbSet<BookAnswer> BookAnswers { get; set; }
        public virtual DbSet<BookQuestion> BookQuestions { get; set; }
        public virtual DbSet<Chat> Chats { get; set; }
        public virtual DbSet<DetailGroupChat> DetailGroupChats { get; set; }
        public virtual DbSet<DetailUser> DetailUsers { get; set; }
        public virtual DbSet<GroupChat> GroupChats { get; set; }
        public virtual DbSet<MessageChat> MessageChats { get; set; }
        public virtual DbSet<OnReadingBook> OnReadingBooks { get; set; }
        public virtual DbSet<Question> Questions { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<TeacherCode> TeacherCodes { get; set; }
        public virtual DbSet<Type> Types { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserBehavior> UserBehaviors { get; set; }
        public virtual DbSet<UserBookAnswer> UserBookAnswers { get; set; }
        public virtual DbSet<BookReview> BookReviews { get; set; }
    }
}
