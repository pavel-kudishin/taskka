using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Taskka.Core.BusinessObjects;
using Taskka.Core.Models;
using Task = System.Threading.Tasks.Task;

namespace Taskka.Core.DataProviders
{
	public class TaskProvider: ITaskProvider
	{
		private readonly TaskkaDbContext _dbContext;
		private readonly IMapper _mapper;

		public TaskProvider(TaskkaDbContext dbContext, IMapper mapper)
		{
			_dbContext = dbContext;
			_mapper = mapper;
		}

		public async Task<BoardBo> GetBoardAsync(int boardId)
		{
			Board board = await _dbContext
				.Boards
				.Include(b => b.Statuses)
				.ThenInclude(s => s.Tasks)
				.FirstOrDefaultAsync(b => b.Id == boardId);

			BoardBo boardBo = _mapper.Map<BoardBo>(board);
			return boardBo;
		}

		public async Task SaveTaskAsync(TaskBo taskBo)
		{
			Models.Task task = _mapper.Map<Models.Task>(taskBo);
			if (task.Id == 0)
			{
				const int BACKLOG_STATUS_ID = 1;
				decimal maxPriority = _dbContext.Tasks
					.Where(t => t.StatusId == BACKLOG_STATUS_ID)
					.OrderByDescending(t => t.Priority)
					.Select(t => t.Priority)
					.FirstOrDefault();

				task.Priority = maxPriority + 1;
				task.StatusId = BACKLOG_STATUS_ID;
				_dbContext.Tasks.Add(task);
			}
			else
			{
				Models.Task existingTask = await _dbContext.Tasks
					.FirstOrDefaultAsync(t => t.Id == task.Id);
				if (existingTask == null)
				{
					return;
				}

				existingTask.Summary = task.Summary;
			}

			await _dbContext.SaveChangesAsync();
		}

		public async Task UpdateTaskAsync(int taskId, decimal priority, int statusId)
		{
			Models.Task task = await _dbContext.Tasks
				.FirstOrDefaultAsync(t => t.Id == taskId);

			if (task == null)
			{
				return;
			}

			task.Priority = priority;
			task.StatusId = statusId;

			await _dbContext.SaveChangesAsync();
		}
	}
}
