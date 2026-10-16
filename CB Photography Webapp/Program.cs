using System.Diagnostics;
using System.Net.Sockets;
using CB_Photography_Webapp.BusinessLogic;
using CB_Photography_Webapp.Services;

// Set up the web application builder
var builder = WebApplication.CreateBuilder(args);

// Register API controllers and Firestore database store with fallback
builder.Services.AddControllers();
builder.Services.AddSingleton<IDataStoreService, FirestoreDataStore>();
builder.Services.AddScoped<BookingService>();

// CORS: allow frontend to make credentialed requests (supports localhost, Azure, and configured domains)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var configuredOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
        var frontendUrl = builder.Configuration["Frontend:BaseUrl"] ?? builder.Configuration["Frontend:Url"];

        policy.SetIsOriginAllowed(origin =>
              {
                  if (string.IsNullOrEmpty(origin)) return false;
                  try
                  {
                      var uri = new Uri(origin);
                      // Allow localhost, LAN network IPs, and testing tunnels in dev
                      if (uri.Host == "localhost" || uri.Host == "127.0.0.1" || uri.Host.StartsWith("192.168.") || uri.Host.StartsWith("10.") || uri.Host.EndsWith(".loca.lt") || uri.Host.EndsWith(".trycloudflare.com") || uri.Host.EndsWith(".ngrok-free.app") || uri.Host.EndsWith(".ngrok.io")) return true;

                      // Allow explicitly configured frontend URLs
                      if (!string.IsNullOrEmpty(frontendUrl) && string.Equals(frontendUrl.TrimEnd('/'), origin.TrimEnd('/'), StringComparison.OrdinalIgnoreCase))
                          return true;

                      // Allow origins from Cors:AllowedOrigins list
                      if (configuredOrigins.Any(o => string.Equals(o.TrimEnd('/'), origin.TrimEnd('/'), StringComparison.OrdinalIgnoreCase)))
                          return true;

                      // Allow Azure domains and studio domains
                      if (uri.Host.EndsWith(".azurestaticapps.net", StringComparison.OrdinalIgnoreCase) ||
                          uri.Host.EndsWith(".azurewebsites.net", StringComparison.OrdinalIgnoreCase) ||
                          uri.Host.EndsWith("cbphotography.co.za", StringComparison.OrdinalIgnoreCase))
                          return true;
                  }
                  catch { }

                  return false;
              })
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// HTTP client for forwarding frontend traffic to Next.js
builder.Services.AddHttpClient("NextJsProxy", client =>
{
    client.Timeout = TimeSpan.FromSeconds(120);
});

var app = builder.Build();

// Enable HSTS in production for extra security
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

// Standard middleware pipeline
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthorization();

// In dev mode, route non-API traffic to the Next.js development server
if (app.Environment.IsDevelopment())
{
    // Start Next.js automatically if it's not already open
    EnsureNextJsRunning(app.Logger);

    var httpClientFactory = app.Services.GetRequiredService<IHttpClientFactory>();

    app.Use(async (context, next) =>
    {
        // CONNECT/WebSocket/Upgrade requests must not be proxied through here
        if (HttpMethods.IsConnect(context.Request.Method) ||
            context.Request.Headers.ContainsKey("Upgrade"))
        {
            await next();
            return;
        }

        // Let ASP.NET Core handle all /api routes directly
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            await next();
            return;
        }

        // Check if Next.js is responding on port 3000
        bool isNextJsAvailable = false;
        for (int i = 0; i < 10; i++)
        {
            if (IsPortOpen("127.0.0.1", 3000))
            {
                isNextJsAvailable = true;
                break;
            }
            await Task.Delay(500);
        }

        // If Next.js isn't ready yet, show a friendly loading and troubleshooting screen
        if (!isNextJsAvailable)
        {
            bool nodeModulesExist = Directory.Exists(Path.Combine(Directory.GetCurrentDirectory(), "node_modules"));

            context.Response.ContentType = "text/html";
            await context.Response.WriteAsync($@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8' />
                    <meta http-equiv='refresh' content='3' />
                    <title>Starting Application...</title>
                    <style>
                        body {{ font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; min-height: 100vh; margin: 0; align-items: center; justify-content: center; flex-direction: column; text-align: center; padding: 20px; box-sizing: border-box; }}
                        .spinner {{ width: 44px; height: 44px; border: 4px solid #38bdf8; border-bottom-color: transparent; border-radius: 50%; display: inline-block; animation: rotation 1s linear infinite; margin-bottom: 20px; }}
                        @keyframes rotation {{ 0% {{ transform: rotate(0deg); }} 100% {{ transform: rotate(360deg); }} }}
                        h2 {{ font-weight: 600; margin-bottom: 8px; }}
                        p {{ color: #94a3b8; margin: 0 0 16px 0; font-size: 14px; }}
                        .card {{ background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; max-width: 520px; text-align: left; margin-top: 10px; font-size: 14px; line-height: 1.6; color: #cbd5e1; }}
                        .card h3 {{ margin-top: 0; color: #f1f5f9; font-size: 16px; }}
                        code {{ background: #0f172a; color: #38bdf8; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-size: 13px; }}
                        .warning {{ color: #fbbf24; font-weight: 600; }}
                    </style>
                </head>
                <body>
                    <div class='spinner'></div>
                    <h2>Starting Application...</h2>
                    <p>Connecting to Next.js dev server on port 3000. Auto-refreshing every 3 seconds...</p>

                    <div class='card'>
                        <h3>Troubleshooting Steps:</h3>
                        {(nodeModulesExist ? "" : "<p class='warning'>The 'node_modules' folder was not found. Dependencies need to be installed first.</p>")}
                        <ol style='margin: 8px 0; padding-left: 20px;'>
                            <li>Ensure Node.js is installed.</li>
                            {(nodeModulesExist ? "" : "<li>Run <code>npm install</code> to install dependencies.</li>")}
                            <li>Run <code>npm run dev</code> manually to inspect any issues.</li>
                            <li>Verify that port <code>3000</code> is free.</li>
                        </ol>
                    </div>
                </body>
                </html>");
            return;
        }

        // Build the proxy request to forward to the Next.js dev server
        var client = httpClientFactory.CreateClient("NextJsProxy");
        var targetUri = new Uri($"http://localhost:3000{context.Request.Path}{context.Request.QueryString}");

        var requestMessage = new HttpRequestMessage(new HttpMethod(context.Request.Method), targetUri);

        // Copy over incoming request headers (skip host header to prevent proxy loops)
        foreach (var header in context.Request.Headers)
        {
            if (!header.Key.StartsWith(":", StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(header.Key, "Host", StringComparison.OrdinalIgnoreCase))
            {
                requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
            }
        }

        // Copy the body content for mutation requests
        if (HttpMethods.IsPost(context.Request.Method) ||
            HttpMethods.IsPut(context.Request.Method) ||
            HttpMethods.IsPatch(context.Request.Method))
        {
            var streamContent = new StreamContent(context.Request.Body);
            requestMessage.Content = streamContent;
            if (context.Request.ContentType != null)
            {
                requestMessage.Content.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse(context.Request.ContentType);
            }
        }

        try
        {
            // Send request to Next.js and stream the response back
            using var responseMessage = await client.SendAsync(requestMessage, HttpCompletionOption.ResponseHeadersRead, context.RequestAborted);
            context.Response.StatusCode = (int)responseMessage.StatusCode;

            foreach (var header in responseMessage.Headers)
            {
                context.Response.Headers[header.Key] = header.Value.ToArray();
            }
            foreach (var header in responseMessage.Content.Headers)
            {
                context.Response.Headers[header.Key] = header.Value.ToArray();
            }
            context.Response.Headers.Remove("transfer-encoding");

            await responseMessage.Content.CopyToAsync(context.Response.Body, context.RequestAborted);
        }
        catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested)
        {
            // Request was aborted by the user/browser, so we can ignore
        }
        catch (Exception ex)
        {
            app.Logger.LogWarning(ex, "Proxy request to Next.js failed.");
            if (!context.Response.HasStarted)
            {
                await next();
            }
        }
    });
}

// Map controller endpoints and run the app
app.MapControllers();

// Support SPA client-side routing if static frontend files are served from wwwroot
if (File.Exists(Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "index.html")))
{
    app.MapFallbackToFile("index.html");
}

app.Run();

// Helper to check if a TCP port is currently open and reachable
static bool IsPortOpen(string host, int port)
{
    try
    {
        using var client = new TcpClient();
        var result = client.BeginConnect(host, port, null, null);
        bool success = result.AsyncWaitHandle.WaitOne(TimeSpan.FromMilliseconds(200));
        if (success && client.Connected)
        {
            client.EndConnect(result);
            return true;
        }
    }
    catch { }
    return false;
}

// Spawns Next.js dev server in a new window if it is not already running
static void EnsureNextJsRunning(ILogger logger)
{
    if (IsPortOpen("127.0.0.1", 3000))
    {
        return;
    }

    try
    {
        string localNode = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "nodejs");
        var currentPath = Environment.GetEnvironmentVariable("PATH") ?? "";
        if (Directory.Exists(localNode) && !currentPath.Contains(localNode))
        {
            Environment.SetEnvironmentVariable("PATH", localNode + ";" + currentPath);
        }

        logger.LogInformation("Launching Next.js dev server on port 3000...");
        
        // Auto run npm install if dependencies haven't been downloaded yet
        bool nodeModulesExist = Directory.Exists(Path.Combine(Directory.GetCurrentDirectory(), "node_modules"));
        string cmdArgs = nodeModulesExist ? "/k npm run dev" : "/k npm install && npm run dev";

        var psi = new ProcessStartInfo
        {
            FileName = "cmd.exe",
            Arguments = cmdArgs,
            WorkingDirectory = Directory.GetCurrentDirectory(),
            UseShellExecute = true,
            WindowStyle = ProcessWindowStyle.Normal
        };
        Process.Start(psi);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to start Next.js dev server process.");
    }
}
