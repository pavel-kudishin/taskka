using System.Collections.Generic;

namespace Taskka.Core.BusinessObjects
{
	public class StatusBo
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public int BoardId { get; set; }
		public BoardBo Board { get; set; }
		public List<TaskBo> Tasks { get; set; }
	}
}
