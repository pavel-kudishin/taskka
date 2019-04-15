using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Taskka.Core.Migrations
{
	public partial class Initial : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.CreateTable(
				name: "Boards",
				columns: table => new
				{
					Id = table.Column<int>(nullable: false)
						.Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
					Name = table.Column<string>(nullable: true)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Boards", x => x.Id);
				});

			migrationBuilder.CreateTable(
				name: "Statuses",
				columns: table => new
				{
					Id = table.Column<int>(nullable: false)
						.Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
					Name = table.Column<string>(nullable: true),
					BoardId = table.Column<int>(nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Statuses", x => x.Id);
					table.ForeignKey(
						name: "FK_Statuses_Boards_BoardId",
						column: x => x.BoardId,
						principalTable: "Boards",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateTable(
				name: "Tasks",
				columns: table => new
				{
					Id = table.Column<int>(nullable: false)
						.Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
					Summary = table.Column<string>(nullable: true),
					StatusId = table.Column<int>(nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Tasks", x => x.Id);
					table.ForeignKey(
						name: "FK_Tasks_Statuses_StatusId",
						column: x => x.StatusId,
						principalTable: "Statuses",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateIndex(
				name: "IX_Statuses_BoardId",
				table: "Statuses",
				column: "BoardId");

			migrationBuilder.CreateIndex(
				name: "IX_Tasks_StatusId",
				table: "Tasks",
				column: "StatusId");
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(
				name: "Tasks");

			migrationBuilder.DropTable(
				name: "Statuses");

			migrationBuilder.DropTable(
				name: "Boards");
		}
	}
}
