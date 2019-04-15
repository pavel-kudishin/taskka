using System.Collections.Generic;

namespace Taskka.Core.Models
{
	public class Status
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public int BoardId { get; set; }
		public Board Board { get; set; }
		public List<Task> Tasks { get; set; }
	}
}