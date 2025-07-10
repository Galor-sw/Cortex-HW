import React from "react";

const SortData = ({ currentSort, handleSort, selectedDate, setSelectedDate, setPage }) => {
    return (
        <div className="flex gap-2">
            <label className="text-sm font-medium text-gray-700">
                Sort by:
                <select
                    className="ml-2 w-36 h-8 border border-gray-300 rounded px-2 py-1"
                    onChange={(e) => handleSort(e.target.value)}
                    value={currentSort}
                >
                    <option value="random">Random</option>
                    <option value="date">Date</option>
                    <option value="visits">Visits</option>
                </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
                Search by date:
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
    );
};

export default SortData;