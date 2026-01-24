'use client';

import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useState, useEffect } from 'react';

export default function LoginButton({ onLogin }: { onLogin: (user: User) => void }) {
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            setError('');
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            onLogin(result.user);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                onClick={handleLogin}
                className="px-6 py-3 bg-white text-gray-800 font-semibold rounded border border-gray-300 hover:bg-gray-100 transition shadow-sm"
            >
                Sign in with Google
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}
