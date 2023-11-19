using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StudentsFormApp.Models
{
    public class CourseOffering
    {
        [Key]
        public int OfferingID { get; set; }
        public int SubjectID { get; set; }
        public int InstructorID { get; set; }
        public int ClassTypeID { get; set; }
        public int GroupID { get; set; }
        public int Semester { get; set; }
        public virtual Subject? Subject { get; set; } 
        public virtual Instructor? Instructor { get; set; }
        public virtual ClassType? ClassType { get; set; }
        public virtual StudentGroup? Group { get; set; }
    }
}
