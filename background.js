// CONFIGURATION
// This points to the raw file in YOUR repository
const RULES_URL = "https://raw.githubusercontent.com/krittinkalra/chatgpt-ad-blocker/main/rules.json";

chrome.runtime.onInstalled.addListener(() => {
    updateRules();
    // Check for updates every 60 minutes
    chrome.alarms.create("fetchRules", { periodInMinutes: 60 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "fetchRules") {
        updateRules();
    }
});

async function updateRules() {
    try {
        // We add a timestamp to bypass browser caching of the JSON file
        const response = await fetch(`${RULES_URL}?t=${Date.now()}`);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const rules = await response.json();
        
        chrome.storage.local.set({ adBlockRules: rules }, () => {
            console.log("AdBlock Rules updated from GitHub:", rules);
        });
    } catch (error) {
        console.error("Failed to fetch rules:", error);
    }
}