let rules = { css_selectors: [], keywords: [], text_threshold: 120 };

// --- BLOCKER LOGIC ---
chrome.storage.local.get(['adBlockRules'], (result) => {
    if (result.adBlockRules) {
        rules = result.adBlockRules;
        scanPage();
    }
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.adBlockRules) {
        rules = changes.adBlockRules.newValue;
        scanPage();
    }
});

function scanPage() {
    // 1. Precise CSS Blocking
    if (rules.css_selectors && rules.css_selectors.length > 0) {
        const selector = rules.css_selectors.join(", ");
        try {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';
                // Mark it so we don't process it again
                el.setAttribute('data-adblocked', 'true');
            });
        } catch (e) { console.error("Invalid Selector in rules"); }
    }

    // 2. Keyword Blocking (Heuristics)
    if (rules.keywords && rules.keywords.length > 0) {
        // Find small text containers
        const candidates = document.querySelectorAll('div, span, p, li, a');
        
        candidates.forEach(el => {
            if (el.offsetParent === null || el.hasAttribute('data-adblocked')) return;

            // Strict check: It should be a small label, not a full chat message
            if (el.innerText.length > 0 && el.innerText.length <= rules.text_threshold) {
                const text = el.innerText.trim().toLowerCase();
                const isMatch = rules.keywords.some(k => text === k.toLowerCase() || text.includes(k.toLowerCase()));

                if (isMatch) {
                    // Hide the element
                    el.style.display = 'none';
                    el.setAttribute('data-adblocked', 'true');
                }
            }
        });
    }
}

// Watch for dynamic content (typing/new messages)
const observer = new MutationObserver(() => scanPage());
observer.observe(document.body, { childList: true, subtree: true });

// --- REPORTING LOGIC ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "GET_SANITIZED_HTML") {
        sendResponse({ html: getSanitizedHTML() });
    }
});

function getSanitizedHTML() {
    const clone = document.body.cloneNode(true);
    
    // Remove scripts and media
    clone.querySelectorAll('script, style, iframe, svg, img, video').forEach(el => el.remove());

    // Redact user chat history (keep structure, hide content)
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
        // If text is long, it's content. If short, it might be UI or Ad label.
        if (node.nodeValue.length > 150) {
            node.nodeValue = "[REDACTED_CONTENT]";
        }
    }
    return clone.innerHTML;
}