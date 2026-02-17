# ChatGPT Ad Blocker :no_entry_sign::shield:

A community-driven, open-source browser extension to block ads on ChatGPT. 

[![Available in the Chrome Web Store](./chrome-store-badge.png)](https://chromewebstore.google.com/detail/chatgpt-ad-blocker/ipmmidjikilclkbnglogmgoofbhjikgb)

## Why this exists?
ChatGPT recently began rolling out ads. Because the platform changes frequently, traditional static blocklists might fail. This extension uses a hybrid approach:
1. **Dynamic Rules:** Fetches updated blocking rules from this repository automatically.
2. **Community Reporting:** Users can anonymously report new ad layouts directly via the extension.

## Features
- **Zero Config:** Just install and browse.
- **Privacy First:** Chat history is redacted locally before any debugging data is shared.
- **Open Source:** Rules and code are transparent.

## How it works
The extension checks `rules.json` in this repository every hour. If an ad format changes, we update the JSON file, and all users get the update automatically without waiting for Chrome Web Store review times.

## Installation
- **From Chrome Web Store:** [Install ChatGPT Ad Blocker](https://chromewebstore.google.com/detail/chatgpt-ad-blocker/ipmmidjikilclkbnglogmgoofbhjikgb)
1. Download the repository.
2. Go to `chrome://extensions/` in Chrome/Brave/Edge.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the folder.

## Contributing
Found an ad? 
1. Use the "Report Ad Layout" button in the extension.
2. Or, submit a Pull Request to `rules.json` with the new CSS selector.

## License
MIT