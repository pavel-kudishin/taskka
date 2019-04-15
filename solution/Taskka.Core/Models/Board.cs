using System.Collections.Generic;

namespace Taskka.Core.Models
{
	public class Board
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public List<Status> Statuses { get; set; }
	}
}