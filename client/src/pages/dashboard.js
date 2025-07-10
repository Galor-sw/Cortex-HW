import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import TrafficTable from "../components/table/trafficTable";
import TrafficChart from "../components/graph/trafficGraph";
import TableGraphToggle from "../components/tableGraphToggle";
import Header from "../components/header";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trafficData, setTrafficData] = useState([]);
    const [viewType, setViewType] = useState("table");
    const navigate = useNavigate();

    const handleLogout = async () => {
        const auth = getAuth();
        await auth.signOut();
        navigate("/");
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                navigate("/");
                return;
            }
            setUser(currentUser);
            try {
                const roleDoc = await getDoc(doc(db, "roles", currentUser.uid));
                if (!roleDoc.exists()) {
                    await setDoc(doc(db, "roles", currentUser.uid), { role: "viewer" });
                }
            } catch (error) {
                console.error("Error fetching role:", error.message);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const fetchTrafficStats = async () => {
            try {
                const response = await fetch("https://us-central1-cortex-hw.cloudfunctions.net/getTrafficData");
                const data = await response.json();
                console.log(data)
                const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
                setTrafficData(sorted);
                
            } catch (error) {
                console.error("Error fetching traffic stats from cloud function:", error);
            }
        };

        fetchTrafficStats();
    }, []);

    if (loading) {
        return <div className="p-4 text-center">Loading dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header user={user} handleLogout={handleLogout} />

            <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow rounded">
                <div className="flex justify-between items-center mb-5 md:mb-10">
                    <h2 className="text-lg font-semibold">Website Traffic</h2>
                    <TableGraphToggle viewType={viewType} setViewType={setViewType} />
                </div>
                {viewType === "table" ? (
                    <TrafficTable
                      trafficData={trafficData}
                      setTrafficData={setTrafficData}
                    />
                ) : (
                    <TrafficChart trafficData={trafficData} />
                )}
            </div>
        </div>
    );
};

export default Dashboard;