import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import SortGraph from "./sortGraph";

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
        <div className="px-4 py-2">
            <SortGraph
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                trafficData={trafficData}
            />

            <div className="min-h-[250px]">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <XAxis dataKey="label" stroke="#374151" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#374151" tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="visits" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TrafficChart;