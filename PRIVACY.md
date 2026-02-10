# Privacy Policy for ChatGPT Ad Blocker

**Last Updated:** [Insert Date]

## 1. Data Collection
This extension prioritizes your privacy. 
- **No passive tracking:** We do not track your browsing history or chat content automatically.
- **No cookies:** We do not store cookies on your device.

## 2. The "Report Ad" Feature
The only data transmitted by this extension occurs when you manually click the **"Report Ad Layout"** button.

When you click this button:
1. The extension creates a copy of the current page structure (HTML).
2. It runs a **Sanitization Process** locally on your device:
   - Removes all images, videos, scripts, and iframes.
   - **Redacts** text blocks longer than 150 characters (identifying them as user chat content).
3. The sanitized HTML structure is sent to our developers via a secure webhook.

**Purpose:** This data is used solely to identify the HTML structure of advertisements (e.g., `div` class names) to update our blocking rules.

## 3. Remote Rules
The extension periodically fetches a `rules.json` file from our public GitHub repository. This is a read-only request and sends no user data.

## 4. Third-Party Services
We use GitHub to host the blocking rules. We use Discord/Webhooks to receive the anonymous page structure reports.

## 5. Contact
For privacy concerns, please open an issue in our GitHub repository.