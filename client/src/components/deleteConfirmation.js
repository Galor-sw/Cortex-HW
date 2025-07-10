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
            console.error("❌ Error deleting entry:", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
                <h2 className="text-lg font-semibold mb-2">Delete Entry</h2>
                <p className="mb-4 text-sm">
                    Are you sure you want to delete this entry?
                </p>
                <p className="mb-4 text-gray-600 text-sm">
                    <strong>Date:</strong> {entry.date} <br />
                    <strong>Visitors:</strong> {entry.visits}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        {loading ? "Deleting..." : "Yes, delete"}
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmation;