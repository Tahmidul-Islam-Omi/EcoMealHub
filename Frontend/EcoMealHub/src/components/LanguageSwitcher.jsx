import i18n from "../i18n.js";

export function LanguageDropdown() {
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      className="px-3 py-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 cursor-pointer"
      value={i18n.language}   // keep dropdown synced
    >
      <option value="en">🇬🇧 English</option>
      <option value="bn">🇧🇩 বাংলা</option>
      <option value="fr">🇫🇷 Français</option>
    </select>
  );
}
