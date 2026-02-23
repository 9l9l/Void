chrome.webRequest.onHeadersReceived.addListener(
    ({ responseHeaders, type, url }) => {
        if (!responseHeaders) return;

        if (type === "main_frame" && url.includes("grok.com")) {
            responseHeaders = responseHeaders.filter(
                h => h.name.toLowerCase() !== "content-security-policy"
            );
        }
        return { responseHeaders };
    },
    { urls: ["*://grok.com/*"], types: ["main_frame"] },
    ["blocking", "responseHeaders"]
);
