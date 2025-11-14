export function readCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

export function getXSRFToken() {
  return readCookie("XSRF-TOKEN");
}

export async function postMessage(text) {
  const xsrf = getXSRFToken();
  const res = await fetch("/api/messages", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "CSRF-Token": xsrf,
    },
    body: JSON.stringify({ text }),
  });
  return res.json();
}
