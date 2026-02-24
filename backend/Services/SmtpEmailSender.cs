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
        var host = _cfg["Email:SmtpHost"];
        var from = _cfg["Email:From"];
        var user = _cfg["Email:Username"];
        var pass = _cfg["Email:Password"];

        if (string.IsNullOrWhiteSpace(host) ||
            string.IsNullOrWhiteSpace(from) ||
            string.IsNullOrWhiteSpace(user) ||
            string.IsNullOrWhiteSpace(pass))
        {
            throw new InvalidOperationException("Email SMTP is not configured. Set Email:* in configuration.");
        }

        var port = int.TryParse(_cfg["Email:SmtpPort"], out var p) ? p : 587;
        var useSsl = bool.TryParse(_cfg["Email:UseSsl"], out var ssl) ? ssl : true;

        using var msg = new MailMessage(from, toEmail, subject, htmlBody)
        {
            IsBodyHtml = true
        };

        using var client = new SmtpClient(host, port)
        {
            EnableSsl = useSsl,
            Credentials = new NetworkCredential(user, pass)
        };

        await client.SendMailAsync(msg);
    }
}