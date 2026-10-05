import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function AdminRequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [request, setRequest] = useState(null);
    const [history, setHistory] = useState([]);
    const [admins, setAdmins] = useState([]);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [assignedTo, setAssignedTo] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    requestResponse,
                    historyResponse,
                    adminsResponse,
                ] = await Promise.all([
                    api.get(`/requests/${id}`),
                    api.get(`/history/${id}`),
                    api.get("/users/admins"),
                ]);

                const requestData = requestResponse.data;

                setRequest(requestData);
                setHistory(historyResponse.data.history);
                setAdmins(adminsResponse.data.users);

                setStatus(requestData.status);
                setPriority(requestData.priority);
                setAssignedTo(
                    requestData.assigned_to_id
                        ? String(requestData.assigned_to_id)
                        : ""
                );
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

        fetchDetails();
    }, [id]);

    const getStatusStyle = (value) => {
        switch (value) {
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

    const getPriorityStyle = (value) => {
        switch (value) {
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

    const formatStatus = (value) => {
        if (!value) return "";

        return value.replace("_", " ");
    };

    const handleUpdate = async () => {
        try {
            setUpdating(true);
            setError("");
            setSuccess("");

            const response = await api.put(`/requests/${id}`, {
                status,
                priority,
                assigned_to: assignedTo
                    ? Number(assignedTo)
                    : null,
            });

            setRequest((previous) => ({
                ...previous,
                ...response.data.request,
            }));

            const historyResponse = await api.get(
                `/history/${id}`
            );

            setHistory(historyResponse.data.history);

            setSuccess("Request updated successfully.");

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update request."
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this request?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await api.delete(`/requests/${id}`);

            navigate("/admin");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete request."
            );

            setDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">
            {/* HEADER */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="min-h-16 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                ServiceDesk
                            </h1>

                            <p className="text-xs text-slate-500">
                                Admin Request Management
                            </p>
                        </div>

                        <Link
                            to="/admin"
                            className="text-sm font-medium text-slate-600 hover:text-blue-600"
                        >
                            ← Back to Admin Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* LOADING */}
                {loading && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="mt-4 text-sm text-slate-500">
                            Loading request details...
                        </p>
                    </div>
                )}

                {/* ERROR */}
                {!loading && error && !request && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                        <h2 className="font-semibold text-red-800">
                            Unable to load request
                        </h2>

                        <p className="mt-2 text-sm text-red-700">
                            {error}
                        </p>

                        <Link
                            to="/admin"
                            className="inline-block mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                )}

                {/* CONTENT */}
                {!loading && request && (
                    <div className="space-y-6">
                        {/* TITLE */}
                        <div>
                            <p className="text-sm font-semibold text-blue-600">
                                Request #{request.id}
                            </p>

                            <div className="mt-2 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900">
                                        {request.title}
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Review and manage this service request.
                                    </p>
                                </div>

                                <span
                                    className={`inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-semibold capitalize ${getStatusStyle(
                                        request.status
                                    )}`}
                                >
                                    {formatStatus(request.status)}
                                </span>
                            </div>
                        </div>

                        {/* ERROR / SUCCESS */}
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                {success}
                            </div>
                        )}

                        {/* REQUEST INFORMATION */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-slate-900">
                                Request Information
                            </h3>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Category
                                    </p>

                                    <p className="mt-1 font-medium text-slate-800">
                                        {request.category}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Submitted By
                                    </p>

                                    <p className="mt-1 font-medium text-slate-800">
                                        {request.created_by}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Current Assignee
                                    </p>

                                    <p className="mt-1 font-medium text-slate-800">
                                        {request.assigned_to ||
                                            "Not assigned"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Current Priority
                                    </p>

                                    <span
                                        className={`inline-flex mt-1 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPriorityStyle(
                                            request.priority
                                        )}`}
                                    >
                                        {request.priority}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Created
                                    </p>

                                    <p className="mt-1 font-medium text-slate-800">
                                        {new Date(
                                            request.created_at
                                        ).toLocaleString()}
                                    </p>
                                </div>

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

                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Description
                                </p>

                                <p className="mt-2 text-slate-700 leading-7 whitespace-pre-wrap">
                                    {request.description}
                                </p>
                            </div>
                        </div>

                        {/* ADMIN CONTROLS */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    Manage Request
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Update the request status, priority, or
                                    administrator responsible for it.
                                </p>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                                {/* STATUS */}
                                <div>
                                    <label
                                        htmlFor="status"
                                        className="block text-sm font-semibold text-slate-700 mb-2"
                                    >
                                        Status
                                    </label>

                                    <select
                                        id="status"
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                        disabled={updating}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>

                                        <option value="assigned">
                                            Assigned
                                        </option>

                                        <option value="in_progress">
                                            In Progress
                                        </option>

                                        <option value="resolved">
                                            Resolved
                                        </option>

                                        <option value="closed">
                                            Closed
                                        </option>
                                    </select>
                                </div>

                                {/* PRIORITY */}
                                <div>
                                    <label
                                        htmlFor="priority"
                                        className="block text-sm font-semibold text-slate-700 mb-2"
                                    >
                                        Priority
                                    </label>

                                    <select
                                        id="priority"
                                        value={priority}
                                        onChange={(e) =>
                                            setPriority(e.target.value)
                                        }
                                        disabled={updating}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="low">
                                            Low
                                        </option>

                                        <option value="medium">
                                            Medium
                                        </option>

                                        <option value="high">
                                            High
                                        </option>

                                        <option value="urgent">
                                            Urgent
                                        </option>
                                    </select>
                                </div>

                                {/* ASSIGNMENT */}
                                <div>
                                    <label
                                        htmlFor="assignedTo"
                                        className="block text-sm font-semibold text-slate-700 mb-2"
                                    >
                                        Assign Administrator
                                    </label>

                                    <select
                                        id="assignedTo"
                                        value={assignedTo}
                                        onChange={(e) =>
                                            setAssignedTo(e.target.value)
                                        }
                                        disabled={updating}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="">
                                            Unassigned
                                        </option>

                                        {admins.map((admin) => (
                                            <option
                                                key={admin.id}
                                                value={String(admin.id)}
                                            >
                                                {admin.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting || updating}
                                    className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {deleting
                                        ? "Deleting..."
                                        : "Delete Request"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleUpdate}
                                    disabled={updating || deleting}
                                    className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {updating
                                        ? "Saving Changes..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </div>

                        {/* STATUS HISTORY */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-900">
                                    Status History
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Complete history of status changes for
                                    this request.
                                </p>
                            </div>

                            {history.length === 0 ? (
                                <div className="rounded-lg bg-slate-50 border border-slate-200 p-5 text-center">
                                    <p className="text-sm text-slate-500">
                                        No status changes have been recorded
                                        yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-200" />

                                    <div className="space-y-7">
                                        {history.map((item) => (
                                            <div
                                                key={item.id}
                                                className="relative flex gap-5"
                                            >
                                                <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                                                </div>

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

                        {/* FOOTER ACTION */}
                        <div className="flex justify-end">
                            <Link
                                to="/admin"
                                className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
                            >
                                Back to Admin Dashboard
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminRequestDetails;