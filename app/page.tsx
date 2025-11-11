import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to CycleIQ
        </h1>
        <Link
          href="/login"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
