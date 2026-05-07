'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setToken, setUser } from '@/lib/tokenStorage';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
            console.error('Authentication error:', error);
            router.push('/login?error=' + error);
            return;
        }

        if (token && userStr) {
            try {
                // Store token and user data
                setToken(token);
                setUser(decodeURIComponent(userStr));

                // Parse user data to check role
                const userData = JSON.parse(decodeURIComponent(userStr));
                console.log('User logged in via Google:', userData);

                // Redirect based on role
                // Redirect based on role
                if (userData.role === 'admin') {
                    window.location.href = 'http://localhost:3001';
                } else if (userData.role === 'seller') {
                    window.location.href = 'http://localhost:3003';
                } else if (userData.role === 'delivery') {
                    window.location.href = 'http://localhost:3002';
                } else {
                    router.push('/');
                }
            } catch (err) {
                console.error('Error processing auth callback:', err);
                router.push('/login?error=invalid_data');
            }
        } else {
            // No token or user data, redirect to login
            router.push('/login?error=missing_credentials');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="mb-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing sign in...</h2>
            <p className="text-gray-500 text-sm">Please wait while we set up your account</p>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="mb-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
