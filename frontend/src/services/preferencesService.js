const STORAGE_KEY = "plotforge.preferences";

export const defaultPreferences = {
  appearance: "dark",
  language: "English",
  notifications: { storyCompleted: false },
  storyDefaults: {
    genre: "Fantasy",
    length: "Medium",
    style: "Cinematic",
    audience: "Adult",
    creativity: 65,
    complexity: "Moderate",
    characterCount: 2,
    autoCharacters: false,
    autoWorld: true,
  },
};

export function getPreferences() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      ...defaultPreferences,
      ...stored,
      notifications: { ...defaultPreferences.notifications, ...stored.notifications },
      storyDefaults: { ...defaultPreferences.storyDefaults, ...stored.storyDefaults },
    };
  } catch {
    return structuredClone(defaultPreferences);
  }
}

export function savePreferences(preferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  document.documentElement.dataset.theme = preferences.appearance || "dark";
}

export function applySavedAppearance() {
  document.documentElement.dataset.theme = getPreferences().appearance;
}
