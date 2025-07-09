import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import googleIcon from "./assets/google-icon.png";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSignup = async () => {
        setError("");
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm border border-gray-200">
                <h1 className="text-3xl font-semibold text-center mb-5">Login</h1>
                {error && (
                    <div className="mb-4 text-red-600 text-center text-sm">{error}</div>
                )}
                <form onSubmit={handleEmailLogin} className="space-y-3 mb-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition font-medium"
                    >
                        Continue
                    </button>
                    <button
                        type="button"
                        onClick={handleSignup}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-medium"
                    >
                        Sign up
                    </button>
                </form>

                <div className="flex items-center mb-6">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="mx-3 text-gray-500 text-sm font-medium">OR</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center bg-white border border-gray-300 py-3 rounded-md hover:bg-gray-100 transition px-4"
                >
                    <img src={googleIcon} alt="Google" className="w-5 h-5 mr-3" />
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Login;