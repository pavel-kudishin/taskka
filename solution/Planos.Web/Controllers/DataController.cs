using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Taskka.Web.Dto;
using Taskka.Web.Hubs;

namespace Taskka.Web.Controllers
{
	[Route("api/[controller]")]
	public class DataController : Controller
	{
		private readonly IHubContext<BoardHub, IBoardClient> _hubContext;
		private static readonly List<StatusDto> _statuses = new List<StatusDto>()
		{
			new StatusDto()
			{
				Id = GetUniqueId(),
				Title = "План",
			},
			new StatusDto()
			{
				Id = GetUniqueId(),
				Title = "В работе",
			},
			new StatusDto()
			{
				Id = GetUniqueId(),
				Title = "Тестирование",
			},
			new StatusDto()
			{
				Id = GetUniqueId(),
				Title = "Проверено",
			},
		};
		private static List<TaskDto> _tasks = CreateTasks();
		private static int _uniqueId;

		public DataController(IHubContext<BoardHub, IBoardClient> hubContext)
		{
			_hubContext = hubContext;
		}

		[HttpGet("[action]")]
		public async Task<BoardDto> GetBoard()
		{
			await Task.Delay(TimeSpan.FromSeconds(2));

			BoardDto board = new BoardDto()
			{
				Statuses = _statuses,
				Tasks = _tasks
			};

			return board;
		}

		[HttpPost("[action]")]
		public async Task UpdateTask(int taskId, decimal priority, int statusId)
		{
			await Task.Delay(TimeSpan.FromSeconds(2));

			TaskDto task = _tasks.FirstOrDefault(t => t.Id == taskId);
			if (task == null)
			{
				return;
			}

			task.Priority = priority;
			task.StatusId = statusId;

			BoardDto board = new BoardDto()
			{
				Statuses = _statuses,
				Tasks = _tasks
			};

			await _hubContext.Clients.All.RefreshBoard(board);
		}

		private static List<TaskDto> CreateTasks()
		{
			Random rng = new Random();
			int count = rng.Next(15, 30);

			List<TaskDto> tasks = Enumerable.Range(1, count).Select(index =>
				{
					int id = GetUniqueId();
					int statusIndex = rng.Next(_statuses.Count);
					return new TaskDto()
					{
						Id = id,
						Title = $"Реализовать отчет №{id}",
						Priority = index,
						StatusId = _statuses[statusIndex].Id,
					};
				})
				.ToList();
			return tasks;
		}

		private static int GetUniqueId()
		{
			return ++_uniqueId;
		}
	}
}
