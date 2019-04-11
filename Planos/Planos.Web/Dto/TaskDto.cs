using System.ComponentModel.DataAnnotations;

namespace Taska.Web.Dto
{
	public class TaskDto
	{
		[Required]
		public int Id { get; set; }
		[Required]
		public string Title { get; set; }

		[Required]
		public int Priority { get; set; }

		[Required]
		public int StatusId { get; set; }
	}
}