import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function EmployeeDashboard() {
    const { user, logout } = useAuth();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/requests");

            setRequests(response.data.requests);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load your requests."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const statistics = useMemo(() => {
        return {
            total: requests.length,

            pending: requests.filter(
                (request) => request.status === "pending"
            ).length,

            inProgress: requests.filter(
                (request) => request.status === "in_progress"
            ).length,

            resolved: requests.filter(
                (request) =>
                    request.status === "resolved" ||
                    request.status === "closed"
            ).length,
        };
    }, [requests]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "pending":
                return "bg-amber-100 text-amber-700";

            case "assigned":
                return "bg-blue-100 text-blue-700";

            case "in_progress":
                return "bg-purple-100 text-purple-700";

            case "resolved":
                return "bg-green-100 text-green-700";

            case "closed":
                return "bg-slate-200 text-slate-700";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case "urgent":
                return "bg-red-100 text-red-700";

            case "high":
                return "bg-orange-100 text-orange-700";

            case "medium":
                return "bg-yellow-100 text-yellow-700";

            case "low":
                return "bg-green-100 text-green-700";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    const formatStatus = (status) => {
        return status.replace("_", " ");
    };

    return (
        <div className="min-h-screen bg-slate-100">

            {/* NAVBAR */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="h-16 flex items-center justify-between">

                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                ServiceDesk
                            </h1>

                            <p className="text-xs text-slate-500">
                                Employee Portal
                            </p>
                        </div>

                        <div className="flex items-center gap-4">

                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-semibold text-slate-800">
                                    {user?.name}
                                </p>

                                <p className="text-xs text-slate-500">
                                    {user?.email}
                                </p>
                            </div>

                            <button
                                onClick={logout}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </div>
            </header>


            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* WELCOME */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div>
                        <p className="text-sm text-blue-600 font-semibold">
                            Employee Dashboard
                        </p>

                        <h2 className="mt-1 text-3xl font-bold text-slate-900">
                            Welcome, {user?.name?.split(" ")[0]} 👋
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Track your office service requests and their progress.
                        </p>
                    </div>

                    <Link
                        to="/employee/request/new"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                    >
                        + New Request
                    </Link>

                </div>


                {/* ERROR */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        {error}
                    </div>
                )}


                {/* STATISTICS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total Requests
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {statistics.total}
                        </p>
                    </div>


                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Pending
                        </p>

                        <p className="mt-2 text-3xl font-bold text-amber-600">
                            {statistics.pending}
                        </p>
                    </div>


                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            In Progress
                        </p>

                        <p className="mt-2 text-3xl font-bold text-purple-600">
                            {statistics.inProgress}
                        </p>
                    </div>


                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Resolved
                        </p>

                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {statistics.resolved}
                        </p>
                    </div>

                </div>


                {/* REQUESTS */}
                <section>

                    <div className="flex items-center justify-between mb-4">

                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                My Requests
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                Your recently submitted service requests
                            </p>
                        </div>

                        <button
                            onClick={fetchRequests}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            Refresh
                        </button>

                    </div>


                    {loading ? (

                        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
                            <p className="text-slate-500">
                                Loading your requests...
                            </p>
                        </div>

                    ) : requests.length === 0 ? (

                        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">

                            <div className="text-4xl mb-3">
                                📋
                            </div>

                            <h4 className="text-lg font-semibold text-slate-900">
                                No requests yet
                            </h4>

                            <p className="mt-1 text-sm text-slate-500">
                                You haven't submitted a service request.
                            </p>

                            <Link
                                to="/employee/request/new"
                                className="inline-block mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Submit Your First Request
                            </Link>

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {requests.map((request) => (

                                <div
                                    key={request.id}
                                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition"
                                >

                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                                        <div className="min-w-0">

                                            <div className="flex flex-wrap items-center gap-2">

                                                <h4 className="font-bold text-slate-900">
                                                    {request.title}
                                                </h4>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${getPriorityStyle(
                                                        request.priority
                                                    )}`}
                                                >
                                                    {request.priority}
                                                </span>

                                            </div>

                                            <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                                                {request.description}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">

                                                <span>
                                                    Category:{" "}
                                                    <strong className="text-slate-700">
                                                        {request.category}
                                                    </strong>
                                                </span>

                                                <span>
                                                    Created:{" "}
                                                    {new Date(
                                                        request.created_at
                                                    ).toLocaleDateString()}
                                                </span>

                                            </div>

                                        </div>


                                        <div className="flex items-center gap-3">

                                            <span
                                                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                                                    request.status
                                                )}`}
                                            >
                                                {formatStatus(request.status)}
                                            </span>

                                            <Link
                                                to={`/employee/request/${request.id}`}
                                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            >
                                                View
                                            </Link>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default EmployeeDashboard;