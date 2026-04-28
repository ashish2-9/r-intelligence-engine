import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SignupPage({ onLogin }) {
  const [form, setForm] = useState({
    fullName: "", username: "", email: "",
    password: "", confirmPassword: "",
    currentAddress: "", permanentAddress: "",
    sameAsCurrent: false, agreed: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = (p) => {
    if (!p) return { label: "", width: "0%", color: "#e2e8f0" };
    if (p.length < 6) return { label: "WEAK", width: "33%", color: "#ef4444" };
    if (p.length < 10) return { label: "MEDIUM", width: "66%", color: "#f59e0b" };
    return { label: "STRONG", width: "100%", color: "#22c55e" };
  };
  const strength = passwordStrength(form.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => {
      const next = { ...prev, [name]: val };
      if (name === "sameAsCurrent" && checked) next.permanentAddress = prev.currentAddress;
      if (name === "currentAddress" && prev.sameAsCurrent) next.permanentAddress = value;
      return next;
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.username || !form.email || !form.password) {
      setError("Please fill in all required fields."); return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    if (!form.agreed) {
      setError("Please agree to the Terms & Conditions."); return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    onLogin?.();
    navigate("/analyze");
    setLoading(false);
  };

  return (
    <div style={styles.root}>
      {/* Left Panel */}
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.logo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={styles.logoText}>Circula</span>
          </div>
          <div style={styles.leftBody}>
            <h2 style={styles.tagline}>Intelligence<br /><em style={{ color: "#7dd98a" }}>Reimagined.</em></h2>
            <p style={styles.leftSub}>Join us in making smarter sustainable decisions for a thriving ecosystem. Every choice counts towards a greener tomorrow.</p>
          </div>
          <div style={styles.badge}>
            <div style={styles.badgeDot} />
            <div>
              <p style={styles.badgePct}>99% sustainable</p>
              <p style={styles.badgeLabel}>insights accuracy powered by R-Intelligence.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.right}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create Your Account</h2>
            <p style={styles.formSub}>Complete the details below to begin your journey.</p>
          </div>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Johnathan Doe" style={styles.input}
                  onFocus={e => e.target.style.borderColor = "#2d7a3a"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Username</label>
                <input name="username" value={form.username} onChange={handleChange} placeholder="johndoe_eco" style={styles.input}
                  onFocus={e => e.target.style.borderColor = "#2d7a3a"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="hello@example.com" style={styles.input}
                onFocus={e => e.target.style.borderColor = "#2d7a3a"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                    placeholder="••••••••" style={{ ...styles.input, paddingRight: "40px" }}
                    onFocus={e => e.target.style.borderColor = "#2d7a3a"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>{showPass ? "🙈" : "👁"}</button>
                </div>
                {form.password && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <div style={{ flex: 1, height: "3px", borderRadius: "2px", background: "#e2e8f0", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: strength.width, background: strength.color, transition: "all 0.3s" }} />
                    </div>
                    <span style={{ fontSize: "9px", fontWeight: "700", color: strength.color, letterSpacing: "0.06em" }}>{strength.label}</span>
                  </div>
                )}
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                    placeholder="••••••••" style={{ ...styles.input, paddingRight: "40px" }}
                    onFocus={e => e.target.style.borderColor = "#2d7a3a"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>{showConfirm ? "🙈" : "👁"}</button>
                </div>
              </div>
            </div>

            <div style={styles.addressSection}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={styles.label}>Address Details</span>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <span style={{ fontSize: "12px", color: "#555" }}>Same as current</span>
                  <div onClick={() => handleChange({ target: { name: "sameAsCurrent", type: "checkbox", checked: !form.sameAsCurrent } })}
                    style={{ width: "36px", height: "20px", borderRadius: "10px", background: form.sameAsCurrent ? "#2d7a3a" : "#ddd", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                    <div style={{ position: "absolute", top: "2px", left: form.sameAsCurrent ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", background: "white", transition: "left 0.2s" }} />
                  </div>
                </label>
              </div>
              <div style={styles.field}>
                <label style={{ fontSize: "12px", color: "#666" }}>Current Address</label>
                <textarea name="currentAddress" value={form.currentAddress} onChange={handleChange}
                  placeholder="123 Eco Lane, Green Valley, CA 90210" rows={2} style={styles.textarea}
                  onFocus={e => e.target.style.borderColor = "#2d7a3a"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
              <div style={styles.field}>
                <label style={{ fontSize: "12px", color: "#666" }}>Permanent Address</label>
                <textarea name="permanentAddress" value={form.permanentAddress} onChange={handleChange}
                  placeholder="Same as current address" rows={2}
                  style={{ ...styles.textarea, background: form.sameAsCurrent ? "#f5f5f0" : "white" }}
                  disabled={form.sameAsCurrent}
                  onFocus={e => e.target.style.borderColor = "#2d7a3a"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", cursor: "pointer" }}>
              <input type="checkbox" name="agreed" checked={form.agreed} onChange={handleChange}
                style={{ accentColor: "#2d7a3a", marginRight: "8px", marginTop: "2px" }} />
              <span style={{ fontSize: "12px", color: "#666", lineHeight: "1.5" }}>
                I agree to the <a href="#" style={{ color: "#2d7a3a", textDecoration: "none", fontWeight: "500" }}>Terms & Conditions</a> and the <a href="#" style={{ color: "#2d7a3a", textDecoration: "none", fontWeight: "500" }}>Privacy Policy</a> regarding my ecological data.
              </span>
            </label>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#888", margin: 0 }}>
              Already have an account? <Link to="/login" style={{ color: "#2d7a3a", fontWeight: "600", textDecoration: "none" }}>Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: { display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" },
  left: { width: "38%", background: "linear-gradient(160deg, #0d1f11 0%, #1a3d20 50%, #0d1f11 100%)", display: "flex", flexDirection: "column", padding: "2rem", overflow: "hidden" },
  leftContent: { display: "flex", flexDirection: "column", height: "100%" },
  logo: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "auto" },
  logoText: { color: "white", fontWeight: "600", fontSize: "15px" },
  leftBody: { marginBottom: "2rem" },
  tagline: { color: "white", fontSize: "42px", fontWeight: "800", lineHeight: "1.1", margin: "0 0 1rem", letterSpacing: "-0.03em" },
  leftSub: { color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: "1.6", margin: 0 },
  badge: { display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.12)" },
  badgeDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#7dd98a", flexShrink: 0, boxShadow: "0 0 8px #7dd98a" },
  badgePct: { color: "#7dd98a", fontSize: "12px", fontWeight: "700", margin: "0 0 2px" },
  badgeLabel: { color: "rgba(255,255,255,0.6)", fontSize: "11px", margin: 0, lineHeight: "1.4" },
  right: { flex: 1, background: "#fafaf8", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", overflowY: "auto" },
  formContainer: { width: "100%", maxWidth: "520px", paddingBottom: "1rem" },
  formHeader: { marginBottom: "1.5rem" },
  formTitle: { fontSize: "22px", fontWeight: "700", color: "#1a1a1a", margin: "0 0 4px", letterSpacing: "-0.02em" },
  formSub: { fontSize: "13px", color: "#888", margin: 0 },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  field: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "13px", fontWeight: "500", color: "#444" },
  input: { width: "100%", padding: "9px 13px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1a1a1a", background: "white", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "9px 13px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1a1a1a", background: "white", outline: "none", resize: "none", transition: "border-color 0.2s", boxSizing: "border-box", fontFamily: "inherit" },
  eyeBtn: { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "13px", padding: 0 },
  addressSection: { background: "white", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" },
  error: { color: "#dc2626", fontSize: "13px", margin: 0, background: "#fef2f2", padding: "8px 12px", borderRadius: "6px", border: "1px solid #fecaca" },
  submitBtn: { width: "100%", padding: "12px", background: "linear-gradient(135deg, #2d7a3a, #1a5c28)", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
};