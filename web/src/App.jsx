import { useEffect, useState } from "react";
import { ClerkProvider, SignIn, useAuth } from "@clerk/react";
import { arSA } from "@clerk/localizations/ar-SA";
import { enUS } from "@clerk/localizations/en-US";
import PortalLayout from "./components/PortalLayout.jsx";
import SessionPanel from "./components/SessionPanel.jsx";
import Icon from "./components/Icon.jsx";
import { applyLanguage, readLanguage, translations } from "./lib/language.js";
import "./App.css";

const arabicLocalization = {
  ...arSA,
  formFieldLabel__emailAddress: "البريد الإلكتروني",
  formFieldInputPlaceholder__emailAddress: "أدخل بريدك الإلكتروني",
  formFieldInputPlaceholder__password: "أدخل كلمة المرور",
  socialButtonsBlockButton: "المتابعة باستخدام {{provider|titleize}}",
};

const appearance = {
  variables: {
    colorPrimary: "#31543f",
    colorText: "#27382d",
    colorTextSecondary: "#667065",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    borderRadius: "0.75rem",
    fontFamily: "inherit",
  },
  elements: {
    rootBox: "clerk-root",
    cardBox: "clerk-card-box",
    card: "clerk-card",
    header: { display: "none" },
    footerAction: { display: "none" },
    formButtonPrimary: "clerk-submit",
  },
};

function LoadingSession({ text }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 12000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="loading-state">
      <span className="spinner" aria-hidden="true" />
      <p role="status">{slow ? text.takingLonger : text.loading}</p>
      {slow && (
        <button
          className="secondary-button"
          onClick={() => window.location.reload()}
        >
          {text.reload}
        </button>
      )}
    </div>
  );
}

function Account({ text }) {
  const { isLoaded, isSignedIn, sessionId } = useAuth();
  if (!isLoaded) return <LoadingSession text={text} />;
  if (isSignedIn) return <SessionPanel key={sessionId} text={text} />;
  return (
    <section className="welcome-block">
      <p className="eyebrow">{text.workspace}</p>
      <h2>{text.welcome}</h2>
      <p className="section-description">{text.signInDescription}</p>
      <div className="sign-in-form">
        <SignIn
          routing="hash"
          fallbackRedirectUrl="/"
          forceRedirectUrl="/"
          withSignUp={false}
          transferable={false}
        />
      </div>
      <p className="help-text">{text.help}</p>
    </section>
  );
}

export default function App({
  publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
}) {
  const [language, setLanguage] = useState(readLanguage);
  const text = translations[language];
  useEffect(() => applyLanguage(language), [language]);
  return (
    <PortalLayout
      language={language}
      onLanguageChange={setLanguage}
      text={text}
    >
      {publishableKey ? (
        <ClerkProvider
          publishableKey={publishableKey}
          localization={language === "ar" ? arabicLocalization : enUS}
          appearance={appearance}
          afterSignOutUrl="/"
        >
          <Account text={text} />
        </ClerkProvider>
      ) : (
        <section className="welcome-block unavailable-panel">
          <span className="unavailable-icon">
            <Icon name="lock" />
          </span>
          <h2>{text.unavailable}</h2>
          <p className="section-description">{text.unavailableDescription}</p>
        </section>
      )}
    </PortalLayout>
  );
}
