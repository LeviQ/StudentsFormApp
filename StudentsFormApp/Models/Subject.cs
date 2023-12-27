using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;


namespace StudentsFormApp.Models
{
    public class Subject
    {
        [Key]
        public int SubjectID { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public string FieldOfStudy { get; set; } = string.Empty;
    }
}
