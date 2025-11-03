// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DatabaseCard from "@/components/DatabaseCard";
import { useRouter } from "next/navigation";

type Counts = {
  dateIdeas: number;
  todos: number;
  events: number;
};

export default function Dashboard() {
  const router = useRouter();
  const [counts, setCounts] = useState<Counts>({
    dateIdeas: 0,
    todos: 0,
    events: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/");
        return;
      }

      const uid = sessionData.session.user.id;
      setUserId(uid);

      try {
        const [dateIdeasRes, todosRes, eventsRes] = await Promise.all([
          supabase.from("date_ideas").select("id").eq("user_id", uid),
          supabase.from("todos").select("id").eq("user_id", uid),
          supabase.from("events").select("id").eq("user_id", uid),
        ]);

        setCounts({
          dateIdeas: dateIdeasRes.data?.length || 0,
          todos: todosRes.data?.length || 0,
          events: eventsRes.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Super Mario Bros
      </h1>
      <p className="text-gray-600 mb-8">Love in Chaos - Life in Order</p>

      <div className="grid grid-cols-1 rounded md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DatabaseCard
          title="Date Ideas"
          description=""
          count={counts.dateIdeas}
          href="/dashboard/date-ideas"
          icon="💕"
          bgColor="bg-pink-50"
        />
        <DatabaseCard
          title="To-Dos"
          description=""
          count={counts.todos}
          href="/dashboard/todos"
          icon="✓"
          bgColor="bg-blue-50"
        />
        <DatabaseCard
          title="Events & Packing"
          description=""
          count={counts.events}
          href="/dashboard/events"
          icon="📦"
          bgColor="bg-amber-50"
        />
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Getting Started
        </h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✓ Create an account or sign in</li>
          <li>✓ Add your partner to create shared items</li>
          <li>✓ Start planning date ideas together</li>
          <li>✓ Keep track of shared tasks and events</li>
        </ul>
      </div>
    </div>
  );
}
