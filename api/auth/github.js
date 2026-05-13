export default async function handler(req, res) {
  const { code } = req.query;

  const clientId = 'Ov23liNbp3aoeUEvfF3f';
  const clientSecret = '8d70c4d8bb6be5d291223526bc6953e9e6be5e82';

  if (!code) {
    const siteId = req.query.site_id || 'kimdrabe.github.io/taxi-overath';
    const redirectUri = `https://${req.headers.host}/api/auth/github`;
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

  const siteUrl = 'https://kimdrabe.github.io/taxi-overath/admin/callback.html';
  res.writeHead(302, {
    Location: `${siteUrl}#access_token=${encodeURIComponent(accessToken)}`,
  });
  res.end();
}
