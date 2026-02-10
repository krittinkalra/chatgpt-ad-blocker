console.log("🛡️ ChatGPT Ad Blocker: Content Script Loaded");

let rules = { css_selectors: [], keywords: [], text_threshold: 120 };

// Load rules logic (Keep existing logic here, just abbreviated for this snippet)
chrome.storage.local.get(['adBlockRules'], (result) => {
    if (result.adBlockRules) {
        console.log("🛡️ Rules loaded from storage:", result.adBlockRules);
        rules = result.adBlockRules;
        // scanPage(); // Call your scan function here
    }
});

// --- REPORTING LISTENER ---

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("🛡️ Content Script received message:", request);

    if (request.action === "GET_SANITIZED_HTML") {
        try {
            const cleanHTML = getSanitizedHTML();
            console.log("🛡️ HTML Sanitized. Sending back response.");
            sendResponse({ html: cleanHTML });
        } catch (e) {
            console.error("🛡️ Error sanitizing HTML:", e);
            sendResponse({ error: e.message });
        }
    }
    // Return true is required for async sendResponse, though we are synchronous here, it's good practice
    return true; 
});

function getSanitizedHTML() {
    const clone = document.body.cloneNode(true);
    
    // Remove scripts and media
    clone.querySelectorAll('script, style, iframe, svg, img, video').forEach(el => el.remove());

    // Redact user chat history
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
        if (node.nodeValue.length > 150) {
            node.nodeValue = "[REDACTED_CONTENT]";
        }
    }
    return clone.innerHTML;
}