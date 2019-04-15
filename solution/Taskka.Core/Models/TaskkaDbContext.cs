using Microsoft.EntityFrameworkCore;

namespace Taskka.Core.Models
{
	public class TaskkaDbContext : DbContext
	{
		public TaskkaDbContext(DbContextOptions<TaskkaDbContext> options) : base(options)
		{
		}

		public DbSet<Board> Boards { get; set; }
		public DbSet<Status> Statuses { get; set; }
		public DbSet<Task> Tasks { get; set; }
	}
}
