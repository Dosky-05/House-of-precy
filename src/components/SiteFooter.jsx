const currentYear = new Date().getFullYear()

export default function SiteFooter({ contacts }) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a className="wordmark wordmark-light" href="#home" aria-label="House of Precy home"><img className="wordmark-image" src="/hop_logo_transparent.png" alt="House of Precy" /></a>
          <p>Style for Every You.</p>
        </div>
        <div className="footer-column"><p className="footer-label">THE GOOD STUFF</p><a href="#shop">Shop</a><a href="#about">About</a><a href="#contact">Contact</a></div>
        <div className="footer-column"><p className="footer-label">SAY HELLO</p><a href={`https://wa.me/${contacts.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp 0704 055 6421</a><a href={`https://wa.me/${contacts.alternate}`} target="_blank" rel="noreferrer">WhatsApp 0901 627 9988</a><a href="https://www.tiktok.com/@homeof_luxury0" target="_blank" rel="noreferrer">TikTok @homeof_luxury0</a><a href="https://www.snapchat.com/add/theyluvvprecy" target="_blank" rel="noreferrer">Snapchat theyluvvprecy</a></div>
        <a className="back-top" href="#home" aria-label="Back to home">↑</a>
      </div>
      <div className="footer-bottom"><span>© {currentYear} House of Precy</span><span>MADE FOR YOUR EVERY YOU</span></div>
    </footer>
  )
}