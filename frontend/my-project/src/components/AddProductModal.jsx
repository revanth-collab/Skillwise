import React, { useState } from "react";

export default function AddProductModal({ open, onClose, onSubmit }) {
    const [form, setForm] = useState({
        name: "",
        unit: "",
        category: "",
        brand: "",
        stock: 0,
        image: "",
    });

    if (!open) return null;

    const update = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const save = () => {
        onSubmit(form);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white shadow-xl p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Add Product</h2>

                {Object.entries(form).map(([key, value]) => (
                    <div className="mb-3" key={key}>
                        <label className="text-sm font-medium capitalize">{key}</label>
                        <input
                            className="border w-full px-3 py-2 mt-1 rounded"
                            name={key}
                            value={value}
                            type={key === "stock" ? "number" : "text"}
                            onChange={update}
                        />
                    </div>
                ))}

                <div className="flex justify-end gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={save}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
