import React from "react";

const SortData = ({
    currentSort,
    handleSort,
    selectedDate,
    setSelectedDate,
    setPage,
    children,
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
            <div className="flex flex-col sm:flex-row gap-2 flex-grow">
                <div className="text-sm font-medium text-gray-700">
                    <span className="block mb-1">Sort by:</span>
                    <select
                        className="w-32 sm:w-36 h-8 border border-gray-300 rounded px-2 py-1"
                        onChange={(e) => handleSort(e.target.value)}
                        value={currentSort}
                    >
                        <option value="random">Random</option>
                        <option value="date">Date</option>
                        <option value="visits">Visits</option>
                    </select>
                </div>
                <div className="text-sm font-medium text-gray-700">
                    <span className="block mb-1">Search by date:</span>
                    <div className="relative">
                        <input
                            type="date"
                            className="w-32 sm:w-36 h-8 border border-gray-300 rounded px-2 py-1"
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
                </div>
            </div>
            <div className="flex justify-end sm:ml-auto">{children}</div>
        </div>
    );
};

export default SortData;