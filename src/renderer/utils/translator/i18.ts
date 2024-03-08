import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fr from "./fr";
import en from "./eng";

const resources = {
  en: en,
  fr: fr
};
const language = localStorage.getItem("language");

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: language ? language : "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;