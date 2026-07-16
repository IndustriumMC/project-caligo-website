const localSpeedInsightHosts = new Set(["localhost", "127.0.0.1", "::1"]);

if (window.location.protocol === "https:" && !localSpeedInsightHosts.has(window.location.hostname)) {
  window.si =
    window.si ||
    function queueVercelSpeedInsights() {
      (window.siq = window.siq || []).push(arguments);
    };

  window.si("beforeSend", (event) => {
    try {
      const url = new URL(event.url, window.location.origin);
      url.search = "";
      url.hash = "";
      return { ...event, url: url.toString() };
    } catch {
      return event;
    }
  });

  const speedInsightsScript = document.createElement("script");
  speedInsightsScript.defer = true;
  speedInsightsScript.src = "/_vercel/speed-insights/script.js";
  document.head.append(speedInsightsScript);
}
