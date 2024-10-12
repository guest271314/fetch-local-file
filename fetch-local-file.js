Object.assign(globalThis, {
  fetchLocalFile: async (extensionPath, filePath) => {
    async function generateIdForPath(path) {
      return [
        ...[
          ...new Uint8Array(
            await crypto.subtle.digest(
              "SHA-256",
              new TextEncoder().encode(path),
            ),
          ),
        ].map((u8) => u8.toString(16).padStart(2, "0")).join("").slice(0, 32),
      ]
        .map((hex) =>
          String.fromCharCode(parseInt(hex, 16) + "a".charCodeAt(0))
        )
        .join(
          "",
        );
    }
    const message = await chrome.runtime.sendMessage(
      await generateIdForPath(extensionPath),
      filePath,
    );
    if (typeof message === "string") {
      throw new TypeError(message);
    }
    return Uint8Array.from(Object.values(
      message,
    ));
  },
});

console.log("fetchLocalFile() declared");
