using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Taska.Web.Dto;

namespace Planos.Web.Controllers
{
	[Route("api/[controller]")]
	public class DataController : Controller
	{
		private static readonly List<StatusDto> _statuses = new List<StatusDto>()
		{
			new StatusDto()
			{
				Id = Guid.NewGuid(),
				Title = "План",
				Tasks = CreateTasks()
			},
			new StatusDto()
			{
				Id = Guid.NewGuid(),
				Title = "В работе",
				Tasks = CreateTasks()
			},
			new StatusDto()
			{
				Id = Guid.NewGuid(),
				Title = "Тестирование",
				Tasks = CreateTasks()
			},
			new StatusDto()
			{
				Id = Guid.NewGuid(),
				Title = "Проверено",
				Tasks = CreateTasks()
			},
		};

		[HttpGet("[action]")]
		public async Task<List<StatusDto>> GetBoard()
		{
			await Task.Delay(TimeSpan.FromSeconds(3));

			return _statuses;
		}

		[HttpPost("[action]")]
		public async Task SaveBoardPriority([FromBody] Dictionary<string, List<Guid>> data)
		{
			await Task.Delay(TimeSpan.FromSeconds(2));
		}

		private static List<TaskDto> CreateTasks()
		{
			Random rng = new Random();
			int count = rng.Next(100);

			List<TaskDto> tasks = Enumerable.Range(1, count).Select(index =>
				{
					Guid id = Guid.NewGuid();
					return new TaskDto()
					{
						Id = id,
						Title = $"Реализовать отчет {id}",
						Priority = index
					};
				})
				.ToList();
			return tasks;
		}
	}
}
