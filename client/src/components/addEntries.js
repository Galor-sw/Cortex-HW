const AddEntries = ({ newDate, setNewDate, newVisits, setNewVisits, handleAddEntry, setShowForm }) => {
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
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={handleAddEntry}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEntries;