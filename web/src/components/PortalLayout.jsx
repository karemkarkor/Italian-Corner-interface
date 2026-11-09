import Icon from "./Icon.jsx";

export default function PortalLayout({
  language,
  onLanguageChange,
  text,
  children,
}) {
  return (
    <div className="portal">
      <a
        className="skip-link"
        href="#account"
        onClick={event => {
          event.preventDefault();
          document.getElementById("account")?.focus();
        }}
      >
        {text.skip}
      </a>
      <aside className="brand-panel" aria-labelledby="brand-heading">
        <div className="brand" dir="ltr">
          <span className="brand-mark" aria-hidden="true">
            ic<span>.</span>
          </span>
          <div>
            <span className="brand-name">italian corner</span>
            <span className="brand-caption">{text.workspace}</span>
          </div>
        </div>
        <div className="brand-story">
          <span className="eyebrow light">
            ITALIAN CORNER · {text.workspace}
          </span>
          <h1 id="brand-heading">{text.hero}</h1>
          <p>{text.intro}</p>
          <div className="parcel-art" aria-hidden="true">
            <svg viewBox="0 0 360 245" fill="none">
              <ellipse
                cx="177"
                cy="222"
                rx="135"
                ry="15"
                fill="#172e25"
                opacity=".3"
              />
              <path d="m58 108 111-49 128 54-115 53-124-58Z" fill="#d7c6a3" />
              <path d="m58 108 124 58v63L58 166v-58Z" fill="#bba47c" />
              <path d="m182 166 115-53v59l-115 57v-63Z" fill="#e6d8b8" />
              <path
                d="m118 81 122 57v61l-26 13v-61L91 93l27-12Z"
                fill="#7f926d"
              />
              <path d="m214 151 26-13v61l-26 13v-61Z" fill="#657e55" />
              <path d="m89 145 34 16v18l-34-17v-17Z" fill="#eee5d1" />
              <path
                d="m97 153 17 8m-17-3 12 6"
                stroke="#7e806d"
                strokeWidth="2"
              />
              <rect
                x="237"
                y="30"
                width="68"
                height="80"
                rx="5"
                fill="#f6f1e7"
                transform="rotate(12 237 30)"
              />
              <path
                d="m248 53 31 7m-33 4 23 5m-26 14 31 7"
                stroke="#b8b9a6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="283" cy="99" r="18" fill="#abc18e" />
              <path
                d="m275 99 5 5 10-11"
                stroke="#274232"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m63 47 2 12m-8-7 13 2M321 147l2 12m-8-7 13 2"
                stroke="#abc18e"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <div className="journey">
          <p className="journey-label">{text.workflow}</p>
          <ol>
            {[
              ["box", text.warehouse],
              ["truck", text.shipping],
              ["check", text.completion],
            ].map(([icon, label], index) => (
              <li key={icon}>
                <span className="journey-icon">
                  <Icon name={icon} />
                </span>
                <span>{label}</span>
                <span className="step-number" dir="ltr">
                  0{index + 1}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="brand-footer">
          <span className="tricolore" aria-hidden="true" />
          <span>{text.footer}</span>
        </div>
      </aside>
      <div className="account-panel">
        <header className="utility-bar">
          <span className="utility-label">
            <span className="little-dot" />
            {text.teamOnly}
          </span>
          <div
            className="language-switch"
            role="group"
            aria-label={text.language}
            dir="ltr"
          >
            <button
              type="button"
              lang="en"
              aria-pressed={language === "en"}
              onClick={() => onLanguageChange("en")}
            >
              English
            </button>
            <button
              type="button"
              lang="ar"
              aria-pressed={language === "ar"}
              onClick={() => onLanguageChange("ar")}
            >
              العربية
            </button>
          </div>
        </header>
        <main id="account" className="account-content" tabIndex="-1">
          {children}
        </main>
        <footer className="account-footer">
          <Icon name="lock" />
          <span>{text.private}</span>
          <span className="footer-brand" dir="ltr">
            italian corner
          </span>
        </footer>
      </div>
    </div>
  );
}
