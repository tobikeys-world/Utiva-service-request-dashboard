import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";

function RequestDetails() {
    const { id } = useParams();

    const [request, setRequest] = useState(null);
    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRequestDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const [requestResponse, historyResponse] =
                    await Promise.all([
                        api.get(`/requests/${id}`),
                        api.get(`/history/${id}`),
                    ]);

                setRequest(requestResponse.data);
                setHistory(historyResponse.data.history);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load request details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRequestDetails();
    }, [id]);

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

            {/* HEADER */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="h-16 flex items-center justify-between">

                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                ServiceDesk
                            </h1>

                            <p className="text-xs text-slate-500">
                                Request Details
                            </p>
                        </div>

                        <Link
                            to="/employee"
                            className="text-sm font-medium text-slate-600 hover:text-blue-600"
                        >
                            ← Back to Dashboard
                        </Link>

                    </div>

                </div>
            </header>


            {/* MAIN */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* LOADING */}
                {loading && (
                    <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
                        <p className="text-slate-500">
                            Loading request details...
                        </p>
                    </div>
                )}


                {/* ERROR */}
                {!loading && error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">

                        <h2 className="font-semibold text-red-800">
                            Unable to load request
                        </h2>

                        <p className="mt-2 text-sm text-red-700">
                            {error}
                        </p>

                        <Link
                            to="/employee"
                            className="inline-block mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                            Back to Dashboard
                        </Link>

                    </div>
                )}


                {/* REQUEST CONTENT */}
                {!loading && !error && request && (

                    <div className="space-y-6">

                        {/* TITLE SECTION */}
                        <div>

                            <p className="text-sm font-semibold text-blue-600">
                                Request #{request.id}
                            </p>

                            <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                <h2 className="text-3xl font-bold text-slate-900">
                                    {request.title}
                                </h2>

                                <span
                                    className={`inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-semibold capitalize ${getStatusStyle(
                                        request.status
                                    )}`}
                                >
                                    {formatStatus(request.status)}
                                </span>

                            </div>

                        </div>


                        {/* REQUEST INFORMATION */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

                            <h3 className="text-lg font-bold text-slate-900 mb-6">
                                Request Information
                            </h3>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* CATEGORY */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Category
                                    </p>

                                    <p className="mt-1 font-medium text-slate-800">
                                        {request.category}
                                    </p>
                                </div>


                                {/* PRIORITY */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Priority
                                    </p>

                                    <span
                                        className={`inline-flex mt-1 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPriorityStyle(
                                            request.priority
                                        )}`}
                                    >
                                        {request.priority}
                                    </span>
                                </div>


                                {/* CREATED BY */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Submitted By
                                    </p>

                                    <p className="mt-1 font-medium text-slate-800">
                                        {request.created_by}
                                    </p>
                                </div>


                                {/* ASSIGNED TO */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Assigned To
                                    </p>

                                    <p className="mt-1 font-medium text-slate-800">
                                        {request.assigned_to || "Not assigned yet"}
                                    </p>
                                </div>


                                {/* CREATED DATE */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Submitted
                                    </p>

                                    <p className="mt-1 font-medium text-slate-800">
                                        {new Date(
                                            request.created_at
                                        ).toLocaleString()}
                                    </p>
                                </div>


                                {/* UPDATED DATE */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Last Updated
                                    </p>

                                    <p className="mt-1 font-medium text-slate-800">
                                        {new Date(
                                            request.updated_at
                                        ).toLocaleString()}
                                    </p>
                                </div>

                            </div>


                            {/* DESCRIPTION */}
                            <div className="mt-8 pt-6 border-t border-slate-200">

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Description
                                </p>

                                <p className="mt-2 text-slate-700 leading-7 whitespace-pre-wrap">
                                    {request.description}
                                </p>

                            </div>

                        </div>


                        {/* STATUS HISTORY */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

                            <div className="mb-6">

                                <h3 className="text-lg font-bold text-slate-900">
                                    Status History
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Track how your request has progressed.
                                </p>

                            </div>


                            {history.length === 0 ? (

                                <div className="rounded-lg bg-slate-50 border border-slate-200 p-5 text-center">

                                    <p className="text-sm text-slate-500">
                                        No status changes have been recorded yet.
                                    </p>

                                </div>

                            ) : (

                                <div className="relative">

                                    {/* TIMELINE LINE */}
                                    <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-200" />


                                    <div className="space-y-7">

                                        {history.map((item) => (

                                            <div
                                                key={item.id}
                                                className="relative flex gap-5"
                                            >

                                                {/* TIMELINE DOT */}
                                                <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white">

                                                    <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />

                                                </div>


                                                {/* HISTORY CONTENT */}
                                                <div className="min-w-0 flex-1">

                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                                                        <div className="flex flex-wrap items-center gap-2">

                                                            {item.old_status && (
                                                                <>
                                                                    <span
                                                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                                                            item.old_status
                                                                        )}`}
                                                                    >
                                                                        {formatStatus(
                                                                            item.old_status
                                                                        )}
                                                                    </span>

                                                                    <span className="text-slate-400">
                                                                        →
                                                                    </span>
                                                                </>
                                                            )}

                                                            <span
                                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                                                    item.new_status
                                                                )}`}
                                                            >
                                                                {formatStatus(
                                                                    item.new_status
                                                                )}
                                                            </span>

                                                        </div>

                                                        <span className="text-xs text-slate-400">
                                                            {new Date(
                                                                item.changed_at
                                                            ).toLocaleString()}
                                                        </span>

                                                    </div>


                                                    <p className="mt-2 text-sm text-slate-500">
                                                        Updated by{" "}
                                                        <span className="font-medium text-slate-700">
                                                            {item.changed_by}
                                                        </span>
                                                    </p>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* BACK BUTTON */}
                        <div className="flex justify-end">

                            <Link
                                to="/employee"
                                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                            >
                                Back to My Requests
                            </Link>

                        </div>

                    </div>

                )}

            </main>

        </div>
    );
}

export default RequestDetails;