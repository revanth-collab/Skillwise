export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center mt-6 gap-2">
            <button
                className="px-3 py-1 border rounded disabled:opacity-40"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
            >
                Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-blue-600 text-white" : ""
                        }`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                className="px-3 py-1 border rounded disabled:opacity-40"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </button>
        </div>
    );
}
