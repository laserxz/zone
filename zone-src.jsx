    const { useState, useEffect, useRef } = React;

    const APPS = [
      { id: "bpm", name: "BPM Detector", tagline: "Detect tempo from audio files with waveform analysis", url: "https://bpm.zone.net.au", icon: "\u266B", color: "#bf5af2", gradient: "linear-gradient(135deg, #bf5af2 0%, #ff375f 100%)", category: "Audio Tools" },
      { id: "pws", name: "PWS Weather", tagline: "Personal weather station dashboard", url: "https://pws.zone.net.au", icon: "\u2601", color: "#00b4d8", gradient: "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)", category: "Utilities" },
      { id: "watch", name: "Watch Tracker", tagline: "Track what you've watched across streaming platforms", url: "https://watch.zone.net.au", icon: "\u25B6", color: "#ff9f1c", gradient: "linear-gradient(135deg, #ff9f1c 0%, #ff003c 100%)", category: "Entertainment" },
      { id: "mortgage", name: "Mortgage Calculator", tagline: "Australian mortgage repayment & comparison tool", url: "https://mortgagecalc.zone.net.au", icon: "\u2302", color: "#2ec4b6", gradient: "linear-gradient(135deg, #2ec4b6 0%, #00ff88 100%)", category: "Finance" },
      { id: "swms", name: "SWMS App", tagline: "Safe Work Method Statements made simple", url: "https://swms.zone.net.au", icon: "\u2713", color: "#ffd60a", gradient: "linear-gradient(135deg, #ffd60a 0%, #ff9f1c 100%)", category: "Safety Tools" },
      { id: "lasermaze", name: "LaserMaze", tagline: "Interactive laser maze challenge game", url: "https://lasermaze.zone.net.au", icon: "\u2B21", color: "#ff003c", gradient: "linear-gradient(135deg, #ff003c 0%, #ff6b35 100%)", category: "Entertainment" },
      { id: "lasermpe", name: "MPE Laser Calculator", tagline: "Maximum Permissible Exposure safety calculator", url: "https://lasermpe.zone.net.au", icon: "\u26A0", color: "#00ff88", gradient: "linear-gradient(135deg, #00ff88 0%, #00b4d8 100%)", category: "Safety Tools" },
    ];

    const CATEGORIES = ["All", ...Array.from(new Set(APPS.map((a) => a.category)))];

    function ParticleField() {
      const canvasRef = useRef(null);
      const particles = useRef([]);
      const mouse = useRef({ x: -1000, y: -1000 });
      const raf = useRef(null);

      useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);
        const COUNT = 80;
        particles.current = Array.from({ length: COUNT }, () => ({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
        }));

        const draw = () => {
          ctx.clearRect(0, 0, w, h);
          const pts = particles.current;
          for (let i = 0; i < pts.length; i++) {
            const p = pts[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0,255,136,0.35)"; ctx.fill();
            for (let j = i + 1; j < pts.length; j++) {
              const q = pts[j];
              const dx = p.x - q.x, dy = p.y - q.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 140) {
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                ctx.strokeStyle = `rgba(0,255,136,${0.08 * (1 - dist / 140)})`; ctx.stroke();
              }
            }
            const mdx = p.x - mouse.current.x, mdy = p.y - mouse.current.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 200) {
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.current.x, mouse.current.y);
              ctx.strokeStyle = `rgba(0,255,136,${0.15 * (1 - mdist / 200)})`; ctx.stroke();
            }
          }
          raf.current = requestAnimationFrame(draw);
        };

        const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
        const onMouse = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
        window.addEventListener("resize", onResize);
        window.addEventListener("mousemove", onMouse);
        draw();
        return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", onResize); window.removeEventListener("mousemove", onMouse); };
      }, []);

      return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
    }

    function ScanLines() {
      return <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none", background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)" }} />;
    }

    function AppCard({ app, index }) {
      const [hovered, setHovered] = useState(false);
      return (
        <a href={app.url} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: "block", textDecoration: "none", color: "inherit", animation: `cardFadeIn 0.4s ease ${index * 0.05}s both` }}>
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "rgba(10,14,20,0.85)", border: `1px solid ${hovered ? app.color + "88" : "rgba(255,255,255,0.06)"}`, backdropFilter: "blur(20px)", transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)", transform: hovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)", boxShadow: hovered ? `0 12px 40px ${app.color}22, 0 0 30px ${app.color}11, inset 0 1px 0 rgba(255,255,255,0.05)` : "0 2px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)", cursor: "pointer" }}>
            <div style={{ height: 75, background: app.gradient, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)", backgroundSize: "30px 30px", opacity: 0.5 }} />
              <span style={{ fontSize: 36, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))", position: "relative", zIndex: 2, transition: "transform 0.3s ease", transform: hovered ? "scale(1.15) rotate(-5deg)" : "scale(1)" }}>{app.icon}</span>
              <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)", padding: "3px 8px", borderRadius: 20, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>{app.category}</div>
            </div>
            <div style={{ padding: "12px 14px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#fff", letterSpacing: "0.02em" }}>{app.name}</h3>
                <span style={{ fontSize: 13, color: app.color, transition: "transform 0.3s ease", transform: hovered ? "translateX(4px)" : "translateX(0)" }}>&rarr;</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.4, color: "rgba(255,255,255,0.5)", fontFamily: "'IBM Plex Sans', sans-serif" }}>{app.tagline}</p>
              <div style={{ marginTop: 8, padding: "4px 8px", background: "rgba(255,255,255,0.03)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.04)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: app.color, opacity: 0.7, letterSpacing: "0.03em" }}>{app.url.replace("https://", "")}</div>
            </div>
          </div>
        </a>
      );
    }

    function PayPalDonate() {
      const containerRef = useRef(null);
      const paypalRef = useRef(null);
      const [loaded, setLoaded] = useState(false);
      useEffect(() => {
        if (window.paypal && window.paypal.HostedButtons) { renderButton(); return; }
        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=BAAi1dpFQIlz0QS4f_kk7h_GX0bsW_3M9Te6pNwN8COH_SybmYyZlD03J9Hr58-OwmivkGFfxaynMHD86U&components=hosted-buttons&disable-funding=venmo&currency=AUD";
        script.addEventListener("load", renderButton);
        document.body.appendChild(script);
        function renderButton() {
          if (paypalRef.current && window.paypal && window.paypal.HostedButtons) {
            window.paypal.HostedButtons({ hostedButtonId: "47L7Q3DXJAYX8" }).render(paypalRef.current).then(() => setLoaded(true));
          }
        }
      }, []);
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }} ref={containerRef}>
          {!loaded && <div style={{ minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>Loading PayPal...</div>
          </div>}
          <div ref={paypalRef} style={{ width: "100%", maxWidth: 400 }} />
        </div>
      );
    }

    function SectionTitle({ children, sub }) {
      return (
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "0.04em", lineHeight: 1.2 }}>{children}</h2>
          {sub && <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0, maxWidth: 560, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>{sub}</p>}
        </div>
      );
    }

    function CategoryFilter({ active, onChange }) {
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 24 }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => onChange(cat)} style={{ padding: "8px 18px", borderRadius: 30, border: active === cat ? "1px solid #00ff88" : "1px solid rgba(255,255,255,0.1)", background: active === cat ? "rgba(0,255,136,0.12)" : "rgba(255,255,255,0.03)", color: active === cat ? "#00ff88" : "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s ease" }}>{cat}</button>
          ))}
        </div>
      );
    }

    function ZoneLanding() {
      const [category, setCategory] = useState("All");
      const [scrollY, setScrollY] = useState(0);
      const [feedbackText, setFeedbackText] = useState("");
      const [feedbackApp, setFeedbackApp] = useState("");
      const [feedbackSent, setFeedbackSent] = useState(false);

      useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
      }, []);

      const filtered = category === "All" ? APPS : APPS.filter((a) => a.category === category);

      const handleFeedbackSubmit = () => {
        if (!feedbackText.trim()) return;
        setFeedbackSent(true);
        setTimeout(() => { setFeedbackText(""); setFeedbackApp(""); setFeedbackSent(false); }, 3000);
      };

      return (
        <>
          <ParticleField />
          <ScanLines />

          {/* Navigation */}
          <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 24px", transition: "all 0.3s ease", background: scrollY > 50 ? "rgba(6,10,16,0.9)" : "transparent", backdropFilter: scrollY > 50 ? "blur(20px)" : "none", borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent" }}>
            <div className="nav-inner" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, gap: 16 }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: 18, color: "#00ff88", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 12px #00ff88", animation: "pulse 2s ease infinite" }} />
                ZONE.NET.AU
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {["apps", "about", "feedback", "donate"].map((id) => (
                  <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })} className="nav-link" style={{ background: "none", cursor: "pointer" }}>{id}</button>
                ))}
              </div>
            </div>
          </nav>

          <div style={{ position: "relative", zIndex: 2 }}>
            {/* Hero */}
            <section style={{ minHeight: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "84px 24px 24px", textAlign: "center", position: "relative" }}>
              <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ animation: "slideUp 0.8s ease", marginBottom: 16 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#00ff88", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                  <span style={{ display: "inline-block", width: 30, height: 1, background: "linear-gradient(90deg, transparent, #00ff88)" }} />
                  Free Web Applications
                  <span style={{ display: "inline-block", width: 30, height: 1, background: "linear-gradient(90deg, #00ff88, transparent)" }} />
                </div>
                <h1 className="hero-title" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(40px, 8vw, 72px)", fontWeight: 900, letterSpacing: "0.04em", lineHeight: 1, margin: "0 0 8px", animation: "heroGlow 4s ease infinite", background: "linear-gradient(135deg, #ffffff 0%, #00ff88 50%, #00b4d8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>ZONE</h1>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(12px, 2vw, 18px)", fontWeight: 400, letterSpacing: "0.35em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>.net.au</div>
              </div>
              <p style={{ animation: "slideUp 0.8s ease 0.2s both", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 17px)", fontWeight: 300, color: "rgba(255,255,255,0.5)", maxWidth: 550, lineHeight: 1.6, marginBottom: 20 }}>Free, purpose-built web apps — from laser safety tools to streaming trackers. Built in Australia, free for everyone.</p>
              <button onClick={() => document.getElementById("apps")?.scrollIntoView({ behavior: "smooth" })} style={{ animation: "slideUp 0.8s ease 0.4s both", display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 50, background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", color: "#00ff88", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s ease" }}>Explore Apps &darr;</button>
            </section>

            {/* Apps Section */}
            <section id="apps" style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 60px" }}>
              <CategoryFilter active={category} onChange={setCategory} />
              <div className="app-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {filtered.map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
              </div>
            </section>

            {/* About Section */}
            <section id="about" style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 60px" }}>
              <SectionTitle>What is Zone?</SectionTitle>
              <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { icon: "\u25C7", title: "Free Forever", desc: "Every app is completely free. No sign-ups, no paywalls, no premium tiers.", color: "#00ff88" },
                  { icon: "\u25B3", title: "Donationware", desc: "50% of all donations go to Kiva \u2014 supporting women-led micro-businesses in the Pacific Islands.", color: "#00b4d8" },
                  { icon: "\u25CB", title: "Built in Australia", desc: "Created by Flying Pictures. These tools solve real problems we\u2019ve encountered in our own work.", color: "#bf5af2" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: 24, borderRadius: 12, background: "rgba(10,14,20,0.7)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(10px)", animation: `slideUp 0.5s ease ${i * 0.08}s both` }}>
                    <div style={{ fontSize: 24, marginBottom: 10, color: item.color }}>{item.icon}</div>
                    <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 8, color: "#fff", letterSpacing: "0.03em" }}>{item.title}</h3>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.45)", fontFamily: "'IBM Plex Sans', sans-serif" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Feedback Section */}
            <section id="feedback" style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px 60px" }}>
              <SectionTitle sub="Love an app? Tell your friends. Something not quite right? Tell us.">Feedback</SectionTitle>
              <div style={{ padding: 28, borderRadius: 16, background: "rgba(10,14,20,0.7)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
                <div className="feedback-paths" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                  <div style={{ padding: 16, borderRadius: 10, background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)", textAlign: "center" }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{"\uD83E\uDD19"}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#00ff88", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>Like it?</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>Tell your friends!</div>
                  </div>
                  <div style={{ padding: 16, borderRadius: 10, background: "rgba(255,159,28,0.05)", border: "1px solid rgba(255,159,28,0.15)", textAlign: "center" }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{"\uD83D\uDD27"}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#ff9f1c", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>Need a tweak?</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>Tell us below!</div>
                  </div>
                </div>

                {feedbackSent ? (
                  <div style={{ textAlign: "center", padding: 40, color: "#00ff88", fontFamily: "'Orbitron', sans-serif", fontSize: 16 }}>{"\u2713"} Thanks for your feedback!</div>
                ) : (
                  <div>
                    <select value={feedbackApp} onChange={(e) => setFeedbackApp(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: feedbackApp ? "#fff" : "rgba(255,255,255,0.35)", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, marginBottom: 12, appearance: "none", cursor: "pointer" }}>
                      <option value="" style={{ background: "#0a0e14" }}>Select an app...</option>
                      {APPS.map((app) => <option key={app.id} value={app.id} style={{ background: "#0a0e14" }}>{app.name}</option>)}
                      <option value="general" style={{ background: "#0a0e14" }}>General / zone.net.au</option>
                    </select>
                    <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="What's on your mind? Bug reports, feature requests, or just say g'day..." rows={4} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, lineHeight: 1.6, resize: "vertical", marginBottom: 16 }} />
                    <button onClick={handleFeedbackSubmit} disabled={!feedbackText.trim()} style={{ width: "100%", padding: "14px 28px", borderRadius: 10, background: feedbackText.trim() ? "linear-gradient(135deg, #00ff88, #00b4d8)" : "rgba(255,255,255,0.05)", border: "none", color: feedbackText.trim() ? "#060a10" : "rgba(255,255,255,0.25)", fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.06em", cursor: feedbackText.trim() ? "pointer" : "not-allowed", transition: "all 0.3s ease" }}>SEND FEEDBACK</button>
                  </div>
                )}
              </div>
            </section>

            {/* Donate Section */}
            <section id="donate" style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 60px" }}>
              <SectionTitle sub="All apps are free, but if you'd like to support the project, donations are appreciated.">Support Zone</SectionTitle>
              <div style={{ padding: 32, borderRadius: 16, background: "rgba(10,14,20,0.7)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 30, background: "rgba(0,180,216,0.08)", border: "1px solid rgba(0,180,216,0.2)", marginBottom: 20 }}>
                  <span style={{ fontSize: 16 }}>{"\uD83C\uDF0F"}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#00b4d8", letterSpacing: "0.04em" }}>50% of all donations go to Kiva</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.5)", maxWidth: 550, margin: "0 auto 12px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  Half of every donation supports{" "}
                  <a href="https://www.kiva.org" target="_blank" rel="noopener noreferrer" style={{ color: "#00b4d8", textDecoration: "none" }}>Kiva.org</a>
                  {" "}micro-financing for women-led small businesses in the Pacific Islands.
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 24, fontFamily: "'IBM Plex Sans', sans-serif" }}>The other half helps keep these apps running and fund new tools.</p>
                <PayPalDonate />
                <div style={{ marginTop: 16, fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>Securely processed via PayPal</div>
              </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "28px 24px", textAlign: "center" }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em", marginBottom: 8 }}>ZONE.NET.AU</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.2)", fontFamily: "'IBM Plex Sans', sans-serif", marginBottom: 6 }}>
                  Built by{" "}<a href="https://flyingpictures.com.au" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Flying Pictures</a>{" "}&mdash; Australia
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.12)", fontFamily: "'JetBrains Mono', monospace" }}>&copy; {new Date().getFullYear()} All rights reserved</div>
              </div>
            </footer>
          </div>
        </>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<ZoneLanding />);
