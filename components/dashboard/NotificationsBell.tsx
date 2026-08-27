"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, RefreshCw, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/lib/supabase/client";
import { rpc } from "@/lib/supabase-rpc";
import { useAuth } from "@/lib/auth";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  created_at: string;
  read_at: string | null;
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationsBell() {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const unreadCount = items.filter((n) => !n.read_at).length;

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("id, type, title, body, link, created_at, read_at")
      .order("created_at", { ascending: false })
      .limit(20);
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const markAllRead = async () => {
    await rpc("mark_notifications_read");
    setItems((cur) => cur.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
  };

  const openNotification = async (n: Notification) => {
    if (!n.read_at) {
      await rpc("mark_notifications_read", { _ids: [n.id] });
      setItems((cur) => cur.map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x)));
    }
    setOpen(false);
    if (n.link) router.push(n.link);
  };

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) load(); }}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-accent transition-transform duration-300 hover:scale-110"
        >
          <motion.span animate={unreadCount > 0 ? { rotate: [0, -12, 12, -8, 8, 0] } : {}} transition={{ duration: 0.6, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}>
            <Bell className="h-5 w-5" />
          </motion.span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-popover border-border backdrop-blur-xl" asChild>
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.18 }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Notifications</span>
            <div className="flex items-center gap-1">
              <button
                onClick={load}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Mark all read"
                  title="Mark all read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-muted-foreground">
                {loading ? "Loading…" : "You're all caught up."}
              </p>
            ) : (
              <AnimatePresence initial={false}>
                {items.map((n, i) => (
                  <motion.button
                    key={n.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    onClick={() => openNotification(n)}
                    className="w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-accent transition-colors flex items-start gap-2.5"
                  >
                    {!n.read_at && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />}
                    <div className={n.read_at ? "opacity-60" : ""}>
                      <p className="text-xs font-semibold text-foreground">{n.title}</p>
                      {n.body && <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.body}</p>}
                      <p className="text-[10px] text-muted-foreground/70 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
