let userElements = [];

// Check if the user is logged in and on the specified page
if (window.location.href === 'https://www.instagram.com/accounts/hide_story_and_live_from/') {
  // Listen for messages from the popup script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'loadUsernames') {
      // Find all the user elements
      userElements = document.querySelectorAll('div[data-bloks-name="bk.components.Flexbox"][role="button"][tabindex="0"]');

      // Extract the usernames from the elements
      const usernames = Array.from(userElements).map(element => {
        const usernameElement = element.querySelector('span[data-bloks-name="bk.components.Text"][style*="font-weight: 600"]');
        const isHidden = element.querySelector('div[data-bloks-name="ig.components.Icon"][style*="circle-check__filled"]') !== null;
        return { username: usernameElement ? usernameElement.textContent.trim() : '', isHidden };
      });

      console.log('Usernames:', usernames);
      sendResponse({ message: 'Usernames loaded successfully' });
    } else if (request.action === 'exportHiddenUsers') {
      const hiddenUsernames = Array.from(new Set(Array.from(userElements)
        .filter(element => element.querySelector('div[data-bloks-name="ig.components.Icon"][style*="circle-check__filled"]') !== null)
        .map(element => {
          const usernameElement = element.querySelector('span[data-bloks-name="bk.components.Text"][style*="font-weight: 600"]');
          return usernameElement ? usernameElement.textContent.trim() : '';
        })
        .filter(Boolean)));
      exportUsersToFile(hiddenUsernames, 'hidden_users.txt');
      sendResponse({ message: `Exported ${hiddenUsernames.length} hidden users` });
    } else if (request.action === 'exportUnhiddenUsers') {
      const unhiddenUsernames = Array.from(new Set(Array.from(userElements)
        .filter(element => element.querySelector('div[data-bloks-name="ig.components.Icon"][style*="circle-check__filled"]') === null)
        .map(element => {
          const usernameElement = element.querySelector('span[data-bloks-name="bk.components.Text"][style*="font-weight: 600"]');
          return usernameElement ? usernameElement.textContent.trim() : '';
        })
        .filter(Boolean)));
      exportUsersToFile(unhiddenUsernames, 'unhidden_users.txt');
      sendResponse({ message: `Exported ${unhiddenUsernames.length} unhidden users` });
    } else if (request.action === 'hideUsers') {
      hideUsers(request.usernames, sendResponse);
    } else if (request.action === 'unhideUsers') {
      unhideUsers(request.usernames, sendResponse);
    } else if (request.action === 'compareHiddenUsers') {
      compareUsers(request.usernamesFromFile, true, sendResponse);
    } else if (request.action === 'compareUnhiddenUsers') {
      compareUsers(request.usernamesFromFile, false, sendResponse);
    }
    return true; // Required to use sendResponse asynchronously
  });
}

function exportUsersToFile(users, filename) {
  const fileContent = users.join('\n');
  const blob = new Blob([fileContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function compareUsers(usernamesFromFile, compareHidden, sendResponse) {
  const currentUsernames = Array.from(userElements)
    .filter(element => {
      const isHidden = element.querySelector('div[data-bloks-name="ig.components.Icon"][style*="circle-check__filled"]') !== null;
      return compareHidden ? isHidden : !isHidden;
    })
    .map(element => {
      const usernameElement = element.querySelector('span[data-bloks-name="bk.components.Text"][style*="font-weight: 600"]');
      return usernameElement ? usernameElement.textContent.trim() : '';
    })
    .filter(Boolean);

  const missingInFile = currentUsernames.filter(username => !usernamesFromFile.includes(username));
  const missingInPage = usernamesFromFile.filter(username => !currentUsernames.includes(username));

  const message = `Missing in file: ${missingInFile.join(', ')}\nMissing in page: ${missingInPage.join(', ')}`;
  sendResponse({ message });
}

function hideUsers(usernames, sendResponse) {
  let processedCount = 0;
  const totalCount = usernames.length;

  function processNextUser() {
    if (processedCount < totalCount) {
      const username = usernames[processedCount];
      const userElement = Array.from(userElements).find(element => {
        const usernameElement = element.querySelector('span[data-bloks-name="bk.components.Text"][style*="font-weight: 600"]');
        return usernameElement && usernameElement.textContent.trim() === username;
      });

      if (userElement) {
        const checkboxElement = userElement.querySelector('div[data-bloks-name="ig.components.Icon"]');
        if (checkboxElement && !checkboxElement.getAttribute('style').includes('circle-check__filled')) {
          checkboxElement.click();
        }
      }

      processedCount++;
      sendResponse({ progress: Math.round((processedCount / totalCount) * 100) });
      setTimeout(processNextUser, 250);
    }
  }

  processNextUser();
}

function unhideUsers(usernames, sendResponse) {
  let processedCount = 0;
  const totalCount = usernames.length;

  function processNextUser() {
    if (processedCount < totalCount) {
      const username = usernames[processedCount];
      const userElement = Array.from(userElements).find(element => {
        const usernameElement = element.querySelector('span[data-bloks-name="bk.components.Text"][style*="font-weight: 600"]');
        return usernameElement && usernameElement.textContent.trim() === username;
      });

      if (userElement) {
        const checkboxElement = userElement.querySelector('div[data-bloks-name="ig.components.Icon"]');
        if (checkboxElement && checkboxElement.getAttribute('style').includes('circle-check__filled')) {
          checkboxElement.click();
        }
      }

      processedCount++;
      sendResponse({ progress: Math.round((processedCount / totalCount) * 100) });
      setTimeout(processNextUser, 250);
    }
  }

  processNextUser();
}