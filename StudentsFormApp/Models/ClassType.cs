using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StudentsFormApp.Models
{
    public class ClassType
    {
        [Key]
        public int ClassTypeID { get; set; }
        public string TypeName { get; set; } = string.Empty;
    }
}
