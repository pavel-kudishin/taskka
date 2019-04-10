using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Taska.Web.Dto
{
	public class StatusDto
	{
		[Required]
		public Guid Id { get; set; }
		[Required]
		public string Title { get; set; }
		[Required]
		public List<TaskDto> Tasks { get; set; }
	}
}