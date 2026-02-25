chrome.webRequest.onHeadersReceived.addListener(
    ({ responseHeaders, type, url }) => {
        if (!responseHeaders) return;

        if (type === "main_frame" && url.includes("grok.com")) {
            const blocked = new Set(["content-security-policy", "content-security-policy-report-only"]);
            responseHeaders = responseHeaders.filter(
                h => !blocked.has(h.name.toLowerCase())
            );
        }
        return { responseHeaders };
    },
    { urls: ["*://grok.com/*"], types: ["main_frame"] },
    ["blocking", "responseHeaders"]
);
