import { ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <section className="story-band" id="about">
      <div className="story-image" role="img" aria-label="House of Precy brand board featuring its logo, packaging and contact details" />
      <div className="story-copy">
        <p className="eyebrow">A LITTLE ABOUT US</p>
        <h2>Style should feel<br /><em>like coming home.</em></h2>
        <p>House of Precy is for anyone who makes every piece their own. Find thoughtful clothes, bags and shoes that bring a little more you to every day.</p>
        <a className="text-link" href="#shop">Explore the edit <ArrowRight size={17} /></a>
      </div>
    </section>
  )
}