using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Taskka.Core.BusinessObjects;
using Taskka.Core.Services;
using Taskka.Web.Dto;
using Taskka.Web.Hubs;

namespace Taskka.Web.Controllers
{
	[Route("api/[controller]")]
	public class DataController : Controller
	{
		private const int BOARD_ID = 1;
		private readonly IHubContext<BoardHub, IBoardClient> _hubContext;
		private readonly ITaskService _taskService;
		private readonly IMapper _mapper;

		public DataController(IHubContext<BoardHub, IBoardClient> hubContext,
			ITaskService taskService, IMapper mapper)
		{
			_hubContext = hubContext;
			_taskService = taskService;
			_mapper = mapper;
		}

		[HttpGet("[action]")]
		public async Task<BoardDto> GetBoard()
		{
			//await Task.Delay(TimeSpan.FromSeconds(2));

			BoardDto boardDto = await GetBoardAsync();
			return boardDto;
		}

		private async Task<BoardDto> GetBoardAsync()
		{
			BoardBo boardBo = await _taskService.GetBoardAsync(BOARD_ID);
			BoardDto boardDto = _mapper.Map<BoardDto>(boardBo);
			boardDto.Tasks = _mapper.Map<List<TaskDto>>(boardBo.Statuses.SelectMany(s => s.Tasks));
			return boardDto;
		}

		[HttpPost("[action]")]
		public async Task UpdateTask(int taskId, decimal priority, int statusId)
		{
			await Task.Delay(TimeSpan.FromSeconds(2));

			await _taskService.UpdateTaskAsync(taskId, priority, statusId);

			BoardDto boardDto = await GetBoardAsync();
			await _hubContext.Clients.All.RefreshBoard(boardDto);
		}

		[HttpPost("[action]")]
		public async Task SaveTask([FromBody]TaskDto task)
		{
			//await Task.Delay(TimeSpan.FromSeconds(2));

			try
			{
				TaskBo taskBo = _mapper.Map<TaskBo>(task);
				await _taskService.SaveTaskAsync(taskBo);
			}
			catch (DbUpdateException e)
			{

			}
			catch (Exception e)
			{
			}

			BoardDto boardDto = await GetBoardAsync();
			await _hubContext.Clients.All.RefreshBoard(boardDto);
		}
	}
}
