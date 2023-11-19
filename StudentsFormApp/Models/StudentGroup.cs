using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StudentsFormApp.Models
{
    public class StudentGroup
    {
        [Key]
        public int GroupID { get; set; }
        public string GroupName { get; set; } = string.Empty;   
    }
}
