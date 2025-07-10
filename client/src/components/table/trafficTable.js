import { useState, useEffect, useMemo } from "react";
import { auth, db } from "../../firebase/config";
import { getDoc, doc } from "firebase/firestore";
import AddEntries from "./addEntries";
import UpdateEntries from "./updateEntries";
import DeleteConfirmation from "./deleteConfirmation";
import SortData from "./sortTable";
import PaginationData from "./paginationData";
import TableData from "./tableData";
import addDataIcon from "../../assets/addData.png";

const TrafficTable = ({ trafficData, setTrafficData }) => {
    const [currentSort, setCurrentSort] = useState("random");
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedDate, setSelectedDate] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [newDate, setNewDate] = useState("");
    const [newVisits, setNewVisits] = useState("");
    const [isEditor, setIsEditor] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [entryToEdit, setEntryToEdit] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);

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
        let newOrder = "desc";
        if (currentSort === sortBy && sortOrder === "desc") {
            newOrder = "asc";
        }
        setCurrentSort(sortBy);
        setSortOrder(newOrder);

        const sorted = [...trafficData];
        if (sortBy === "date") {
            sorted.sort((a, b) => newOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));
        } else if (sortBy === "visits") {
            sorted.sort((a, b) => newOrder === "asc" ? a.visits - b.visits : b.visits - a.visits);
        }
        setTrafficData(sorted);
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
                updatedData.sort((a, b) => sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));
            } else if (currentSort === "visits") {
                updatedData.sort((a, b) => sortOrder === "asc" ? a.visits - b.visits : b.visits - a.visits);
            }

            setTrafficData(updatedData);
            setShowForm(false);
            setNewDate("");
            setNewVisits("");
        }
    };

    const handleDeleteClick = (entry) => {
        setEntryToDelete(entry);
        setShowDeleteModal(true);
    };

    const maxPages = Math.ceil(filteredData.length / pageSize);

    return (
        <div>
            <div className="flex items-center mb-4">
                <SortData
                    currentSort={currentSort}
                    handleSort={handleSort}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    setPage={setPage}
                />
                {isEditor && (
                    <div className="flex justify-end ml-auto">
                        <img
                            src={addDataIcon}
                            alt="Add"
                            title="Add new entries"
                            className="w-8 h-8 cursor-pointer"
                            onClick={() => setShowForm(true)}
                        />
                    </div>
                )}
            </div>

            <hr className="border-t border-gray-300 mb-4" />

            {paginatedData.length > 0 ? (
                <>
                    <TableData
                        paginatedData={paginatedData}
                        isEditor={isEditor}
                        currentSort={currentSort}
                        sortOrder={sortOrder}
                        handleSort={handleSort}
                        setEntryToEdit={setEntryToEdit}
                        setShowUpdateForm={setShowUpdateForm}
                        handleDeleteClick={handleDeleteClick}
                        totalCount={trafficData.length}
                        page={page}
                        pageSize={pageSize}
                    />

                    <PaginationData
                        page={page}
                        maxPages={maxPages}
                        setPage={setPage}
                    />
                </>
            ) : (
                <p>No traffic data found.</p>
            )}

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
                            updatedList.sort((a, b) => sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));
                        } else if (currentSort === "visits") {
                            updatedList.sort((a, b) => sortOrder === "asc" ? a.visits - b.visits : b.visits - a.visits);
                        }

                        setTrafficData(updatedList);
                        setShowUpdateForm(false);
                        setEntryToEdit(null);
                    }}
                />
            )}
            {showDeleteModal && entryToDelete && (
                <DeleteConfirmation
                    entry={entryToDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    onDeleteSuccess={(deletedId) => {
                        setTrafficData((prev) => prev.filter((e) => e.id !== deletedId));
                        setShowDeleteModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default TrafficTable;