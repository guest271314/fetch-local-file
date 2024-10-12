const encoder = new TextEncoder();

chrome.scripting.unregisterContentScripts().then(() =>
  chrome.scripting
    .registerContentScripts([{
      id: "get-extension-details",
      js: ["get-extension-details.js"],
      persistAcrossSessions: false,
      matches: ["chrome://extensions-internals/*"],
      runAt: "document_idle",
    }, {
      id: "fetch-local-file",
      js: ["fetch-local-file.js"],
      persistAcrossSessions: true,
      matches: ["https://*/*", "http://*/*"],
      runAt: "document_start",
      world: "MAIN",
    }])
).catch((e) => console.error(chrome.runtime.lastError, e));

async function getExtensionInternals() {
  try {
    const { id, tabs: [{ id: tabId }] } = await chrome.windows.create({
      url: "chrome://extensions-internals",
      state: "minimized",
      focused: false,
    });
    const { resolve, promise } = Promise.withResolvers();
    const handleMessage = async (message) => {
      resolve(message);
      chrome.runtime.onMessage.removeListener(handleMessage);
      await chrome.windows.remove(id);
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    const result = await promise;
    return result;
  } catch (e) {
    console.error(chrome.runtime.lastError, e);
  }
}

async function handleMessageEvent(message, sender, sendResponse) {
  console.log(message, sender, extensionPath);
  try {
    const url = new URL(message, `file://${globalThis.extensionPath}`);
    console.log(url);
    const response = await fetch(url);
    const bytes = await response.bytes();
    sendResponse(bytes);
  } catch (e) {
    console.log(e.message);
    sendResponse(e.message);
  }
}

async function handleInstallEvent() {
  const extensionInternals = await getExtensionInternals();
  const extensionPath = extensionInternals.find(({ id }) => {
    return id === chrome.runtime.id;
  }).path;
  Object.assign(globalThis, { extensionPath });
}

chrome.runtime.onInstalled.addListener(handleInstallEvent);
chrome.action.onClicked.addListener(() => chrome.runtime.reload());
chrome.runtime.onMessageExternal.addListener(handleMessageEvent);
