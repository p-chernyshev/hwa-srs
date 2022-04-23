using Microsoft.EntityFrameworkCore.Migrations;

namespace HwaSrsApi.Migrations
{
    public partial class AddCardReviewNavigationToCardProgress : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_CardProgresses_CardProgressId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_CardProgressId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "CardProgressId",
                table: "Reviews");

            migrationBuilder.AddColumn<int>(
                name: "CardId",
                table: "Reviews",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_CardId",
                table: "Reviews",
                column: "CardId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_CardProgresses_CardId",
                table: "Reviews",
                column: "CardId",
                principalTable: "CardProgresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_CardProgresses_CardId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_CardId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "CardId",
                table: "Reviews");

            migrationBuilder.AddColumn<int>(
                name: "CardProgressId",
                table: "Reviews",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_CardProgressId",
                table: "Reviews",
                column: "CardProgressId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_CardProgresses_CardProgressId",
                table: "Reviews",
                column: "CardProgressId",
                principalTable: "CardProgresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
