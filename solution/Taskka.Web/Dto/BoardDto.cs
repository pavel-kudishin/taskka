using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Taskka.Web.Dto
{
	public class BoardDto
	{
		[Required]
		public List<StatusDto> Statuses { get; set; }
		[Required]
		public List<TaskDto> Tasks { get; set; }
	}
}
