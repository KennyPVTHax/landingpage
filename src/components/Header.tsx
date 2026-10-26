import Icon from "./Icon";
export default function Header() {
  return (
    <header className="site-header">
      <nav aria-label="Google Play navigation">
        <a
          className="brand"
          href="https://play.google.com/store/games"
          aria-label="Google Play"
        >
          <img
            className="play-logo"
            src="/assets/google-play.svg"
            width="40"
            height="40"
            alt=""
          />
          <span>Google Play</span>
        </a>
        <div className="nav-tabs">
          {["Games", "Apps", "Books", "Kids"].map((t) => (
            <a
              key={t}
              className={t === "Apps" ? "active" : ""}
              aria-current={t === "Apps" ? "page" : undefined}
              href={`https://play.google.com/store/${t === "Kids" ? "apps/category/FAMILY" : t.toLowerCase()}`}
            >
              {t}
            </a>
          ))}
        </div>
        <div className="header-actions">
          <a
            className="icon-button"
            aria-label="Search Google Play"
            href="https://play.google.com/store/search?q=mparivahan&c=apps"
          >
            <Icon name="search" />
          </a>
          <a
            className="icon-button"
            aria-label="Help Center"
            href="https://support.google.com/googleplay/"
          >
            <Icon name="help_outline" />
          </a>
          <a
            className="icon-button"
            href="https://play.google.com/store/apps/details?id=com.nic.mparivahan"
            aria-label="Open account on official Google Play"
          >
            <img src="/assets/image-0.png" width="32" height="32" alt="" />
          </a>
        </div>
      </nav>
    </header>
  );
}
