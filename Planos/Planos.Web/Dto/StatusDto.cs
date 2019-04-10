using System;
using System.Collections.Generic;

namespace Taska.Web.Dto
{
	public class StatusDto
	{
		public Guid Id { get; set; }
		public string Title { get; set; }
		public List<TaskDto> Tasks { get; set; }
	}
}