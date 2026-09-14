let lastRightClickedElement = null;

document.addEventListener("contextmenu", (event) => {
  lastRightClickedElement = event.target;
}, true);

function getTileFromElement(element) {
  if (!(element instanceof Element)) return null;
  return element.closest(".tileItem[data-feed-item-id]");
}

function getTilesFromClicked(startTile, count) {
  const allTiles = Array.from(
    document.querySelectorAll(".tileItem[data-feed-item-id]")
  );

  const startIndex = allTiles.indexOf(startTile);
  if (startIndex === -1) return [];

  return allTiles.slice(startIndex, startIndex + count);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (_) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    document.documentElement.appendChild(textarea);
    textarea.select();

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (_) {}

    textarea.remove();
    return ok;
  }
}

function showToast(message, isError = false) {
  const old = document.getElementById("__rg_tile_copy_toast");
  if (old) old.remove();

  const toast = document.createElement("div");
  toast.id = "__rg_tile_copy_toast";
  toast.textContent = message;

  Object.assign(toast.style, {
    position: "fixed",
    right: "18px",
    bottom: "18px",
    zIndex: "2147483647",
    padding: "10px 14px",
    borderRadius: "8px",
    font: "13px/1.3 Arial, sans-serif",
    background: isError ? "#7a1d1d" : "#222",
    color: "#fff",
    boxShadow: "0 2px 12px rgba(0,0,0,.35)",
    pointerEvents: "none"
  });

  document.documentElement.appendChild(toast);
  setTimeout(() => toast.remove(), 1600);
}

async function copyTilesFromTile(tile, count) {
  if (!tile) {
    showToast("Right-click inside a RedGIFs tile first.", true);
    return;
  }

  const tiles = getTilesFromClicked(tile, count);
  if (!tiles.length) {
    showToast("Could not find the RedGIFs tile.", true);
    return;
  }

  const html = tiles.map(tile => tile.outerHTML).join("\n\n");
  const ok = await copyText(html);

  if (ok) {
    showToast(
      tiles.length === 1
        ? "Copied 1 RedGIFs tile."
        : `Copied ${tiles.length} RedGIFs tiles.`
    );
  } else {
    showToast("Chrome blocked clipboard access.", true);
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (!message || message.type !== "COPY_TILES") return;

  const count = [1, 4, 8].includes(message.count) ? message.count : 1;
  const clickedTile = getTileFromElement(lastRightClickedElement);

  copyTilesFromTile(clickedTile, count);
});
