import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-xl">
        {/* Emoji / Icon */}
        <div className="mb-4 text-6xl">🍽️🏠</div>

        {/* Title */}
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          404 – Page Not Found
        </h1>

        {/* Subtitle */}
        <p className="mb-2 text-gray-600">
          Looks like this plate is empty or the PG room doesn’t exist.
        </p>

        {/* Description */}
        <p className="mb-6 text-sm text-gray-500">
          The page you’re looking for might have been moved, renamed, or is
          temporarily unavailable.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            🏡 Go to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-300 bg-gray-100 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
          >
            🔙 Go Back
          </button>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-xs text-gray-400">
          Discover trusted <span className="font-semibold">PGs</span>,
          <span className="font-semibold"> hostels</span>, and
          <span className="font-semibold"> home-style food</span> near you.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
