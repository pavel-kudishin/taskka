namespace Taskka.Core.Models
{
	public class Task
	{
		public int Id { get; set; }
		public string Summary { get; set; }
		public int StatusId { get; set; }
		public Status Status { get; set; }
		public decimal Priority { get; set; }
	}
}