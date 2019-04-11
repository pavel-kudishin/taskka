using System.Threading.Tasks;
using Taska.Web.Dto;

namespace Taska.Web.Hubs
{
	public interface IBoardClient
	{
		Task SendToAll(string user, string message);
		Task RefreshBoard(BoardDto board);
	}
}
