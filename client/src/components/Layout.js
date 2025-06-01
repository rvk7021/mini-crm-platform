import { useState } from "react";
import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const openSidebar = () => {
        console.log("Opening sidebar"); // Debug log
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        console.log("Closing sidebar"); // Debug log
        setIsSidebarOpen(false);
    };
    
    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
            {/* Desktop sidebar - always visible on large screens */}
            <aside
                className="w-64 flex-shrink-0 bg-white/90 backdrop-blur-md border-r border-slate-200/60 shadow-xl shadow-slate-200/50 hidden lg:block"
                aria-label="Navigation sidebar"
            >
                <Sidebar />
            </aside>

            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeSidebar}
                        aria-label="Close sidebar"
                    />
                    <aside className="relative w-64 h-full bg-white/95 backdrop-blur-md shadow-2xl shadow-slate-900/20">
                        <div className="flex justify-end p-4 border-b border-slate-200/60 bg-white/80">
                            <button
                                onClick={closeSidebar}
                                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200 hover:shadow-md hover:shadow-slate-200/50 hover:scale-105 active:scale-95"
                                aria-label="Close navigation menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <Sidebar onClose={closeSidebar} />
                    </aside>
                </div>
            )}

            {/* Main content area */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Mobile header with hamburger menu */}
                <header className="lg:hidden bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-4 py-3 shadow-md shadow-slate-200/50">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg  font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SmartReach  </h1>
                        <button
                            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200 hover:shadow-md hover:shadow-slate-200/50 hover:scale-105 active:scale-95"
                            aria-label="Open navigation menu"
                            onClick={openSidebar}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}