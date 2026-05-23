/ SECTION: Element References
const form = document.getElementById("url-form");
const input = document.getElementById("url-input");
const frame = document.getElementById("viewer-frame");
const overlay = document.getElementById("viewer-overlay");
const loadingState = document.getElementById("state-loading");
const errorState = document.getElementById("state-error");
const openDirectBtn = document.getElementById("open-direct");

let lastUrl = "";

// SECTION: Helpers
function normaliseUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  // If it already looks like a URL with protocol, leave it
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Otherwise, prefix https://
  return "https://" + trimmed;
}

function setState({ loading = false, error = false }) {
  if (loading) {
    loadingState.classList.add("is-visible");
    loadingState.setAttribute("aria-hidden", "false");
  } else {
    loadingState.classList.remove("is-visible");
    loadingState.setAttribute("aria-hidden", "true");
  }

  if (error) {
    errorState.classList.add("is-visible");
    errorState.setAttribute("aria-hidden", "false");
  } else {
    errorState.classList.remove("is-visible");
    errorState.setAttribute("aria-hidden", "true");
  }
}

function loadUrl(url) {
  lastUrl = url;
  setState({ loading: true, error: false });

  // Hide intro overlay after first real load
  if (overlay) {
    overlay.style.display = "none";
  }

  // Attach basic load/error handlers
  const onLoad = () => {
    setState({ loading: false, error: false });
  };

  const onError = () => {
    setState({ loading: false, error: true });
  };

  frame.removeEventListener("load", onLoad);
  frame.removeEventListener("error", onError);

  frame.addEventListener("load", onLoad, { once: true });
  frame.addEventListener("error", onError, { once: true });

  frame.src = url;
}

// SECTION: Event Handlers
if (form && input && frame) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value;
    const url = normaliseUrl(value);

    if (!url) return;

    try {
      // Validate URL structure
      // eslint-disable-next-line no-new
      new URL(url);
    } catch (_) {
      setState({ loading: false, error: true });
      return;
    }

    loadUrl(url);
  });
}

if (openDirectBtn) {
  openDirectBtn.addEventListener("click", () => {
    if (!lastUrl) return;
    window.open(lastUrl, "_blank", "noopener,noreferrer");
  });
}
