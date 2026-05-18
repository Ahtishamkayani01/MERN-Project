export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-brand">MERN<span>.</span>Dev</div>
      <div className="footer-stack">
        {["MongoDB", "Express", "React", "Node.js"].map((t) => (
          <span key={t} className="stack-badge">{t}</span>
        ))}
      </div>
      <p className="footer-copy">© {year} Portfolio Project</p>
    </footer>
  );
}