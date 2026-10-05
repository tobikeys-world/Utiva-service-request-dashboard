import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles }) {
    const {
        user,
        loading,
    } = useAuth();


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="mt-4 text-sm text-slate-500">
                        Checking authentication...
                    </p>

                </div>

            </div>
        );
    }


    // Not logged in
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // Logged in but wrong role
    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {
        if (user.role === "admin") {
            return (
                <Navigate
                    to="/admin"
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/employee"
                replace
            />
        );
    }


    return <Outlet />;
}

export default ProtectedRoute;