import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { I18nManager } from "react-native";

import { lightTheme, darkTheme, type ThemeColors } from "@/constants/theme";

type Language = "en" | "ar";
type Theme = "light" | "dark";

interface AppContextType {
  language: Language;
  theme: Theme;
  isDark: boolean;
  colors: ThemeColors;
  biometricLoginEnabled: boolean;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setBiometricLoginEnabled: (enabled: boolean) => void;
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
  "profile.deleteAccount": { en: "Delete Account", ar: "\u062d\u0630\u0641 \u0627\u0644\u062d\u0633\u0627\u0628" },
  "deleteAccount.title": { en: "Delete Account", ar: "\u062d\u0630\u0641 \u0627\u0644\u062d\u0633\u0627\u0628" },
  "deleteAccount.subtitle": { en: "This action cannot be undone", ar: "\u0644\u0627 \u064a\u0645\u0643\u0646 \u0627\u0644\u062a\u0631\u0627\u062c\u0639 \u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0625\u062c\u0631\u0627\u0621" },
  "deleteAccount.areYouSure": { en: "Are you sure?", ar: "\u0647\u0644 \u0623\u0646\u062a \u0645\u062a\u0623\u0643\u062f\u061f" },
  "deleteAccount.intro": {
    en: "Deleting your account will permanently remove all your data, including:",
    ar: "\u0633\u064a\u0624\u062f\u064a \u062d\u0630\u0641 \u062d\u0633\u0627\u0628\u0643 \u0625\u0644\u0649 \u0625\u0632\u0627\u0644\u0629 \u062c\u0645\u064a\u0639 \u0628\u064a\u0627\u0646\u0627\u062a\u0643 \u0628\u0634\u0643\u0644 \u062f\u0627\u0626\u0645\u060c \u0628\u0645\u0627 \u0641\u064a \u0630\u0644\u0643:",
  },
  "deleteAccount.itemAlertsTitle": { en: "All emergency alerts", ar: "\u062c\u0645\u064a\u0639 \u062a\u0646\u0628\u064a\u0647\u0627\u062a \u0627\u0644\u0637\u0648\u0627\u0631\u0626" },
  "deleteAccount.itemAlertsSub": { en: "Your alert history will be deleted.", ar: "\u0633\u064a\u062a\u0645 \u062d\u0630\u0641 \u0633\u062c\u0644 \u062a\u0646\u0628\u064a\u0647\u0627\u062a\u0643." },
  "deleteAccount.itemProfileTitle": { en: "Profile information", ar: "\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a" },
  "deleteAccount.itemProfileSub": { en: "Your personal details will be removed.", ar: "\u0633\u064a\u062a\u0645 \u0625\u0632\u0627\u0644\u0629 \u0628\u064a\u0627\u0646\u0627\u062a\u0643 \u0627\u0644\u0634\u062e\u0635\u064a\u0629." },
  "deleteAccount.itemAccessTitle": { en: "Access to system", ar: "\u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0646\u0638\u0627\u0645" },
  "deleteAccount.itemAccessSub": {
    en: "You'll lose access to CodeConnect.",
    ar: "\u0633\u062a\u0641\u0642\u062f \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 CodeConnect.",
  },
  "deleteAccount.noteBold": { en: "Note:", ar: "\u0645\u0644\u0627\u062d\u0638\u0629:" },
  "deleteAccount.noteBody": {
    en: "This action is permanent and cannot be reversed. Please make sure you want to proceed.",
    ar: "\u0647\u0630\u0627 \u0627\u0644\u0625\u062c\u0631\u0627\u0621 \u062f\u0627\u0626\u0645 \u0648\u0644\u0627 \u064a\u0645\u0643\u0646 \u0627\u0644\u062a\u0631\u0627\u062c\u0639 \u0639\u0646\u0647. \u062a\u0623\u0643\u062f \u0645\u0646 \u0631\u063a\u0628\u062a\u0643 \u0641\u064a \u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629.",
  },
  "deleteAccount.cancel": { en: "Cancel", ar: "\u0625\u0644\u063a\u0627\u0621" },
  "deleteAccount.continue": { en: "Continue", ar: "\u0645\u062a\u0627\u0628\u0639\u0629" },
  "deleteAccount.footerHelp": {
    en: "Need help? Contact support before deleting your account.",
    ar: "\u0628\u062d\u0627\u062c\u0629 \u0644\u0644\u0645\u0633\u0627\u0639\u062f\u0629\u061f \u0627\u062a\u0635\u0644 \u0628\u0627\u0644\u062f\u0639\u0645 \u0642\u0628\u0644 \u062d\u0630\u0641 \u062d\u0633\u0627\u0628\u0643.",
  },
  "deleteAccount.verifyTitle": { en: "Verify Your Identity", ar: "\u062a\u062d\u0642\u0642 \u0645\u0646 \u0647\u0648\u064a\u062a\u0643" },
  "deleteAccount.verifySubtitle": {
    en: "Please confirm your password and type DELETE to proceed",
    ar: "\u064a\u0631\u062c\u0649 \u062a\u0623\u0643\u064a\u062f \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0648\u0643\u062a\u0627\u0628\u0629 DELETE \u0644\u0644\u0645\u062a\u0627\u0628\u0639\u0629",
  },
  "deleteAccount.passwordLabel": { en: "Password", ar: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" },
  "deleteAccount.passwordPlaceholder": { en: "Enter your password", ar: "\u0623\u062f\u062e\u0644 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" },
  "deleteAccount.typeDeleteLabel": { en: "Type 'DELETE' to confirm", ar: "\u0627\u0643\u062a\u0628 DELETE \u0644\u0644\u062a\u0623\u0643\u064a\u062f" },
  "deleteAccount.typeDeletePlaceholder": { en: "Type DELETE", ar: "\u0627\u0643\u062a\u0628 DELETE" },
  "deleteAccount.finalWarningBold": { en: "Final Warning:", ar: "\u062a\u062d\u0630\u064a\u0631 \u0646\u0647\u0627\u0626\u064a:" },
  "deleteAccount.finalWarningBody": {
    en: "Once deleted, your account cannot be recovered.",
    ar: "\u0628\u0639\u062f \u0627\u0644\u062d\u0630\u0641\u060c \u0644\u0627 \u064a\u0645\u0643\u0646 \u0627\u0633\u062a\u0631\u062c\u0627\u0639 \u062d\u0633\u0627\u0628\u0643.",
  },
  "deleteAccount.back": { en: "Back", ar: "\u0631\u062c\u0648\u0639" },
  "deleteAccount.deleteButton": { en: "Delete Account", ar: "\u062d\u0630\u0641 \u0627\u0644\u062d\u0633\u0627\u0628" },
  "deleteAccount.fillFields": {
    en: "Enter your password and type DELETE to confirm.",
    ar: "\u0623\u062f\u062e\u0644 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0648\u0627\u0643\u062a\u0628 DELETE.",
  },
  "deleteAccount.typeDeleteMismatch": {
    en: "Type DELETE exactly to confirm.",
    ar: "\u0627\u0643\u062a\u0628 DELETE \u0628\u0627\u0644\u0636\u0628\u0637 \u0644\u0644\u062a\u0623\u0643\u064a\u062f.",
  },
  "deleteAccount.doneTitle": { en: "Account deleted", ar: "\u062a\u0645 \u062d\u0630\u0641 \u0627\u0644\u062d\u0633\u0627\u0628" },
  "deleteAccount.doneMessage": {
    en: "Your account has been removed. You can sign in again with a new registration if needed.",
    ar: "\u062a\u0645 \u0625\u0632\u0627\u0644\u0629 \u062d\u0633\u0627\u0628\u0643. \u064a\u0645\u0643\u0646\u0643 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0628\u062a\u0633\u062c\u064a\u0644 \u062c\u062f\u064a\u062f \u0625\u0630\u0627 \u0644\u0632\u0645 \u0627\u0644\u0623\u0645\u0631.",
  },
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
  "settings.security": { en: "Security", ar: "\u0627\u0644\u0623\u0645\u0627\u0646" },
  "settings.biometricLogin": { en: "Face ID", ar: "Face ID" },
  "settings.biometricLoginHint": {
    en: "Show Face ID or fingerprint sign-in on the login screen",
    ar: "\u0639\u0631\u0636 \u0632\u0631 Face ID \u0623\u0648 \u0628\u0635\u0645\u0629 \u0627\u0644\u0625\u0635\u0628\u0639 \u0641\u064a \u0634\u0627\u0634\u0629 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
  },
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
  "home.emergencyCodes": { en: "Emergency Codes", ar: "\u0631\u0645\u0648\u0632 \u0627\u0644\u0637\u0648\u0627\u0631\u0626" },
  "home.quickAccess": { en: "Quick access to create alerts", ar: "\u0648\u0635\u0648\u0644 \u0633\u0631\u064a\u0639 \u0644\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062a\u0646\u0628\u064a\u0647\u0627\u062a" },
  "home.activeRequests": { en: "Active Requests", ar: "\u0627\u0644\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0646\u0634\u0637\u0629" },
  "home.ongoingAlerts": { en: "ongoing alerts", ar: "\u062a\u0646\u0628\u064a\u0647\u0627\u062a \u062c\u0627\u0631\u064a\u0629" },
  "home.viewAll": { en: "View all", ar: "\u0639\u0631\u0636 \u0627\u0644\u0643\u0644" },
  "alerts.title": { en: "Active alerts", ar: "\u0627\u0644\u062a\u0646\u0628\u064a\u0647\u0627\u062a \u0627\u0644\u0646\u0634\u0637\u0629" },
  "alerts.all": { en: "All", ar: "\u0627\u0644\u0643\u0644" },
  "alerts.pending": { en: "Pending", ar: "\u0642\u064a\u062f \u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631" },
  "alerts.resolved": { en: "Resolved", ar: "\u062a\u0645 \u0627\u0644\u062d\u0644" },
  "alerts.noAlerts": { en: "No alerts found", ar: "\u0644\u0627 \u062a\u0648\u062c\u062f \u062a\u0646\u0628\u064a\u0647\u0627\u062a" },
  "alerts.responding": { en: "responding", ar: "\u064a\u0633\u062a\u062c\u064a\u0628" },
  "alertDetail.locationDetails": { en: "Location Details", ar: "\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0645\u0648\u0642\u0639" },
  "alertDetail.building": { en: "Building", ar: "\u0627\u0644\u0645\u0628\u0646\u0649" },
  "alertDetail.floor": { en: "Floor", ar: "\u0627\u0644\u0637\u0627\u0628\u0642" },
  "alertDetail.department": { en: "Department", ar: "\u0627\u0644\u0642\u0633\u0645" },
  "alertDetail.room": { en: "Room", ar: "\u0627\u0644\u063a\u0631\u0641\u0629" },
  "alertDetail.responders": { en: "Responders", ar: "\u0627\u0644\u0645\u0633\u062a\u062c\u064a\u0628\u0648\u0646" },
  "alertDetail.noResponders": { en: "No responders yet", ar: "\u0644\u0627 \u064a\u0648\u062c\u062f \u0645\u0633\u062a\u062c\u064a\u0628\u0648\u0646 \u0628\u0639\u062f" },
  "alertDetail.respond": { en: "Respond", ar: "\u0627\u0633\u062a\u062c\u0627\u0628\u0629" },
  "alertDetail.escalate": { en: "Escalate", ar: "\u062a\u0635\u0639\u064a\u062f" },
  "notifications.title": { en: "Notifications", ar: "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a" },
  "notifications.empty": { en: "No notifications", ar: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0625\u0634\u0639\u0627\u0631\u0627\u062a" },
  "emergency.title": { en: "New emergency request", ar: "\u0637\u0644\u0628 \u0637\u0648\u0627\u0631\u0626 \u062c\u062f\u064a\u062f" },
  "emergency.selectCode": { en: "SELECT CODE TYPE", ar: "\u0627\u062e\u062a\u0631 \u0646\u0648\u0639 \u0627\u0644\u0631\u0645\u0632" },
  "emergency.location": { en: "LOCATION", ar: "\u0627\u0644\u0645\u0648\u0642\u0639" },
  "emergency.selectBuilding": { en: "Select building", ar: "\u0627\u062e\u062a\u0631 \u0627\u0644\u0645\u0628\u0646\u0649" },
  "emergency.selectFloor": { en: "Select floor", ar: "\u0627\u062e\u062a\u0631 \u0627\u0644\u0637\u0627\u0628\u0642" },
  "emergency.selectDept": { en: "Select department", ar: "\u0627\u062e\u062a\u0631 \u0627\u0644\u0642\u0633\u0645" },
  "emergency.selectRoom": { en: "Select room", ar: "\u0627\u062e\u062a\u0631 \u0627\u0644\u063a\u0631\u0641\u0629" },
  "emergency.notes": { en: "Notes", ar: "\u0645\u0644\u0627\u062d\u0638\u0627\u062a" },
  "emergency.notesPlaceholder": { en: "Additional information", ar: "\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0625\u0636\u0627\u0641\u064a\u0629" },
  "emergency.activate": { en: "Activate alert", ar: "\u062a\u0641\u0639\u064a\u0644 \u0627\u0644\u062a\u0646\u0628\u064a\u0647" },
  "emergency.instruction": {
    en: "Select your location to alert the emergency response team.",
    ar: "\u062d\u062f\u062f \u0645\u0648\u0642\u0639\u0643 \u0644\u0625\u0631\u0633\u0627\u0644 \u062a\u0646\u0628\u064a\u0647 \u0625\u0644\u0649 \u0641\u0631\u064a\u0642 \u0627\u0644\u0627\u0633\u062a\u062c\u0627\u0628\u0629 \u0644\u0644\u0637\u0648\u0627\u0631\u0626.",
  },
  "emergency.sendAlert": {
    en: "Send Alert to Response Team",
    ar: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062a\u0646\u0628\u064a\u0647 \u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u0627\u0633\u062a\u062c\u0627\u0628\u0629",
  },
  "emergency.sendFooter": {
    en: "The assigned team will be notified immediately.",
    ar: "\u0633\u064a\u062a\u0645 \u0625\u0634\u0639\u0627\u0631 \u0627\u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u0645\u0639\u064a\u0646 \u0641\u0648\u0631\u064b\u0627.",
  },
  "emergency.roomNumber": { en: "Room number", ar: "\u0631\u0642\u0645 \u0627\u0644\u063a\u0631\u0641\u0629" },
  "emergency.roomPlaceholder": { en: "e.g., 305", ar: "\u0645\u062b\u0627\u0644\u064b\u0627\u060c 305" },
  "emergency.titleFallback": { en: "Emergency alert", ar: "\u062a\u0646\u0628\u064a\u0647 \u0637\u0648\u0627\u0631\u0626" },
  "emergency.pickCodeHint": {
    en: "Choose an alert type below",
    ar: "\u0627\u062e\u062a\u0631 \u0646\u0648\u0639 \u0627\u0644\u062a\u0646\u0628\u064a\u0647 \u0623\u062f\u0646\u0627\u0647",
  },
  "editProfile.title": { en: "Edit Profile", ar: "\u062a\u0639\u062f\u064a\u0644 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a" },
  "editProfile.fullName": { en: "Full Name", ar: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644" },
  "editProfile.email": { en: "Email", ar: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a" },
  "editProfile.phone": { en: "Phone", ar: "\u0627\u0644\u0647\u0627\u062a\u0641" },
  "editProfile.department": { en: "Department", ar: "\u0627\u0644\u0642\u0633\u0645" },
  "editProfile.role": { en: "Role", ar: "\u0627\u0644\u062f\u0648\u0631" },
  "editProfile.employeeId": { en: "Employee ID", ar: "\u0631\u0642\u0645 \u0627\u0644\u0645\u0648\u0638\u0641" },
  "editProfile.changePhoto": { en: "Change photo", ar: "\u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u0635\u0648\u0631\u0629" },
  "privacy.title": { en: "Privacy Policy", ar: "\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629" },
  "terms.title": { en: "Terms of Service", ar: "\u0634\u0631\u0648\u0637 \u0627\u0644\u062e\u062f\u0645\u0629" },
  "about.title": { en: "About", ar: "\u062d\u0648\u0644" },
  "about.features": { en: "Features", ar: "\u0627\u0644\u0645\u064a\u0632\u0627\u062a" },
  "about.legal": { en: "Legal", ar: "\u0642\u0627\u0646\u0648\u0646\u064a" },
  "changePassword.title": { en: "Change Password", ar: "\u062a\u063a\u064a\u064a\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" },
  "changePassword.current": { en: "Current Password", ar: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062d\u0627\u0644\u064a\u0629" },
  "changePassword.new": { en: "New Password", ar: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062c\u062f\u064a\u062f\u0629" },
  "changePassword.confirm": { en: "Confirm New Password", ar: "\u062a\u0623\u0643\u064a\u062f \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" },
  "changePassword.update": { en: "Update Password", ar: "\u062a\u062d\u062f\u064a\u062b \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" },
  "incoming.incomingAlert": { en: "Incoming Emergency Alert", ar: "\u062a\u0646\u0628\u064a\u0647 \u0637\u0648\u0627\u0631\u0626 \u0648\u0627\u0631\u062f" },
  "incoming.timeElapsed": { en: "Time Elapsed", ar: "\u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0645\u0646\u0642\u0636\u064a" },
  "incoming.locationDetails": { en: "LOCATION DETAILS", ar: "\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0645\u0648\u0642\u0639" },
  "incoming.floorRoom": { en: "Floor & Room", ar: "\u0627\u0644\u0637\u0627\u0628\u0642 \u0648\u0627\u0644\u063a\u0631\u0641\u0629" },
  "incoming.reject": { en: "Reject", ar: "\u0631\u0641\u0636" },
  "incoming.accept": { en: "Accept", ar: "\u0642\u0628\u0648\u0644" },
  "incoming.quickResponse": { en: "Quick response saves lives", ar: "\u0627\u0644\u0627\u0633\u062a\u062c\u0627\u0628\u0629 \u0627\u0644\u0633\u0631\u064a\u0639\u0629 \u062a\u0646\u0642\u0630 \u0627\u0644\u0623\u0631\u0648\u0627\u062d" },
  "incoming.pleaseRespond": { en: "Please respond to this emergency alert", ar: "\u064a\u0631\u062c\u0649 \u0627\u0644\u0627\u0633\u062a\u062c\u0627\u0628\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u062a\u0646\u0628\u064a\u0647 \u0627\u0644\u0637\u0627\u0631\u0626" },

  "login.welcome": { en: "Welcome back", ar: "\u0645\u0631\u062d\u0628\u064b\u0627 \u0628\u0639\u0648\u062f\u062a\u0643" },
  "login.signInSubtitle": { en: "Sign in to your account to continue", ar: "\u0633\u062c\u0651\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0625\u0644\u0649 \u062d\u0633\u0627\u0628\u0643 \u0644\u0644\u0645\u062a\u0627\u0628\u0639\u0629" },
  "login.platformSubtitle": { en: "Emdad Arabia Healthcare Platform", ar: "\u0645\u0646\u0635\u0629 \u0625\u0645\u062f\u0627\u062f \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0644\u0644\u0631\u0639\u0627\u064a\u0629 \u0627\u0644\u0635\u062d\u064a\u0629" },
  "login.username": { en: "Username", ar: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645" },
  "login.enterUsername": { en: "Enter your username", ar: "\u0623\u062f\u062e\u0644 \u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645" },
  "login.password": { en: "Password", ar: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" },
  "login.enterPassword": { en: "Enter your password", ar: "\u0623\u062f\u062e\u0644 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" },
  "login.usernameRequired": { en: "Username is required", ar: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645 \u0645\u0637\u0644\u0648\u0628" },
  "login.passwordRequired": { en: "Password is required", ar: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0645\u0637\u0644\u0648\u0628\u0629" },
  "login.forgotPassword": { en: "Forgot Password?", ar: "\u0646\u0633\u064a\u062a \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631\u061f" },
  "login.signIn": { en: "Sign In", ar: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644" },
  "login.signingIn": { en: "Signing in...", ar: "\u062c\u0627\u0631\u064d \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644..." },
  "login.dontHaveAccount": { en: "Don't have an account?", ar: "\u0644\u064a\u0633 \u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628\u061f" },
  "login.createAccount": { en: "Create Account", ar: "\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628" },
  "login.secureData": { en: "Secure healthcare data management", ar: "\u0625\u062f\u0627\u0631\u0629 \u0628\u064a\u0627\u0646\u0627\u062a \u0635\u062d\u064a\u0629 \u0622\u0645\u0646\u0629" },
  "login.continueAsGuest": { en: "Continue as Guest", ar: "\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0643\u0636\u064a\u0641" },
  "login.biometricUnavailableTitle": { en: "Biometrics unavailable", ar: "\u0627\u0644\u0642\u064a\u0627\u0633 \u0627\u0644\u062d\u064a\u0648\u064a \u063a\u064a\u0631 \u0645\u062a\u0627\u062d" },
  "login.biometricUnavailableMessage": {
    en: "Add Face ID or fingerprint in your device settings, then try again.",
    ar: "\u0623\u0636\u0641 Face ID \u0623\u0648 \u0628\u0635\u0645\u0629 \u0627\u0644\u0625\u0635\u0628\u0639 \u0641\u064a \u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u062c\u0647\u0627\u0632\u060c \u062b\u0645 \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.",
  },

  "register.createAccount": { en: "Create Your Account", ar: "\u0623\u0646\u0634\u0626 \u062d\u0633\u0627\u0628\u0643" },
  "register.desc": { en: "Join the emergency response network", ar: "\u0627\u0646\u0636\u0645 \u0625\u0644\u0649 \u0634\u0628\u0643\u0629 \u0627\u0644\u0627\u0633\u062a\u062c\u0627\u0628\u0629 \u0644\u0644\u0637\u0648\u0627\u0631\u0626" },
  "register.joinCodeConnect": { en: "JOIN CODECONNECT", ar: "\u0627\u0646\u0636\u0645 \u0625\u0644\u0649 \u0643\u0648\u062f \u0643\u0648\u0646\u0643\u062a" },
  "register.registerCode": { en: "Registration Code", ar: "\u0631\u0645\u0632 \u0627\u0644\u062a\u0633\u062c\u064a\u0644" },
  "register.phone": { en: "Phone Number", ar: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641" },
  "register.fullName": { en: "Full Name", ar: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644" },
  "register.emailAddress": { en: "Email Address", ar: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a" },
  "register.mainBranch": { en: "Main Branch", ar: "\u0627\u0644\u0641\u0631\u0639 \u0627\u0644\u0631\u0626\u064a\u0633\u064a" },
  "register.register": { en: "Register", ar: "\u062a\u0633\u062c\u064a\u0644" },
  "register.loading": { en: "Loading...", ar: "\u062c\u0627\u0631\u064d \u0627\u0644\u062a\u062d\u0645\u064a\u0644..." },
  "register.alreadyHaveAccount": { en: "Already have an account?", ar: "\u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628 \u0628\u0627\u0644\u0641\u0639\u0644\u061f" },

  "forgot.title": { en: "Forgot Password", ar: "\u0646\u0633\u064a\u062a \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" },
  "forgot.desc": { en: "Reset your account password", ar: "\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" },
  "forgot.resetPassword": { en: "Reset Password", ar: "\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" },
  "forgot.resetDesc": { en: "Enter your registered email address and we'll send you a verification code to reset your password.", ar: "\u0623\u062f\u062e\u0644 \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0627\u0644\u0645\u0633\u062c\u0644 \u0648\u0633\u0646\u0631\u0633\u0644 \u0644\u0643 \u0631\u0645\u0632 \u0627\u0644\u062a\u062d\u0642\u0642 \u0644\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631." },
  "forgot.emailPlaceholder": { en: "Enter your email address", ar: "\u0623\u062f\u062e\u0644 \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a" },
  "forgot.sendResetLink": { en: "Send Reset Code", ar: "\u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u062a\u0639\u064a\u064a\u0646" },
  "forgot.backToLogin": { en: "Back to Sign In", ar: "\u0627\u0644\u0639\u0648\u062f\u0629 \u0644\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644" },

  "otp.title": { en: "OTP Verification", ar: "\u0627\u0644\u062a\u062d\u0642\u0642 \u0628\u0631\u0645\u0632 OTP" },
  "otp.enterFourDigit": { en: "Enter the 4-digit code", ar: "\u0623\u062f\u062e\u0644 \u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u0645\u0643\u0648\u0646 \u0645\u0646 4 \u0623\u0631\u0642\u0627\u0645" },
  "otp.verifyCode": { en: "Verify Code", ar: "\u0627\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u0631\u0645\u0632" },
  "otp.verifyCodeDesc": { en: "We've sent a 4-digit verification code to your email. Please enter it below.", ar: "\u0644\u0642\u062f \u0623\u0631\u0633\u0644\u0646\u0627 \u0631\u0645\u0632 \u062a\u062d\u0642\u0642 \u0645\u0643\u0648\u0646\u064b\u0627 \u0645\u0646 4 \u0623\u0631\u0642\u0627\u0645 \u0625\u0644\u0649 \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a. \u0623\u062f\u062e\u0644\u0647 \u0623\u062f\u0646\u0627\u0647." },
  "otp.verifyAndContinue": { en: "Verify & Continue", ar: "\u0627\u0644\u062a\u062d\u0642\u0642 \u0648\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629" },
  "otp.resendCode": { en: "Resend Code", ar: "\u0625\u0639\u0627\u062f\u0629 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0645\u0632" },
  "otp.backToPrevious": { en: "Go Back", ar: "\u0627\u0644\u0639\u0648\u062f\u0629" },

  "verifyOtp.title": { en: "Verify Identity", ar: "\u0627\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u0647\u0648\u064a\u0629" },
  "verifyOtp.subtitle": { en: "One last step before you're in", ar: "\u062e\u0637\u0648\u0629 \u0623\u062e\u064a\u0631\u0629 \u0642\u0628\u0644 \u0627\u0644\u062f\u062e\u0648\u0644" },
  "verifyOtp.verifyIdentity": { en: "Verify your identity", ar: "\u062a\u062d\u0642\u0642 \u0645\u0646 \u0647\u0648\u064a\u062a\u0643" },
  "verifyOtp.enterCode": { en: "Enter the 4-digit code sent to your registered email", ar: "\u0623\u062f\u062e\u0644 \u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u0645\u0643\u0648\u0646 \u0645\u0646 4 \u0623\u0631\u0642\u0627\u0645 \u0627\u0644\u0645\u0631\u0633\u0644 \u0625\u0644\u0649 \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a" },
  "verifyOtp.verify": { en: "Verify", ar: "\u062a\u062d\u0642\u0642" },
  "verifyOtp.didntReceive": { en: "Didn't receive the code?", ar: "\u0644\u0645 \u062a\u0633\u062a\u0644\u0645 \u0627\u0644\u0631\u0645\u0632\u061f" },
  "verifyOtp.resendIn": { en: "Resend in", ar: "\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u0628\u0639\u062f" },
  "verifyOtp.resendCode": { en: "Resend code", ar: "\u0625\u0639\u0627\u062f\u0629 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0645\u0632" },

  "newPass.title": { en: "Set New Password", ar: "\u062a\u0639\u064a\u064a\u0646 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u062c\u062f\u064a\u062f\u0629" },
  "newPass.subtitle": { en: "Create a strong password", ar: "\u0623\u0646\u0634\u0626 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u0642\u0648\u064a\u0629" },
  "newPass.setNewPassword": { en: "Set New Password", ar: "\u062a\u0639\u064a\u064a\u0646 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u062c\u062f\u064a\u062f\u0629" },
  "newPass.setNewDesc": { en: "Choose a strong password with at least 8 characters to protect your account.", ar: "\u0627\u062e\u062a\u0631 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u0642\u0648\u064a\u0629 \u062a\u062a\u0643\u0648\u0646 \u0645\u0646 8 \u0623\u062d\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 \u0644\u062d\u0645\u0627\u064a\u0629 \u062d\u0633\u0627\u0628\u0643." },
  "newPass.newPassword": { en: "New Password", ar: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062c\u062f\u064a\u062f\u0629" },
  "newPass.confirmPassword": { en: "Confirm Password", ar: "\u062a\u0623\u0643\u064a\u062f \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" },
  "newPass.enterNew": { en: "Enter new password", ar: "\u0623\u062f\u062e\u0644 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062c\u062f\u064a\u062f\u0629" },
  "newPass.enterConfirm": { en: "Confirm your password", ar: "\u0623\u0643\u062f \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" },
  "newPass.minLength": { en: "Password must be at least 8 characters", ar: "\u064a\u062c\u0628 \u0623\u0646 \u062a\u062a\u0643\u0648\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0645\u0646 8 \u0623\u062d\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644" },
  "newPass.mismatch": { en: "Passwords do not match", ar: "\u0643\u0644\u0645\u0627\u062a \u0627\u0644\u0645\u0631\u0648\u0631 \u063a\u064a\u0631 \u0645\u062a\u0637\u0627\u0628\u0642\u0629" },
  "newPass.updatePassword": { en: "Update Password", ar: "\u062a\u062d\u062f\u064a\u062b \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" },
  "newPass.updated": { en: "Password Updated!", ar: "\u062a\u0645 \u062a\u062d\u062f\u064a\u062b \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631!" },
  "newPass.updatedDesc": { en: "Your password has been updated successfully. You can now sign in with your new password.", ar: "\u062a\u0645 \u062a\u062d\u062f\u064a\u062b \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0628\u0646\u062c\u0627\u062d. \u064a\u0645\u0643\u0646\u0643 \u0627\u0644\u0622\u0646 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0628\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062c\u062f\u064a\u062f\u0629." },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("light");
  const [biometricLoginEnabled, setBiometricLoginState] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("app_language").then((val) => {
      if (val === "ar" || val === "en") setLanguageState(val);
    });
    AsyncStorage.getItem("app_theme").then((val) => {
      if (val === "dark" || val === "light") setThemeState(val);
    });
    AsyncStorage.getItem("app_biometric_login").then((val) => {
      if (val === "1") setBiometricLoginState(true);
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

  const setBiometricLoginEnabled = (enabled: boolean) => {
    setBiometricLoginState(enabled);
    AsyncStorage.setItem("app_biometric_login", enabled ? "1" : "0");
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const colors = theme === "dark" ? darkTheme : lightTheme;

  return (
    <AppContext.Provider
      value={{
        language,
        theme,
        isDark: theme === "dark",
        colors,
        biometricLoginEnabled,
        setLanguage,
        setTheme,
        setBiometricLoginEnabled,
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
