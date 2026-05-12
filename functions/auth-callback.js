export async function onRequest() {
  const html = '<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Authorizing - Taxi Overath CMS</title></head><body><script>' +
    'var f = new URLSearchParams(window.location.hash.slice(1));' +
    'var t = f.get("access_token");' +
    'if (t && window.opener) {' +
    '  window.opener.postMessage({type:"authorization",token:t},"*");' +
    '  window.close();' +
    '} else {' +
    '  document.body.textContent = t ? "Kein opener" : "Kein Token: " + window.location.hash;' +
    '}' +
    '<\/script><p>Authorizing...</p></body></html>';

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
