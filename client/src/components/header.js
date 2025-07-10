import logoutIcon from "../assets/logout.png";
const Header = ({ user, handleLogout }) => {
    return (
        <div className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">{user?.email}</span>
                <button
                    onClick={handleLogout}
                    className="text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    <img src={logoutIcon} alt="Logout" className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Header;