let blocked_domains = [];

// GitHub RAW blocklist URL
const BLOCKLIST_URL =
  "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts";

// Load blocklist from GitHub
async function loadBlocklist() {
  try {
    const response = await fetch(BLOCKLIST_URL);
    const text = await response.text();

    blocked_domains = text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line && !line.startsWith("#"));

    console.log("Ads Guard: Blocklist loaded", blocked_domains.length);
  } catch (e) {
    console.error("Ads Guard: Failed to load blocklist", e);
  }
}

// Initial load
loadBlocklist();

// Block requests
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    return {
      cancel: blocked_domains.some(domain =>
        details.url.includes(domain)
      )
    };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
