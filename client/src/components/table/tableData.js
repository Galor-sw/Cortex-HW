import editIcon from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";

const TableData = ({
    paginatedData,
    isEditor,
    currentSort,
    sortOrder,
    handleSort,
    setEntryToEdit,
    setShowUpdateForm,
    handleDeleteClick,
    totalCount,
    page,
    pageSize
}) => {
    return (
        <>
        <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
                <tr>
                    <th className="w-12 px-1 py-1 text-xs sm:w-14 sm:px-2 sm:py-2 sm:text-sm text-center font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Row</th>
                    <th
                        onClick={() => handleSort("date")}
                        className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm text-center font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer"
                    >
                        Date
                        <span className="ml-1 inline-block text-gray-400">
                            {currentSort === "date" ? (sortOrder === "asc" ? "↑" : "↓") : "⇅"}
                        </span>
                    </th>
                    <th
                        onClick={() => handleSort("visits")}
                        className="px-1 py-1 text-xs sm:px-1 sm:py-2 sm:text-sm text-center font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer"
                    >
                        Visits
                        <span className="ml-1 inline-block text-gray-400">
                            {currentSort === "visits" ? (sortOrder === "asc" ? "↑" : "↓") : "⇅"}
                        </span>
                    </th>
                    {isEditor && <th className="w-20 sm:w-24 px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm bg-gray-100 border-b border-gray-200" />}
                </tr>
            </thead>
            <tbody>
                {paginatedData.map((entry, index) => (
                    <tr key={index} className="group hover:bg-gray-50 transition">
                        <td className="w-12 px-1 py-2 text-xs sm:w-14 sm:px-2 sm:py-3 sm:text-sm text-center border-b border-gray-100 text-gray-400">{(page - 1) * pageSize + index + 1}</td>
                        <td className="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm text-center border-b border-gray-100">{entry.date}</td>
                        <td className="px-1 py-2 text-xs sm:px-1 sm:py-3 sm:text-sm text-center border-b border-gray-100">{entry.visits}</td>
                        {isEditor && (
                            <td className="w-20 sm:w-24 px-2 py-2 text-xs sm:px-2 sm:py-3 sm:text-sm text-center border-b border-gray-100">
                                <div className="flex items-start justify-start gap-2 opacity-0 group-hover:opacity-100 transition">
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
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
        <div className="mt-2 text-sm text-gray-600 text-left">
            Total: {totalCount}
        </div>
        </>
    );
};

export default TableData;