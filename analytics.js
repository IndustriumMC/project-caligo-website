const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);

if (window.location.protocol === "https:" && !localHosts.has(window.location.hostname)) {
  window.va =
    window.va ||
    function queueVercelAnalytics() {
      (window.vaq = window.vaq || []).push(arguments);
    };

  window.va("beforeSend", (event) => {
    try {
      const url = new URL(event.url, window.location.origin);
      url.search = "";
      url.hash = "";
      return { ...event, url: url.toString() };
    } catch {
      return event;
    }
  });

  const analyticsScript = document.createElement("script");
  analyticsScript.defer = true;
  analyticsScript.src = "/_vercel/insights/script.js";
  document.head.append(analyticsScript);
}
