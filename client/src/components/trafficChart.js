import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TrafficChart = ({ trafficData }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [viewMode, setViewMode] = useState(() => localStorage.getItem("viewMode") || "day");
    const [selectedMonth, setSelectedMonth] = useState("2025-03");
    const [selectedYear, setSelectedYear] = useState("2025");

    useEffect(() => {
        if (viewMode === "day") {
            const [year, month] = selectedMonth.split("-");
            const daysInMonth = new Date(year, month, 0).getDate();
            const entriesByDay = Object.fromEntries(
                trafficData
                    .filter((entry) => entry.date.startsWith(selectedMonth))
                    .map((entry) => [entry.date.split("-")[2], entry.visits])
            );
            const filledDays = Array.from({ length: daysInMonth }, (_, i) => {
                const day = String(i + 1).padStart(2, "0");
                return {
                    date: `${selectedMonth}-${day}`,
                    label: day,
                    visits: entriesByDay[day] || 0,
                };
            });
            setFilteredData(filledDays);
        } else if (viewMode === "month") {
            const monthMap = {};
            trafficData.forEach(({ date, visits }) => {
                const [year, month] = date.split("-");
                if (year === selectedYear) {
                    monthMap[month] = (monthMap[month] || 0) + visits;
                }
            });
            const months = Array.from({ length: 12 }, (_, i) => {
                const monthNum = String(i + 1).padStart(2, "0");
                return {
                    label: monthNum,
                    visits: monthMap[monthNum] || 0,
                };
            });
            setFilteredData(months);
        } else if (viewMode === "year") {
            const currentYear = new Date().getFullYear();
            const yearMap = {};
            trafficData.forEach(({ date, visits }) => {
                const year = date.split("-")[0];
                yearMap[year] = (yearMap[year] || 0) + visits;
            });
            const years = Array.from({ length: 5 }, (_, i) => {
                const year = String(currentYear - i);
                return {
                    label: year,
                    visits: yearMap[year] || 0,
                };
            }).reverse();
            setFilteredData(years);
        }
    }, [viewMode, selectedMonth, selectedYear, trafficData]);

    return (
        <div>
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

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="label" stroke="#374151" />
                    <YAxis stroke="#374151" />
                    <Tooltip />
                    <Line type="monotone" dataKey="visits" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrafficChart;