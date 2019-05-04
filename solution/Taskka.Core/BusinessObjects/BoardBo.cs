using System.Collections.Generic;

namespace Taskka.Core.BusinessObjects
{
	public class BoardBo
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public List<StatusBo> Statuses { get; set; }
	}
}
