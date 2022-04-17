using HwaSrsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HwaSrsApi.Db
{
    public class SrsContext : DbContext
    {
        public SrsContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<CardType> CardTypes { get; set; }
        public DbSet<Field> Fields { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<FieldData> FieldDatas { get; set; }
        public DbSet<CardProgress> CardProgresses { get; set; }
        public DbSet<CardReview> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FieldData>()
                .HasKey(data => new { data.CardId, data.FieldId });

            modelBuilder.Entity<FieldData>()
                .HasOne(data => data.Card)
                .WithMany(card => card.Fields)
                .HasForeignKey(data => data.CardId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FieldData>()
                .HasOne(data => data.Field)
                .WithMany()
                .HasForeignKey(data => data.FieldId)
                .OnDelete(DeleteBehavior.ClientCascade);

        }
    }
}
