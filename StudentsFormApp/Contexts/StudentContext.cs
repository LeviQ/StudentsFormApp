using Microsoft.EntityFrameworkCore;
using StudentsFormApp;
using StudentsFormApp.Models;

public class StudentContext : DbContext
{
    public StudentContext(DbContextOptions<StudentContext> options) : base(options) { }
    public DbSet<Student> Students { get; set; }
    public DbSet<StudentGroup> StudentGroups { get; set; }
    public DbSet<Instructor> Instructors { get; set; }
    public DbSet<ClassType> ClassTypes { get; set; }
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<CourseOffering> CourseOfferings { get; set; }
    public DbSet<SurveyResponse> SurveyResponses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Student>()
            .HasOne(s => s.Group);
    }
}
