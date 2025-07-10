import { useState } from "react";

const DeleteConfirmation = ({ entry, onCancel, onDeleteSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://us-central1-cortex-hw.cloudfunctions.net/deleteTrafficEntry?id=${entry.id}`,
                {
                    method: "DELETE",
                }
            );
            if (!response.ok) throw new Error("Failed to delete entry");
            onDeleteSuccess(entry.id);
        } catch (err) {
            console.error("Error deleting entry:", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-center">Delete Traffic Entry</h2>
                <p className="mb-4 text-sm text-center">
                    Are you sure you want to delete this entry?
                </p>
                <div className="mb-4 text-center text-sm text-gray-600">
                    <p><strong>Date:</strong> {entry.date}</p>
                    <p><strong>Visitors:</strong> {entry.visits}</p>
                </div>
                <div className="flex justify-center gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        {loading ? "Deleting..." : "Yes, Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmation;