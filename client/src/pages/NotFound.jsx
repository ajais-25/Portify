import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 leading-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-lg text-gray-400">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Illustration/Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-3V6a3 3 0 11-6 0v3M5 12H3a2 2 0 00-2 2v4a2 2 0 002 2h18a2 2 0 002-2v-4a2 2 0 00-2-2h-2"
              />
            </svg>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Home
          </Link>

          <div className="mt-4">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-gray-500 text-gray-300 font-medium rounded-lg hover:border-gray-400 hover:text-white transition-all duration-300 ease-in-out"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
            </button>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-400 mb-4">Maybe try one of these pages:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              Login
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              to="/register"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
