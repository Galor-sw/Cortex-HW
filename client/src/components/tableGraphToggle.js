const TableGraphToggle = ({ viewType, setViewType }) => {
    return (
        <div className="flex rounded-full border border-purple-700 overflow-hidden bg-gray-200">
            <button
                onClick={() => setViewType("table")}
                className={`px-5 py-1.5 text-sm transition rounded-l-full ${viewType === "table"
                        ? "bg-purple-700 text-white font-bold shadow-md border-r-2 border-purple-900"
                        : "text-gray-500 bg-gray-100 hover:bg-gray-200"
                    }`}
            >
                Table
            </button>
            <button
                onClick={() => setViewType("chart")}
                className={`px-5 py-1.5 text-sm transition rounded-r-full ${viewType === "chart"
                        ? "bg-purple-700 text-white font-bold shadow-md border-l-2 border-purple-900"
                        : "text-gray-500 bg-gray-100 hover:bg-gray-200"
                    }`}
            >
                Graph
            </button>
        </div>
    );
};

export default TableGraphToggle;