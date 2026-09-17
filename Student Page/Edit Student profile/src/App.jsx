import { useState, useRef, useMemo } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  MapPin,
  Building2,
  BookOpen,
  Layers,
  Hash,
  CalendarDays,
  CalendarCheck,
  Gauge,
  Camera,
  Send,
  Loader2,
  GraduationCap,
  Check,
  Clock,
  ShieldCheck,
  Undo2,
  Copy,
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

const PERSONAL_FIELDS = [
  { key: "name", label: "Name", icon: User, type: "text", placeholder: "Aditi Sharma" },
  { key: "email", label: "Email", icon: Mail, type: "email", placeholder: "aditi@school.edu" },
  { key: "phone", label: "Phone", icon: Phone, type: "tel", placeholder: "+91 98765 43210" },
  { key: "dob", label: "Date of Birth", icon: Calendar, type: "date" },
  { key: "gender", label: "Gender", icon: Users, type: "select", options: ["Female", "Male", "Other", "Prefer not to say"] },
  { key: "presentAddress", label: "Present Address", icon: MapPin, type: "textarea", placeholder: "House no., street, city, state, PIN" },
  { key: "permanentAddress", label: "Permanent Address", icon: MapPin, type: "textarea", placeholder: "House no., street, city, state, PIN" },
];

const ACADEMIC_FIELDS = [
  { key: "college", label: "College", icon: Building2, type: "text", placeholder: "Institute of Technology" },
  { key: "course", label: "Course", icon: BookOpen, type: "text", placeholder: "B.Tech Computer Science" },
  { key: "yearSemester", label: "Year and Semester", icon: Layers, type: "text", placeholder: "3rd Year, 6th Semester" },
  { key: "collegeRoll", label: "College Roll Number", icon: Hash, type: "text", placeholder: "CR-2024-118" },
  { key: "universityRoll", label: "University Roll Number", icon: Hash, type: "text", placeholder: "UR-2024-8821" },
  { key: "admissionYear", label: "Admission Year", icon: CalendarDays, type: "text", placeholder: "2023" },
  { key: "completionYear", label: "Completion Year", icon: CalendarCheck, type: "text", placeholder: "2027" },
];

const GPA_FIELDS = [
  { key: "sgpa", label: "SGPA", icon: Gauge, type: "number", placeholder: "8.4" },
  { key: "ygpa", label: "YGPA", icon: Gauge, type: "number", placeholder: "8.2" },
  { key: "cgpa", label: "CGPA", icon: Gauge, type: "number", placeholder: "8.3" },
];

const ALL_KEYS = [...PERSONAL_FIELDS, ...ACADEMIC_FIELDS, ...GPA_FIELDS].map((f) => f.key);

export default function StudentEditProfile() {
  const [form, setForm] = useState(() =>
    Object.fromEntries(ALL_KEYS.map((k) => [k, ""]))
  );
  const [photo, setPhoto] = useState(null);
  const [sameAddress, setSameAddress] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | pending | verified | returned
  const fileRef = useRef(null);
  const reason = "Roll numbers don't match college records. Please re-check and resubmit.";

  const update = (key) => (value) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "presentAddress" && sameAddress) {
        next.permanentAddress = value;
      }
      return next;
    });
  };

  const toggleSameAddress = () => {
    setSameAddress((s) => {
      const next = !s;
      if (next) setForm((f) => ({ ...f, permanentAddress: f.presentAddress }));
      return next;
    });
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const completeness = useMemo(() => {
    const filled = ALL_KEYS.filter((k) => String(form[k]).trim().length > 0).length;
    const photoBonus = photo ? 1 : 0;
    return Math.round(((filled + photoBonus) / (ALL_KEYS.length + 1)) * 100);
  }, [form, photo]);

  const initials = (form.name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setTimeout(() => setStatus("pending"), 1300);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{
        background: `radial-gradient(circle at 1px 1px, ${TOKENS.paperLine} 1px, transparent 0) 0 0/22px 22px, ${TOKENS.paper}`,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes avatarPop { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.06); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes stampLand {
          0%   { transform: scale(1.6) rotate(-14deg); opacity: 0; }
          55%  { transform: scale(0.94) rotate(-9deg); opacity: 1; }
          75%  { transform: scale(1.04) rotate(-11deg); }
          100% { transform: scale(1) rotate(-10deg); opacity: 1; }
        }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(232,163,61,0.45); }
          70%  { box-shadow: 0 0 0 10px rgba(232,163,61,0); }
          100% { box-shadow: 0 0 0 0 rgba(232,163,61,0); }
        }
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        @keyframes checkPop { 0% { transform: scale(0) rotate(-20deg); opacity: 0; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }

        .field-in { animation: fadeUp 0.5s ease both; }
        .avatar-pop { animation: avatarPop 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .stamp-land { animation: stampLand 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .pulse-ring { animation: pulseRing 2s ease-out infinite; }
        .shake-once { animation: shakeX 0.5s ease-in-out both; }
        .check-pop { animation: checkPop 0.5s cubic-bezier(0.22,1,0.36,1) both; }

        @media (prefers-reduced-motion: reduce) {
          .field-in, .avatar-pop, .stamp-land, .pulse-ring, .shake-once, .check-pop { animation: none !important; }
        }

        .font-display { font-family: 'Fraunces', serif; }
        .font-mono-id { font-family: 'IBM Plex Mono', monospace; }
        .input-shell:focus-within {
          border-color: ${TOKENS.amberDeep};
          box-shadow: 0 0 0 3px rgba(232,163,61,0.18);
        }
      `}</style>

      <div className="w-full max-w-4xl">
        {/* Eyebrow */}
        <div className="field-in flex items-center gap-2 mb-4 sm:mb-6 px-1" style={{ animationDelay: "0.02s" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: TOKENS.ink }}>
            <GraduationCap size={18} color={TOKENS.amber} />
          </div>
          <span className="font-mono-id text-[11px] sm:text-xs tracking-[0.2em] uppercase" style={{ color: TOKENS.slate }}>
            Campus Portal &middot; Edit Profile
          </span>
        </div>

        <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: TOKENS.cream, boxShadow: "0 30px 60px -20px rgba(20,28,48,0.3)" }}>
          {/* Banner */}
          <div
            className="field-in relative h-24 sm:h-28 flex items-end justify-center pb-4"
            style={{ background: `linear-gradient(135deg, ${TOKENS.ink} 0%, ${TOKENS.inkDeep} 100%)`, animationDelay: "0.04s" }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`, backgroundSize: "18px 18px" }}
            />
            <h1 className="relative font-display text-xl sm:text-2xl" style={{ color: TOKENS.cream }}>
              Edit Your Profile
            </h1>
          </div>

          {/* Avatar overlap */}
          <div className="flex justify-center -mt-12 sm:-mt-14">
            <div className="relative avatar-pop">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex items-center justify-center border-4 font-display text-2xl"
                style={{ borderColor: TOKENS.cream, backgroundColor: TOKENS.paper, color: TOKENS.ink }}
              >
                {photo ? <img src={photo} alt="Profile" className="w-full h-full object-cover" /> : initials || <Camera size={24} color={TOKENS.slate} />}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0.5 right-0.5 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: TOKENS.amber, borderColor: TOKENS.cream }}
                aria-label="Change profile picture"
              >
                <Camera size={14} color={TOKENS.inkDeep} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </div>
          </div>
          <p className="field-in text-center text-xs mt-2" style={{ color: TOKENS.slate, animationDelay: "0.08s" }}>
            Student profile picture
          </p>

          {/* Completeness bar */}
          <div className="field-in px-6 sm:px-12 mt-5" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: TOKENS.slate }}>
              <span className="font-semibold">Profile completeness</span>
              <span className="font-mono-id">{completeness}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: TOKENS.paperLine }}>
              <div
                className="h-full rounded-full origin-left transition-transform duration-500 ease-out"
                style={{
                  backgroundColor: completeness === 100 ? TOKENS.sage : TOKENS.amber,
                  width: "100%",
                  transform: `scaleX(${completeness / 100})`,
                }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 sm:px-12 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal column */}
              <div>
                <p className="field-in text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: TOKENS.amberDeep, animationDelay: "0.12s" }}>
                  Personal details
                </p>
                <div className="space-y-4">
                  {PERSONAL_FIELDS.map((f, i) => (
                    <div key={f.key}>
                      <Field
                        {...f}
                        value={form[f.key]}
                        onChange={update(f.key)}
                        delay={`${0.14 + i * 0.04}s`}
                        disabled={f.key === "permanentAddress" && sameAddress}
                      />
                      {f.key === "presentAddress" && (
                        <label
                          className="field-in mt-2 flex items-center gap-2 text-xs cursor-pointer select-none"
                          style={{ color: TOKENS.slate, animationDelay: "0.18s" }}
                        >
                          <input
                            type="checkbox"
                            checked={sameAddress}
                            onChange={toggleSameAddress}
                            className="rounded"
                            style={{ accentColor: TOKENS.amberDeep }}
                          />
                          <Copy size={12} />
                          Permanent address same as present
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic column */}
              <div>
                <p className="field-in text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: TOKENS.amberDeep, animationDelay: "0.14s" }}>
                  Academic details
                </p>
                <div className="space-y-4">
                  {ACADEMIC_FIELDS.map((f, i) => (
                    <Field key={f.key} {...f} value={form[f.key]} onChange={update(f.key)} delay={`${0.16 + i * 0.04}s`} />
                  ))}
                </div>

                <p className="field-in text-xs font-bold uppercase tracking-[0.15em] mt-6 mb-4" style={{ color: TOKENS.amberDeep, animationDelay: "0.42s" }}>
                  SGPA, YGPA &amp; CGPA
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {GPA_FIELDS.map((f, i) => (
                    <Field key={f.key} {...f} value={form[f.key]} onChange={update(f.key)} delay={`${0.44 + i * 0.04}s`} compact />
                  ))}
                </div>
              </div>
            </div>

            {/* Send for verification panel */}
            <div className="field-in relative mt-9 rounded-2xl p-5 sm:p-6" style={{ backgroundColor: TOKENS.paper, animationDelay: "0.58s" }}>
              {(status === "pending" || status === "returned") && (
                <div key={status} className="stamp-land absolute -top-4 -right-3 sm:right-4 select-none pointer-events-none">
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

              {status === "idle" && (
                <>
                  <p className="text-sm text-center mb-4" style={{ color: TOKENS.ink }}>
                    Once your details look right, send them to the Principal
                    of your institution for verification.
                  </p>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                    style={{ backgroundColor: TOKENS.ink, color: TOKENS.cream }}
                  >
                    <Send size={16} />
                    Send It to the Principal of Your Institution for Verification
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
                    <span className="pulse-ring w-2.5 h-2.5 rounded-full" style={{ backgroundColor: TOKENS.amberDeep }} />
                    <p className="font-semibold text-sm" style={{ color: TOKENS.ink }}>Verification pending</p>
                  </div>
                  <p className="text-xs mb-5" style={{ color: TOKENS.slate }}>
                    Your Principal has been notified. This usually takes 1&ndash;2 working days.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs" style={{ color: TOKENS.slate }}>
                    <Clock size={13} />
                    <span>Demo &middot; simulate the Principal's response:</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <button type="button" onClick={() => setStatus("verified")} className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors hover:bg-black/5" style={{ borderColor: TOKENS.sage, color: TOKENS.sage }}>
                      Approve
                    </button>
                    <button type="button" onClick={() => setStatus("returned")} className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors hover:bg-black/5" style={{ borderColor: TOKENS.brick, color: TOKENS.brick }}>
                      Return with reason
                    </button>
                  </div>
                </div>
              )}

              {status === "verified" && (
                <div className="flex flex-col items-center text-center py-2">
                  <div className="check-pop w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: "rgba(110,155,114,0.15)" }}>
                    <ShieldCheck size={26} color={TOKENS.sage} strokeWidth={2.5} />
                  </div>
                  <p className="font-semibold text-sm mb-1" style={{ color: TOKENS.ink }}>Profile verified</p>
                  <p className="text-xs" style={{ color: TOKENS.slate }}>Your Principal has confirmed your details. You're good to go.</p>
                </div>
              )}

              {status === "returned" && (
                <div className="text-center">
                  <p className="font-semibold text-sm mb-2" style={{ color: TOKENS.brick }}>Returned for changes</p>
                  <div className="shake-once text-left text-xs sm:text-sm rounded-xl p-3.5 mb-4" style={{ backgroundColor: "rgba(180,72,58,0.08)", color: TOKENS.ink }}>
                    <span className="font-semibold" style={{ color: TOKENS.brick }}>Reason: </span>
                    {reason}
                  </div>
                  <button type="button" onClick={() => setStatus("idle")} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-black/5" style={{ borderColor: TOKENS.paperLine, color: TOKENS.ink }}>
                    <Undo2 size={13} />
                    Update &amp; resend
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, type = "text", placeholder, value, onChange, delay, options, disabled, compact }) {
  return (
    <div className="field-in" style={{ animationDelay: delay }}>
      <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: TOKENS.slate }}>
        {label}
      </label>
      <div
        className={`input-shell flex items-start gap-2 rounded-xl border transition-all ${compact ? "px-2.5 py-2" : "px-3.5 py-2.5"}`}
        style={{ borderColor: TOKENS.paperLine, backgroundColor: disabled ? TOKENS.paperLine : TOKENS.paper, opacity: disabled ? 0.7 : 1 }}
      >
        <Icon size={15} color={TOKENS.slate} className="shrink-0 mt-0.5" />
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={2}
            className="w-full bg-transparent outline-none text-sm resize-none"
            style={{ color: TOKENS.ink }}
          />
        ) : type === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
            style={{ color: value ? TOKENS.ink : TOKENS.slate }}
          >
            <option value="" disabled>Select&hellip;</option>
            {options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full bg-transparent outline-none text-sm"
            style={{ color: TOKENS.ink }}
          />
        )}
      </div>
    </div>
  );
}