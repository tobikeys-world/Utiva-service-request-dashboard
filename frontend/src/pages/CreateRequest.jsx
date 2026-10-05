import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

function CreateRequest() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category_id: "",
        priority: "medium",
    });

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories");

                setCategories(response.data);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load request categories."
                );
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            await api.post("/requests", {
                title: formData.title,
                description: formData.description,
                category_id: Number(formData.category_id),
                priority: formData.priority,
            });

            navigate("/employee");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to submit request. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">

            {/* HEADER */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="h-16 flex items-center justify-between">

                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                ServiceDesk
                            </h1>

                            <p className="text-xs text-slate-500">
                                New Service Request
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
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                <div className="mb-8">

                    <p className="text-sm font-semibold text-blue-600">
                        Employee Portal
                    </p>

                    <h2 className="mt-1 text-3xl font-bold text-slate-900">
                        Submit a Service Request
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Tell the support team what needs attention and we'll help
                        get it resolved.
                    </p>

                </div>


                {/* FORM CARD */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

                    {error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* TITLE */}
                        <div>

                            <label
                                htmlFor="title"
                                className="block text-sm font-semibold text-slate-700 mb-2"
                            >
                                Request Title
                            </label>

                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Laptop is not connecting to Wi-Fi"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* DESCRIPTION */}
                        <div>

                            <label
                                htmlFor="description"
                                className="block text-sm font-semibold text-slate-700 mb-2"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the problem in detail..."
                                rows="6"
                                required
                                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <p className="mt-2 text-xs text-slate-400">
                                Provide enough information to help the support team
                                understand the problem.
                            </p>

                        </div>


                        {/* CATEGORY + PRIORITY */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                            {/* CATEGORY */}
                            <div>

                                <label
                                    htmlFor="category_id"
                                    className="block text-sm font-semibold text-slate-700 mb-2"
                                >
                                    Category
                                </label>

                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    required
                                    disabled={loadingCategories}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                                >

                                    <option value="">
                                        {loadingCategories
                                            ? "Loading categories..."
                                            : "Select a category"}
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}

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
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

                        </div>


                        {/* PRIORITY GUIDE */}
                        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">

                            <p className="text-sm font-semibold text-slate-700 mb-2">
                                Priority Guide
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500">

                                <p>
                                    <strong className="text-green-600">
                                        Low:
                                    </strong>{" "}
                                    Minor issue
                                </p>

                                <p>
                                    <strong className="text-yellow-600">
                                        Medium:
                                    </strong>{" "}
                                    Normal issue
                                </p>

                                <p>
                                    <strong className="text-orange-600">
                                        High:
                                    </strong>{" "}
                                    Significant disruption
                                </p>

                                <p>
                                    <strong className="text-red-600">
                                        Urgent:
                                    </strong>{" "}
                                    Critical issue
                                </p>

                            </div>

                        </div>


                        {/* BUTTONS */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">

                            <Link
                                to="/employee"
                                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={submitting || loadingCategories}
                                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting
                                    ? "Submitting..."
                                    : "Submit Request"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default CreateRequest;