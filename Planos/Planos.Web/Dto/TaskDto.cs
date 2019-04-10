using System;
using System.ComponentModel.DataAnnotations;

namespace Taska.Web.Dto
{
	public class TaskDto
	{
		[Required]
		public Guid Id { get; set; }
		[Required]
		public string Title { get; set; }

		[Required]
		public int Priority { get; set; }
	}
}