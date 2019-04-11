using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Taska.Web.Hubs
{
	public class BoardHub : Hub<IBoardClient>
	{
	}
}
