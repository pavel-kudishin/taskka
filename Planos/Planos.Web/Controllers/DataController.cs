using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Taska.Web.Dto;
using Taska.Web.Hubs;

namespace Planos.Web.Controllers
{
	[Route("api/[controller]")]
	public class DataController : Controller
	{
		private readonly IHubContext<BoardHub, IBoardClient> _hubContext;

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

		public DataController(IHubContext<BoardHub, IBoardClient> hubContext)
		{
			_hubContext = hubContext;
		}

		[HttpGet("[action]")]
		public async Task<List<StatusDto>> GetBoard()
		{
			await Task.Delay(TimeSpan.FromSeconds(3));

			return _statuses;
		}

		[HttpPost("[action]")]
		public async Task SaveBoardPriority([FromBody] Dictionary<Guid, List<Guid>> data)
		{
			await Task.Delay(TimeSpan.FromSeconds(2));

			UpdatePriority();

			await _hubContext.Clients.All.RefreshBoard(_statuses);

			void UpdatePriority()
			{
				foreach ((Guid statusId, List<Guid> taskIds) in data)
				{
					StatusDto statusDto = _statuses.FirstOrDefault(s => s.Id == statusId);
					if (statusDto == null)
					{
						continue;
					}

					for (int index = 0; index < taskIds.Count; index++)
					{
						Guid taskId = taskIds[index];
						TaskDto task = statusDto.Tasks.FirstOrDefault(t => t.Id == taskId);
						if (task != null)
						{
							task.Priority = index;
						}
					}

					statusDto.Tasks = statusDto.Tasks.OrderBy(t => t.Priority).ToList();
				}
			}
		}

		private static List<TaskDto> CreateTasks()
		{
			Random rng = new Random();
			int count = rng.Next(10);

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
