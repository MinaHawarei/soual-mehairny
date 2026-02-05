<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Support\Facades\Log;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // مهم: في وضع NativePHP (sqlite محلي)، ممنوع نلمس Auth/DB محليًا
        // لأن $request->user() هيعمل Query على جدول users داخل sqlite ويوقع لو الميجريشنز مش موجودة.
        $isNativeApp = (bool) config('app.native_app', false);
        $remoteAppUrl = config('app.remote_app_url');
        $nativeError = null;

        if ($isNativeApp) {
            if (empty($remoteAppUrl)) {
                $nativeError = 'REMOTE_APP_URL is required for NativePHP mode.';
            } elseif (! str_starts_with($remoteAppUrl, 'https://')) {
                $nativeError = 'REMOTE_APP_URL must use https:// in NativePHP mode.';
            }

            if ($nativeError) {
                Log::channel('stack')->error('NativePHP configuration error', [
                    'message' => $nativeError,
                ]);
            }
        }

        return [
            ...parent::share($request),

            'name'  => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],

            'auth' => [
                'user' => $isNativeApp ? null : $request->user(),
            ],

            'native' => $isNativeApp,
            'remoteAppUrl' => $isNativeApp && ! $nativeError ? $remoteAppUrl : null,
            'nativeError' => $nativeError,
            'locale' => app()->getLocale(),

            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            'sidebarOpen' => ! $request->hasCookie('sidebar_state')
                || $request->cookie('sidebar_state') === 'true',

            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
        ];
    }
}
