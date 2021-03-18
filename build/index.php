<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Meu Redirect</title>
    <script>
        caches.open('otimigas-app').then(function(cache) {
            cache.delete('/').then(function(response) {
                someUIUpdateFunction();
            });
        })
        window.location.href = 'index.html'
    </script>
    <meta http-equiv="refresh" content="5; URL='index.html'"/>
</head>
<body>
...
</body>
</html>