namespace ProjectHackathon.Models
{
    public class HostHackathons
    {
        public int HackathonID { get; set; }

        public int HostID { get; set; }

        public string HackathonName { get; set; }

        public string HackathonType { get; set; }

        public string Mode { get; set; }

        public string ParticipationType { get; set; }

        public int? TeamSize { get; set; }

        public decimal? PrizePool { get; set; }

        public DateTime EventDate { get; set; }

        public DateTime? RegistrationStartDate { get; set; }

        public DateTime? RegistrationEndDate { get; set; }

        public IFormFile Photo { get; set; }

        public string Description { get; set; }

        public string WebsiteLink { get; set; }
    }
}
