using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
				Title = "Backlog",
			},
			new StatusDto()
			{
				Id = GetUniqueId(),
				Title = "Planned",
			},
			new StatusDto()
			{
				Id = GetUniqueId(),
				Title = "Reopened",
			},
			new StatusDto()
			{
				Id = GetUniqueId(),
				Title = "Analysis",
			},
			new StatusDto()
			{
				Id = GetUniqueId(),
				Title = "In Progress",
			},
			new StatusDto()
			{
				Id = GetUniqueId(),
				Title = "Review",
			},
			new StatusDto()
			{
				Id = GetUniqueId(),
				Title = "Testing",
			},
			new StatusDto()
			{
				Id = GetUniqueId(),
				Title = "Ready To Prod",
			},
			new StatusDto()
			{
				Id = GetUniqueId(),
				Title = "Done",
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
			//await Task.Delay(TimeSpan.FromSeconds(2));

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

		[HttpPost("[action]")]
		public async Task SaveTask([FromBody]TaskDto task)
		{
			await Task.Delay(TimeSpan.FromSeconds(2));

			TaskDto existingTask = _tasks.FirstOrDefault(t => t.Id == task.Id);
			if (existingTask == null)
			{
				existingTask = new TaskDto()
				{
					Id = GetUniqueId()
				};
				_tasks.Add(existingTask);
			}

			int backlogStatusId = _statuses[0].Id;
			decimal maxPriority = _tasks
				.Where(t => t.StatusId == backlogStatusId)
				.OrderByDescending(t => t.Priority)
				.Select(t => t.Priority)
				.FirstOrDefault();

			existingTask.Title = task.Title;
			existingTask.Priority = maxPriority + 1;
			existingTask.StatusId = backlogStatusId;

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
			int count = rng.Next(20, 40);

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
