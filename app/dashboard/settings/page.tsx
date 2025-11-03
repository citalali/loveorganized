// FILE: app/dashboard/settings/page.tsx
// LOCATION: Create NEW file at app/dashboard/settings/page.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/lib/stores";

type PartnerInvite = {
  id: string;
  to_email: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
};

type PartnerProfile = {
  id: string;
  email: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const showNotification = useNotificationStore((s) => s.showNotification);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [invites, setInvites] = useState<PartnerInvite[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.push("/");
        return;
      }

      const uid = sessionData.session.user.id;
      const userEmail = sessionData.session.user.email;

      setUserId(uid);
      setUserEmail(userEmail || "");

      // Fetch user profile to see if they have a partner
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();

      if (profileData?.partner_id) {
        const { data: partnerData } = await supabase
          .from("profiles")
          .select("id, email")
          .eq("id", profileData.partner_id)
          .single();

        setPartner(partnerData);
      }

      // Fetch sent invites
      const { data: invitesData } = await supabase
        .from("partner_invites")
        .select("*")
        .eq("from_user_id", uid)
        .order("created_at", { ascending: false });

      setInvites(invitesData || []);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !userId) return;

    if (inviteEmail === userEmail) {
      showNotification("Can't invite yourself!", "error");
      return;
    }

    // Check if invite already exists
    const { data: existingInvite } = await supabase
      .from("partner_invites")
      .select("id")
      .eq("from_user_id", userId)
      .eq("to_email", inviteEmail)
      .single();

    if (existingInvite) {
      showNotification("Invite already sent to this email", "info");
      return;
    }

    const { error } = await supabase.from("partner_invites").insert({
      from_user_id: userId,
      to_email: inviteEmail,
      status: "pending",
    });

    if (!error) {
      setInviteEmail("");
      showNotification(`Invite sent to ${inviteEmail}!`, "success");
      // Refresh invites
      const { data: newInvites } = await supabase
        .from("partner_invites")
        .select("*")
        .eq("from_user_id", userId)
        .order("created_at", { ascending: false });
      setInvites(newInvites || []);
    } else {
      showNotification("Failed to send invite", "error");
    }
  };

  const handleRemovePartner = async () => {
    if (!userId || !partner) return;

    if (!window.confirm("Remove this partner? You can reconnect later."))
      return;

    const { error } = await supabase
      .from("profiles")
      .update({ partner_id: null })
      .eq("id", userId);

    if (!error) {
      setPartner(null);
      showNotification("Partner removed", "success");
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    const { error } = await supabase
      .from("partner_invites")
      .delete()
      .eq("id", inviteId);

    if (!error) {
      setInvites(invites.filter((i) => i.id !== inviteId));
      showNotification("Invite cancelled", "success");
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      {/* Current Partner Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          👥 Your Partner
        </h2>

        {partner ? (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{partner.email}</p>
              <p className="text-sm text-gray-600">Connected</p>
            </div>
            <button
              onClick={handleRemovePartner}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        ) : (
          <p className="text-gray-600">
            No partner connected yet. Send an invite below!
          </p>
        )}
      </div>

      {/* Send Invite Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📨 Send Invite
        </h2>

        <form onSubmit={handleSendInvite}>
          <div className="flex gap-3 mb-4">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Partner's email address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium"
            >
              Invite
            </button>
          </div>
          <p className="text-sm text-gray-600">
            They will receive an email to connect as your partner
          </p>
        </form>
      </div>

      {/* Pending Invites Section */}
      {invites.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📤 Pending Invites ({invites.length})
          </h2>

          <div className="space-y-2">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{invite.to_email}</p>
                  <p className="text-xs text-gray-600">
                    Sent{" "}
                    {new Date(invite.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleCancelInvite(invite.id)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Your Email Section */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-8">
        <h3 className="font-semibold text-blue-900 mb-2">Your Email</h3>
        <p className="text-sm text-blue-800">{userEmail}</p>
        <p className="text-xs text-blue-700 mt-2">
          💡 Share this email with your partner so they can send you an invite
        </p>
      </div>
    </div>
  );
}
