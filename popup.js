document.addEventListener('DOMContentLoaded', () => {
  const checkPageBtn = document.getElementById('checkPageBtn');
  const pageStatus = document.getElementById('pageStatus');
  const loadUsernamesBtn = document.getElementById('loadUsernamesBtn');
  const exportHiddenBtn = document.getElementById('exportHiddenBtn');
  const exportUnhiddenBtn = document.getElementById('exportUnhiddenBtn');
  const hideUsersBtn = document.getElementById('hideUsersBtn');
  const unhideUsersBtn = document.getElementById('unhideUsersBtn');
  const progressBar = document.querySelector('.progress');
  const compareHiddenBtn = document.getElementById('compareHiddenBtn');
  const compareUnhiddenBtn = document.getElementById('compareUnhiddenBtn');

  checkPageBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const currentUrl = tabs[0].url;
      if (currentUrl === 'https://www.instagram.com/accounts/hide_story_and_live_from/') {
        pageStatus.textContent = 'You are on the correct page!';
      } else {
        pageStatus.textContent = 'Please navigate to the Instagram story hiding page.';
      }
    });
  });

  loadUsernamesBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'loadUsernames' }, response => {
        if (response && response.message) {
          pageStatus.textContent = response.message;
        }
      });
    });
  });

  exportHiddenBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'exportHiddenUsers' }, response => {
        if (response && response.message) {
          pageStatus.textContent = response.message;
        }
      });
    });
  });

  exportUnhiddenBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'exportUnhiddenUsers' }, response => {
        if (response && response.message) {
          pageStatus.textContent = response.message;
        }
      });
    });
  });

  compareHiddenBtn.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt';
    fileInput.addEventListener('change', handleFileSelect);
    fileInput.click();
  
    function handleFileSelect(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const usernamesFromFile = reader.result.split('\n').map(username => username.trim()).filter(Boolean);
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'compareHiddenUsers', usernamesFromFile: usernamesFromFile }, response => {
            if (response && response.message) {
              pageStatus.textContent = response.message;
            }
          });
        });
      };
      reader.readAsText(file);
    }
  });

  compareUnhiddenBtn.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt';
    fileInput.addEventListener('change', handleFileSelect);
    fileInput.click();
  
    function handleFileSelect(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const usernamesFromFile = reader.result.split('\n').map(username => username.trim()).filter(Boolean);
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'compareUnhiddenUsers', usernamesFromFile: usernamesFromFile }, response => {
            if (response && response.message) {
              pageStatus.textContent = response.message;
            }
          });
        });
      };
      reader.readAsText(file);
    }
  });

  hideUsersBtn.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt';
    fileInput.addEventListener('change', handleFileSelect);
    fileInput.click();

    function handleFileSelect(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const usernames = reader.result.split('\n').map(username => username.trim()).filter(Boolean);
        progressBar.style.width = '0%'; // Reset the progress bar width
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'hideUsers', usernames: usernames }, response => {
            if (response && response.progress) {
              progressBar.style.width = `${response.progress}%`;
            }
          });
        });
      };
      reader.readAsText(file);
    }
  });

  unhideUsersBtn.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt';
    fileInput.addEventListener('change', handleFileSelect);
    fileInput.click();

    function handleFileSelect(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const usernames = reader.result.split('\n').map(username => username.trim()).filter(Boolean);
        progressBar.style.width = '0%'; // Reset the progress bar width
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'unhideUsers', usernames: usernames }, response => {
            if (response && response.progress) {
              progressBar.style.width = `${response.progress}%`;
            }
          });
        });
      };
      reader.readAsText(file);
    }
  });
});