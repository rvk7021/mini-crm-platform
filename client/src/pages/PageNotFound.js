import React from 'react';
import { Link } from 'react-router-dom';

export const PageNotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4">
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <h2 className="text-2xl mt-4 text-gray-800">Page Not Found</h2>
            <p className="text-center mt-2 text-gray-600">
                The page you are looking for doesn’t exist or has been moved.
            </p>
            <Link
                to="/"
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Go to Home
            </Link>
        </div>
    );
};
