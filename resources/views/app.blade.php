<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ request()->is('admin*') ? 'ltr' : (app()->getLocale() === 'ar' ? 'rtl' : 'ltr') }}" >
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">



        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }


        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Favicon PNG -->
        <link rel="icon" href="/Coptic_cross.png" sizes="32x32" type="image/png">
        <link rel="icon" href="/Coptic_cross.png" sizes="16x16" type="image/png">

        <!-- Favicon SVG -->
        <link rel="icon" href="/Coptic_cross.svg" type="image/svg+xml">

        <!-- Apple Touch Icon -->
        <link rel="apple-touch-icon" href="/Coptic_cross.png" sizes="180x180">



        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Readex+Pro:wght@160..700&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">

        <script>
            window.__APP_CONFIG__ = @js([
                'native' => (bool) config('app.native_app'),
                'remoteAppUrl' => (string) config('app.remote_app_url', ''),
                'locale' => app()->getLocale(),
            ]);
        </script>


        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
