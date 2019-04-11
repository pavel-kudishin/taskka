using System.Threading.Tasks;

namespace Taska.Web.Hubs
{
	public interface IBoardClient
	{
		Task SendToAll(string user, string message);
	}
}
