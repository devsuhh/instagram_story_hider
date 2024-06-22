# Instagram Story Hider

Instagram Story Hider is a Chrome extension that allows you to hide users from your Instagram story and provides features to export and import hidden users.

## Features

- Check if the current page is the Instagram story hiding page
- Load usernames from page
- Export hidden users to a text file
- Export unhidden users to a text file
- Hide users from a text file
- Unhide users from a text file
- Compare a text file with currently hidden users
- Compare a text file with currently unhidden users

## Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and go to the Extensions page (`chrome://extensions/`).
3. Enable "Developer mode" using the toggle switch in the top right corner.
4. Click on "Load unpacked" and select the directory where you cloned/downloaded this repository.
5. The Instagram Story Hider extension should now be installed and visible in your Chrome extensions.

## Usage

1. Navigate to the Instagram story hiding page (`https://www.instagram.com/accounts/hide_story_and_live_from/`).
2. Click on the Instagram Story Hider extension icon in your Chrome toolbar.
3. Use the provided buttons to perform various actions:
   - "Check Page": Verifies if you are on the correct Instagram story hiding page.
   - "Load Users": Loads the usernames from the Instagram page into chrome storage (console)
   - "Export Hidden Users": Exports the currently hidden users to a text file.
   - "Export Unhidden Users": Exports the currently unhidden users to a text file.
   - "Hide Users from File": Hides the users listed in a selected text file.
   - "Unhide Users from File": Unhides the users listed in a selected text file.
   - "Compare Text File with Current Hidden": Compares a selected text file with the currently hidden users.
   - "Compare Text File with Current Unhidden": Compares a selected text file with the currently unhidden users.
4. Follow the on-screen prompts and messages for each action.

## File Structure

- `manifest.json`: The manifest file for the Chrome extension.
- `popup.html`: The HTML file for the extension's popup.
- `popup.js`: The JavaScript file handling the popup functionality.
- `content.js`: The content script injected into the Instagram story hiding page.
- `background.js`: The background script for the extension.
- `icon.png`: The icon for the extension.

## Notes

- This extension is specifically designed to work with the Instagram story hiding page (`https://www.instagram.com/accounts/hide_story_and_live_from/`).
- The extension uses Chrome Storage to store hidden usernames.
- The extension communicates between the popup, content script, and background script using Chrome's message passing system.
- The extension requires permission to access the active tab.

## License

This project is open-source and available under the MIT License

Enjoy!
- Suh
