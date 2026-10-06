import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import UserManagement from "../components/UserManagement";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
    const { user, logout } = useAuth();

    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState(null);
    const [categoryStats, setCategoryStats] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                requestsResponse,
                statsResponse,
                categoryResponse,
            ] = await Promise.all([
                api.get("/requests"),
                api.get("/dashboard/stats"),
                api.get("/dashboard/by-category"),
            ]);

            setRequests(requestsResponse.data.requests);
            setStats(statsResponse.data);
            setCategoryStats(categoryResponse.data);
            const usersResponse = await api.get("/users/employees");

            setEmployees(usersResponse.data.users);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load admin dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);


    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {

            const matchesStatus =
                statusFilter === "all" ||
                request.status === statusFilter;

            const matchesPriority =
                priorityFilter === "all" ||
                request.priority === priorityFilter;

            const search = searchTerm.toLowerCase();

            const matchesSearch =
                !search ||
                request.title.toLowerCase().includes(search) ||
                request.description.toLowerCase().includes(search) ||
                request.category.toLowerCase().includes(search) ||
                request.created_by.toLowerCase().includes(search);

            return (
                matchesStatus &&
                matchesPriority &&
                matchesSearch
            );
        });
    }, [
        requests,
        statusFilter,
        priorityFilter,
        searchTerm,
    ]);


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


    const handleUpdateRequest = async (
        requestId,
        field,
        value
    ) => {

        try {
            setUpdatingId(requestId);

            await api.put(`/requests/${requestId}`, {
                [field]: value,
            });

            await fetchDashboardData();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update request."
            );
        } finally {
            setUpdatingId(null);
        }
    };


    const handleDeleteRequest = async (requestId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this request?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(requestId);

            await api.delete(`/requests/${requestId}`);

            setRequests((currentRequests) =>
                currentRequests.filter(
                    (request) => request.id !== requestId
                )
            );

            await fetchDashboardData();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete request."
            );
        } finally {
            setDeletingId(null);
        }
    };


    return (
        <div className="min-h-screen bg-slate-100">

            {/* HEADER */}
            <header className="bg-slate-900 text-white">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="min-h-16 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>
                            <h1 className="text-xl font-bold">
                                ServiceDesk
                            </h1>

                            <p className="text-xs text-slate-400">
                                Administrator Dashboard
                            </p>
                        </div>


                        <div className="flex items-center gap-4">

                            <div className="hidden sm:block text-right">

                                <p className="text-sm font-semibold">
                                    {user?.name}
                                </p>

                                <p className="text-xs text-slate-400">
                                    Administrator
                                </p>

                            </div>


                            <button
                                onClick={logout}
                                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 transition"
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </div>

            </header>


            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* PAGE TITLE */}
                <div className="mb-8">

                    <p className="text-sm font-semibold text-blue-600">
                        Admin Portal
                    </p>

                    <h2 className="mt-1 text-3xl font-bold text-slate-900">
                        Service Request Overview
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Monitor, assign and manage employee service requests.
                    </p>

                </div>


                {/* ERROR */}
                {error && (
                    <div className="mb-6 flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={() => setError("")}
                            className="font-bold text-red-500 hover:text-red-700"
                        >
                            ×
                        </button>

                    </div>
                )}


                {/* STAT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">

                        <p className="text-sm text-slate-500">
                            Total Requests
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {loading ? "—" : stats?.total || 0}
                        </p>

                    </div>


                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">

                        <p className="text-sm text-slate-500">
                            Pending
                        </p>

                        <p className="mt-2 text-3xl font-bold text-amber-600">
                            {loading ? "—" : stats?.pending || 0}
                        </p>

                    </div>


                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">

                        <p className="text-sm text-slate-500">
                            In Progress
                        </p>

                        <p className="mt-2 text-3xl font-bold text-purple-600">
                            {loading ? "—" : stats?.in_progress || 0}
                        </p>

                    </div>


                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">

                        <p className="text-sm text-slate-500">
                            Resolved
                        </p>

                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {loading ? "—" : stats?.resolved || 0}
                        </p>

                    </div>

                </div>


                {/* SECONDARY STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                    <div className="bg-white rounded-xl border border-slate-200 p-5">

                        <div className="flex items-center justify-between">

                            <span className="text-sm text-slate-500">
                                Assigned
                            </span>

                            <span className="text-lg font-bold text-blue-600">
                                {stats?.assigned || 0}
                            </span>

                        </div>

                    </div>


                    <div className="bg-white rounded-xl border border-slate-200 p-5">

                        <div className="flex items-center justify-between">

                            <span className="text-sm text-slate-500">
                                Closed
                            </span>

                            <span className="text-lg font-bold text-slate-700">
                                {stats?.closed || 0}
                            </span>

                        </div>

                    </div>


                    <div className="bg-white rounded-xl border border-slate-200 p-5">

                        <div className="flex items-center justify-between">

                            <span className="text-sm text-slate-500">
                                Urgent
                            </span>

                            <span className="text-lg font-bold text-red-600">
                                {stats?.urgent || 0}
                            </span>

                        </div>

                    </div>

                </div>


                {/* CATEGORY OVERVIEW */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">

                    <div className="mb-5">

                        <h3 className="text-lg font-bold text-slate-900">
                            Requests by Category
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                            Distribution of service requests across categories.
                        </p>

                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                        {categoryStats.map((category) => (

                            <div
                                key={category.category}
                                className="rounded-lg bg-slate-50 border border-slate-200 p-4"
                            >

                                <p className="text-sm text-slate-500">
                                    {category.category}
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {category.total}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

                {/* USER MANAGEMENT */}
                <UserManagement />

                {/* REQUEST MANAGEMENT */}
                <section>

                    <div className="mb-5">

                        <h3 className="text-xl font-bold text-slate-900">
                            Request Management
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Review and manage all employee service requests.
                        </p>

                    </div>


                    {/* FILTERS */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-5">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {/* SEARCH */}
                            <div>

                                <label
                                    htmlFor="search"
                                    className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2"
                                >
                                    Search
                                </label>

                                <input
                                    id="search"
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    placeholder="Search requests..."
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                            </div>


                            {/* STATUS */}
                            <div>

                                <label
                                    htmlFor="statusFilter"
                                    className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2"
                                >
                                    Status
                                </label>

                                <select
                                    id="statusFilter"
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >

                                    <option value="all">
                                        All Statuses
                                    </option>

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
                                    htmlFor="priorityFilter"
                                    className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2"
                                >
                                    Priority
                                </label>

                                <select
                                    id="priorityFilter"
                                    value={priorityFilter}
                                    onChange={(e) =>
                                        setPriorityFilter(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >

                                    <option value="all">
                                        All Priorities
                                    </option>

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

                        </div>

                    </div>


                    {/* REQUEST TABLE */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1000px]">

                                <thead className="bg-slate-50 border-b border-slate-200">

                                    <tr>

                                        <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Request
                                        </th>

                                        <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Employee
                                        </th>

                                        <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Category
                                        </th>

                                        <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Priority
                                        </th>

                                        <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Status
                                        </th>

                                        <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Assigned To
                                        </th>

                                        <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {loading ? (

                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-5 py-12 text-center text-slate-500"
                                            >
                                                Loading requests...
                                            </td>
                                        </tr>

                                    ) : filteredRequests.length === 0 ? (

                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-5 py-12 text-center text-slate-500"
                                            >
                                                No requests match your filters.
                                            </td>
                                        </tr>

                                    ) : (

                                        filteredRequests.map((request) => (

                                            <tr
                                                key={request.id}
                                                className="hover:bg-slate-50 transition"
                                            >

                                                {/* REQUEST */}
                                                <td className="px-5 py-4">

                                                    <Link
                                                        to={`/employee/request/${request.id}`}
                                                        className="font-semibold text-slate-900 hover:text-blue-600"
                                                    >
                                                        {request.title}
                                                    </Link>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        #{request.id} ·{" "}
                                                        {new Date(
                                                            request.created_at
                                                        ).toLocaleDateString()}
                                                    </p>

                                                </td>


                                                {/* EMPLOYEE */}
                                                <td className="px-5 py-4 text-sm text-slate-700">
                                                    {request.created_by}
                                                </td>


                                                {/* CATEGORY */}
                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {request.category}
                                                </td>


                                                {/* PRIORITY */}
                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getPriorityStyle(
                                                            request.priority
                                                        )}`}
                                                    >
                                                        {request.priority}
                                                    </span>

                                                </td>


                                                {/* STATUS */}
                                                <td className="px-5 py-4">

                                                    <select
                                                        value={request.status}
                                                        disabled={updatingId === request.id}
                                                        onChange={(e) =>
                                                            handleUpdateRequest(
                                                                request.id,
                                                                "status",
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`rounded-lg border-0 px-3 py-2 text-xs font-semibold capitalize outline-none focus:ring-2 focus:ring-blue-200 ${getStatusStyle(
                                                            request.status
                                                        )}`}
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

                                                </td>


                                                {/* ASSIGNED TO */}
                                                <td className="px-5 py-4">
                                                    <select
                                                        value={
                                                            request.assigned_to_id
                                                                ? String(request.assigned_to_id)
                                                                : ""
                                                        }
                                                        disabled={updatingId === request.id}
                                                        onChange={(e) =>
                                                            handleUpdateRequest(
                                                                request.id,
                                                                "assigned_to",
                                                                e.target.value
                                                                    ? Number(e.target.value)
                                                                    : null
                                                            )
                                                        }
                                                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                    >
                                                        <option value="">
                                                            Unassigned
                                                        </option>

                                                        {employees.map((employee) => (
                                                            <option
                                                                key={employee.id}
                                                                value={String(employee.id)}
                                                            >
                                                                {employee.name}
                                                            </option>
                                                        ))}
                                                    </select>

                                                </td>


                                                {/* ACTIONS */}
                                                <td className="px-5 py-4">

                                                    <div className="flex items-center justify-end gap-2">

                                                        <Link
                                                            to={`/admin/request/${request.id}`}
                                                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                                        >
                                                            View
                                                        </Link>

                                                        <button
                                                            onClick={() =>
                                                                handleDeleteRequest(
                                                                    request.id
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId === request.id
                                                            }
                                                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                        >
                                                            {deletingId === request.id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* RESULTS COUNT */}
                    <div className="mt-4 text-sm text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-700">
                            {filteredRequests.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-700">
                            {requests.length}
                        </span>{" "}
                        requests
                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;