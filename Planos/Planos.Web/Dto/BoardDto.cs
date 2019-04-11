using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Taska.Web.Dto
{
	public class BoardDto
	{
		[Required]
		public List<StatusDto> Statuses { get; set; }
		[Required]
		public List<TaskDto> Tasks { get; set; }
	}
}
