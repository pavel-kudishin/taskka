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
		public async Task<List<StatusDto>> GetBoard()
		{
			await Task.Delay(TimeSpan.FromSeconds(2));

			List<StatusDto> statuses = GetStatuses();
			return statuses;
		}

		private static List<StatusDto> GetStatuses()
		{
			ILookup<int, TaskDto> taskLookup = _tasks.ToLookup(t => t.StatusId);

			return _statuses.Select(s => new StatusDto()
				{
					Id = s.Id,
					Title = s.Title,
					Tasks = taskLookup[s.Id]
				})
				.ToList();
		}

		[HttpPost("[action]")]
		public async Task SaveBoardChanges([FromBody] List<TaskDto> tasks)
		{
			await Task.Delay(TimeSpan.FromSeconds(2));

			_tasks = tasks;

			List<StatusDto> statuses = GetStatuses();
			await _hubContext.Clients.All.RefreshBoard(statuses);
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
