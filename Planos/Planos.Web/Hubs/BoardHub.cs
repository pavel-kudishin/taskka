using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Taska.Web.Hubs
{
	public class BoardHub : Hub<IBoardClient>
	{
		public async Task SendToAll(string name, string message)
		{
			//await Clients.Others.SendToAll(name, message);
			await Clients.All.SendToAll(name, message);
		}
	}
}
