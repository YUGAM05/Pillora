"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { setToken, setUser as setStoredUser } from "@/lib/tokenStorage";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            if (!auth || !googleProvider) {
                throw new Error("Auth not initialized");
            }

            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const idToken = await user.getIdToken();

            // Send ID token to backend for verification and session setup
            const response = await axios.post("/api/auth/verify-token", { idToken });

            if (response.data.success) {
                const userData = {
                    uid: response.data.uid,
                    phoneNumber: response.data.phoneNumber,
                    name: response.data.name || user.displayName || "User",
                    email: response.data.email || user.email || "",
                    picture: response.data.picture || user.photoURL || "",
                    role: "user"
                };
                setStoredUser(JSON.stringify(userData));
                setToken(idToken);
                window.dispatchEvent(new Event('storage'));
                router.push("/dashboard");
            } else {
                throw new Error("Verification failed on server");
            }
        } catch (err: any) {
            console.error("Error with Google Login:", err);
            setError(err.message || "Google Sign-In failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-xl"
            >
                <div className="text-center mb-8">
                    <div className="mb-8 flex justify-center">
                        <img src="/pillora-logo-v2.svg" alt="Pillora" className="w-20 h-20 object-contain" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Welcome to Pillora
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        Sign in to your account to continue
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center border border-red-100"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="space-y-6">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-4 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        ) : (
                            <>
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                Continue with Google
                            </>
                        )}
                    </button>
                </div>
                
                <p className="text-[11px] text-gray-400 text-center mt-6 px-2 italic">
                    By continuing, you confirm that you have read and agreed to our 
                    <Link href="/terms" className="text-primary hover:underline whitespace-nowrap"> Terms &amp; Conditions</Link> and 
                    <Link href="/privacy" className="text-primary hover:underline whitespace-nowrap"> Privacy Policy</Link>.
                </p>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <p className="text-gray-500 text-sm">
                        New to Pillora?{" "}
                        <Link href="/register" className="text-primary font-bold hover:underline transition-all">
                            Create Account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
