using System.Threading.Tasks;
using Taskka.Web.Dto;

namespace Taskka.Web.Hubs
{
	public interface IBoardClient
	{
		Task SendToAll(string user, string message);
		Task RefreshBoard(BoardDto board);
	}
}
