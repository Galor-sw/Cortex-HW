import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { getDoc, doc } from "firebase/firestore";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";

const TrafficTable = ({ trafficData, setTrafficData }) => {
    const [selectedDate, setSelectedDate] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [newDate, setNewDate] = useState("");
    const [newVisits, setNewVisits] = useState("");
    const [isEditor, setIsEditor] = useState(false);

    useEffect(() => {
        const checkUserRole = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const docRef = doc(db, "roles", user.uid);
                    console.log(user.uid)
                    const docSnap = await getDoc(docRef);
                    console.log(docSnap)
                    if (docSnap.exists() && docSnap.data().role === "editor") {
                        setIsEditor(true);
                    }
                } catch (err) {
                    console.error("Failed to fetch user role:", err);
                }
            }
        };
        checkUserRole();
    }, []);

    const handleSort = (sortBy) => {
        if (sortBy === "random") {
            setTrafficData([...trafficData]);
        } else {
            const sorted = [...trafficData];
            if (sortBy === "date") {
                sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            } else if (sortBy === "visits") {
                sorted.sort((a, b) => b.visits - a.visits);
            }
            setTrafficData(sorted);
        }
    };

    const filteredData = selectedDate
        ? trafficData.filter((entry) => entry.date === selectedDate)
        : trafficData;

    const handleAddEntry = () => {
        if (newDate && newVisits) {
            setTrafficData([...trafficData, { date: newDate, visits: parseInt(newVisits) }]);
            setShowForm(false);
            setNewDate("");
            setNewVisits("");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Sort by:
                        <select
                            className="ml-2 w-36 h-8 border border-gray-300 rounded px-2 py-1"
                            onChange={(e) => handleSort(e.target.value)}
                            defaultValue="random"
                        >
                            <option value="random">Random</option>
                            <option value="date">Date</option>
                            <option value="visits">Visits</option>
                        </select>
                    </label>

                    <label className="text-sm font-medium text-gray-700">
                        Date:
                        <div className="relative inline-block">
                            <input
                                type="date"
                                className="ml-2 w-36 h-8 border border-gray-300 rounded px-2 py-1"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                            {selectedDate && (
                                <button
                                    onClick={() => setSelectedDate("")}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-gray-300 text-red-600 rounded-full flex items-center justify-center text-xs hover:bg-gray-400"
                                    title="Clear"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </label>
                </div>
            </div>

            {isEditor && (
                <div className="mb-2">
                    <button
                        className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-lg font-bold"
                        onClick={() => setShowForm(true)}
                    >
                        +
                    </button>
                </div>
            )}

            <hr className="border-t border-gray-300 mb-4" />

            {filteredData.length > 0 ? (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b px-4 py-2 text-gray-700">Date</th>
                            <th className="border-b px-4 py-2 text-gray-700">Visits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((entry, index) => (
                            <tr
                                key={index}
                                className="group hover:bg-gray-50 transition"
                            >
                                <td className="border-b px-4 py-2">{entry.date}</td>
                                <td className="border-b px-4 py-2 flex items-center justify-between">
                                    {entry.visits}
                                    {isEditor && (
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <img
                                                src={editIcon}
                                                alt="Edit"
                                                title="Edit"
                                                className="w-5 h-5 cursor-pointer"
                                            />
                                            <img
                                                src={deleteIcon}
                                                alt="Delete"
                                                title="Delete"
                                                className="w-5 h-5 cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No traffic data found.</p>
            )}

            {showForm && (
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
            )}
        </div>
    );
};

export default TrafficTable;