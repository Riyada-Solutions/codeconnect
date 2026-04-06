import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { I18nManager } from "react-native";

type Language = "en" | "ar";
type Theme = "light" | "dark";

interface AppContextType {
  language: Language;
  theme: Theme;
  isDark: boolean;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  "profile.title": { en: "My Profile", ar: "\u0645\u0644\u0641\u064a \u0627\u0644\u0634\u062e\u0635\u064a" },
  "profile.editProfile": { en: "Edit Profile", ar: "\u062a\u0639\u062f\u064a\u0644 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a" },
  "profile.settings": { en: "Settings", ar: "\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a" },
  "profile.changePassword": { en: "Change Password", ar: "\u062a\u063a\u064a\u064a\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" },
  "profile.notifications": { en: "Notifications", ar: "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a" },
  "profile.about": { en: "About", ar: "\u062d\u0648\u0644" },
  "profile.terms": { en: "Terms & Conditions", ar: "\u0627\u0644\u0634\u0631\u0648\u0637 \u0648\u0627\u0644\u0623\u062d\u0643\u0627\u0645" },
  "profile.privacy": { en: "Privacy Policy", ar: "\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629" },
  "profile.helpSupport": { en: "Help & Support", ar: "\u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629 \u0648\u0627\u0644\u062f\u0639\u0645" },
  "profile.logout": { en: "Log out", ar: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c" },
  "settings.title": { en: "Settings", ar: "\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a" },
  "settings.appearance": { en: "Appearance", ar: "\u0627\u0644\u0645\u0638\u0647\u0631" },
  "settings.darkMode": { en: "Dark Mode", ar: "\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0645\u0638\u0644\u0645" },
  "settings.language": { en: "Language", ar: "\u0627\u0644\u0644\u063a\u0629" },
  "settings.english": { en: "English", ar: "\u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629" },
  "settings.arabic": { en: "Arabic", ar: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629" },
  "settings.notifications": { en: "Notifications", ar: "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a" },
  "settings.pushNotifications": { en: "Push Notifications", ar: "\u0625\u0634\u0639\u0627\u0631\u0627\u062a \u0627\u0644\u062f\u0641\u0639" },
  "settings.sound": { en: "Sound", ar: "\u0627\u0644\u0635\u0648\u062a" },
  "settings.vibration": { en: "Vibration", ar: "\u0627\u0644\u0627\u0647\u062a\u0632\u0627\u0632" },
  "settings.emergency": { en: "Emergency", ar: "\u0627\u0644\u0637\u0648\u0627\u0631\u0626" },
  "settings.autoResponse": { en: "Auto-Response", ar: "\u0627\u0644\u0631\u062f \u0627\u0644\u062a\u0644\u0642\u0627\u0626\u064a" },
  "help.title": { en: "Help & Support", ar: "\u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629 \u0648\u0627\u0644\u062f\u0639\u0645" },
  "help.contactUs": { en: "Contact Us", ar: "\u0627\u062a\u0635\u0644 \u0628\u0646\u0627" },
  "help.whatsapp": { en: "WhatsApp", ar: "\u0648\u0627\u062a\u0633\u0627\u0628" },
  "help.whatsappSub": { en: "Chat with us instantly", ar: "\u062a\u062d\u062f\u062b \u0645\u0639\u0646\u0627 \u0641\u0648\u0631\u0627\u064b" },
  "help.facebook": { en: "Facebook", ar: "\u0641\u064a\u0633\u0628\u0648\u0643" },
  "help.facebookSub": { en: "Follow us for updates", ar: "\u062a\u0627\u0628\u0639\u0646\u0627 \u0644\u0644\u062a\u062d\u062f\u064a\u062b\u0627\u062a" },
  "help.email": { en: "Email", ar: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a" },
  "help.sendMessage": { en: "Send Us a Message", ar: "\u0623\u0631\u0633\u0644 \u0644\u0646\u0627 \u0631\u0633\u0627\u0644\u0629" },
  "help.yourName": { en: "Your Name", ar: "\u0627\u0633\u0645\u0643" },
  "help.yourEmail": { en: "Your Email", ar: "\u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a" },
  "help.subject": { en: "Subject", ar: "\u0627\u0644\u0645\u0648\u0636\u0648\u0639" },
  "help.message": { en: "Message", ar: "\u0627\u0644\u0631\u0633\u0627\u0644\u0629" },
  "help.send": { en: "Send Message", ar: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629" },
  "help.namePlaceholder": { en: "Enter your name", ar: "\u0623\u062f\u062e\u0644 \u0627\u0633\u0645\u0643" },
  "help.emailPlaceholder": { en: "Enter your email", ar: "\u0623\u062f\u062e\u0644 \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a" },
  "help.subjectPlaceholder": { en: "What's this about?", ar: "\u0645\u0627 \u0647\u0648 \u0627\u0644\u0645\u0648\u0636\u0648\u0639\u061f" },
  "help.messagePlaceholder": { en: "Write your message here...", ar: "\u0627\u0643\u062a\u0628 \u0631\u0633\u0627\u0644\u062a\u0643 \u0647\u0646\u0627..." },
  "tabs.home": { en: "Home", ar: "\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629" },
  "tabs.alerts": { en: "Alerts", ar: "\u0627\u0644\u062a\u0646\u0628\u064a\u0647\u0627\u062a" },
  "tabs.profile": { en: "Profile", ar: "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a" },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    AsyncStorage.getItem("app_language").then((val) => {
      if (val === "ar" || val === "en") setLanguageState(val);
    });
    AsyncStorage.getItem("app_theme").then((val) => {
      if (val === "dark" || val === "light") setThemeState(val);
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem("app_language", lang);
    if (lang === "ar") {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    AsyncStorage.setItem("app_theme", t);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        theme,
        isDark: theme === "dark",
        setLanguage,
        setTheme,
        toggleTheme,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
