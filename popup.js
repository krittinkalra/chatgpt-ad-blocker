document.getElementById('reportBtn').addEventListener('click', async () => {
    const status = document.getElementById('status');
    const btn = document.getElementById('reportBtn');
    
    console.log("[Popup] Report button clicked.");

    // UI Feedback
    btn.disabled = true;
    btn.innerText = "Scanning...";
    status.innerText = "Initializing...";
    
    // 1. Get Active Tab
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        console.log("[Popup] Found active tab:", tab);

        if (!tab) {
            handleError("No active tab found.");
            return;
        }

        if (!tab.url.includes("chatgpt.com")) {
            handleError("This is not a ChatGPT tab.");
            return;
        }

        // 2. Send Message to Content Script
        console.log("[Popup] Sending message to tab ID:", tab.id);
        
        chrome.tabs.sendMessage(tab.id, { action: "GET_SANITIZED_HTML" }, (response) => {
            // Check for connection errors (e.g., content script not loaded)
            if (chrome.runtime.lastError) {
                console.error("[Popup] Runtime Error:", chrome.runtime.lastError.message);
                handleError("Connection failed. Please REFRESH the ChatGPT page.");
                return;
            }

            if (!response || !response.html) {
                console.error("[Popup] Invalid response received:", response);
                handleError("Failed to get HTML from page.");
                return;
            }

            console.log("[Popup] HTML received. Length:", response.html.length);
            status.innerText = "HTML captured. Sending to server...";
            sendReport(response.html);
        });

    } catch (err) {
        console.error("[Popup] Unexpected error:", err);
        handleError("Unexpected error occurred.");
    }

    function handleError(msg) {
        status.innerText = " " + msg;
        status.style.color = "red";
        btn.disabled = false;
        btn.innerText = "Report Ad Layout";
    }

    function sendReport(htmlData) {
        // PASTE YOUR DISCORD WEBHOOK URL HERE
        const WEBHOOK_URL = "https://discord.com/api/webhooks/1470672111038103553/zkuhZvXgJ1auAbCTASubhGNF-wB2iTKVnvnp_uh3mCE8unGTTZBx49B6ZQzrEupkwr_f";

        if (!WEBHOOK_URL || WEBHOOK_URL.includes("YOUR_DISCORD")) {
            handleError("Webhook URL not configured in popup.js");
            return;
        }

        const payload = {
            content: "**New Ad Report Received** ",
            embeds: [{
                title: "Page Dump",
                description: "Attached HTML structure for analysis.",
                color: 15158332,
                fields: [{ name: "Time", value: new Date().toISOString() }]
            }]
        };

        const blob = new Blob([htmlData], { type: 'text/html' });
        const formData = new FormData();
        formData.append('payload_json', JSON.stringify(payload));
        formData.append('file', blob, 'page_dump.html');

        fetch(WEBHOOK_URL, {
            method: "POST",
            body: formData
        })
        .then(res => {
            if(res.ok) {
                console.log("[Popup] Report sent successfully.");
                status.innerText = " Report sent! Thank you.";
                status.style.color = "green";
            } else {
                throw new Error("Server responded with " + res.status);
            }
        })
        .catch(err => {
            console.error("[Popup] Upload error:", err);
            handleError("Network error. Check console.");
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerText = "Report Ad Layout";
        });
    }
});