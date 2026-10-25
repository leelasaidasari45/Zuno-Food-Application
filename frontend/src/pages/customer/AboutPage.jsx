import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./AboutPage.css";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page-root">
      {/* Top Navigation Bar */}
      <Navbar />

      <main className="about-main-container">
        {/* Navigation & Breadcrumb */}
        <div className="about-top-bar">
          <button
            type="button"
            className="about-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back</span>
          </button>
        </div>

        {/* HERO SECTION */}
        <section className="about-hero-section">
          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>

          <div className="about-hero-content">
            <div className="about-story-pill">
              <span className="pill-star">★</span>
              <span>The Zunoindia Story</span>
            </div>

            <h1 className="about-hero-title">
              Crafted For People Who Value <br />
              <span className="gradient-highlight">Time & Extraordinary Food.</span>
            </h1>

            <p className="about-hero-subtitle">
              We started Zunoindia with a simple conviction: you should never have to wait 45 minutes
              at a dining table for your food to arrive. By synchronizing diner arrivals with intelligent
              kitchen prep, we make dining out seamless, predictable, and memorable.
            </p>

            {/* Quick Metrics Ribbon */}
            <div className="about-stats-ribbon">
              <div className="stat-card">
                <span className="stat-number">0 min</span>
                <span className="stat-label">Table Waiting Time</span>
              </div>
              <div className="stat-separator"></div>
              <div className="stat-card">
                <span className="stat-number">100+</span>
                <span className="stat-label">Partner Kitchens</span>
              </div>
              <div className="stat-separator"></div>
              <div className="stat-card">
                <span className="stat-number">4.9 ★</span>
                <span className="stat-label">Diner Satisfaction</span>
              </div>
              <div className="stat-separator"></div>
              <div className="stat-card">
                <span className="stat-number">100%</span>
                <span className="stat-label">Hot & Fresh On Arrival</span>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON: THE PROBLEM VS THE ZUNOINDIA SOLUTION */}
        <section className="about-comparison-section">
          <div className="section-header-centered">
            <span className="section-eyebrow">Why We Built This</span>
            <h2 className="section-title">The Shift In How We Dine</h2>
            <p className="section-desc">
              Traditional dining creates unnecessary friction for both hungry diners and overwhelmed kitchen staff.
            </p>
          </div>

          <div className="comparison-grid">
            {/* The Old Way Card */}
            <div className="comparison-card old-way-card">
              <div className="card-badge old-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                The Traditional Hassle
              </div>
              <ul className="comparison-list">
                <li>
                  <span className="list-icon-cross">✕</span>
                  <div>
                    <strong>Long Unplanned Waits:</strong> Waiting 20–45 minutes for a table during lunch or dinner rush hours.
                  </div>
                </li>
                <li>
                  <span className="list-icon-cross">✕</span>
                  <div>
                    <strong>Cooking Delays:</strong> Ordering after being seated and waiting another 30 minutes while starving.
                  </div>
                </li>
                <li>
                  <span className="list-icon-cross">✕</span>
                  <div>
                    <strong>Stressed Kitchens:</strong> Sudden spikes of orders causing order mistakes and slow table turnaround.
                  </div>
                </li>
              </ul>
            </div>

            {/* The Zunoindia Way Card */}
            <div className="comparison-card new-way-card">
              <div className="card-badge new-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                The Zunoindia Experience
              </div>
              <ul className="comparison-list">
                <li>
                  <span className="list-icon-check">✓</span>
                  <div>
                    <strong>Scheduled Arrival:</strong> Pick your exact arrival time and reserved table slot in advance.
                  </div>
                </li>
                <li>
                  <span className="list-icon-check">✓</span>
                  <div>
                    <strong>Pre-Cooked Precision:</strong> Kitchen prepares your dishes to be hot and ready the second you sit down.
                  </div>
                </li>
                <li>
                  <span className="list-icon-check">✓</span>
                  <div>
                    <strong>Smooth Kitchen Flow:</strong> Restaurants prepare meals in an organized queue with zero chaos.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (3 SIMPLE STEPS) */}
        <section className="about-how-it-works-section">
          <div className="section-header-centered">
            <span className="section-eyebrow">Effortless Dining</span>
            <h2 className="section-title">How Zunoindia Works</h2>
            <p className="section-desc">Experience 3 streamlined steps from hungry to fully satisfied.</p>
          </div>

          <div className="steps-container-grid">
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-number-pill">01</div>
              <div className="step-icon-box">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="step-title">Choose & Schedule</h3>
              <p className="step-desc">
                Browse hand-picked local restaurants, view authentic ratings, and choose your preferred dining time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="step-number-pill">02</div>
              <div className="step-icon-box">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
              <h3 className="step-title">Pre-Order Favorites</h3>
              <p className="step-desc">
                Customize your cart with mouth-watering dishes. The kitchen automatically queues cooking based on your schedule.
              </p>
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="step-number-pill">03</div>
              <div className="step-icon-box">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3 className="step-title">Arrive & Feast</h3>
              <p className="step-desc">
                Walk straight to your table. Your meal is brought out hot, fresh, and ready for you to enjoy immediately.
              </p>
            </div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="about-values-section">
          <div className="section-header-centered">
            <span className="section-eyebrow">Our Philosophy</span>
            <h2 className="section-title">Built On Hospitality & Precision</h2>
          </div>

          <div className="values-grid">
            <div className="value-item-card">
              <div className="value-icon-wrapper">⏱️</div>
              <h4>Time Is Sacred</h4>
              <p>Your lunch break or weekend dinner shouldn't be consumed by staring at empty restaurant tables waiting for a ticket.</p>
            </div>

            <div className="value-item-card">
              <div className="value-icon-wrapper">🔥</div>
              <h4>Fresh, Never Stale</h4>
              <p>Our scheduling sync ensures food isn't cooked hours early; it finishes cooking right as you arrive at the restaurant.</p>
            </div>

            <div className="value-item-card">
              <div className="value-icon-wrapper">🤝</div>
              <h4>Empowering Chefs</h4>
              <p>We provide restaurant owners and chefs with clear visibility of incoming orders, eliminating chaotic kitchen rushes.</p>
            </div>

            <div className="value-item-card">
              <div className="value-icon-wrapper">💎</div>
              <h4>Transparent & Safe</h4>
              <p>Clear pricing, authentic menus, secure JWT authentication, and real-time visual 5-stage order status updates.</p>
            </div>
          </div>
        </section>

        {/* CREATOR & TECH STACK SPOTLIGHT */}
        <section className="about-creator-section">
          <div className="creator-card">
            <div className="creator-info-side">
              <span className="creator-tag">The Maker</span>
              <h3 className="creator-name">Developed by Leela Sai Dasari</h3>
              <p className="creator-bio">
                Zunoindia was built as an ambitious, full-stack dining platform using the <strong>MERN Stack</strong>
                (MongoDB, Express, React, Node.js) with a focus on high-performance UX, responsive UI aesthetics,
                and seamless table management algorithms.
              </p>

              <div className="creator-links">
                <a
                  href="https://github.com/leelasaidasari45/Zuno-Food-Application"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="creator-gh-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                  </svg>
                  <span>View On GitHub</span>
                </a>
                <Link to="/home" className="creator-explore-btn">
                  <span>Explore Restaurants</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>

            <div className="creator-tech-badges">
              <span className="tech-badge">React 19</span>
              <span className="tech-badge">Vite</span>
              <span className="tech-badge">Node.js</span>
              <span className="tech-badge">Express</span>
              <span className="tech-badge">MongoDB Atlas</span>
              <span className="tech-badge">JWT Security</span>
              <span className="tech-badge">Vercel & Render</span>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION BANNER */}
        <section className="about-cta-section">
          <div className="cta-banner-card">
            <h2 className="cta-banner-title">Ready To Dine Without The Wait?</h2>
            <p className="cta-banner-text">
              Browse top-rated restaurants near you, schedule your table, and pre-order your meals right now.
            </p>
            <div className="cta-buttons-group">
              <Link to="/home" className="cta-primary-btn">
                <span>Start Pre-Ordering</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <Link to="/" className="cta-secondary-btn">
                <span>Restaurant Partner Sign In</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">Zuno<span>india</span></span>
            <p className="footer-tagline">Food, scheduled for you. 🍽️</p>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} Zunoindia. Built for seamless dining.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
