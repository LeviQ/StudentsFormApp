using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StudentsFormApp.Models
{
    public class SurveyResponse
    {
        [Key]
        public int SurveyResponseID { get; set; }
        public int OfferingID { get; set; }
        public int AlbumNumber { get; set; }
        public int Answer1 { get; set; }
        public int Answer2 { get; set; }
        public int Answer3 { get; set; }
        public int Answer4 { get; set; }
        public int Answer5 { get; set; }
        public int Answer6 { get; set; }
        public int Answer7 { get; set; }
        public string OpenQuestion { get; set; }
    }
}
