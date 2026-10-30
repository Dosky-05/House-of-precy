import { ArrowRight, Heart, MessageCircle, PhoneCall } from 'lucide-react'

export default function ContactPage({ contacts }) {
  return (
    <section className="contact-page" id="contact">
      <p className="eyebrow">WE'RE HERE FOR YOU</p>
      <h1>Let's find your <em>feel-good fit.</em></h1>
      <p className="contact-page-intro">Questions about sizing, an order, or a piece you have your eye on? Talk to us directly.</p>
      <div className="contact-options">
        <a href={`https://wa.me/${contacts.whatsapp}?text=Hi%20House%20of%20Precy!`} target="_blank" rel="noreferrer"><MessageCircle /><span><small>WHATSAPP</small><strong>0704 055 6421</strong></span><ArrowRight /></a>
        <a href={`tel:+${contacts.alternate}`}><PhoneCall /><span><small>CALL US</small><strong>0901 627 9988</strong></span><ArrowRight /></a>
        <a href="https://www.tiktok.com/@homeof_luxury0" target="_blank" rel="noreferrer"><Heart /><span><small>FOLLOW ALONG</small><strong>@homeof_luxury0 on TikTok</strong></span><ArrowRight /></a>
      </div>
    </section>
  )
}