using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlbanianQuora.Migrations
{
    /// <inheritdoc />
    public partial class AddLoginOtpTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 27, 15, 56, 4, 614, DateTimeKind.Utc).AddTicks(2233));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 27, 15, 56, 4, 614, DateTimeKind.Utc).AddTicks(2236));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 27, 15, 56, 4, 614, DateTimeKind.Utc).AddTicks(2239));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 27, 15, 56, 4, 614, DateTimeKind.Utc).AddTicks(2241));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 27, 15, 56, 4, 614, DateTimeKind.Utc).AddTicks(2243));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 27, 15, 56, 4, 614, DateTimeKind.Utc).AddTicks(2245));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
