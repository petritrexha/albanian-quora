using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AlbanianQuora.Migrations
{
    /// <inheritdoc />
    public partial class SeedAllCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 27, 1, 28, 39, 33, DateTimeKind.Utc).AddTicks(8636));

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CreatedAt", "IsActive", "Name" },
                values: new object[,]
                {
                    { 2, new DateTime(2026, 2, 27, 1, 28, 39, 33, DateTimeKind.Utc).AddTicks(8638), true, "Programim" },
                    { 3, new DateTime(2026, 2, 27, 1, 28, 39, 33, DateTimeKind.Utc).AddTicks(8640), true, "Teknologji" },
                    { 4, new DateTime(2026, 2, 27, 1, 28, 39, 33, DateTimeKind.Utc).AddTicks(8641), true, "Shkence" },
                    { 5, new DateTime(2026, 2, 27, 1, 28, 39, 33, DateTimeKind.Utc).AddTicks(8643), true, "Arsim" },
                    { 6, new DateTime(2026, 2, 27, 1, 28, 39, 33, DateTimeKind.Utc).AddTicks(8644), true, "Biznes" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 26, 23, 34, 4, 611, DateTimeKind.Utc).AddTicks(6505));
        }
    }
}
