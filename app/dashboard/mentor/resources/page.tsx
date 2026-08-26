export const metadata = {
  title: "Study Materials | Mentor Hub",
};

export default function MentorResourcesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Study Materials</h1>
        <p className="text-zinc-400">Upload and organize resources for your students.</p>
      </header>

      {/* Simulated client component area (placeholder) */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium">No Resources Uploaded</h2>
          <p className="text-zinc-400 text-sm">Upload your first PDF or link to get started.</p>
        </div>
      </div>
    </div>
  );
}
