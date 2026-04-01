namespace ProjectHackathon.Models
{
    public class ParticipantsProfile
    {
        public int ParticipantsID { get; set; }

        public string? Skill { get; set; }

        public string? Place { get; set; }

        public string? GithubLink { get; set; }

        public string? Bio { get; set; }

        public IFormFile? ImageFile { get; set; }
    }
}
    