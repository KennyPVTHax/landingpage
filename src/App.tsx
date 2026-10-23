import { useState } from "react";
import listing from "./data/listing.json";
import Header from "./components/Header";
import Icon from "./components/Icon";
import Modal from "./components/Modal";
import Carousel, { screenshots } from "./components/Carousel";

const external = { target: "_blank", rel: "noopener noreferrer" };
const safetyUrl =
  "https://play.google.com/store/apps/datasafety?id=com.nic.mparivahan";
function SectionHeading({
  title,
  action,
  href,
}: {
  title: string;
  action?: () => void;
  href?: string;
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {href ? (
        <a
          className="icon-button"
          href={href}
          {...external}
          aria-label={`More about ${title}`}
        >
          <Icon name="arrow_forward" />
        </a>
      ) : (
        <button
          className="icon-button"
          onClick={action}
          aria-label={`More about ${title}`}
        >
          <Icon name="arrow_forward" />
        </button>
      )}
    </div>
  );
}
function ContentRating() {
  return (
    <div className="content-rating">
      <img src="/assets/image-20.webp" width="38" height="38" alt="IARC 3+" />
      <div>
        <span>Rated for 3+</span>
        <a
          href="https://support.google.com/googleplay?p=appgame_ratings"
          {...external}
        >
          Learn more
        </a>
      </div>
    </div>
  );
}
function Review({
  review,
  notify,
}: {
  review: (typeof listing.reviewsSnapshot)[number];
  notify: (message: string) => void;
}) {
  const [vote, setVote] = useState("");
  return (
    <article className="review">
      <div className="review-author">
        <img src={`/assets/${review.avatar}`} width="32" height="32" alt="" />
        <span>{review.name}</span>
        <a
          href={`${listing.officialUrl}&showAllReviews=true`}
          {...external}
          className="icon-button"
          aria-label={`More actions for ${review.name}'s review`}
        >
          <Icon name="more_vert" />
        </a>
      </div>
      <div className="review-date">
        <span className="stars" aria-label="1 out of 5 stars">
          ★<span>★★★★</span>
        </span>
        <time>{review.date}</time>
      </div>
      <p>{review.text}</p>
      <div className="helpful-count">
        {review.helpful} people found this review helpful
      </div>
      <div className="review-vote">
        <span>Did you find this helpful?</span>
        {["Yes", "No"].map((v) => (
          <button
            key={v}
            aria-pressed={vote === v}
            onClick={() => {
              setVote(v);
              notify("Feedback selected for this local demo only.");
            }}
          >
            {v}
          </button>
        ))}
      </div>
      {review.reply ? (
        <div className="developer-reply">
          <div>
            <span>{listing.publisher}</span>
            <time>{review.reply.date}</time>
          </div>
          <p>{review.reply.text}</p>
        </div>
      ) : null}
    </article>
  );
}
function Related({ similar = false }: { similar?: boolean }) {
  const apps = similar ? listing.related.slice(6) : listing.related.slice(0, 6);
  return (
    <section className="related">
      <SectionHeading
        title={similar ? "Similar apps" : `More by ${listing.publisher}`}
        href={similar ? listing.officialUrl : listing.publisherUrl}
      />
      <div className="related-list">
        {apps.map((app) => (
          <a
            key={app.title}
            href={app.url}
            {...external}
            className="related-app"
          >
            <img
              src={`/assets/${app.image}`}
              width="64"
              height="64"
              alt=""
              loading="lazy"
            />
            <div>
              <span>{app.title}</span>
              <span>{app.publisher}</span>
              <small>{app.rating}★</small>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
function Support() {
  const [open, setOpen] = useState(false);
  return (
    <section className="support">
      <h2>
        <button
          aria-expanded={open}
          aria-controls="support-details"
          onClick={() => setOpen((v) => !v)}
        >
          App support
          <Icon name={open ? "expand_less" : "expand_more"} />
        </button>
      </h2>
      {open ? (
        <div id="support-details">
          <a href="https://parivahan.gov.in/" {...external}>
            <Icon name="public" />
            <span>Website</span>
          </a>
          <a href="tel:+911204925505">
            <Icon name="phone" />
            <span>
              Phone number<small>+911204925505</small>
            </span>
          </a>
          <a href="mailto:helpdesk-mparivahan@gov.in">
            <Icon name="email" />
            <span>
              Support email<small>helpdesk-mparivahan@gov.in</small>
            </span>
          </a>
          <a
            href="https://mparivahan.parivahan.gov.in/privacy-policy.html"
            {...external}
          >
            <Icon name="shield" />
            <span>Privacy Policy</span>
          </a>
          <div>
            <Icon name="info_outline" />
            <span>
              About the developer
              <small>
                National Informatics Centre
                <br />
                developer.mapmyindia@gmail.com
                <br />
                A-BLOCK, CGO COMPLEX LODHI ROAD
                <br />
                NEW DELHI, Delhi 110003
                <br />
                India
                <br />
                +91 94180 28835
              </small>
            </span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
function Footer() {
  const names = [
    "Play Pass",
    "Play Points",
    "Gift cards",
    "Redeem",
    "Refund policy",
    "Parent Guide",
    "Family sharing",
    "Terms of Service",
    "Privacy",
    "About Google Play",
    "Developers",
    "Google Store",
  ];
  const links = names
    .map((name) => listing.footerLinks.find((l) => l.text.trim() === name)!)
    .filter(Boolean);
  return (
    <footer className="footer page-width">
      <div className="footer-columns">
        <div>
          <p>Google Play</p>
          {links.slice(0, 5).map((l) => (
            <a key={l.text} href={l.href} {...external}>
              {l.text}
            </a>
          ))}
        </div>
        <div>
          <p>Kids & family</p>
          {links.slice(5, 7).map((l) => (
            <a key={l.text} href={l.href} {...external}>
              {l.text}
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        {links.slice(7).map((l) => (
          <a key={l.text} href={l.href} {...external}>
            {l.text}
          </a>
        ))}
        <span>All prices include GST.</span>
        <span className="region">
          <img src="/assets/image-33.png" width="24" height="18" alt="India" />
          {listing.region}
        </span>
      </div>
      <p className="study-notice">
        Private local UI study. Not affiliated with Google, NIC, or the
        Government of India. Snapshot: 23 October 2026. No app installation or
        account changes occur here.
      </p>
    </footer>
  );
}
export default function App() {
  const [modal, setModal] = useState<"about" | "reviews" | null>(null);
  const [shot, setShot] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [copyFallback, setCopyFallback] = useState(false);
  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          url: listing.officialUrl,
        });
        setNotice("Official listing shared.");
      } else {
        await navigator.clipboard.writeText(listing.officialUrl);
        setNotice("Official Google Play link copied.");
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      setCopyFallback(true);
      setNotice("Copy the official listing link below.");
    }
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <section className="hero">
          <div className="hero-inner page-width">
            <div className="trailer-art" aria-hidden="true">
              <img src="/assets/image-1.jpg" width="480" height="360" alt="" />
              <div className="trailer-shade" />
            </div>
            <div className="hero-copy">
              <div className="app-identity">
                <img
                  className="mobile-app-icon"
                  src="/assets/image-2.webp"
                  width="96"
                  height="96"
                  alt="NextGen mParivahan app icon"
                />
                <div>
                  <h1>{listing.title}</h1>
                  <a
                    className="publisher"
                    href={listing.publisherUrl}
                    {...external}
                  >
                    {listing.publisher}
                  </a>
                </div>
              </div>
              <div className="stats" aria-label="App information">
                <img
                  className="desktop-app-icon"
                  src="/assets/image-3.webp"
                  width="48"
                  height="48"
                  alt="NextGen mParivahan app icon"
                />
                <div className="stat">
                  <strong>
                    {listing.rating}
                    <span className="tiny-star">★</span>
                  </strong>
                  <span>{listing.reviews} reviews</span>
                </div>
                <div className="stat mobile-rating">
                  <img
                    src="/assets/image-4.webp"
                    width="16"
                    height="16"
                    alt=""
                  />
                  <span>
                    Rated for 3+ <Icon name="info_outline" />
                  </span>
                </div>
                <div className="stat">
                  <strong className="government">
                    <Icon name="account_balance" />
                  </strong>
                  <span>
                    Government{" "}
                    <a
                      href={listing.officialUrl}
                      {...external}
                      aria-label="About the Government badge"
                    >
                      <Icon name="info_outline" />
                    </a>
                  </span>
                </div>
                <div className="stat">
                  <strong>{listing.downloads}</strong>
                  <span>Downloads</span>
                </div>
              </div>
              <div className="hero-actions">
                <a className="install" href={listing.officialUrl} {...external}>
                  Install
                </a>
                <div className="secondary-actions">
                  <button className="text-button" onClick={share}>
                    <Icon name="share" />
                    <span>Share</span>
                  </button>
                  <a
                    className="text-button"
                    href={listing.officialUrl}
                    {...external}
                  >
                    <Icon name="bookmark_add" />
                    <span>Add to wishlist</span>
                  </a>
                </div>
              </div>
            </div>
            <a
              className="trailer-button"
              href="https://www.youtube.com/watch?v=d0JuFxJIukc"
              {...external}
              aria-label="Play official trailer"
            >
              <Icon name="play_arrow" />
              Trailer
            </a>
          </div>
        </section>
        <div className="content-layout page-width">
          <div className="main-column">
            <div className="tablet-content-rating">
              <ContentRating />
            </div>
            <Carousel onOpen={setShot} />
            <section className="about">
              <SectionHeading
                title="About this app"
                action={() => setModal("about")}
              />
              <div className="description-preview">{listing.description}</div>
              <div className="updated">
                <strong>Updated on</strong>
                <span>{listing.updated}</span>
              </div>
              <a
                className="category"
                href="https://play.google.com/store/apps/category/PRODUCTIVITY"
                {...external}
              >
                Productivity
              </a>
            </section>
            <section className="data-safety">
              <SectionHeading title="Data safety" href={safetyUrl} />
              <p>
                Safety starts with understanding how developers collect and
                share your data. Data privacy and security practices may vary
                based on your use, region, and age. The developer provided this
                information and may update it over time.
              </p>
              <div className="safety-card">
                <div>
                  <img
                    src="/assets/image-13.webp"
                    width="20"
                    height="20"
                    alt=""
                  />
                  <span>
                    No data shared with third parties
                    <small>
                      <a
                        href="https://support.google.com/googleplay?p=data-safety&hl=en"
                        {...external}
                      >
                        Learn more
                      </a>{" "}
                      about how developers declare sharing
                    </small>
                  </span>
                </div>
                <div>
                  <img
                    src="/assets/image-14.webp"
                    width="20"
                    height="20"
                    alt=""
                  />
                  <span>
                    This app may collect these data types
                    <small>Location, Personal info and 5 others</small>
                  </span>
                </div>
                <div>
                  <img
                    src="/assets/image-15.webp"
                    width="20"
                    height="20"
                    alt=""
                  />
                  <span>Data is encrypted in transit</span>
                </div>
                <div>
                  <img
                    src="/assets/image-16.webp"
                    width="20"
                    height="20"
                    alt=""
                  />
                  <span>You can request that data be deleted</span>
                </div>
                <a className="text-button" href={safetyUrl} {...external}>
                  See details
                </a>
              </div>
            </section>
            <section className="ratings">
              <div className="ratings-heading">
                <SectionHeading
                  title="Ratings and reviews"
                  action={() => setModal("reviews")}
                />
                <a
                  className="verified"
                  href="https://support.google.com/googleplay/answer/113410"
                  {...external}
                >
                  Ratings and reviews are verified <Icon name="info_outline" />
                </a>
              </div>
              <div className="device-tabs">
                <button aria-pressed="true">
                  <Icon name="phone_android" />
                  Phone
                </button>
                <a
                  href={`${listing.officialUrl}&showAllReviews=true`}
                  {...external}
                >
                  <Icon name="tablet_android" />
                  Tablet
                </a>
              </div>
              <div className="rating-summary">
                <div>
                  <strong>{listing.rating}</strong>
                  <span className="stars" aria-label="3.7 out of 5 stars">
                    ★★★<span className="partial-star">★</span>
                    <span>★</span>
                  </span>
                  <small>{listing.phoneReviews} reviews</small>
                </div>
                <div className="rating-bars">
                  {listing.distribution.map((n, i) => (
                    <div
                      key={i}
                      role="img"
                      aria-label={`${n.toLocaleString("en-IN")} reviews for star rating ${5 - i}`}
                    >
                      <span>{5 - i}</span>
                      <div>
                        <i
                          style={{
                            width: `${(n / listing.distribution.reduce((a, b) => a + b, 0)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="review-list">
                {listing.reviewsSnapshot.map((r) => (
                  <Review key={r.name} review={r} notify={setNotice} />
                ))}
              </div>
              <button
                className="text-button see-all"
                onClick={() => setModal("reviews")}
              >
                See all reviews
              </button>
            </section>
            <a
              className="flag"
              href="https://support.google.com/googleplay/?p=report_content"
              {...external}
            >
              <Icon name="flag" />
              Flag as inappropriate
            </a>
          </div>
          <aside className="sidebar">
            <div className="desktop-content-rating">
              <ContentRating />
            </div>
            <Support />
            <Related />
            <Related similar />
          </aside>
        </div>
      </main>
      <Footer />
      <div
        className={notice ? "toast visible" : "toast"}
        role="status"
        aria-live="polite"
      >
        {notice}
        {notice ? (
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <Icon name="close" />
          </button>
        ) : null}
        {copyFallback ? (
          <input
            aria-label="Official listing URL to copy"
            value={listing.officialUrl}
            readOnly
            onFocus={(e) => e.target.select()}
          />
        ) : null}
      </div>
      {modal ? (
        <Modal
          title={modal === "about" ? "About this app" : "Ratings and reviews"}
          onClose={() => setModal(null)}
        >
          {modal === "about" ? (
            <>
              <div className="modal-app">
                <img src="/assets/image-3.webp" width="48" height="48" alt="" />
                <h3>{listing.title}</h3>
              </div>
              <div className="full-description">{listing.description}</div>
              <dl className="app-details">
                {[
                  ["Version", listing.version],
                  ["Updated on", listing.updated],
                  ["Requires Android", "8.1 and up"],
                  ["Downloads", "100,000,000+ downloads"],
                  ["Content rating", "Rated for 3+"],
                  ["Released on", "Jan 10, 2017"],
                  ["Offered by", listing.publisher],
                ].map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <>
              <p className="demo-explanation">
                Public review snapshot from 23 October 2026.
              </p>
              {listing.reviewsSnapshot.map((r) => (
                <Review key={r.name} review={r} notify={setNotice} />
              ))}
              <a
                className="text-button"
                href={`${listing.officialUrl}&showAllReviews=true`}
                {...external}
              >
                View current reviews on Google Play
              </a>
            </>
          )}
        </Modal>
      ) : null}
      {shot !== null ? (
        <Modal
          title={`Screenshot ${shot + 1} of ${screenshots.length}`}
          full
          onClose={() => setShot(null)}
          onKeyDown={(key) => {
            if (key === "ArrowRight")
              setShot((i) => ((i ?? 0) + 1) % screenshots.length);
            if (key === "ArrowLeft")
              setShot(
                (i) => ((i ?? 0) - 1 + screenshots.length) % screenshots.length,
              );
          }}
        >
          <div className="lightbox-content">
            <button
              className="icon-button"
              aria-label="Previous screenshot"
              onClick={() => setShot((i) => ((i ?? 0) - 1 + 7) % 7)}
            >
              <Icon name="chevron_left" />
            </button>
            <img
              src={`/assets/screenshot-full-${shot}.webp`}
              alt={`NextGen mParivahan screenshot ${shot + 1}`}
              width="131"
              height="296"
            />
            <button
              className="icon-button"
              aria-label="Next screenshot"
              onClick={() => setShot((i) => ((i ?? 0) + 1) % 7)}
            >
              <Icon name="chevron_right" />
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
