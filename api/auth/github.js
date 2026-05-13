export default async function handler(req, res) {
  const { code } = req.query;

  const clientId = 'Ov23liNbp3aoeUEvfF3f';
  const clientSecret = '8d70c4d8bb6be5d291223526bc6953e9e6be5e82';

  if (!code) {
    const siteId = req.query.site_id || 'kimdrabe.github.io/taxi-overath';
    const baseUrl = `https://${siteId}`;
    const redirectUri = `${baseUrl}/admin/`;
    const githubUrl = 'https://github.com/login/oauth/authorize'
      + '?client_id=' + encodeURIComponent(clientId)
      + '&redirect_uri=' + encodeURIComponent(redirectUri)
      + '&scope=repo'
      + '&response_type=code';
    res.writeHead(302, { Location: githubUrl });
    res.end();
    return;
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  const data = await tokenRes.json();
  const accessToken = data.access_token;

  if (!accessToken) {
    res.status(400).send('Token exchange failed: ' + JSON.stringify(data));
    return;
  }

  const html = `<!DOCTYPE html><html><meta charset="utf-8"/><title>Authorizing - Taxi Overath CMS</title><body><script>
var t = ${JSON.stringify(accessToken)};
if (window.opener) { window.opener.postMessage({type:"authorization",token:t},"*"); }
window.location.hash = "access_token=" + encodeURIComponent(t);
<\/script><p>Authorizing... fertig! Dieses Fenster kann geschlossen werden.</p></body></html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
