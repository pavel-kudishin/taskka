using Microsoft.EntityFrameworkCore.Migrations;

namespace Taskka.Core.Migrations
{
	public partial class Priority : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AddColumn<decimal>(
				name: "Priority",
				table: "Tasks",
				nullable: false,
				defaultValue: 0m);
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropColumn(
				name: "Priority",
				table: "Tasks");
		}
	}
}
