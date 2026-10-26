import Reveal from '../components/Reveal';
import SocialLinks from '../components/SocialLinks';
import SpaceScene from '../components/SpaceScene';
import { EMAIL, JOURNEY, PROJECTS, SKILLS, TOEFL } from '../lib/content';

const ext = { target: '_blank', rel: 'noopener' } as const;
const layerVar = (n: number) => ({ ['--c' as string]: `var(--c${n})` });

export default function Home() {
  return (
    <>
      <SpaceScene />
      <header className="top">
        <a className="brand" href="#top">Amid Hassan</a>
        <nav aria-label="Sections">
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#journey">Journey</a>
          <a href="#english">English</a>
          <a className="pill" href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap">
            <p className="kicker">Chennai, India</p>
            <h1 id="hero-title">I build the <em>whole</em> stack, from the database core to the browser in orbit.</h1>
            <p className="lead">
              I’m Amid Hassan, an MCA student who builds web apps with React, Next.js, Node.js and PostgreSQL and deploys them on AWS.
              I’m looking for developer roles in the UK, the EU, Australia and New Zealand, and I’m open to relocating for a role with visa sponsorship.
            </p>
            <div className="cta">
              <a className="btn" href="#projects">See my projects</a>
              <a className="btn o" href="/Amid_Hassan_Resume.pdf" download>Download resume</a>
            </div>
            <p className="cue">Scroll to travel around the planet</p>
          </div>
        </section>

        <div className="wrap stack">
          <section id="projects" aria-labelledby="projects-title">
            <Reveal>
              <p className="kicker">Flight log</p>
              <h2 id="projects-title">Projects</h2>
            </Reveal>
            {PROJECTS.map((p) => (
              <Reveal className="panel" key={p.title}>
                <h3>{p.title}</h3>
                <p className="meta">{p.meta}</p>
                {p.chips && (
                  <ul className="flow">
                    {p.chips.map((c) => (
                      <li key={c.label} style={layerVar(c.layer)}>{c.label}</li>
                    ))}
                  </ul>
                )}
                <p className="body">{p.text}</p>
                {p.shots && (
                  <div className="shots">
                    {p.shots.map((s) => (
                      <figure key={s.src}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.src} alt={s.alt} loading="lazy" />
                        <figcaption>{s.caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                )}
                {p.links && (
                  <div className="links">
                    {p.links.map((l) => (
                      <a key={l.href} href={l.href} {...ext}>{l.label}</a>
                    ))}
                  </div>
                )}
                {p.note && <p className="note">{p.note}</p>}
              </Reveal>
            ))}
          </section>

          <section id="skills" aria-labelledby="skills-title">
            <Reveal>
              <p className="kicker">Payload</p>
              <h2 id="skills-title">Skills</h2>
            </Reveal>
            <Reveal className="panel">
              <div className="sk">
                {SKILLS.map((s) => (
                  <div className="skrow" key={s.name} style={layerVar(s.layer)}>
                    <b>{s.name}</b>
                    <span>{s.items}</span>
                  </div>
                ))}
              </div>
              <p className="note">Also C, C++, Java, Python, SQL, Git and Unix.</p>
            </Reveal>
          </section>

          <section id="journey" aria-labelledby="journey-title">
            <Reveal>
              <p className="kicker">Trajectory</p>
              <h2 id="journey-title">Study and experience</h2>
            </Reveal>
            <Reveal className="panel">
              <ol className="tl">
                {JOURNEY.map((j) => (
                  <li key={j.title}>
                    <span className="date">{j.date}</span>
                    <h3>{j.title}</h3>
                    <p>{j.text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </section>

          <section id="english" aria-labelledby="english-title">
            <Reveal>
              <p className="kicker">Comms</p>
              <h2 id="english-title">English</h2>
            </Reveal>
            <Reveal className="panel">
              <p className="body">
                TOEFL iBT, taken {TOEFL.date}: {TOEFL.total} out of 120. My MyBest® score, which combines the highest section scores from valid tests, is {TOEFL.myBest}.
              </p>
              {TOEFL.sections.map((s) => (
                <div className="sc" key={s.name}>
                  <span>{s.name}</span>
                  <div><i style={{ ['--v' as string]: s.score }} /></div>
                  <span>{s.score}</span>
                </div>
              ))}
              <p className="note">Section scores are out of 30. I speak Assamese, Bengali, English and Hindi.</p>
            </Reveal>
          </section>

          <section id="contact" aria-labelledby="contact-title">
            <Reveal>
              <p className="kicker">Signal</p>
              <h2 id="contact-title">Let’s talk.</h2>
            </Reveal>
            <Reveal className="panel">
              <p className="body">Email is the fastest way to reach me: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
              <div className="cta">
                <a className="btn" href="/Amid_Hassan_Resume.pdf" download>Download resume (PDF)</a>
              </div>
              <SocialLinks />
            </Reveal>
          </section>
        </div>
      </main>
      <footer>
        <SocialLinks compact />
        <p>Chennai, India. Built with Next.js, TypeScript and Three.js.</p>
      </footer>
    </>
  );
}
