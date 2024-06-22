chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveHiddenUsernames') {
    console.log('Received usernames:', request.usernames);
    // Save the hidden usernames to Chrome storage
    chrome.storage.local.set({ hiddenUsernames: request.usernames }, () => {
      console.log('Hidden usernames saved to storage:', request.usernames);
    });
  }
});