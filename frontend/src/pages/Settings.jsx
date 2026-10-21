import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Palette, Globe, Bell, Wand2, Shield, UserCog, Check, LogOut, RotateCcw } from "lucide-react";
import { getCurrentUser } from "../services/userService";
import { defaultPreferences, getPreferences, savePreferences } from "../services/preferencesService";
import { genres, lengths, styles, audiences, languages, complexities } from "../data/stories";

const sections = [
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "language", label: "Language", icon: Globe },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "defaults", label: "Story Defaults", icon: Wand2 },
  { key: "privacy", label: "Privacy", icon: Shield },
  { key: "account", label: "Account", icon: UserCog },
];

const themes = [
  { id: "dark", name: "Studio", description: "Ink, slate, and aqua" },
  { id: "midnight", name: "Midnight", description: "Cool blue tones" },
  { id: "crimson", name: "Crimson", description: "Warm red tones" },
];

function SelectField({ label, value, options, onChange }) {
  return <label className="grid gap-2 text-sm text-ink-soft">{label}
    <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-ink focus:border-primary/60 focus:outline-none">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>;
}

function PreferenceRow({ title, description, checked, onChange, disabled = false }) {
  return <label className={`flex items-center justify-between gap-5 py-4 ${disabled ? "opacity-50" : "cursor-pointer"}`}>
    <span><span className="block text-sm font-medium text-ink">{title}</span><span className="mt-1 block text-xs text-ink-soft">{description}</span></span>
    <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} className="h-4 w-4 accent-primary" />
  </label>;
}

export default function Settings() {
  const navigate = useNavigate();
  const [active, setActive] = useState("appearance");
  const [preferences, setPreferences] = useState(getPreferences);
  const [user, setUser] = useState(null);
  const [accountError, setAccountError] = useState("");
  const [saved, setSaved] = useState(false);
  const notificationsAvailable = typeof window !== "undefined" && "Notification" in window;

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.appearance;
  }, [preferences.appearance]);

  useEffect(() => {
    getCurrentUser().then(setUser).catch((error) => setAccountError(error.message || "Could not load account details."));
  }, []);

  const changePreferences = (update) => {
    const next = typeof update === "function" ? update(preferences) : { ...preferences, ...update };
    setPreferences(next);
    savePreferences(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const setDefault = (key, value) => changePreferences((current) => ({
    ...current,
    storyDefaults: { ...current.storyDefaults, [key]: value },
  }));

  const setCompletionNotifications = async (enabled) => {
    if (enabled && notificationsAvailable && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;
    }
    changePreferences((current) => ({
      ...current,
      notifications: { ...current.notifications, storyCompleted: enabled },
    }));
  };

  const clearPreferences = () => {
    savePreferences(defaultPreferences);
    setPreferences(getPreferences());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const inputClass = "w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-ink focus:border-primary/60 focus:outline-none";
  const panelTitle = sections.find((section) => section.key === active)?.label;

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
      <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {sections.map((section) => <button key={section.key} type="button" onClick={() => setActive(section.key)} aria-current={active === section.key ? "page" : undefined}
          className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors ${active === section.key ? "border-border bg-card text-ink" : "border-transparent text-ink-soft hover:text-ink"}`}>
          <section.icon size={16} className={active === section.key ? "text-primary" : ""} />{section.label}
        </button>)}
      </nav>

      <section className="min-h-[430px] rounded-2xl border border-border bg-card p-6" aria-labelledby="settings-title">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><h2 id="settings-title" className="text-lg font-semibold text-ink">{panelTitle}</h2><p className="mt-1 text-sm text-ink-soft">Personalize how PlotForge works for you.</p></div>
          <span role="status" className="flex min-h-6 items-center gap-1 text-xs text-green-400">{saved && <><Check size={14} />Saved</>}</span>
        </div>

        {active === "appearance" && <div>
          <p className="mb-3 text-sm font-medium text-ink">Color theme</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {themes.map((theme) => <button key={theme.id} type="button" onClick={() => changePreferences({ ...preferences, appearance: theme.id })} aria-pressed={preferences.appearance === theme.id}
              className={`rounded-xl border p-4 text-left transition-colors ${preferences.appearance === theme.id ? "border-primary bg-primary/10" : "border-border bg-bg hover:border-primary/50"}`}>
              <span className={`mb-3 flex h-16 items-end rounded-lg p-2 ${theme.id === "midnight" ? "bg-[#101b2c]" : theme.id === "crimson" ? "bg-[#241111]" : "bg-[#1F2833]"}`}><span className="h-2 w-10 rounded-full bg-primary" /></span>
              <span className="block text-sm font-medium text-ink">{theme.name}</span><span className="mt-1 block text-xs text-ink-soft">{theme.description}</span>
            </button>)}
          </div>
        </div>}

        {active === "language" && <div className="max-w-sm space-y-4">
          <SelectField label="Default story language" value={preferences.language} options={languages} onChange={(value) => changePreferences({ ...preferences, language: value })} />
          <p className="text-xs leading-5 text-ink-soft">This language is preselected when you start a new story. You can still change it in the story builder.</p>
        </div>}

        {active === "notifications" && <div className="divide-y divide-border">
          <PreferenceRow title="Story finished generating" description={notificationsAvailable ? "Show a browser notification if generation finishes while you are away." : "This browser does not support desktop notifications."} checked={preferences.notifications.storyCompleted} disabled={!notificationsAvailable} onChange={(event) => setCompletionNotifications(event.target.checked)} />
          {notificationsAvailable && Notification.permission === "denied" && <p className="pt-3 text-xs text-amber-400">Notifications are blocked in your browser. Allow them in browser site settings to receive alerts.</p>}
        </div>}

        {active === "defaults" && <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Default genre" value={preferences.storyDefaults.genre} options={genres} onChange={(value) => setDefault("genre", value)} />
          <SelectField label="Story length" value={preferences.storyDefaults.length} options={lengths} onChange={(value) => setDefault("length", value)} />
          <SelectField label="Writing style" value={preferences.storyDefaults.style} options={styles} onChange={(value) => setDefault("style", value)} />
          <SelectField label="Audience" value={preferences.storyDefaults.audience} options={audiences} onChange={(value) => setDefault("audience", value)} />
          <SelectField label="Complexity" value={preferences.storyDefaults.complexity} options={complexities} onChange={(value) => setDefault("complexity", value)} />
          <label className="grid gap-2 text-sm text-ink-soft">Characters: {preferences.storyDefaults.characterCount}
            <input type="range" min="1" max="6" value={preferences.storyDefaults.characterCount} onChange={(event) => setDefault("characterCount", Number(event.target.value))} className="accent-primary" />
          </label>
          <label className="grid gap-2 text-sm text-ink-soft sm:col-span-2">Creativity: {preferences.storyDefaults.creativity}%
            <input type="range" min="0" max="100" value={preferences.storyDefaults.creativity} onChange={(event) => setDefault("creativity", Number(event.target.value))} className="accent-primary" />
          </label>
          <div className="sm:col-span-2 divide-y divide-border">
            <PreferenceRow title="Generate characters automatically" description="Let PlotForge invent the story's characters." checked={preferences.storyDefaults.autoCharacters} onChange={(event) => setDefault("autoCharacters", event.target.checked)} />
            <PreferenceRow title="Generate the world automatically" description="Let PlotForge build the setting from your prompt." checked={preferences.storyDefaults.autoWorld} onChange={(event) => setDefault("autoWorld", event.target.checked)} />
          </div>
        </div>}

        {active === "privacy" && <div className="space-y-5">
          <div className="rounded-xl border border-border bg-bg p-4"><h3 className="text-sm font-medium text-ink">Your preferences stay on this device</h3><p className="mt-1 text-sm leading-6 text-ink-soft">Theme, language, and story defaults are stored in this browser. Your account and stories are stored by PlotForge so they are available when you sign in.</p></div>
          <button type="button" onClick={clearPreferences} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-ink hover:border-primary/50"><RotateCcw size={15} />Reset preferences</button>
          <p className="text-xs text-ink-soft">To remove saved stories, open Story Library and delete them there.</p>
        </div>}

        {active === "account" && <div className="space-y-5">
          {accountError && <p role="alert" className="text-sm text-red-400">{accountError}</p>}
          {user ? <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-ink-soft">Full name<input readOnly value={user.fullName || ""} className={inputClass} /></label>
            <label className="grid gap-2 text-sm text-ink-soft">Username<input readOnly value={user.username || ""} className={inputClass} /></label>
            <label className="grid gap-2 text-sm text-ink-soft sm:col-span-2">Email<input readOnly value={user.email || ""} className={inputClass} /></label>
          </div> : !accountError && <p className="text-sm text-ink-soft">Loading account details...</p>}
          <div className="border-t border-border pt-5"><button type="button" onClick={signOut} className="flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10"><LogOut size={15} />Sign out</button></div>
        </div>}
      </section>
    </div>
  );
}
