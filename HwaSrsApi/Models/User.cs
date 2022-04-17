using System.ComponentModel.DataAnnotations;

namespace HwaSrsApi.Models
{
    public class User
    {
        public int Id { get; set; }

        [MaxLength(64)]
        [Required]
        public string Login { get; set; }
        [MaxLength(64)]
        [Required]
        public string Password { get; set; }

        public UserGroup UserGroup { get; set; }
    }

    public enum UserGroup
    {
        [Display(Name = "Администратор")]
        Admin,
        [Display(Name = "Автор")]
        Editor,
        [Display(Name = "Пользователь")]
        User,
    }
}
