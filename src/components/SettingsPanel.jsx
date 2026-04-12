import { AI_PROVIDERS } from "../data/appConfig";
import { THEMES, getGlobalStyles } from "../theme/themes";

function toggleStyle(active, C, darkMode) {
  return {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    cursor: "pointer",
    border: "none",
    background: active ? C.accent : (darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"),
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: active ? "flex-end" : "flex-start",
  };
}

export default function SettingsPanel({
  apiKey,
  apiKeyInput,
  C,
  darkMode,
  handleSaveApiKey,
  lang,
  monoFont,
  offlineMode,
  pageStyle,
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
  return (
    <div style={{ ...pageStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, position: "relative" }}>
      <div data-testid="settings-backdrop" onClick={() => setShowApiSetup(false)} style={{ position: "fixed", inset: 0, background: darkMode ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)", backdropFilter: "blur(8px)", zIndex: 0 }} />
      <div style={{
        maxWidth: 440, width: "100%", background: C.bgGlass, backdropFilter: "blur(24px)",
        border: `1px solid ${C.border}`, borderRadius: 20, padding: 32,
        boxShadow: `0 24px 64px rgba(0,0,0,${darkMode ? "0.5" : "0.15"})`,
        position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>{t("settings")}</h2>
          <button aria-label="Close settings" data-testid="close-settings" onClick={() => setShowApiSetup(false)} style={{ color: C.textDim, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
          <p id="theme-switch-label" style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0 }}>{t("switchAppearance")}</p>
          <div role="radiogroup" aria-labelledby="theme-switch-label" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(68px, 1fr))", gap: 6, marginTop: 10 }}>
            {Object.entries(THEMES).map(([key, { label, labelKo, colors }]) => (
              <button key={key} role="radio" aria-checked={themeKey === key} onClick={() => setThemeKey(key)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                padding: "6px 4px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                border: themeKey === key ? `2px solid ${C.accent}` : `2px solid ${C.border}`,
                background: themeKey === key ? C.accentBg : "transparent",
                transition: "all 0.2s",
              }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {colors.map((color, index) => (
                    <div key={index} style={{ width: 12, height: 12, borderRadius: "50%", background: color, border: "1px solid rgba(255,255,255,0.1)" }} />
                  ))}
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, color: themeKey === key ? C.accentText : C.textDim, whiteSpace: "nowrap" }}>
                  {lang === "ko" ? labelKo : label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
          <div>
            <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0 }}>{t("language")}</p>
            <p style={{ color: C.textDim, fontSize: 12, margin: "2px 0 0" }}>{t("langDesc")}</p>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[["en", "EN"], ["ko", "한국어"]].map(([code, label]) => (
              <button key={code} data-testid={`lang-${code}`} onClick={() => setLang(code)} style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                border: `1px solid ${lang === code ? C.accentBorder : C.border}`,
                background: lang === code ? C.accentBg : "transparent",
                color: lang === code ? C.accentText : C.textDim,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
          <div>
            <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0 }}>{t("offlineMode")}</p>
            <p style={{ color: C.textDim, fontSize: 12, margin: "2px 0 0" }}>{offlineMode ? `${t("offlineDesc")}${pyodideStatus === "loading" ? ` (${t("loading")})` : pyodideStatus === "ready" ? ` (${t("ready")})` : ""}` : t("onlineDesc")}</p>
          </div>
          <button onClick={() => setOfflineMode(!offlineMode)} style={toggleStyle(offlineMode, C, darkMode)}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </button>
        </div>

        {!offlineMode && (
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "space-between", gap: 8, padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
            <div>
              <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0 }}>{t("provider")}</p>
              <p style={{ color: C.textDim, fontSize: 12, margin: "2px 0 0" }}>{t("providerDesc")}</p>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {Object.entries(AI_PROVIDERS).map(([key, prov]) => (
                <button key={key} onClick={() => setProvider(key)} style={{
                  padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  border: `1px solid ${provider === key ? C.accentBorder : C.border}`,
                  background: provider === key ? C.accentBg : "transparent",
                  color: provider === key ? C.accentText : C.textDim,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                }}>{prov.name}</button>
              ))}
            </div>
          </div>
        )}

        {!offlineMode && (
          <div style={{ paddingTop: 16 }}>
            <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>{t("apiKey")}</p>
            <p style={{ color: C.textDim, fontSize: 12, lineHeight: 1.6, margin: "0 0 12px" }}>
              {t("apiKeyDesc")} <span style={{ color: C.accent }}>{AI_PROVIDERS[provider].keyUrl}</span>
            </p>
            <p style={{ color: C.textDim, fontSize: 11, lineHeight: 1.6, margin: "0 0 12px" }}>
              {t("apiKeyPrivacy")}
            </p>
            <input type="password" value={apiKeyInput} onChange={(event) => setApiKeyInput(event.target.value)} placeholder={apiKey ? "••••••••" : AI_PROVIDERS[provider].keyPlaceholder}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12, background: C.codeBg,
                border: `1px solid ${C.border}`, color: C.text, fontSize: 13, outline: "none",
                fontFamily: monoFont, marginBottom: 12, transition: "border-color 0.2s",
              }}
              onFocus={(event) => { event.target.style.borderColor = C.borderFocus; }}
              onBlur={(event) => { event.target.style.borderColor = C.border; }}
              onKeyDown={(event) => event.key === "Enter" && handleSaveApiKey()}
            />
            <button onClick={handleSaveApiKey} style={{
              width: "100%", padding: "12px 0", borderRadius: 12,
              background: `linear-gradient(135deg, ${C.accentDeep}, ${C.accent})`,
              color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit",
              fontSize: 13, fontWeight: 700, transition: "all 0.2s",
              boxShadow: `0 4px 16px ${C.accentGlow}`,
            }}>{t("saveKey")}</button>
          </div>
        )}
      </div>
      <style>{getGlobalStyles(C)}</style>
    </div>
  );
}
