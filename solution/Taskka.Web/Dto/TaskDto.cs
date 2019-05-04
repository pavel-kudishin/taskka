using System.ComponentModel.DataAnnotations;

namespace Taskka.Web.Dto
{
	public class TaskDto
	{
		[Required]
		public int Id { get; set; }
		[Required]
		public string Summary { get; set; }

		[Required]
		public decimal Priority { get; set; }

		[Required]
		public int StatusId { get; set; }
	}
}