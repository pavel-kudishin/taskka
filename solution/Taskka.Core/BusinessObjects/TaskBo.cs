namespace Taskka.Core.BusinessObjects
{
	public class TaskBo
	{
		public int Id { get; set; }
		public string Summary { get; set; }
		public int StatusId { get; set; }
		public StatusBo Status { get; set; }
	}
}
