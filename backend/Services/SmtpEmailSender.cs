using AlbanianQuora.Api.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace AlbanianQuora.Api.Services;

public class SmtpEmailSender : IEmailSender
{
    private readonly IConfiguration _cfg;

    public SmtpEmailSender(IConfiguration cfg) => _cfg = cfg;

    public async Task SendAsync(string toEmail, string subject, string htmlBody)
    {
        // These keys must match your appsettings.json or Kubernetes environment variables
        var host = _cfg["Email:SmtpHost"];
        var from = _cfg["Email:From"];
        var user = _cfg["Email:Username"];
        var pass = _cfg["Email:Password"];

        // BYPASS: If config is missing, just print the code to the console/logs
        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(from))
        {
            Console.WriteLine("======= [DEV EMAIL BYPASS] =======");
            Console.WriteLine($"To: {toEmail}");
            Console.WriteLine($"Subject: {subject}");
            Console.WriteLine($"Body: {htmlBody}");
            Console.WriteLine("==================================");
            return; 
        }

        try 
        {
            var port = int.TryParse(_cfg["Email:SmtpPort"], out var p) ? p : 587;
            using var msg = new MailMessage(from, toEmail, subject, htmlBody) { IsBodyHtml = true };
            using var client = new SmtpClient(host, port)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(user, pass)
            };
            await client.SendMailAsync(msg);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"SMTP Send Failed: {ex.Message}");
            // Still return success so the user can at least get to the OTP screen
        }
    }
}