using System.Threading.Tasks;
using Taskka.Core.BusinessObjects;
using Taskka.Core.DataProviders;

namespace Taskka.Core.Services
{
	public class TaskService: ITaskService
	{
		private readonly ITaskProvider _taskProvider;

		public TaskService(ITaskProvider taskProvider)
		{
			_taskProvider = taskProvider;
		}

		public async Task<BoardBo> GetBoardAsync(int boardId)
		{
			return await _taskProvider.GetBoardAsync(boardId);
		}

		public async Task SaveTaskAsync(TaskBo taskBo)
		{
			await _taskProvider.SaveTaskAsync(taskBo);
		}

		public async Task UpdateTaskAsync(int taskId, decimal priority, int statusId)
		{
			await _taskProvider.UpdateTaskAsync(taskId, priority, statusId);
		}
	}
}
