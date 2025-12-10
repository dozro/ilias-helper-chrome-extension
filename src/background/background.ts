// Copyright (c) 2025 itsrye.dev.
// Licensed under the GPLv3 License. See LICENSE in the project root for license information.

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    files: ['content.js']
  });
});
