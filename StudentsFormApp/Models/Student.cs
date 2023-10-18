using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StudentsFormApp
{
    public class Student
    {
        public int ID { get; set; }
        public int AlbumNumber { get; set; }
        public string StudentPasswordHash { get; set; } = string.Empty;
        public string FieldOfStudy { get; set; } = string.Empty;
        public uint YearNumber { get; set; }
        public uint Semester { get; set; }

    }
}

