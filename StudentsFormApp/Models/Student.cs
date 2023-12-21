using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using StudentsFormApp.Models;

namespace StudentsFormApp
{
    public class Student
    {
        [Key]
        public int ID { get; set; }
        public int AlbumNumber { get; set; }
        public string StudentPasswordHash { get; set; } = string.Empty;
        public string FieldOfStudy { get; set; } = string.Empty;
        public int Semester { get; set; }
        public int GroupID { get; set; }
        public string IsSuperUser { get; set; } = "No";

        public virtual StudentGroup? Group { get; set; }

    }
}

