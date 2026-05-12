export async function onRequest(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('No code provided', { status: 400 });
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: 'Ov23liNbp3aoeUEvfF3f',
      client_secret: '8d70c4d8bb6be5d291223526bc6953e9e6be5e82',
      code: code,
    }),
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return new Response(JSON.stringify(tokenData), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Authorizing...</title>
</head>
<body>
  <script>
    var token = ${JSON.stringify(accessToken)};
    window.opener.postMessage({ type: 'authorization', token: token }, '*');
    window.close();
  </script>
  <p>Authorizing... fertig!</p>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
