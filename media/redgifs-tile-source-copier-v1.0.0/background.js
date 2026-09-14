const PARENT = "redgifs-copy-source";
const COPY_ONE = "redgifs-copy-one";
const COPY_FOUR = "redgifs-copy-four";
const COPY_EIGHT = "redgifs-copy-eight";

function buildMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: PARENT,
      title: "Copy RedGIFs tile source",
      contexts: ["all"],
      documentUrlPatterns: [
        "https://www.redgifs.com/*",
        "https://redgifs.com/*"
      ]
    });

    chrome.contextMenus.create({
      id: COPY_ONE,
      parentId: PARENT,
      title: "Copy 1 tile",
      contexts: ["all"]
    });

    chrome.contextMenus.create({
      id: COPY_FOUR,
      parentId: PARENT,
      title: "Copy 4 tiles in a row",
      contexts: ["all"]
    });

    chrome.contextMenus.create({
      id: COPY_EIGHT,
      parentId: PARENT,
      title: "Copy 8 tiles in a row",
      contexts: ["all"]
    });
  });
}

chrome.runtime.onInstalled.addListener(buildMenus);
chrome.runtime.onStartup.addListener(buildMenus);

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab || !tab.id) return;

  let count = null;
  if (info.menuItemId === COPY_ONE) count = 1;
  if (info.menuItemId === COPY_FOUR) count = 4;
  if (info.menuItemId === COPY_EIGHT) count = 8;

  if (count) {
    chrome.tabs.sendMessage(tab.id, { type: "COPY_TILES", count });
  }
});
