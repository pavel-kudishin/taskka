using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NLog;
using NLog.Targets;
using Swashbuckle.AspNetCore.Swagger;
using Taskka.Web.Hubs;

namespace Taskka.Web
{
	public class Startup
	{
		private readonly ILogger<Startup> _logger;

		public IConfiguration Configuration { get; }

		public Startup(IConfiguration configuration, ILoggerFactory loggerFactory)
		{
			Configuration = configuration;

			const string LOG_PATH = "LogPath:FileName";
			if (Configuration[LOG_PATH] != null)
			{
				FileTarget target = (FileTarget)LogManager.Configuration.FindTargetByName("logfile");
				target.FileName = Configuration[LOG_PATH];
				LogManager.ReconfigExistingLoggers();
			}
			_logger = loggerFactory.CreateLogger<Startup>();

		}

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services
				.AddMvc()
				.SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

			services.AddSignalR(options => {});

			// In production, the React files will be served from this directory
			services.AddSpaStaticFiles(configuration =>
			{
				configuration.RootPath = "ClientApp/build";
			});

			services
				.AddSwaggerGen(options =>
				{
					options.DescribeAllEnumsAsStrings();
					options.SwaggerDoc("v1", new Info
					{
						Title = "HTTP Taska API",
						Version = $"v1",
						Description = "Taska API"
					});
					//options.OperationFilter<CustomOperationFilter>();
				});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseSpaStaticFiles();
			app.UseSignalR(builder =>
			{
				builder.MapHub<BoardHub>("/signal-board");
			});

			app.UseSwagger()
				.UseSwaggerUI(c =>
				{
					c.SwaggerEndpoint("/swagger/v1/swagger.json", "TD ABBat Leaves API V1");
				});

			app.UseMvc(routes =>
			{
				routes.MapRoute(
					name: "default",
					template: "{controller}/{action=Index}/{id?}");
			});

			app.UseSpa(spa =>
			{
				spa.Options.SourcePath = "ClientApp";

				if (env.IsDevelopment())
				{
					spa.UseReactDevelopmentServer(npmScript: "start");
				}
			});
		}
	}
}
