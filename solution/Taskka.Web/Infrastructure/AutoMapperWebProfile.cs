using AutoMapper;
using Taskka.Core.BusinessObjects;
using Taskka.Core.Models;
using Taskka.Web.Dto;

namespace Taskka.Web.Infrastructure
{
	public class AutoMapperWebProfile : Profile
	{
		public AutoMapperWebProfile()
		{
			CreateMap<Board, BoardBo>()
				.ReverseMap();
			CreateMap<Status, StatusBo>()
				.ReverseMap();
			CreateMap<Task, TaskBo>()
				.ReverseMap();

			CreateMap<BoardDto, BoardBo>()
				.ReverseMap();
			CreateMap<StatusDto, StatusBo>()
				.ReverseMap();
			CreateMap<TaskDto, TaskBo>()
				.ReverseMap();

		}
	}
}
