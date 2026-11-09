import { useEffect, useState } from "react";
import { useAuth, useUser, UserButton } from "@clerk/react";
import { getCurrentEmployee, SessionError } from "../lib/api.js";
import Icon from "./Icon.jsx";

export default function SessionPanel({ text }) {
  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ state: "checking", attempt: -1 });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => {
      if (active) {
        setResult({ state: "failed", code: "offline", userId, attempt });
        active = false;
      }
      controller.abort();
    }, 15000);
    getCurrentEmployee({ getToken, userId, signal: controller.signal })
      .then(() => {
        if (active) setResult({ state: "connected", userId, attempt });
      })
      .catch(error => {
        if (active)
          setResult({
            state: "failed",
            code: error instanceof SessionError ? error.code : "offline",
            userId,
            attempt,
          });
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [getToken, userId, attempt]);

  const state =
    result.userId === userId && result.attempt === attempt
      ? result.state
      : "checking";
  const email = user?.primaryEmailAddress?.emailAddress;
  return (
    <section className="welcome-block">
      <p className="eyebrow">{text.account}</p>
      <h2>
        {text.welcomeBack},<br />
        <bdi>{user?.firstName || text.colleague}</bdi>.
      </h2>
      <p className="section-description">{text.signedInDescription}</p>
      <div className="identity-card">
        <div className="profile-button" aria-label={text.profile}>
          <UserButton />
        </div>
        <div>
          <span className="field-label">{text.email}</span>
          <span className="employee-email">
            <bdi>{email || text.noEmail}</bdi>
          </span>
        </div>
      </div>
      <div
        className={`connection-card ${state}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="connection-icon">
          {state === "checking" ? (
            <span className="spinner" />
          ) : (
            <Icon name={state === "connected" ? "check" : "alert"} />
          )}
        </span>
        <div>
          <h3>{text[state]}</h3>
          <p>
            {state === "failed"
              ? text[result.code]
              : text[`${state}Description`]}
          </p>
        </div>
      </div>
      <button
        className="secondary-button"
        type="button"
        disabled={state === "checking"}
        onClick={() => setAttempt(value => value + 1)}
      >
        <Icon name="refresh" />
        {state === "failed" ? text.retry : text.checkAgain}
      </button>
      <p className="help-text">{text.help}</p>
    </section>
  );
}
