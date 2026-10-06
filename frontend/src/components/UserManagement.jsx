import { useEffect, useState } from "react";
import api from "../services/api";

function UserManagement() {
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "employee",
    });


    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/users");

            setUsers(response.data.users);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load users."
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleCreateUser = async (e) => {
        e.preventDefault();

        try {
            setCreating(true);
            setError("");
            setSuccess("");

            const response = await api.post(
                "/users",
                formData
            );

            setSuccess(response.data.message);

            setFormData({
                name: "",
                email: "",
                password: "",
                role: "employee",
            });

            setShowForm(false);

            await fetchUsers();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to create user."
            );

        } finally {
            setCreating(false);
        }
    };


    const getRoleStyle = (role) => {
        if (role === "admin") {
            return "bg-purple-100 text-purple-700";
        }

        return "bg-blue-100 text-blue-700";
    };


    return (
        <section className="mb-8">

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">

                {/* HEADER */}
                <div className="p-6 border-b border-slate-200">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                User Management
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Create and manage administrators and employees.
                            </p>
                        </div>


                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(!showForm);
                                setError("");
                                setSuccess("");
                            }}
                            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
                        >
                            {showForm ? "Close Form" : "+ Add User"}
                        </button>

                    </div>

                </div>


                {/* MESSAGES */}
                <div className="px-6">

                    {error && (
                        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}


                    {success && (
                        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                </div>


                {/* CREATE USER FORM */}
                {showForm && (
                    <form
                        onSubmit={handleCreateUser}
                        className="m-6 rounded-xl border border-slate-200 bg-slate-50 p-5"
                    >

                        <h4 className="text-lg font-bold text-slate-900 mb-4">
                            Create New User
                        </h4>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* NAME */}
                            <div>
                                <label
                                    htmlFor="user-name"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Full Name
                                </label>

                                <input
                                    id="user-name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter full name"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>


                            {/* EMAIL */}
                            <div>
                                <label
                                    htmlFor="user-email"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Email Address
                                </label>

                                <input
                                    id="user-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter email address"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>


                            {/* PASSWORD */}
                            <div>
                                <label
                                    htmlFor="user-password"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Temporary Password
                                </label>

                                <input
                                    id="user-password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="6"
                                    placeholder="Minimum 6 characters"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>


                            {/* ROLE */}
                            <div>
                                <label
                                    htmlFor="user-role"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Role
                                </label>

                                <select
                                    id="user-role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="employee">
                                        Employee
                                    </option>

                                    <option value="admin">
                                        Administrator
                                    </option>
                                </select>
                            </div>

                        </div>


                        <div className="mt-5 flex justify-end">

                            <button
                                type="submit"
                                disabled={creating}
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
                            >
                                {creating
                                    ? "Creating..."
                                    : "Create User"}
                            </button>

                        </div>

                    </form>
                )}


                {/* USERS TABLE */}
                <div className="p-6">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[700px]">

                            <thead className="bg-slate-50 border-b border-slate-200">

                                <tr>

                                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Name
                                    </th>

                                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Email
                                    </th>

                                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Role
                                    </th>

                                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Created
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {loading ? (

                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-4 py-10 text-center text-slate-500"
                                        >
                                            Loading users...
                                        </td>
                                    </tr>

                                ) : users.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-4 py-10 text-center text-slate-500"
                                        >
                                            No users found.
                                        </td>
                                    </tr>

                                ) : (

                                    users.map((user) => (

                                        <tr
                                            key={user.id}
                                            className="hover:bg-slate-50 transition"
                                        >

                                            <td className="px-4 py-4">

                                                <p className="font-semibold text-slate-900">
                                                    {user.name}
                                                </p>

                                            </td>


                                            <td className="px-4 py-4 text-sm text-slate-600">
                                                {user.email}
                                            </td>


                                            <td className="px-4 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleStyle(
                                                        user.role
                                                    )}`}
                                                >
                                                    {user.role === "admin"
                                                        ? "Administrator"
                                                        : "Employee"}
                                                </span>

                                            </td>


                                            <td className="px-4 py-4 text-sm text-slate-500">
                                                {new Date(
                                                    user.created_at
                                                ).toLocaleDateString()}
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>


                    <div className="mt-4 text-sm text-slate-500">
                        Total users:{" "}
                        <span className="font-semibold text-slate-700">
                            {users.length}
                        </span>
                    </div>

                </div>

            </div>

        </section>
    );
}

export default UserManagement;