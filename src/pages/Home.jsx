import { ArrowRight, MessageCircle } from 'lucide-react'
import ProductCollection from '../components/ProductCollection.jsx'

export default function HomePage({
  categories,
  chooseCategory,
  collectionProps,
  contacts,
}) {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> THE HOUSE OF GOOD FINDS</p>
          <h1 id="hero-heading">Wear what<br />feels like <em>you.</em></h1>
          <p className="hero-description">A considered mix of clothes, bags and shoes for wherever the day takes you.</p>
          <button className="primary-button" onClick={() => chooseCategory('All pieces')}>
            Find your next favourite <ArrowRight size={18} />
          </button>
          <div className="hero-footnote"><span>01 / 03</span><span>CURATED FOR YOUR EVERYDAY</span></div>
        </div>
        <div className="hero-image" role="img" aria-label="A woman in a confident, contemporary outfit">
          <div className="hero-image-label"><span>NEW SEASON</span><span>THE FEEL-GOOD EDIT</span></div>
          <div className="hero-sticker">STYLE<br />FOR EVERY<br /><i>YOU</i></div>
        </div>
        <div className="hero-edge-note">CLOTHES / BAGS / SHOES</div>
      </section>

      <ProductCollection {...collectionProps} categories={categories} pageType="home" />

      <section className="story-band" id="about">
        <div className="story-image" role="img" aria-label="House of Precy brand board featuring its logo, packaging and contact details" />
        <div className="story-copy">
          <p className="eyebrow">A LITTLE ABOUT US</p>
          <h2>Style should feel<br /><em>like coming home.</em></h2>
          <p>House of Precy is for anyone who makes every piece their own. Find thoughtful clothes, bags and shoes that bring a little more you to every day.</p>
          <a className="text-link" href="#shop">Explore the edit <ArrowRight size={17} /></a>
        </div>
      </section>

      <section className="contact-strip" id="contact">
        <p>Need a hand finding your fit?</p>
        <a href={`https://wa.me/${contacts.whatsapp}?text=Hi%20House%20of%20Precy!%20I%20need%20a%20hand%20finding%20something.`} target="_blank" rel="noreferrer">
          <MessageCircle size={17} /> Chat with us on WhatsApp
        </a>
        <a href={`tel:+${contacts.alternate}`}>
          Call 0901 627 9988
        </a>
      </section>
    </>
  )
}