import { useState } from "react";

const UpdateEntries = ({ entry, onClose, onUpdateSuccess }) => {
    const [date, setDate] = useState(entry.date);
    const [visits, setVisits] = useState(entry.visits);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!date || isNaN(visits)) return;
        setLoading(true);
        try {
            const response = await fetch(
                "https://us-central1-cortex-hw.cloudfunctions.net/updateTrafficEntry",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: entry.id, date, visits: Number(visits) }),
                }
            );
            if (!response.ok) throw new Error("Failed to update entry");
            onUpdateSuccess({ id: entry.id, date, visits: Number(visits) });
        } catch (err) {
            console.error("Error updating entry:", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">Update Entry</h2>
                <label className="block mb-2">
                    Date:
                    <input
                        type="date"
                        className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </label>
                <label className="block mb-4">
                    Visits:
                    <input
                        type="number"
                        className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                        value={visits}
                        onChange={(e) => setVisits(e.target.value)}
                    />
                </label>
                <div className="flex justify-center gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {loading ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateEntries;