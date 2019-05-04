using System.Threading.Tasks;
using Taskka.Core.BusinessObjects;

namespace Taskka.Core.DataProviders
{
	public interface ITaskProvider
	{
		Task<BoardBo> GetBoardAsync(int boardId);
		Task SaveTaskAsync(TaskBo taskBo);
		Task UpdateTaskAsync(int taskId, decimal priority, int statusId);
	}
}