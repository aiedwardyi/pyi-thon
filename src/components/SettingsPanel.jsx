import { useEffect, useRef } from "react";
import { AI_PROVIDERS } from "../data/appConfig";
import { MONO_FONT, mix } from "../theme/themes";
import { primaryButton } from "./parts";

function toggleStyle(active, C) {
  return {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    cursor: "pointer",
    border: "none",
    background: active ? C.accentLine : C.line,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
  };
}

function chipStyle(active, C) {
  return {
    padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
    border: `1px solid ${active ? C.accentLine : C.line}`, background: active ? mix(C.accent, 16) : "transparent", color: active ? C.text : C.muted,
  };
}

export default function SettingsPanel({
  apiKey,
  apiKeyInput,
  C,
  handleSaveApiKey,
  lang,
  offlineMode,
  provider,
  pyodideStatus,
  setApiKeyInput,
  setLang,
  setOfflineMode,
  setProvider,
  setShowApiSetup,
  setThemeKey,
  t,
  themeKey,
}) {
  const closeButtonRef = useRef(null);
  const providerConfig = AI_PROVIDERS[provider] || AI_PROVIDERS.claude;
  const closeSettings = () => setShowApiSetup(false);
  const rowStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.line}` };
  const labelStyle = { color: C.text, fontSize: 14, fontWeight: 600, margin: 0 };
  const descStyle = { color: C.muted, fontSize: 12, margin: "2px 0 0" };

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setShowApiSetup(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [setShowApiSetup]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}>
      <div data-testid="settings-backdrop" onClick={closeSettings} style={{ position: "fixed", inset: 0, background: C.scrim, zIndex: 0 }} />
      <div
        className="ui-rise"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        style={{
          maxWidth: 440, width: "100%", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: 24,
          boxShadow: C.shadow, position: "relative", zIndex: 1, maxHeight: "calc(100vh - 32px)", overflowY: "auto",
        }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 id="settings-title" style={{ color: C.text, fontSize: 20, fontWeight: 700, margin: 0 }}>{t("settings")}</h2>
          <button ref={closeButtonRef} type="button" className="ui-btn" aria-label={t("closeSettings")} data-testid="close-settings" onClick={closeSettings} style={{ color: C.muted, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div style={rowStyle}>
          <p id="theme-switch-label" style={labelStyle}>{t("switchAppearance")}</p>
          <div role="radiogroup" aria-labelledby="theme-switch-label" style={{ display: "flex", gap: 4 }}>
            {[["dark", t("darkMode")], ["light", t("lightMode")]].map(([key, label]) => (
              <button key={key} type="button" className="ui-btn" role="radio" aria-checked={themeKey === key} data-testid={`theme-${key}`} onClick={() => setThemeKey(key)} style={chipStyle(themeKey === key, C)}>{label}</button>
            ))}
          </div>
        </div>

        <div style={rowStyle}>
          <div>
            <p id="language-label" style={labelStyle}>{t("language")}</p>
            <p id="language-desc" style={descStyle}>{t("langDesc")}</p>
          </div>
          <div role="group" aria-labelledby="language-label" aria-describedby="language-desc" style={{ display: "flex", gap: 4 }}>
            {[["en", "EN"], ["ko", "한국어"]].map(([code, label]) => (
              <button key={code} type="button" className="ui-btn" aria-pressed={lang === code} data-testid={`lang-${code}`} onClick={() => setLang(code)} style={chipStyle(lang === code, C)}>{label}</button>
            ))}
          </div>
        </div>

        <div style={rowStyle}>
          <div>
            <p id="offline-mode-label" style={labelStyle}>{t("offlineMode")}</p>
            <p id="offline-mode-desc" style={descStyle}>{offlineMode ? `${t("offlineDesc")}${pyodideStatus === "loading" ? ` (${t("loading")})` : pyodideStatus === "ready" ? ` (${t("ready")})` : ""}` : t("onlineDesc")}</p>
          </div>
          <button type="button" className="ui-btn" role="switch" aria-checked={offlineMode} aria-labelledby="offline-mode-label" aria-describedby="offline-mode-desc" onClick={() => setOfflineMode(!offlineMode)} style={toggleStyle(offlineMode, C)}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transform: offlineMode ? "translateX(20px)" : "translateX(0)", transition: "transform 160ms ease" }} />
          </button>
        </div>

        {!offlineMode && (
          <div style={{ ...rowStyle, flexWrap: "wrap", gap: 8 }}>
            <div>
              <p id="provider-label" style={labelStyle}>{t("provider")}</p>
              <p id="provider-desc" style={descStyle}>{t("providerDesc")}</p>
            </div>
            <div role="group" aria-labelledby="provider-label" aria-describedby="provider-desc" style={{ display: "flex", gap: 4 }}>
              {Object.entries(AI_PROVIDERS).map(([key, prov]) => (
                <button key={key} type="button" className="ui-btn" aria-pressed={provider === key} onClick={() => setProvider(key)} style={chipStyle(provider === key, C)}>{prov.name}</button>
              ))}
            </div>
          </div>
        )}

        {!offlineMode && (
          <div style={{ paddingTop: 16 }}>
            <p id="api-key-label" style={{ ...labelStyle, margin: "0 0 4px" }}>{t("apiKey")}</p>
            <p id="api-key-desc" style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, margin: "0 0 12px" }}>
              {t("apiKeyDesc")} <span style={{ color: C.accentLine }}>{providerConfig.keyUrl}</span>
            </p>
            <p style={{ color: C.muted, fontSize: 11, lineHeight: 1.6, margin: "0 0 12px" }}>
              {t("apiKeyPrivacy")}
            </p>
            <input type="password" aria-labelledby="api-key-label" aria-describedby="api-key-desc" value={apiKeyInput} onChange={(event) => setApiKeyInput(event.target.value)} placeholder={apiKey ? "••••••••" : providerConfig.keyPlaceholder}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 10, background: C.well,
                border: `1px solid ${C.line}`, color: C.text, fontSize: 16, outline: "none",
                fontFamily: MONO_FONT, marginBottom: 12, transition: "border-color 0.2s",
              }}
              onFocus={(event) => { event.target.style.borderColor = C.accentLine; }}
              onBlur={(event) => { event.target.style.borderColor = C.line; }}
              onKeyDown={(event) => event.key === "Enter" && handleSaveApiKey()}
            />
            <button type="button" className="ui-btn" onClick={handleSaveApiKey} style={primaryButton(C, { width: "100%", fontSize: 14 })}>{t("saveKey")}</button>
          </div>
        )}
      </div>
    </div>
  );
}
