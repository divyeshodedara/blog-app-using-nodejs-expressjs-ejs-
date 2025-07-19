export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">About BlogiFy</h1>
        <p className="text-lg text-gray-600">Your daily dose of thoughts, ideas, and stories from passionate writers.</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-2">🚀 Our Mission</h2>
          <p>
            We believe that every voice matters. <strong>BlogiFy</strong> is a platform built for curious minds and creative hearts.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-2">👨‍💻 Who We Are</h2>
          <p>
            We're a team of passionate web developers who built this platform to help writers easily share their stories.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-2">🤝 Want to Contribute?</h2>
          <p>
            Join our community and share your unique voice with the world.
          </p>
        </div>
      </div>
    </div>
  );
}