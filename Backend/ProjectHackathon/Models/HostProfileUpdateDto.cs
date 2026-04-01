using Microsoft.AspNetCore.Http;

namespace ProjectHackathon.Models
{
    public class HostProfileUpdateDto
    {
        public int HostID { get; set; }
        public string HostName { get; set; }
        public string OrganizationName { get; set; }
        public string Bio { get; set; }
        public string Website { get; set; }
        public string Industry { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public IFormFile? ProfileImage { get; set; }
    }

    public class HostDashboardStatsDto
    {
        public int TotalHackathons { get; set; }
        public int TotalApplicants { get; set; }
        public decimal TotalPrizePool { get; set; }
    }

    public class HostApplicantDto
    {
        public int ApplicationId { get; set; }
        public int ParticipantId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string CollegeName { get; set; }
        public string PortfolioUrl { get; set; }
        public string Motivation { get; set; }
        public string TeamMembers { get; set; }
        public DateTime AppliedAt { get; set; }
        public string HackathonName { get; set; }
        
        // Extended Details
        public byte[]? ProfileImage { get; set; }
        public string Skills { get; set; }
        public string GithubLink { get; set; }
        public int TotalParticipated { get; set; }
        public int TotalWins { get; set; }
        public bool IsWinner { get; set; }
        public bool HasParticipated { get; set; }
        public string Status { get; set; } = "Pending";
    }

    public class HostNotificationDto
    {
        public int ApplicationId { get; set; }
        public string ParticipantName { get; set; }
        public string HackathonName { get; set; }
        public DateTime AppliedAt { get; set; }
    }
}
