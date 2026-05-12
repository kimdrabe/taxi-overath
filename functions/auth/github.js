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
      + '&response_type=code'
      + '&state=' + encodeURIComponent(siteId);

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

  const siteUrl = new URL('auth-callback', url.origin);
  siteUrl.hash = 'access_token=' + encodeURIComponent(accessToken);
  return Response.redirect(siteUrl.toString(), 302);
}
