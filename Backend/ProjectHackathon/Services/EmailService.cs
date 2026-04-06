using System.Net;
using System.Net.Mail;

namespace ProjectHackathon.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var settings = _config.GetSection("EmailSettings");
            var smtpServer = settings["SmtpServer"];
            var smtpPort = int.Parse(settings["SmtpPort"] ?? "587");
            var senderEmail = settings["SenderEmail"];
            // Retrieve password from environment variable for security, fallback to config for local dev
            var senderPassword = Environment.GetEnvironmentVariable("GMAIL_APP_PASSWORD")?.Replace(" ", "") ?? settings["SenderPassword"];

            // For local development or if credentials aren't provided, log to console
            if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
            {
                Console.WriteLine("--------------------------------------------------");
                Console.WriteLine("[EmailService] SMTP credentials not set.");
                Console.WriteLine($"TO: {toEmail}");
                Console.WriteLine($"SUBJECT: {subject}");
                Console.WriteLine($"BODY: {body}");
                Console.WriteLine("--------------------------------------------------");
                return;
            }

            try
            {
                // Force TLS 1.2 and 1.3 for modern SMTP servers like Gmail
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls13;

                using (var message = new MailMessage())
                {
                    message.From = new MailAddress(senderEmail, "NexCode Platform");
                    message.To.Add(new MailAddress(toEmail));
                    message.Subject = subject;
                    message.Body = body;
                    message.IsBodyHtml = true;

                    using (var client = new SmtpClient(smtpServer, smtpPort))
                    {
                        Console.WriteLine($"[EmailService] SMTP Client connecting to {smtpServer}:{smtpPort} with SSL/TLS...");
                        client.EnableSsl = true;
                        client.UseDefaultCredentials = false;
                        client.Credentials = new NetworkCredential(senderEmail, senderPassword);
                        client.DeliveryMethod = SmtpDeliveryMethod.Network;
                        client.Timeout = 10000; // 10 seconds
                        
                        await client.SendMailAsync(message);
                        Console.WriteLine($"[EmailService] Email successfully sent to {toEmail}.");
                    }
                }
            }
            catch (SmtpException smtpEx)
            {
                string error = $"[{DateTime.Now}] SMTP Error sending to {toEmail}: Status={smtpEx.StatusCode}, Message={smtpEx.Message}";
                if (smtpEx.InnerException != null) error += $" | Inner: {smtpEx.InnerException.Message}";
                Console.WriteLine(error);
                System.IO.File.AppendAllText("email_logs.txt", error + Environment.NewLine);
            }
            catch (Exception ex)
            {
                string error = $"[{DateTime.Now}] General Error sending to {toEmail}: {ex.GetType().Name} - {ex.Message}";
                if (ex.InnerException != null) error += $" | Inner: {ex.InnerException.Message}";
                Console.WriteLine(error);
                System.IO.File.AppendAllText("email_logs.txt", error + Environment.NewLine);
            }
        }
    }
}
