export default async function handler(req, res) {
  const { code, provider } = req.query;
  const prov = provider || 'github';

  const clientId = 'Ov23liNbp3aoeUEvfF3f';
  const clientSecret = '8d70c4d8bb6be5d291223526bc6953e9e6be5e82';

  if (code) {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await tokenRes.json();
    const accessToken = data.access_token;

    if (!accessToken) {
      const errHtml = `<!DOCTYPE html><html><meta charset="utf-8"/><body><script>
        window.opener.postMessage('authorization:${prov}:error:'+JSON.stringify(${JSON.stringify(data)}), '*');
        window.close();
      <\/script></body></html>`;
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(errHtml);
      return;
    }

    const okHtml = `<!DOCTYPE html><html><meta charset="utf-8"/><body><script>
      window.opener.postMessage('authorization:${prov}:success:'+JSON.stringify({token:${JSON.stringify(accessToken)}}), '*');
      window.close();
    <\/script></body></html>`;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(okHtml);
    return;
  }

  const redirectUri = `https://${req.headers.host}/api/auth/github`;
  const githubUrl = 'https://github.com/login/oauth/authorize'
    + '?client_id=' + encodeURIComponent(clientId)
    + '&redirect_uri=' + encodeURIComponent(redirectUri)
    + '&scope=repo'
    + '&response_type=code';

  const html = `<!DOCTYPE html><html><meta charset="utf-8"/><title>Authorizing - Taxi Overath</title><body><script>
    (function() {
      var p = '${prov}';
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

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
