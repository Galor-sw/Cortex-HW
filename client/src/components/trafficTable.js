import { useState, useEffect, useMemo } from "react";
import { auth, db } from "../firebase/config";
import { getDoc, doc } from "firebase/firestore";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";
import AddEntries from "./addEntries";
import UpdateEntries from "./updateEntries";
import leftArrow from "../assets/leftArrow.png";
import rightArrow from "../assets/rightArrow.png";

const TrafficTable = ({ trafficData, setTrafficData, onDelete }) => {
    const [currentSort, setCurrentSort] = useState("random");
    const [selectedDate, setSelectedDate] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [newDate, setNewDate] = useState("");
    const [newVisits, setNewVisits] = useState("");
    const [isEditor, setIsEditor] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [entryToEdit, setEntryToEdit] = useState(null);

    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const checkUserRole = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const docRef = doc(db, "roles", user.uid);
                    const docSnap = await getDoc(docRef);
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
        setCurrentSort(sortBy);
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

    const filteredData = useMemo(() => {
        return selectedDate
            ? trafficData.filter((entry) => entry.date === selectedDate)
            : trafficData;
    }, [trafficData, selectedDate]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, page]);

    const handleAddEntry = () => {
        if (newDate && newVisits) {
            const updatedData = [...trafficData, { date: newDate, visits: parseInt(newVisits) }];

            if (currentSort === "date") {
                updatedData.sort((a, b) => new Date(b.date) - new Date(a.date));
            } else if (currentSort === "visits") {
                updatedData.sort((a, b) => b.visits - a.visits);
            }

            setTrafficData(updatedData);
            setShowForm(false);
            setNewDate("");
            setNewVisits("");
        }
    };

    const handleDeleteClick = (entry) => {
        if (typeof onDelete === "function") {
            onDelete(entry);
        }
    };

    return (
        <div>
            {/* Filters */}
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
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setPage(1);
                                }}
                            />
                            {selectedDate && (
                                <button
                                    onClick={() => {
                                        setSelectedDate("");
                                        setPage(1);
                                    }}
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

            {/* Add button */}
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

            {/* Table */}
            {paginatedData.length > 0 ? (
                <>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="border-b px-4 py-2 text-gray-700">Date</th>
                                <th className="border-b px-4 py-2 text-gray-700">Visits</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((entry, index) => (
                                <tr key={index} className="group hover:bg-gray-50 transition">
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
                                                    onClick={() => {
                                                        setEntryToEdit(entry);
                                                        setShowUpdateForm(true);
                                                    }}
                                                />
                                                <img
                                                    src={deleteIcon}
                                                    alt="Delete"
                                                    title="Delete"
                                                    className="w-5 h-5 cursor-pointer"
                                                    onClick={() => handleDeleteClick(entry)}
                                                />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-center mt-4 gap-4 items-center">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
                        >
                            <img
                                src={leftArrow}
                                alt="Previous"
                                className={`w-6 h-6 ${page === 1 ? "opacity-30" : "hover:opacity-80 cursor-pointer"}`}
                            />
                        </button>
                        <span className="text-sm text-gray-700">Page {page}</span>
                        <button
                            onClick={() => {
                                const maxPages = Math.ceil(filteredData.length / pageSize);
                                setPage((p) => (p < maxPages ? p + 1 : p));
                            }}
                            disabled={page >= Math.ceil(filteredData.length / pageSize)}
                        >
                            <img
                                src={rightArrow}
                                alt="Next"
                                className={`w-6 h-6 ${page >= Math.ceil(filteredData.length / pageSize) ? "opacity-30" : "hover:opacity-80 cursor-pointer"}`}
                            />
                        </button>
                    </div>
                </>
            ) : (
                <p>No traffic data found.</p>
            )}

            {/* Modals */}
            {showForm && (
                <AddEntries
                    newDate={newDate}
                    setNewDate={setNewDate}
                    newVisits={newVisits}
                    setNewVisits={setNewVisits}
                    handleAddEntry={handleAddEntry}
                    setShowForm={setShowForm}
                    setTrafficData={setTrafficData}
                    currentSort={currentSort}
                />
            )}
            {showUpdateForm && entryToEdit && (
                <UpdateEntries
                    entry={entryToEdit}
                    onClose={() => {
                        setShowUpdateForm(false);
                        setEntryToEdit(null);
                    }}
                    onUpdateSuccess={(updatedEntry) => {
                        const updatedList = trafficData.map((e) =>
                            e.id === updatedEntry.id ? updatedEntry : e
                        );

                        if (currentSort === "date") {
                            updatedList.sort((a, b) => new Date(b.date) - new Date(a.date));
                        } else if (currentSort === "visits") {
                            updatedList.sort((a, b) => b.visits - a.visits);
                        }

                        setTrafficData(updatedList);
                        setShowUpdateForm(false);
                        setEntryToEdit(null);
                    }}
                />
            )}
        </div>
    );
};

export default TrafficTable;