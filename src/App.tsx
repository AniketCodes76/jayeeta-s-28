import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Heart, X } from 'lucide-react'
import { birthdayData } from './data/birthdayData'

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); observer.disconnect() } }, { threshold: 0.12 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

function MemoryTile({ photo, index, onSelect }: { photo: typeof birthdayData.photos[number]; index: number; onSelect: () => void }) {
  const [loaded, setLoaded] = useState(true)
  return <button className={`memory memory-${index + 1}`} onClick={onSelect} aria-label={`Open memory ${String(index + 1).padStart(2, '0')}`}>
    {loaded && <img src={photo.src} alt={photo.caption} loading="lazy" onError={() => setLoaded(false)} />}
    {!loaded && <span className="photo-placeholder"><span className="placeholder-index">MEMORY · {String(index + 1).padStart(2, '0')}</span><span className="placeholder-mark">✳</span><span className="placeholder-copy">Your photo<br/>goes here</span><span className="placeholder-caption">Add <code>sister-{index + 1}.jpg</code> to <code>public/images</code></span></span>}
    <span className="memory-overlay"><span>memory {String(index + 1).padStart(2, '0')}</span><ArrowUpRight size={17}/></span>
  </button>
}

type Chapter = (typeof birthdayData.timeline)[number]

function JourneyMemory({ chapter, index, onPrevious, onNext }: { chapter: Chapter; index: number; onPrevious: () => void; onNext: () => void }) {
  const [loaded, setLoaded] = useState(true)
  return <article className="chapter-memory" aria-live="polite">
    <div className="chapter-memory-meta"><span>MEMORY · {String(index + 1).padStart(2, '0')} / 07</span><span>JAYEETA, THROUGH THE YEARS</span></div>
    <div className={`chapter-photo-frame chapter-photo-${chapter.chapter}`}>
      {loaded ? <img src={chapter.photo} alt={chapter.alt} loading="lazy" onError={() => setLoaded(false)}/> : <div className="chapter-photo-placeholder"><span className="chapter-placeholder-mark">✳</span><span className="chapter-placeholder-title">{chapter.photoPrompt}</span><span className="chapter-placeholder-hint">Add <code>{chapter.photo.split('/').slice(-1)[0]}</code> to <code>public/images/chapters</code></span></div>}
      <span className="chapter-photo-corner">{chapter.chapter}</span>
    </div>
    <div className="chapter-memory-footer"><p>{chapter.text}</p><div className="chapter-switcher"><button onClick={onPrevious} aria-label="Previous chapter">←</button><span>{chapter.title}</span><button onClick={onNext} aria-label="Next chapter">→</button></div></div>
  </article>
}

function App() {
  const [progress, setProgress] = useState(0)
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [selectedChapter, setSelectedChapter] = useState(0)
  const [tapCount, setTapCount] = useState(0)
  const cakeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => { const max = document.documentElement.scrollHeight - window.innerHeight; setProgress(max > 0 ? window.scrollY / max : 0) }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (selectedPhoto === null) return
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedPhoto(null); if (e.key === 'ArrowRight') setSelectedPhoto((selectedPhoto + 1) % birthdayData.photos.length); if (e.key === 'ArrowLeft') setSelectedPhoto((selectedPhoto + birthdayData.photos.length - 1) % birthdayData.photos.length) }
    window.addEventListener('keydown', close); document.body.classList.add('modal-open')
    return () => { window.removeEventListener('keydown', close); document.body.classList.remove('modal-open') }
  }, [selectedPhoto])

  const tapCake = () => setTapCount((n) => Math.min(3, n + 1))
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return <>
    <div className="scroll-track" aria-hidden="true"><div className="scroll-fill" style={{ transform: `scaleY(${progress})` }}/></div>
    <header className="topbar"><a className="wordmark" href="#home" aria-label="Back to the beginning"><span className="wordmark-icon">✳</span> A LITTLE WORLD <span className="wordmark-for">FOR 28</span></a><a href="#wish" className="top-link">MAKE A WISH <ArrowDown size={13}/></a></header>

    <main>
      <section className="hero" id="home">
        <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
        <div className="hero-seal"><span>01 — 07</span><span className="seal-dot"/><span>MADE WITH LOVE</span></div>
        <div className="hero-content">
          <Reveal><p className="eyebrow"><span className="eyebrow-line"/>TODAY IS A LITTLE MORE SPECIAL<span className="eyebrow-line"/></p></Reveal>
          <Reveal delay={100}><h1>28 looks<br/><em>beautiful</em><br className="mobile-break"/> on you.</h1></Reveal>
          <Reveal delay={220}><p className="hero-sub">Happy Birthday, {birthdayData.name} ♡</p><p className="hero-note">A little world, made just for you.</p></Reveal>
          <Reveal delay={320}><button className="button button-dark" onClick={() => scrollTo('intro')}>Begin the celebration <ArrowRight size={16}/></button></Reveal>
        </div>
        <div className="hero-bottom"><span>FOR MY FAVORITE PERSON</span><span className="hero-heart">♡</span><span>SCROLL TO WANDER</span></div>
        <span className="hero-side-note">A DAY TO CELEBRATE YOU · EST. TODAY</span>
      </section>

      <section className="intro section-pad" id="intro">
        <div className="section-meta"><span>01 / A NOTE FOR YOU</span><span>THE BEGINNING</span></div>
        <div className="intro-grid"><Reveal><p className="eyebrow accent-eyebrow">A WHOLE LIFE OF YOU</p><h2>28 years of being<br/><em>wonderfully you.</em></h2></Reveal>
          <Reveal delay={140} className="intro-copy"><span className="large-quote">“</span><p>{birthdayData.intro}</p><span className="signature">With all my love, {birthdayData.from} <Heart size={13}/></span></Reveal></div>
        <div className="intro-foot"><span className="hairline"/><span>AND THIS IS ONLY THE BEGINNING</span><span>♡</span></div>
      </section>

      <section className="gallery section-pad" id="memories">
        <div className="section-meta"><span>02 / LITTLE MOMENTS</span><span>KEPT CLOSE</span></div>
        <Reveal className="gallery-heading"><p className="eyebrow">A COLLECTION OF YOU</p><h2>A few of my favorite<br/><em>memories of you.</em></h2><p className="gallery-note">The days move on. The little things stay.</p></Reveal>
        <div className="gallery-grid">{birthdayData.photos.map((photo, i) => <Reveal key={photo.src} delay={i * 65}><MemoryTile photo={photo} index={i} onSelect={() => setSelectedPhoto(i)}/></Reveal>)}</div>
        <div className="gallery-caption"><span>THE EVERYDAY, MADE GOLDEN</span><span>01 — 06</span></div>
      </section>

      <section className="things section-pad" id="things">
        <div className="section-meta"><span>03 / THE LITTLE THINGS</span><span>ALL THE REASONS</span></div>
        <Reveal className="things-heading"><p className="eyebrow">A FEW FROM THE LIST</p><h2>28 little things<br/><em>that make you, you.</em></h2><p>There are at least 28. Here are a few I keep close.</p></Reveal>
        <div className="things-grid">{birthdayData.thingsILove.map(([title, description], i) => <Reveal key={title} delay={(i % 5) * 65}><article className="thing-card" tabIndex={0}><span className="thing-num">{String(i + 1).padStart(2, '0')}</span><span className="thing-star">✳</span><h3>{title}</h3><p>{description}</p><span className="thing-rule"/></article></Reveal>)}</div>
        <p className="things-aside">(And so many more.)</p>
      </section>

      <section className="timeline-section section-pad" id="journey">
        <div className="section-meta"><span>04 / THE YEARS BETWEEN</span><span>A LIFE IN CHAPTERS</span></div>
        <Reveal className="family-before" delay={100}><div className="family-before-copy"><p className="eyebrow">A LITTLE BEFORE MY TIME</p><h3>Before I arrived,<br/><em>we were already us.</em></h3><p>{birthdayData.familyBefore.note}</p><span className="family-before-sign">JAYEETA · A FAMILY MOMENT · BEFORE ANIKET</span></div><figure className="family-before-photo"><img src={birthdayData.familyBefore.image} alt={birthdayData.familyBefore.alt} loading="lazy"/><figcaption>Somewhere our story began.</figcaption></figure></Reveal>
        <div className="timeline-heading"><Reveal><p className="eyebrow">LOOK HOW FAR YOU'VE COME</p><h2>28 years.<br/><em>Countless moments.</em></h2></Reveal><Reveal delay={120}><p className="timeline-aside">Every version of you<br/>has been worth celebrating.</p></Reveal></div>
        <div className="timeline-experience">
          <div className="timeline-list" aria-label="Choose a chapter in Jayeeta’s story">
            {birthdayData.timeline.map((chapter, i) => <Reveal key={chapter.chapter} delay={i * 55}><button className={`timeline-item ${selectedChapter === i ? 'chapter-active' : ''}`} aria-pressed={selectedChapter === i} aria-label={`Chapter ${chapter.chapter}, ${chapter.title}: ${chapter.photoPrompt}`} onClick={() => setSelectedChapter(i)}><span className="timeline-node"/><span className="timeline-item-copy"><span className="timeline-year">CHAPTER {chapter.chapter}</span><span className="timeline-title">{chapter.title}</span><span className="timeline-description">{chapter.text}</span></span><span className="timeline-chevron">↗</span></button></Reveal>)}
          </div>
          <div className="chapter-panel"><JourneyMemory key={birthdayData.timeline[selectedChapter].chapter} chapter={birthdayData.timeline[selectedChapter]} index={selectedChapter} onPrevious={() => setSelectedChapter((selectedChapter + birthdayData.timeline.length - 1) % birthdayData.timeline.length)} onNext={() => setSelectedChapter((selectedChapter + 1) % birthdayData.timeline.length)}/></div>
        </div>
        <span className="timeline-end">TAP A CHAPTER TO OPEN ITS MEMORY <span>↓</span></span>
      </section>

      <section className="letter section-pad" id="letter">
        <div className="letter-glow"/><div className="section-meta"><span>05 / FROM ME TO YOU</span><span>A LETTER, ALWAYS</span></div>
        <Reveal className="letter-inner"><p className="eyebrow">IF YOU EVER WONDER</p><h2>Before you make<br/>another wish<span>,</span></h2><span className="letter-flourish">✳</span><div className="letter-copy">{birthdayData.message.split('\n\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div><p className="letter-sign">Always, {birthdayData.from} <span>♡</span></p></Reveal>
        <span className="letter-bottom">SOME THINGS ARE TOO BIG FOR JUST ONE DAY</span>
      </section>

      <section className={`wish section-pad ${tapCount === 3 ? 'wish-made' : ''}`} id="wish" ref={cakeRef}>
        <div className="section-meta"><span>06 / THE WISH</span><span>TAKE YOUR TIME</span></div>
        <Reveal className="wish-heading"><p className="eyebrow">ONE LAST THING</p><h2>Make a <em>wish.</em></h2><p>Close your eyes for a second. Think of something lovely.</p></Reveal>
        <Reveal className="cake-area" delay={100}>
          <div className={`cake-stage ${tapCount > 0 ? `wind-${tapCount}` : ''} ${tapCount === 3 ? 'wish-made' : ''}`}>
            <div className="cake-halo"/>
            <div className="candles" aria-label="Birthday cake with 28 candles">{Array.from({ length: 28 }, (_, i) => <div key={i} className={`candle candle-${i + 1}`}><span className={`flame ${tapCount === 3 ? 'out' : ''}`} style={{ animationDelay: `${(i % 7) * -0.17}s` }}/><span className={`smoke ${tapCount === 3 ? 'smoke-on' : ''}`} style={{ animationDelay: `${(i % 5) * 0.09}s` }}/><span className="wick"/><span className="candle-body"/></div>)}</div>
            <div className="cake-top"><span className="cake-piping"/><span className="cake-top-shine"/></div><div className="cake-middle"><span className="icing-drip drip-a"/><span className="icing-drip drip-b"/><span className="icing-drip drip-c"/><span className="cake-middle-shine"/></div><div className="cake-bottom"><span className="cake-band"/><span className="cake-bottom-shine"/></div><div className="cake-plate"><span/></div>
            {tapCount === 3 && <div className="sparkle-burst" aria-hidden="true">✳　·　✦　·　✧　·　✳</div>}
          </div>
          <p className="tap-instruction" aria-live="polite">{tapCount === 0 ? 'Tap the cake 3 times to blow out the candles.' : tapCount === 1 ? 'That’s one…' : tapCount === 2 ? 'Two…' : 'Wish made. Keep it close.'}</p>
          {tapCount < 3 ? <button className="button button-outline" onClick={tapCake}>Tap to make a wish <span className="tap-dots"><i/><i/><i/></span></button> : <div className="wish-reveal"><p>Happy 28th Birthday, <em>{birthdayData.name}</em> ♡</p><span>{birthdayData.finalMessage.wish}</span></div>}
          <span className="candle-count">28 CANDLES · ONE VERY LOVED PERSON</span>
        </Reveal>
      </section>

      <section className="finale section-pad" id="finale"><div className="finale-top"><span>07 / WHAT COMES NEXT</span><span>MADE WITH LOVE, ALWAYS</span></div><Reveal className="finale-content"><span className="finale-star">✳</span><p className="eyebrow">A NEW CHAPTER BEGINS</p><h2>{birthdayData.finalMessage.heading} <em>28.</em></h2><p className="finale-lines">{birthdayData.finalMessage.lines.map((line) => <span key={line}>{line}<br/></span>)}</p><span className="finale-divider"/><p className="finale-birthday">{birthdayData.finalMessage.signoff}<br/><em>{birthdayData.name}.</em> <span>♡</span></p><p className="made-with">Made with love, {birthdayData.from} <span>✳</span></p></Reveal><button className="back-top" onClick={() => scrollTo('home')}>BACK TO THE BEGINNING <ArrowUpRight size={14}/></button><span className="finale-number">28</span></section>
    </main>

    {selectedPhoto !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo memory" onClick={() => setSelectedPhoto(null)}><button className="lightbox-close" aria-label="Close photo" onClick={() => setSelectedPhoto(null)}><X/></button><div className="lightbox-content" onClick={(e) => e.stopPropagation()}><div className="lightbox-image">{<img src={birthdayData.photos[selectedPhoto].src} alt={birthdayData.photos[selectedPhoto].caption} onError={(e) => { e.currentTarget.style.display = 'none' }}/>}<span className="lightbox-placeholder">✳<small>YOUR MEMORY</small></span></div><div className="lightbox-caption"><span>MEMORY · {String(selectedPhoto + 1).padStart(2, '0')}</span><p>{birthdayData.photos[selectedPhoto].caption}</p></div><div className="lightbox-controls"><button onClick={() => setSelectedPhoto((selectedPhoto + 5) % 6)}>← PREVIOUS</button><span>{String(selectedPhoto + 1).padStart(2, '0')} / 06</span><button onClick={() => setSelectedPhoto((selectedPhoto + 1) % 6)}>NEXT →</button></div></div></div>}
  </>
}

export default App
