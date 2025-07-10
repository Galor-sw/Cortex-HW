import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    if (user === undefined) return <p className="text-center mt-10">Loading...</p>;
    if (!user) return <Navigate to="/" replace />;
    return children;
}

export default AuthGuard;