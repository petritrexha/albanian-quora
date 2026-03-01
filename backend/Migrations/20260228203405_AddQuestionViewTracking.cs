using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlbanianQuora.Migrations
{
    /// <inheritdoc />
    public partial class AddQuestionViewTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QuestionViews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    IpAddress = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ViewedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionViews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionViews_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionViews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 28, 20, 34, 5, 551, DateTimeKind.Utc).AddTicks(8023));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 28, 20, 34, 5, 551, DateTimeKind.Utc).AddTicks(8027));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 28, 20, 34, 5, 551, DateTimeKind.Utc).AddTicks(8028));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 28, 20, 34, 5, 551, DateTimeKind.Utc).AddTicks(8029));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 28, 20, 34, 5, 551, DateTimeKind.Utc).AddTicks(8030));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 28, 20, 34, 5, 551, DateTimeKind.Utc).AddTicks(8032));

            migrationBuilder.CreateIndex(
                name: "IX_QuestionViews_QuestionId_UserId_IpAddress_ViewedAt",
                table: "QuestionViews",
                columns: new[] { "QuestionId", "UserId", "IpAddress", "ViewedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionViews_UserId",
                table: "QuestionViews",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuestionViews");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 27, 1, 28, 39, 33, DateTimeKind.Utc).AddTicks(8636));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 27, 1, 28, 39, 33, DateTimeKind.Utc).AddTicks(8638));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 27, 1, 28, 39, 33, DateTimeKind.Utc).AddTicks(8640));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 27, 1, 28, 39, 33, DateTimeKind.Utc).AddTicks(8641));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 27, 1, 28, 39, 33, DateTimeKind.Utc).AddTicks(8643));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 27, 1, 28, 39, 33, DateTimeKind.Utc).AddTicks(8644));
        }
    }
}
