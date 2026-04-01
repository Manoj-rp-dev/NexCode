namespace ProjectHackathon.Models
{
    public class UpdateStatusDto
    {
        [System.Text.Json.Serialization.JsonPropertyName("applicationId")]
        public int ApplicationId { get; set; }

        [System.Text.Json.Serialization.JsonPropertyName("status")]
        public bool Status { get; set; }
    }
}
