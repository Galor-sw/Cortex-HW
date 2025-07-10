const SortGraph = ({
    viewMode,
    setViewMode,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    trafficData,
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            <select
                value={viewMode}
                onChange={(e) => {
                    const mode = e.target.value;
                    setViewMode(mode);
                    localStorage.setItem("viewMode", mode);
                }}
                className="border rounded px-2 py-1"
            >
                <option value="day">Days</option>
                <option value="month">Months</option>
                <option value="year">Years</option>
            </select>

            {viewMode === "day" && (
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    {[...new Set(trafficData.map((d) => d.date.slice(0, 7)))].map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
            )}

            {viewMode === "month" && (
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    {[...new Set(trafficData.map((d) => d.date.slice(0, 4)))].map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default SortGraph;