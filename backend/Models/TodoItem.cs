using System;

namespace TodoApp.Models
{
    public class TodoItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool Status { get; set; }
        public DateTime DueDate { get; set; }
        public string UserId { get; set; }
    }
}