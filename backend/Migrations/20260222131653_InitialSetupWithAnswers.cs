using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlbanianQuora.Migrations
{
    /// <inheritdoc />
    public partial class InitialSetupWithAnswers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 22, 13, 16, 53, 367, DateTimeKind.Utc).AddTicks(1846));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 22, 12, 49, 35, 70, DateTimeKind.Utc).AddTicks(6912));
        }
    }
}
