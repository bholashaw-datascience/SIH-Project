import { useState, useRef } from "react";
import {
  Camera,Mail,Phone,Pencil,Check,Send,Loader2,Clock,Undo2,GraduationCap,ShieldCheck,
} from "lucide-react";

const TOKENS = {
  ink: "#1E2A44",
  inkDeep: "#141C30",
  paper: "#FAF7F0",
  paperLine: "#EDE7D8",
  amber: "#E8A33D",
  amberDeep: "#C97F1E",
  sage: "#6E9B72",
  brick: "#B4483A",
  slate: "#5B6472",
  cream: "#FFFDF8",
};

export default function StudentProfile() {
  const [photo, setPhoto] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Aditi Sharma",
    email: "aditi@school.edu",
    phone: "+91 98765 43210",
  });
  const [draft, setDraft] = useState(profile);
  const [status, setStatus] = useState("unsent"); // unsent | sending | pending | verified | returned
  const reason = "Photo doesn't clearly show your face. Please re-upload a passport-style photo.";
  const fileRef = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const saveEdit = () => {
    setProfile(draft);
    setEditing(false);
  };

  const sendForVerification = () => {
    setStatus("sending");
    setTimeout(() => setStatus("pending"), 1300);
  };

  const initials = profile.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{
        background: `radial-gradient(circle at 1px 1px, ${TOKENS.paperLine} 1px, transparent 0) 0 0/22px 22px, ${TOKENS.paper}`,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >

      <div className="w-full max-w-2xl">
        {/* Header eyebrow */}
        <div className="field-in flex items-center gap-2 mb-4 sm:mb-6 px-1" style={{ animationDelay: "0.02s" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: TOKENS.ink }}>
            <GraduationCap size={18} color={TOKENS.amber} />
          </div>
          <span className="font-mono-id text-[11px] sm:text-xs tracking-[0.2em] uppercase" style={{ color: TOKENS.slate }}>
            &middot; My Profile
          </span>
        </div>

        <div
          className="relative rounded-3xl overflow-hidden"
          style={{ backgroundColor: TOKENS.cream, boxShadow: "0 30px 60px -20px rgba(20,28,48,0.3)" }}
        >
          {/* Banner */}
          <div
            className="field-in relative h-24 sm:h-28"
            style={{
              background: `linear-gradient(135deg, ${TOKENS.ink} 0%, ${TOKENS.inkDeep} 100%)`,
              animationDelay: "0.04s",
            }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                backgroundSize: "18px 18px",
              }}
            />
          </div>

          {/* Avatar overlapping banner */}
          <div className="flex justify-center -mt-14 sm:-mt-16">
            <div className="relative avatar-pop">
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden flex items-center justify-center border-4 font-display text-3xl"
                style={{ borderColor: TOKENS.cream, backgroundColor: TOKENS.paper, color: TOKENS.ink }}
              >
                {photo ? (
                  <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  initials || <Camera size={28} color={TOKENS.slate} />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-1 right-1 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: TOKENS.amber, borderColor: TOKENS.cream }}
                aria-label="Change profile picture"
              >
                <Camera size={15} color={TOKENS.inkDeep} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </div>
          </div>
          <p className="field-in text-center text-xs mt-2 mb-6" style={{ color: TOKENS.slate, animationDelay: "0.08s" }}>
            Student profile picture
          </p>

          {/* Info block */}
          <div className="px-6 sm:px-12 pb-8">
            <div className="field-in flex items-center justify-center gap-2 mb-5" style={{ animationDelay: "0.1s" }}>
              {!editing ? (
                <button
                  type="button"
                  onClick={startEdit}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors hover:bg-black/5"
                  style={{ borderColor: TOKENS.paperLine, color: TOKENS.ink }}
                >
                  <Pencil size={12} />
                  Edit details
                </button>
              ) : (
                <button
                  type="button"
                  onClick={saveEdit}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: TOKENS.sage, color: TOKENS.cream }}
                >
                  <Check size={12} />
                  Save changes
                </button>
              )}
            </div>

            {!editing ? (
              <div className="field-in text-center mb-8" style={{ animationDelay: "0.14s" }}>
                <h1 className="font-display text-2xl sm:text-3xl mb-3" style={{ color: TOKENS.ink }}>
                  {profile.name}
                </h1>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm">
                  <span className="flex items-center gap-1.5" style={{ color: TOKENS.slate }}>
                    <Mail size={14} /> {profile.email}
                  </span>
                  <span className="flex items-center gap-1.5" style={{ color: TOKENS.slate }}>
                    <Phone size={14} /> {profile.phone}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-8 max-w-md mx-auto">
                <EditField icon={GraduationCap} label="Name" value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} delay="0.02s" />
                <EditField icon={Mail} label="Email" type="email" value={draft.email} onChange={(v) => setDraft((d) => ({ ...d, email: v }))} delay="0.06s" />
                <EditField icon={Phone} label="Phone" type="tel" value={draft.phone} onChange={(v) => setDraft((d) => ({ ...d, phone: v }))} delay="0.1s" />
              </div>
            )}

            {/* Verification panel */}
            <div
              className="field-in relative rounded-2xl p-5 sm:p-6"
              style={{ backgroundColor: TOKENS.paper, animationDelay: "0.18s" }}
            >
              {/* stamp for pending / returned */}
              {(status === "pending" || status === "returned") && (
                <div
                  key={status}
                  className="stamp-land absolute -top-4 -right-3 sm:right-4 select-none pointer-events-none"
                >
                  <div
                    className="font-mono-id text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-md border-[3px]"
                    style={{
                      color: status === "pending" ? TOKENS.amberDeep : TOKENS.brick,
                      borderColor: status === "pending" ? TOKENS.amberDeep : TOKENS.brick,
                      backgroundColor: "rgba(255,253,248,0.9)",
                    }}
                  >
                    {status === "pending" ? "Pending" : "Returned"}
                  </div>
                </div>
              )}

              {status === "unsent" && (
                <>
                  <p className="text-sm text-center mb-4 leading-relaxed" style={{ color: TOKENS.ink }}>
                    Complete your profile and send it to the Principal of your
                    institution for verification. You'll see the status here
                    once it's reviewed.
                  </p>
                  <button
                    type="button"
                    onClick={sendForVerification}
                    className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                    style={{ backgroundColor: TOKENS.ink, color: TOKENS.cream }}
                  >
                    <Send size={16} />
                    Send to Principal for Verification
                  </button>
                </>
              )}

              {status === "sending" && (
                <div className="flex items-center justify-center gap-2 py-3 text-sm font-semibold" style={{ color: TOKENS.slate }}>
                  <Loader2 size={18} className="animate-spin" />
                  Sending to your Principal&hellip;
                </div>
              )}

              {status === "pending" && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span
                      className="pulse-ring w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: TOKENS.amberDeep }}
                    />
                    <p className="font-semibold text-sm" style={{ color: TOKENS.ink }}>
                      Verification pending
                    </p>
                  </div>
                  <p className="text-xs mb-5" style={{ color: TOKENS.slate }}>
                    Your Principal has been notified.
                  </p>
                  
                  
                  {/* Principal approve/reject part */}

                  {/* <div className="flex items-center justify-center gap-2 text-xs" style={{ color: TOKENS.slate }}>
                    <Clock size={13} />
                    <span>Demo &middot; simulate the Principal's response:</span>
                  </div> */}
                  {/* <div className="flex items-center justify-center gap-3 mt-3">
                    <button
                      onClick={() => setStatus("verified")}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors hover:bg-black/5"
                      style={{ borderColor: TOKENS.sage, color: TOKENS.sage }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setStatus("returned")}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors hover:bg-black/5"
                      style={{ borderColor: TOKENS.brick, color: TOKENS.brick }}
                    >
                      Return with reason
                    </button>
                  </div> */}



                </div>
              )}

              {status === "verified" && (
                <div className="flex flex-col items-center text-center py-2">
                  <div
                    className="check-pop w-14 h-14 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: "rgba(110,155,114,0.15)" }}
                  >
                    <ShieldCheck size={26} color={TOKENS.sage} strokeWidth={2.5} />
                  </div>
                  <p className="font-semibold text-sm mb-1" style={{ color: TOKENS.ink }}>
                    Profile verified
                  </p>
                  <p className="text-xs" style={{ color: TOKENS.slate }}>
                    Your Principal has confirmed your details. You're good to go.
                  </p>
                </div>
              )}

              {status === "returned" && (
                <div className="text-center">
                  <p className="font-semibold text-sm mb-2" style={{ color: TOKENS.brick }}>
                    Returned for changes
                  </p>
                  <div
                    className="shake-once text-left text-xs sm:text-sm rounded-xl p-3.5 mb-4"
                    style={{ backgroundColor: "rgba(180,72,58,0.08)", color: TOKENS.ink }}
                  >
                    <span className="font-semibold" style={{ color: TOKENS.brick }}>
                      Reason:{" "}
                    </span>
                    {reason}
                  </div>
                  <button
                    onClick={() => setStatus("unsent")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-black/5"
                    style={{ borderColor: TOKENS.paperLine, color: TOKENS.ink }}
                  >
                    <Undo2 size={13} />
                    Update &amp; resend
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditField({ icon: Icon, label, type = "text", value, onChange, delay }) {
  return (
    <div className="field-in" style={{ animationDelay: delay }}>
      <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: TOKENS.slate }}>
        {label}
      </label>
      <div
        className="input-shell flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all"
        style={{ borderColor: TOKENS.paperLine, backgroundColor: TOKENS.paper }}
      >
        <Icon size={16} color={TOKENS.slate} className="shrink-0" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-sm"
          style={{ color: TOKENS.ink }}
        />
      </div>
    </div>
  );
}