import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ onClose }) {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate("/login");
        if (onClose) onClose();
    };

    const handleNavClick = () => {
        if (onClose) onClose();
    };

    return (
        <div className="h-full bg-gradient-to-b from-slate-50 to-white shadow-inner">
            {/* Header */}
            <div className="p-6 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
                <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SmartReach
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col p-4 space-y-1">
                {/* dashboard */}
                <NavLink
                    to="/home"
                    className={({ isActive }) =>
                        `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[0.98]"
                            : "text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 hover:shadow-md hover:shadow-blue-100/50 hover:transform hover:scale-[1.02] active:scale-[0.98]"
                        }`
                    }
                    onClick={handleNavClick}
                >
                    <svg className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                </NavLink>

                {/* customers */}
                <NavLink
                    to="/customers"
                    className={({ isActive }) =>
                        `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[0.98]"
                            : "text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 hover:shadow-md hover:shadow-blue-100/50 hover:transform hover:scale-[1.02] active:scale-[0.98]"
                        }`
                    }
                    onClick={handleNavClick}
                >
                    <svg className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Customers
                </NavLink>

                <NavLink
                    to="/segments"
                    className={({ isActive }) =>
                        `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[0.98]"
                            : "text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 hover:shadow-md hover:shadow-blue-100/50 hover:transform hover:scale-[1.02] active:scale-[0.98]"
                        }`
                    }
                    onClick={handleNavClick}
                >
                    <svg className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Customer Segments
                </NavLink>

                <NavLink
                    to="/campaigns"
                    className={({ isActive }) =>
                        `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[0.98]"
                            : "text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 hover:shadow-md hover:shadow-blue-100/50 hover:transform hover:scale-[1.02] active:scale-[0.98]"
                        }`
                    }
                    onClick={handleNavClick}
                >
                    <svg className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Campaign Log
                </NavLink>

                <NavLink
                    to="/create-campaign"
                    className={({ isActive }) =>
                        `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[0.98]"
                            : "text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 hover:shadow-md hover:shadow-blue-100/50 hover:transform hover:scale-[1.02] active:scale-[0.98]"
                        }`
                    }
                    onClick={handleNavClick}
                >
                    <svg className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Campaign
                </NavLink>
            </nav>

            {/* Logout Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50/80 to-transparent backdrop-blur-sm border-t border-slate-200/60">
                <button
                    onClick={logout}
                    className="group w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50/80 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-red-100/50 hover:transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <svg className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    );
}