import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowRight, Check, Heart, Music2, RotateCcw, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import cosmicArtwork from "@/assets/niranjana-cosmic.jpg";
import portraitPhoto from "@/assets/niranjana-portrait.jpg";
import memoryPhotoOne from "@/assets/niranjana-memory-01.jpg";
import memoryPhotoTwo from "@/assets/niranjana-memory-02.jpg";
import memoryPhotoThree from "@/assets/niranjana-memory-03.jpg";
import memoryPhotoFour from "@/assets/niranjana-memory-04.jpg";
import memoryPhotoFive from "@/assets/niranjana-memory-05.jpg";

const birthdayLetter = `Dear Niranjana,

Happy Birthday to someone who holds a very special place in my heart. ✨

I wanted to give you something a little different this year — not flowers that fade, not a card that gets tucked away. A little universe made of you.

Your smile in silk. Quiet days on a wooden bench. The way sunlight finds you under the trees, as if it had been looking for you.

You deserve happiness in the little moments, beautiful surprises when you least expect them, and countless reasons to smile.

May this new chapter bring you love, peace, laughter, and dreams that come true.

No matter how ordinary a day may seem, I hope you always remember how rare you are.

Happy Birthday, Niranjana. 💖

With lots of wishes,
Someone who thinks you're truly special.`;

const memories = [
  { src: memoryPhotoOne, caption: "Soft gold, and a smile that stays", secret: "Even the garden leaned in to look at you.", symbol: "01", position: "50% 18%" },
  { src: memoryPhotoTwo, caption: "Mustard silk. The stars got jealous.", secret: "Some people wear gold. You become it.", symbol: "02", position: "50% 14%" },
  { src: memoryPhotoThree, caption: "That campus smile. That quiet magic.", secret: "A whole afternoon, and still the brightest thing in it.", symbol: "03", position: "50% 18%" },
  { src: memoryPhotoFour, caption: "Among the trees, still the brightest", secret: "Wildflowers tried. They could not outshine you.", symbol: "04", position: "50% 28%" },
  { src: memoryPhotoFive, caption: "Barefoot, unhurried, completely you", secret: "The softest kind of beautiful — the one that does not try.", symbol: "05", position: "50% 42%" },
];

const reasons = [
  "Your smile can rearrange an ordinary day.",
  "You make little moments feel like they were meant to be kept.",
  "The world feels a little more beautiful with you in it.",
  "You have a way of making people feel seen.",
  "Your kindness leaves a little light wherever you go.",
  "There is no one quite like you, Niranjana.",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Little Universe for Niranjana | Happy Birthday" },
      { name: "description", content: "A starry birthday surprise, made with love for Niranjana." },
      { property: "og:title", content: "A Little Universe for Niranjana" },
      { property: "og:description", content: "A little world of stars, memories, and birthday wishes, made just for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BirthdayPage,
});

function BirthdayPage() {
  const [entered, setEntered] = useState(false);
  const [wishMade, setWishMade] = useState(false);
  const [openedCards, setOpenedCards] = useState<number[]>([]);
  const [letterOpen, setLetterOpen] = useState(false);
  const [letterLength, setLetterLength] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [missingPhotos, setMissingPhotos] = useState<number[]>([]);
  const [awakenedStar, setAwakenedStar] = useState<number | null>(null);
  const birthdayRef = useRef<HTMLElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const musicTimer = useRef<number | null>(null);
  const notes = useRef<{ oscillator: OscillatorNode; gain: GainNode }[]>([]);

  useEffect(() => {
    if (!letterOpen) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const characters = Array.from(birthdayLetter);
    if (reduceMotion) {
      setLetterLength(characters.length);
      return;
    }
    let current = 0;
    const timer = window.setInterval(() => {
      current += 3;
      setLetterLength(Math.min(current, characters.length));
      if (current >= characters.length) window.clearInterval(timer);
    }, 12);
    return () => window.clearInterval(timer);
  }, [letterOpen]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") setLightboxIndex((index) => index === null ? 0 : (index + 1) % memories.length);
      if (event.key === "ArrowLeft") setLightboxIndex((index) => index === null ? 0 : (index - 1 + memories.length) % memories.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex]);

  useEffect(() => () => {
    if (musicTimer.current !== null) window.clearInterval(musicTimer.current);
    notes.current.forEach(({ oscillator, gain }) => {
      try { oscillator.stop(); gain.disconnect(); } catch { /* A fading note may already be stopped. */ }
    });
    void audioContext.current?.close();
  }, []);

  function startMusic() {
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;
    const context = audioContext.current ?? new AudioContextConstructor();
    audioContext.current = context;
    void context.resume();
    const progression = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
    let note = 0;
    const playNote = () => {
      if (context.state !== "running") return;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = progression[note % progression.length] ?? 329.63;
      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.025, context.currentTime + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 2.7);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 2.8);
      notes.current.push({ oscillator, gain });
      oscillator.onended = () => {
        notes.current = notes.current.filter((activeNote) => activeNote.oscillator !== oscillator);
        gain.disconnect();
      };
      note += 1;
    };
    playNote();
    musicTimer.current = window.setInterval(playNote, 2200);
    setMusicOn(true);
  }

  function toggleMusic() {
    if (!musicOn) {
      startMusic();
      return;
    }
    if (musicTimer.current !== null) window.clearInterval(musicTimer.current);
    musicTimer.current = null;
    notes.current.forEach(({ oscillator, gain }) => {
      try { oscillator.stop(); gain.disconnect(); } catch { /* The note finished naturally. */ }
    });
    notes.current = [];
    setMusicOn(false);
  }

  function beginSurprise() {
    setEntered(true);
    window.setTimeout(() => birthdayRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }

  function celebrateWish() {
    if (wishMade) return;
    setWishMade(true);
    setConfettiKey((key) => key + 1);
  }

  function replay() {
    setEntered(false);
    setWishMade(false);
    setOpenedCards([]);
    setLetterOpen(false);
    setLetterLength(0);
    setLightboxIndex(null);
    setConfettiKey(0);
    setAwakenedStar(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCard(index: number) {
    setOpenedCards((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  }

  function openPhoto(index: number) {
    setLightboxIndex(index);
  }

  const renderedLetter = Array.from(birthdayLetter).slice(0, letterLength).join("");

  return (
    <div className={`birthday-world${entered ? "" : " entry-pending"}`}>
      <div className="cosmic-backdrop" aria-hidden="true">
        <img src={cosmicArtwork} alt="" width={1920} height={1280} fetchPriority="high" />
      </div>
      <div className="star-field" aria-hidden="true" />

      {!entered && (
        <div className="entry-screen" role="dialog" aria-modal="true" aria-labelledby="entry-title">
          <img className="entry-artwork" src={cosmicArtwork} alt="" width={1920} height={1280} />
          <div className="entry-constellation" aria-hidden="true">✦<span>·</span>✧<span>·</span>✦</div>
          <div className="entry-portrait">
            <img src={portraitPhoto} alt="" width={640} height={800} />
            <span className="entry-portrait-ring" aria-hidden="true" />
          </div>
          <p className="eyebrow entry-eyebrow"><Sparkles size={14} aria-hidden="true" /> A little secret, just for you</p>
          <h1 id="entry-title">Hey, <span>Niranjana</span>...<span className="entry-title-sparkle" aria-hidden="true"> ✨</span></h1>
          <p className="entry-copy">Someone hid a universe of you<br className="desktop-break" /> behind this night sky.</p>
          <Button className="surprise-button entry-button" onClick={beginSurprise}>
            Open Your Surprise <Heart size={16} aria-hidden="true" />
          </Button>
          <p className="entry-footnote">A tiny universe, made with love</p>
          <div className="entry-scroll-mark" aria-hidden="true"><span /></div>
        </div>
      )}

      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Niranjana’s birthday universe">
          <span className="wordmark-star">✳</span> FOR NIRANJANA
        </a>
        <nav className="topnav" aria-label="Birthday surprise sections">
          <a href="#memories">Memories</a>
          <a href="#constellation">Constellation</a>
          <a href="#letter">Your letter</a>
        </nav>
        <Button className="music-button" variant="outline" onClick={toggleMusic} aria-label={musicOn ? "Pause birthday music" : "Play birthday music"} title={musicOn ? "Pause music" : "Play music"}>
          {musicOn ? <Volume2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}
          <span>{musicOn ? "Music on" : "Music off"}</span>
        </Button>
      </header>

      <main id="top">
        <section className="birthday-hero" id="birthday" ref={birthdayRef} aria-labelledby="birthday-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> TODAY, THE STARS ARE YOURS <span className="eyebrow-line" /></p>
            <h2 id="birthday-title">Happy Birthday,<br /><span className="name-glow">Niranjana!</span><span className="title-sparkle">🎂</span></h2>
            <p className="hero-blessing">A whole little universe, for one<br className="desktop-break" /> very extraordinary person.</p>
          </div>

          <div className={`cake-scene${wishMade ? " wish-complete" : ""}`} aria-label={wishMade ? "Birthday cake candles blown out" : "Birthday cake with glowing candles"}>
            <div className="hero-polaroids" aria-hidden="true">
              {[memoryPhotoOne, memoryPhotoTwo, memoryPhotoFive].map((src, index) => (
                <span className={`hero-polaroid hero-polaroid-${index}`} key={src}>
                  <img src={src} alt="" />
                </span>
              ))}
            </div>
            <div className="cake-stars" aria-hidden="true">✦ <span>✧</span> · <span>✦</span></div>
            <div className="cake">
              <div className="candles" aria-hidden="true">
                {Array.from({ length: 3 }, (_, index) => <span className="candle" key={index}><i className="flame" /></span>)}
              </div>
              <div className="cake-top"><span className="cake-drip" /></div>
              <div className="cake-tier cake-tier-top"><span className="cake-decoration">✦ &nbsp; · &nbsp; ✦</span></div>
              <div className="cake-tier cake-tier-bottom"><span className="cake-decoration">♡ &nbsp; ✧ &nbsp; ♡</span></div>
              <div className="cake-plate" />
            </div>
            <span className="cake-heart cake-heart-left" aria-hidden="true">♡</span>
            <span className="cake-heart cake-heart-right" aria-hidden="true">♡</span>
          </div>

          <div className="wish-action">
            <Button className="wish-button" variant="outline" onClick={celebrateWish} disabled={wishMade}>
              {wishMade ? <><Check size={16} aria-hidden="true" /> Wish sent to the stars</> : <>Make a Wish <Sparkles size={16} aria-hidden="true" /></>}
            </Button>
            <p>{wishMade ? "May it find its way to you." : "Close your eyes. The stars are listening."}</p>
          </div>
          <a className="scroll-cue" href="#memories"><span>THE NIGHT IS JUST BEGINNING</span><ArrowDown size={14} aria-hidden="true" /></a>
        </section>

        <section className="memory-section story-section" id="memories" aria-labelledby="memories-title">
          <div className="section-heading">
            <p className="eyebrow"><span className="eyebrow-line" /> LITTLE PIECES OF FOREVER <span className="eyebrow-line" /></p>
            <h2 id="memories-title">Five versions of <span>you</span></h2>
            <p>Tap a polaroid. Each one is a tiny universe of its own.</p>
          </div>
          <div className="memory-grid">
            {memories.map((memory, index) => (
              <button className={`memory-card memory-tilt-${index % 3}`} key={memory.src} onClick={() => openPhoto(index)} aria-label={`Open photo ${index + 1}: ${memory.caption}`}>
                <span className="memory-image-wrap">
                  {!missingPhotos.includes(index) ? (
                    <img src={memory.src} alt={memory.caption} loading="lazy" style={{ objectPosition: memory.position }} onError={() => setMissingPhotos((current) => current.includes(index) ? current : [...current, index])} />
                  ) : (
                    <span className="memory-placeholder"><span className="placeholder-star">✧</span><span>YOUR MOMENT<br />GOES HERE</span><span className="placeholder-number">{memory.symbol}</span></span>
                  )}
                  <span className="photo-expand" aria-hidden="true">↗</span>
                </span>
                <span className="memory-caption">{memory.caption}</span>
              </button>
            ))}
          </div>
          <p className="memory-note">Every beautiful story deserves to be remembered.</p>
        </section>

        <section className="constellation-section story-section" id="constellation" aria-labelledby="constellation-title">
          <div className="section-heading">
            <p className="eyebrow"><span className="eyebrow-line" /> FIND YOURSELF IN THE SKY <span className="eyebrow-line" /></p>
            <h2 id="constellation-title">A constellation made of <span>you</span></h2>
            <p>Touch a star. A secret about you is hiding inside it.</p>
          </div>
          <div className="constellation-sky" role="list">
            {memories.map((memory, index) => {
              const isAwake = awakenedStar === index;
              return (
                <button
                  className={`sky-star sky-star-${index}${isAwake ? " sky-star-awake" : ""}`}
                  key={`star-${memory.symbol}`}
                  type="button"
                  role="listitem"
                  aria-pressed={isAwake}
                  aria-label={`Reveal secret ${index + 1}`}
                  onClick={() => setAwakenedStar((current) => (current === index ? null : index))}
                >
                  <span className="sky-star-core" aria-hidden="true">✦</span>
                  <span className="sky-star-bloom">
                    <img src={memory.src} alt="" style={{ objectPosition: memory.position }} />
                    <em>{memory.secret}</em>
                  </span>
                </button>
              );
            })}
            <svg className="constellation-lines" viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden="true">
              <polyline points="18,38 38,16 58,28 74,12 86,34" />
            </svg>
          </div>
        </section>

        <section className="reasons-section story-section" id="reasons" aria-labelledby="reasons-title">
          <div className="section-heading">
            <p className="eyebrow"><span className="eyebrow-line" /> A FEW OF A MILLION <span className="eyebrow-line" /></p>
            <h2 id="reasons-title">Little things that make you <span>you</span></h2>
            <p>Some things simply deserve to be said out loud.</p>
          </div>
          <div className="reasons-grid">
            {reasons.map((reason, index) => {
              const isOpen = openedCards.includes(index);
              return (
                <button className={`reason-card${isOpen ? " reason-card-open" : ""}`} key={reason} onClick={() => openCard(index)} aria-expanded={isOpen}>
                  <span className="reason-orbit" aria-hidden="true">{isOpen ? "♡" : "✧"}</span>
                  <span className="reason-label">{isOpen ? "A LITTLE REMINDER" : `LITTLE NOTE 0${index + 1}`}</span>
                  <span className="reason-message">{isOpen ? reason : "A little something for you…"}</span>
                  <span className="reason-open">{isOpen ? "KEEP THIS ONE CLOSE" : "TAP TO OPEN"}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="letter-section story-section" id="letter" aria-labelledby="letter-title">
          <div className="letter-heading">
            <p className="eyebrow"><span className="eyebrow-line" /> FROM THE HEART <span className="eyebrow-line" /></p>
            <h2 id="letter-title">A little letter,<br /><span>just for you</span> <span className="letter-heart" aria-hidden="true">♡</span></h2>
            <p>There are a few things the stars asked me to tell you.</p>
          </div>
          {!letterOpen ? (
            <button className="envelope-button" onClick={() => { setLetterOpen(true); setLetterLength(0); }} aria-label="Open your birthday letter">
              <span className="envelope-glow" aria-hidden="true" />
              <span className="envelope-icon" aria-hidden="true"><span className="envelope-flap" /><span className="envelope-seal">♡</span></span>
              <span className="envelope-instruction">A little letter, just for you <span aria-hidden="true">✉</span></span>
              <span className="envelope-tap">OPEN WHEN YOU’RE READY</span>
            </button>
          ) : (
            <div className="letter-paper" aria-live="polite">
              <span className="letter-paper-mark" aria-hidden="true">✧</span>
              <p className="letter-content">{renderedLetter}<span className="typing-cursor" aria-hidden="true" /></p>
              {letterLength >= Array.from(birthdayLetter).length && <p className="letter-signature">Written among the stars <span aria-hidden="true">♡</span></p>}
            </div>
          )}
        </section>

        <section className="finale-section" aria-label="Birthday wishes for Niranjana">
          <div className="finale-portrait">
            <img src={portraitPhoto} alt="Niranjana" width={640} height={800} />
          </div>
          <div className="finale-stars" aria-hidden="true">✧　·　✦　·　✧</div>
          <p className="eyebrow">UNTIL ALL THE STARS COME HOME</p>
          <p className="finale-message">Today is your day.<br /><span>Keep shining, Niranjana.</span> <span className="finale-moon" aria-hidden="true">☾</span></p>
          <Button className="replay-button" variant="outline" onClick={replay}><RotateCcw size={15} aria-hidden="true" /> Experience it again</Button>
        </section>
      </main>

      <footer className="site-footer"><span>Made with love <Heart size={13} aria-label="love" /></span><span>A universe for Niranjana <span className="footer-star" aria-hidden="true">✦</span></span></footer>

      {confettiKey > 0 && (
        <div className="confetti-burst" key={confettiKey} aria-hidden="true">
          {Array.from({ length: 38 }, (_, index) => <i key={index} style={{ "--confetti-index": index, "--confetti-x": `${Math.round(Math.cos(index * 2.4) * 300)}px`, "--confetti-y": `${-Math.round(150 + ((index * 37) % 220))}px`, "--confetti-angle": `${index * 83}deg` } as React.CSSProperties} />)}
          {memories.map((memory, index) => (
            <span className={`wish-polaroid wish-polaroid-${index}`} key={`wish-${memory.symbol}`} style={{ "--confetti-index": index } as React.CSSProperties}>
              <img src={memory.src} alt="" />
            </span>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Memory photo viewer" onClick={(event) => { if (event.target === event.currentTarget) setLightboxIndex(null); }}>
          <Button className="lightbox-close icon-control" variant="outline" size="icon" onClick={() => setLightboxIndex(null)} aria-label="Close photo viewer"><X size={19} /></Button>
          <Button className="lightbox-previous icon-control" variant="outline" size="icon" onClick={() => setLightboxIndex((lightboxIndex - 1 + memories.length) % memories.length)} aria-label="Previous photo"><ArrowLeft size={18} /></Button>
          <figure className="lightbox-figure">
            {missingPhotos.includes(lightboxIndex) ? <div className="lightbox-placeholder"><span>✧</span><p>Your moment goes here</p></div> : <img src={memories[lightboxIndex]?.src} alt={memories[lightboxIndex]?.caption ?? "Birthday memory"} />}
            <figcaption>{memories[lightboxIndex]?.caption} <span>· {String(lightboxIndex + 1).padStart(2, "0")} / {String(memories.length).padStart(2, "0")}</span></figcaption>
          </figure>
          <Button className="lightbox-next icon-control" variant="outline" size="icon" onClick={() => setLightboxIndex((lightboxIndex + 1) % memories.length)} aria-label="Next photo"><ArrowRight size={18} /></Button>
        </div>
      )}
      <div className="music-status" role="status" aria-live="polite">{musicOn && <><Music2 size={13} /> A little melody, just for you</>}</div>
    </div>
  );
}