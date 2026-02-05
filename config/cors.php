<?php

$nativeOrigins = array_values(array_filter(array_map(
    'trim',
    explode(',', env('NATIVE_APP_ALLOWED_ORIGINS', ''))
)));

$appUrl = env('APP_URL');
$appOrigins = [];

if ($appUrl) {
    $appOrigins[] = $appUrl;
    $appOrigins[] = preg_replace('/^http:/', 'https:', $appUrl);
}

return [
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

  'allowed_origins' => $nativeOrigins ?: array_values(array_unique($appOrigins)),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
