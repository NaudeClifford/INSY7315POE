using System.Diagnostics;
using System.Net.Sockets;
using CB_Photography_Webapp.Services;

// Create ASP.NET Core WebApplication builder with default configurations
var builder = WebApplication.CreateBuilder(args);

// Register Model-View-Controller (MVC) services, IDataStoreService, and HttpClient into dependency injection
builder.Services.AddControllersWithViews();
builder.Services.AddSingleton<IDataStoreService, DemoDataStore>();
builder.Services.AddHttpClient("NextJsProxy", client =>
{
    client.Timeout = TimeSpan.FromSeconds(120);
});

// Build the WebApplication instance
var app = builder.Build();

// Configure HTTP request middleware pipeline based on environment
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Automatically redirect HTTP requests to secure HTTPS
app.UseHttpsRedirection();

// Serve static assets from wwwroot
app.UseStaticFiles();

// Enable endpoint routing for matching incoming requests to controllers
app.UseRouting();

// Enable authorization middleware for controller access control
app.UseAuthorization();

// In Development environment, ensure Next.js dev server is running and proxy frontend traffic
if (app.Environment.IsDevelopment())
{
    // Auto-launch npm run dev if port 3000 is not active yet
    EnsureNextJsRunning(app.Logger);

    var httpClientFactory = app.Services.GetRequiredService<IHttpClientFactory>();

    app.Use(async (context, next) =>
    {
        // Allow backend API routes (/api/...) to be handled by ASP.NET Core controllers
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            await next();
            return;
        }

        // Wait up to 5 seconds for Next.js server to be active
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

        // If Next.js is still starting up, present an auto-refreshing splash screen instead of crashing
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
                    <title>Starting Photography Webapp...</title>
                    <style>
                        body {{ font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; min-height: 100vh; margin: 0; align-items: center; justify-content: center; flex-direction: column; text-align: center; padding: 20px; box-sizing: border-box; }}
                        .spinner {{ width: 44px; height: 44px; border: 4px solid #38bdf8; border-bottom-color: transparent; border-radius: 50%; display: inline-block; animation: rotation 1s linear infinite; margin-bottom: 20px; }}
                        @keyframes rotation {{ 0% {{ transform: rotate(0deg); }} 100% {{ transform: rotate(360deg); }} }}
                        h2 {{ font-weight: 600; margin-bottom: 8px; }}
                        p {{ color: #94a3b8; margin: 0 0 16px 0; font-size: 14px; }}
                        .card {{ background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; max-width: 520px; text-align: left; margin-top: 10px; font-size: 14px; line-height: 1.6; color: #cbd5e1; }}
                        .card h3 {{ margin-top: 0; color: #f1f5f9; font-size: 16px; display: flex; align-items: center; gap: 8px; }}
                        code {{ background: #0f172a; color: #38bdf8; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-size: 13px; }}
                        .warning {{ color: #fbbf24; font-weight: 600; }}
                    </style>
                </head>
                <body>
                    <div class='spinner'></div>
                    <h2>Starting Photography Webapp...</h2>
                    <p>Connecting to Next.js dev server on port 3000. Auto-refreshing every 3 seconds...</p>

                    <div class='card'>
                        <h3>⚠️ Still stuck on this screen?</h3>
                        {(nodeModulesExist ? "" : "<p class='warning'>❌ 'node_modules' folder is missing! You need to install dependencies first.</p>")}
                        <p>Follow these quick steps in your terminal (inside the project root folder):</p>
                        <ol style='margin: 8px 0; padding-left: 20px;'>
                            <li>Make sure <strong>Node.js</strong> is installed on your machine.</li>
                            {(nodeModulesExist ? "" : "<li>Run <code>npm install</code> to install required packages.</li>")}
                            <li>Run <code>npm run dev</code> manually to see if there are any errors.</li>
                            <li>Ensure port <code>3000</code> is not being used by another application.</li>
                        </ol>
                    </div>
                </body>
                </html>");
            return;
        }

        var client = httpClientFactory.CreateClient("NextJsProxy");
        var targetUri = new Uri($"http://localhost:3000{context.Request.Path}{context.Request.QueryString}");

        var requestMessage = new HttpRequestMessage(new HttpMethod(context.Request.Method), targetUri);

        foreach (var header in context.Request.Headers)
        {
            if (!header.Key.StartsWith(":", StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(header.Key, "Host", StringComparison.OrdinalIgnoreCase))
            {
                requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
            }
        }

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
            // Ignore request aborted by user closing browser
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

// Map Web API Controllers
app.MapControllers();

// Define default MVC route pattern ({controller}/{action}/{id}) pointing to HomeController Index
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Launch the ASP.NET Core web server
app.Run();

// Helper method to check if a TCP port is open
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

// Helper method to auto-launch npm run dev if Next.js is not already listening on port 3000
static void EnsureNextJsRunning(ILogger logger)
{
    if (IsPortOpen("127.0.0.1", 3000))
    {
        return; // Next.js is already running
    }

    try
    {
        logger.LogInformation("Launching Next.js dev server on port 3000...");
        
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

