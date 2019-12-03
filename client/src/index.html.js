const DEFAULT_PATHS = {
  styles: { path: 'styles.css', sri: '' },
  production: { path: 'bundle.js', sri: '' },
  vendor: { path: '404', sri: '' },
}

module.exports = (initialHtml = '', paths = DEFAULT_PATHS) =>
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>React Redux Boilerplate</title>
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet">
  <link rel="stylesheet" href="/static/${paths.styles.path}" integrity="${paths.styles.sri}" />
</head>
<body>
  <div id="root">${initialHtml}</div>
  <script src="/static/${paths.vendor.path}" integrity="${paths.vendor.sri}"></script>
  <script src="/static/${paths.production.path}" integrity="${paths.production.sri}"></script>
</body>
</html>`
