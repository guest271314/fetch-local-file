chrome.runtime.sendMessage(
  JSON.parse(document.querySelector("pre").textContent),
);
