export async function onRequest(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');

  const clientId = 'Ov23liNbp3aoeUEvfF3f';
  const clientSecret = '8d70c4d8bb6be5d291223526bc6953e9e6be5e82';

  if (!code) {
    const siteId = url.searchParams.get('site_id') || 'taxi-overath.pages.dev';
    const redirectUri = 'https://' + siteId + '/auth/github';
    const githubUrl = 'https://github.com/login/oauth/authorize'
      + '?client_id=' + encodeURIComponent(clientId)
      + '&redirect_uri=' + encodeURIComponent(redirectUri)
      + '&scope=repo'
      + '&response_type=code';

    return Response.redirect(githubUrl, 302);
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }),
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return new Response('Token exchange failed: ' + JSON.stringify(tokenData), {
      status: 400,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const html = '<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Authorizing - Taxi Overath CMS</title></head><body>' +
    '<script>' +
    'var t = ' + JSON.stringify(accessToken) + ';' +
    'if (window.opener) {' +
    '  window.opener.postMessage({type:"authorization",token:t},"*");' +
    '}' +
    'window.location.hash = "access_token=" + encodeURIComponent(t);' +
    '<\/script>' +
    '<p>Authorizing... fertig! Dieses Fenster kann geschlossen werden.</p>' +
    '</body></html>';

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
