using System.Collections.Concurrent;

namespace AlbanianQuora.Api.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private static readonly ConcurrentDictionary<string, ClientRateInfo> _clients = new();

        // Configuration
        private const int MaxRequests = 100;              // max requests per window
        private const int WindowSeconds = 60;             // time window in seconds

        public RateLimitingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var clientIp = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var now = DateTime.UtcNow;

            var clientInfo = _clients.GetOrAdd(clientIp, _ => new ClientRateInfo
            {
                RequestCount = 0,
                WindowStart = now
            });

            lock (clientInfo)
            {
                // Reset window if expired
                if ((now - clientInfo.WindowStart).TotalSeconds > WindowSeconds)
                {
                    clientInfo.RequestCount = 0;
                    clientInfo.WindowStart = now;
                }

                clientInfo.RequestCount++;

                if (clientInfo.RequestCount > MaxRequests)
                {
                    context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                    context.Response.Headers["Retry-After"] = WindowSeconds.ToString();
                    context.Response.ContentType = "application/json";
                    context.Response.WriteAsync(
                        "{\"error\":\"Too many requests. Please try again later.\"}");
                    return;
                }
            }

            await _next(context);
        }
    }

    internal class ClientRateInfo
    {
        public int RequestCount { get; set; }
        public DateTime WindowStart { get; set; }
    }

    // Extension method for clean registration
    public static class RateLimitingMiddlewareExtensions
    {
        public static IApplicationBuilder UseRateLimiting(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RateLimitingMiddleware>();
        }
    }
}
