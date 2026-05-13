export async function onRequest(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');
  const provider = url.searchParams.get('provider') || 'github';

  const clientId = 'Ov23liNbp3aoeUEvfF3f';
  const clientSecret = '8d70c4d8bb6be5d291223526bc6953e9e6be5e82';

  if (code) {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      const errHtml = `<!DOCTYPE html><html><meta charset="utf-8"/><body><script>
        window.opener.postMessage('authorization:${provider}:error:'+JSON.stringify(${JSON.stringify(tokenData)}), '*');
        window.close();
      <\/script></body></html>`;
      return new Response(errHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const okHtml = `<!DOCTYPE html><html><meta charset="utf-8"/><body><script>
      window.opener.postMessage('authorization:${provider}:success:'+JSON.stringify({token:${JSON.stringify(accessToken)}}), '*');
      window.close();
    <\/script></body></html>`;
    return new Response(okHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const redirectUri = url.origin + url.pathname;
  const githubUrl = 'https://github.com/login/oauth/authorize'
    + '?client_id=' + encodeURIComponent(clientId)
    + '&redirect_uri=' + encodeURIComponent(redirectUri)
    + '&scope=repo'
    + '&response_type=code';

  const html = `<!DOCTYPE html><html><meta charset="utf-8"/><title>Authorizing - Taxi Overath</title><body><script>
    (function() {
      var p = '${provider}';
      if (window.opener) {
        window.opener.postMessage('authorizing:' + p, '*');
        var handler = function(e) {
          if (e.data === 'authorizing:' + p) {
            window.removeEventListener('message', handler, false);
            window.location.href = ${JSON.stringify(githubUrl)};
          }
        };
        window.addEventListener('message', handler, false);
      } else {
        window.location.href = ${JSON.stringify(githubUrl)};
      }
    })();
  <\/script><p>Authorizing...</p></body></html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
