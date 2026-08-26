export const metadata = {
  title: "My Students | Mentor Hub",
};

export default function MentorStudentsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
        <p className="text-zinc-400">Monitor progress and schedule 1-on-1 sessions.</p>
      </header>

      {/* Simulated client component area (placeholder) */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium">No Students Assigned</h2>
          <p className="text-zinc-400 text-sm">Your assigned mentees will appear here.</p>
        </div>
      </div>
    </div>
  );
}
