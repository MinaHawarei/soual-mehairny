<?php

if (!function_exists('isNativeApp')) {
    function isNativeApp(): bool
    {
        return (bool) config('app.native_app');
    }
}
