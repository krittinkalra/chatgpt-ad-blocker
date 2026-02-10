document.getElementById('reportBtn').addEventListener('click', async () => {
    const status = document.getElementById('status');
    const btn = document.getElementById('reportBtn');
    
    btn.disabled = true;
    btn.innerText = "Scanning...";
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url.includes("chatgpt")) {
        status.innerText = "Please open ChatGPT first.";
        btn.disabled = false;
        return;
    }

    chrome.tabs.sendMessage(tab.id, { action: "GET_SANITIZED_HTML" }, (response) => {
        if (chrome.runtime.lastError || !response) {
            status.innerText = "Try refreshing the page.";
            btn.disabled = false;
            return;
        }
        sendReport(response.html);
    });

    function sendReport(htmlData) {
        btn.innerText = "Sending...";
        
        const WEBHOOK_URL = "https://discord.com/api/webhooks/1470672111038103553/zkuhZvXgJ1auAbCTASubhGNF-wB2iTKVnvnp_uh3mCE8unGTTZBx49B6ZQzrEupkwr_f";

        // Format data for Discord
        const payload = {
            content: "**New Ad Report Received** 🚨",
            embeds: [{
                title: "Page Dump",
                description: "Attached HTML structure for analysis.",
                color: 15158332,
                fields: [
                    { name: "Time", value: new Date().toISOString() }
                ]
            }]
        };

        // We send the HTML as a file attachment because it's too long for a message
        const blob = new Blob([htmlData], { type: 'text/html' });
        const formData = new FormData();
        formData.append('payload_json', JSON.stringify(payload));
        formData.append('file', blob, 'page_structure.html');

        fetch(WEBHOOK_URL, {
            method: "POST",
            body: formData
        })
        .then(res => {
            if(res.ok) {
                status.innerText = "Report sent! We'll update rules shortly.";
                status.style.color = "green";
            } else {
                throw new Error("Failed");
            }
        })
        .catch(err => {
            status.innerText = "Error sending report.";
            console.error(err);
        })
        .finally(() => {
            btn.innerText = "Report Ad Layout";
            btn.disabled = false;
        });
    }
});