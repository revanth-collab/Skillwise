export default function ProductHistorySidebar({ product, history, onClose }) {
    if (!product) return null;

    return (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-xl z-50 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    {product.name} – History
                </h2>
                <button className="text-xl" onClick={onClose}>
                    ✕
                </button>
            </div>

            {history.length === 0 ? (
                <p className="text-gray-500">No history available</p>
            ) : (
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-2 py-2">Date</th>
                            <th className="px-2 py-2">Old</th>
                            <th className="px-2 py-2">New</th>
                            <th className="px-2 py-2">User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((h) => (
                            <tr key={h.id} className="border-b">
                                <td className="px-2 py-2">
                                    {new Date(h.createdAt).toLocaleString()}
                                </td>
                                <td className="px-2 py-2">{h.oldStock}</td>
                                <td className="px-2 py-2">{h.newStock}</td>
                                <td className="px-2 py-2">{h.changedBy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
