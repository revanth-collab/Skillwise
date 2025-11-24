import React, { useState } from "react";

export default function ProductTable({
    products,
    sortBy,
    sortOrder,
    onSort,
    onRowClick,
    onDelete,
    onSaveRow,
}) {
    const [editId, setEditId] = useState(null);
    const [draft, setDraft] = useState({});

    const edit = (p) => {
        setEditId(p.id);
        setDraft(p);
    };

    const save = () => {
        onSaveRow(editId, draft);
        setEditId(null);
    };

    const SortIcon = ({ field }) =>
        sortBy === field ? (
            sortOrder === "ASC" ? (
                <span>▲</span>
            ) : (
                <span>▼</span>
            )
        ) : (
            <span className="opacity-40">⇅</span>
        );

    const set = (f, v) => setDraft({ ...draft, [f]: v });

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        {[
                            "image",
                            "name",
                            "unit",
                            "category",
                            "brand",
                            "stock",
                            "status",
                        ].map((col) => (
                            <th
                                key={col}
                                className="px-4 py-3 font-medium cursor-pointer"
                                onClick={() => onSort(col)}
                            >
                                <div className="flex items-center gap-2">
                                    {col.toUpperCase()}
                                    <SortIcon field={col} />
                                </div>
                            </th>
                        ))}
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((p) => {
                        const isEdit = editId === p.id;

                        return (
                            <tr
                                key={p.id}
                                className="border-b hover:bg-gray-50 cursor-pointer"
                                onClick={(e) => {
                                    if (e.target.closest("button")) return;
                                    onRowClick(p);
                                }}
                            >
                                <td className="px-4 py-3">
                                    <img
                                        src={p.image}
                                        className="w-10 h-10 rounded object-cover"
                                    />
                                </td>

                                {[
                                    "name",
                                    "unit",
                                    "category",
                                    "brand",
                                    "stock",
                                ].map((col) => (
                                    <td key={col} className="px-4 py-3">
                                        {isEdit ? (
                                            <input
                                                className="border px-2 py-1 rounded w-full"
                                                value={draft[col]}
                                                onChange={(e) =>
                                                    set(col, col === "stock" ? Number(e.target.value) : e.target.value)
                                                }
                                            />
                                        ) : (
                                            p[col]
                                        )}
                                    </td>
                                ))}

                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 rounded text-white ${p.status === "In Stock"
                                            ? "bg-green-600"
                                            : "bg-red-600"
                                            }`}
                                    >
                                        {p.status}
                                    </span>
                                </td>

                                <td className="px-4 py-3 flex gap-2">
                                    {!isEdit ? (
                                        <>
                                            <button
                                                className="px-3 py-1 bg-blue-500 text-white rounded"
                                                onClick={() => edit(p)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-red-500 text-white rounded"
                                                onClick={() => onDelete(p.id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="px-3 py-1 bg-green-600 text-white rounded"
                                                onClick={save}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-gray-300 rounded"
                                                onClick={() => setEditId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
