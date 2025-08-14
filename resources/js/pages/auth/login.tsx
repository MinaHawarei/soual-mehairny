import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { isArabic } from '@/lib/locale';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const isArabicLocale = isArabic();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout 
            title={isArabicLocale ? 'تسجيل الدخول إلى حسابك' : 'Log in to your account'} 
            description={isArabicLocale ? 'أدخل بريدك الإلكتروني وكلمة المرور أدناه لتسجيل الدخول' : 'Enter your email and password below to log in'}
        >
            <Head title={isArabicLocale ? 'تسجيل الدخول' : 'Log in'} />

            <form className={`flex flex-col gap-6 ${isArabicLocale ? 'rtl' : 'ltr'}`} onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className={isArabicLocale ? 'text-right' : 'text-left'}>
                            {isArabicLocale ? 'عنوان البريد الإلكتروني' : 'Email address'}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={isArabicLocale ? 'email@example.com' : 'email@example.com'}
                            className="text-black"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className={`flex items-center ${isArabicLocale ? 'flex-row-reverse' : 'flex-row'}`}>
                            <Label htmlFor="password" className={isArabicLocale ? 'text-right' : 'text-left'}>
                                {isArabicLocale ? 'كلمة المرور' : 'Password'}
                            </Label>
                            {canResetPassword && (
                                <TextLink 
                                    href={route('password.request')} 
                                    className={`text-sm ${isArabicLocale ? 'mr-auto' : 'ml-auto'}`} 
                                    tabIndex={5}
                                >
                                    {isArabicLocale ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={isArabicLocale ? 'كلمة المرور' : 'Password'}
                            className="text-black"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className={`flex items-center space-x-3 ${isArabicLocale ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                        />
                        <Label htmlFor="remember" className={isArabicLocale ? 'text-right' : 'text-left'}>
                            {isArabicLocale ? 'تذكرني' : 'Remember me'}
                        </Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {isArabicLocale ? 'تسجيل الدخول' : 'Log in'}
                    </Button>
                </div>

                <div className={`text-sm text-muted-foreground ${isArabicLocale ? 'text-right' : 'text-center'}`}>
                    {isArabicLocale ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                    <TextLink href={route('register')} tabIndex={5}>
                        {isArabicLocale ? 'إنشاء حساب' : 'Sign up'}
                    </TextLink>
                </div>
            </form>

            {status && (
                <div className={`mb-4 text-sm font-medium text-green-600 ${isArabicLocale ? 'text-right' : 'text-center'}`}>
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
