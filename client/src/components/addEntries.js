import { useState } from "react";

const AddEntries = ({
    newDate,
    setNewDate,
    newVisits,
    setNewVisits,
    setShowForm,
    setTrafficData,
    currentSort,
}) => {
    const [loading, setLoading] = useState(false);

    const handleAddEntry = async () => {
        if (!newDate || !newVisits) {
            alert("Please fill in both date and visits.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                "https://us-central1-cortex-hw.cloudfunctions.net/addTrafficEntry",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        date: newDate,
                        visits: parseInt(newVisits),
                    }),
                }
            );

            if (!response.ok) throw new Error("Failed to add entry");

            const newEntry = await response.json();

            setTrafficData((prev) => {
                const updated = [...prev, newEntry];
                if (currentSort === "date") {
                    return updated.sort((a, b) => new Date(b.date) - new Date(a.date));
                }
                if (currentSort === "visits") {
                    return updated.sort((a, b) => b.visits - a.visits);
                }
                return updated;
            });

            setNewDate("");
            setNewVisits("");
            setShowForm(false);
        } catch (err) {
            console.error("❌ Error adding entry:", err.message);
            alert("Failed to add entry.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">Add Traffic Entry</h2>
                <label className="block mb-2">
                    Date:
                    <input
                        type="date"
                        className="w-full border border-gray-300 rounded px-2 py-1"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                    />
                </label>
                <label className="block mb-4">
                    Visits:
                    <input
                        type="number"
                        className="w-full border border-gray-300 rounded px-2 py-1"
                        value={newVisits}
                        onChange={(e) => setNewVisits(e.target.value)}
                    />
                </label>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() => setShowForm(false)}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={handleAddEntry}
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEntries;