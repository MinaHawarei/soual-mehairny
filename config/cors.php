<?php

$nativeOrigins = array_values(array_filter(array_map(
    'trim',
    explode(',', env('NATIVE_APP_ALLOWED_ORIGINS', ''))
)));

return [
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => $nativeOrigins,

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
