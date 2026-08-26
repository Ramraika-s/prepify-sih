export const metadata = {
  title: "Settings | Mentor Hub",
};

export default function MentorSettingsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile & Calendar</h1>
        <p className="text-zinc-400">Manage your mentor profile and availability.</p>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl">
        <h2 className="text-xl font-medium mb-4">Calendar Integrations</h2>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
            <div>
              <p className="font-medium">Google Calendar</p>
              <p className="text-sm text-zinc-400">Not connected</p>
            </div>
            <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors">
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
