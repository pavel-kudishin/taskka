using System.ComponentModel.DataAnnotations;

namespace Taskka.Web.Dto
{
	public class StatusDto
	{
		[Required]
		public int Id { get; set; }
		[Required]
		public string Name { get; set; }
	}
}