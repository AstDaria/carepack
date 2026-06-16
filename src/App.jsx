import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import LanguageSwitch from "./components/LanguageSwitch.jsx";

const icon = (name) => `/icons/${name}.png`;

const icons = {
  hero: icon("hero"),
  aboutStress: icon("icon1"),
  aboutSolution: icon("icon2"),
  aboutService: icon("icon3"),
  notPackFurniture: icon("icon4"),
  notPackHeavy: icon("icon5"),
  notPackAppliances: icon("icon6"),
  notPackAnimals: icon("icon7"),
  notPackPlants: icon("icon8"),
  notPackHazard: icon("icon9"),
  packages: icon("packages"),
  payment: icon("payment"),
  forWho: icon("audience"),
  contact: icon("contact"),
  eco: icon("leaf"),
};

function AnchorNav({ baseHref = "" }) {
  const { t } = useTranslation();
  const items = [
    ["about", t("nav.about")],
    ["for-who", t("nav.forWho")],
    ["process", t("nav.process")],
    ["packages", t("nav.packages")],
    ["not-pack", t("nav.notPack")],
    ["contact", t("nav.contact")],
  ];

  return (
    <nav className="nav" aria-label="On-page navigation">
      <a className="nav__brand" href="/">
        {t("brand.name")}
      </a>

      <div className="nav__links">
        {items.map(([href, label]) => (
          <a key={href} className="nav__link" href={`${baseHref}#${href}`}>
            {label}
          </a>
        ))}
      </div>

      <div className="nav__right">
        <LanguageSwitch />
      </div>
    </nav>
  );
}

function TermsPage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app">
      <AnchorNav baseHref="/" />

      <main className="main">
        <section className="terms">
          <div className="terms__container">
            <h2 className="terms__title">{t("terms.title")}</h2>
            <p className="terms__acceptance">{t("terms.acceptance")}</p>
            <div className="terms__sections">
              {t("terms.sections", { returnObjects: true }).map(
                (section, idx) => (
                  <div key={idx} className="terms__section">
                    <h3 className="terms__section-heading">
                      {section.heading}
                    </h3>
                    <p className="terms__section-text">{section.text}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__container">
          <div className="footer__left">
            <div className="footer__brand">{t("brand.name")}</div>
            <span className="footer__email">{t("contact.email")}</span>
          </div>
          <div className="footer__note">{t("footer.note")}</div>
          <a className="footer__terms-link" href="/terms">
            {t("nav.terms")}
          </a>
        </div>
      </footer>
    </div>
  );
}

function ContactForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    company: "", // honeypot
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear a field's error as soon as the user edits it
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = t("contact.form.errors.name");
    if (!form.phone.trim()) next.phone = t("contact.form.errors.phone");
    if (!form.email.trim()) next.email = t("contact.form.errors.email");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = t("contact.form.errors.emailInvalid");
    if (!form.message.trim()) next.message = t("contact.form.errors.message");
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "", company: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="contact__status contact__status--success" role="status">
        {t("contact.form.success")}
      </p>
    );
  }

  const fieldError = (name) =>
    errors[name] ? (
      <span className="contact__field-error" role="alert">
        {errors[name]}
      </span>
    ) : null;

  const inputClass = (name) =>
    `contact__input${errors[name] ? " contact__input--error" : ""}`;

  return (
    <form className="contact__form" onSubmit={onSubmit} noValidate>
      <div className="contact__form-row">
        <div className="contact__field">
          <input
            className={inputClass("name")}
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder={t("contact.form.name")}
            aria-label={t("contact.form.name")}
            aria-invalid={errors.name ? "true" : undefined}
          />
          {fieldError("name")}
        </div>
        <div className="contact__field">
          <input
            className={inputClass("phone")}
            type="tel"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder={t("contact.form.phone")}
            aria-label={t("contact.form.phone")}
            aria-invalid={errors.phone ? "true" : undefined}
          />
          {fieldError("phone")}
        </div>
      </div>
      <div className="contact__field">
        <input
          className={inputClass("email")}
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder={t("contact.form.email")}
          aria-label={t("contact.form.email")}
          aria-invalid={errors.email ? "true" : undefined}
        />
        {fieldError("email")}
      </div>
      <div className="contact__field">
        <textarea
          className={`${inputClass("message")} contact__textarea`}
          name="message"
          value={form.message}
          onChange={onChange}
          placeholder={t("contact.form.message")}
          aria-label={t("contact.form.message")}
          rows={4}
          aria-invalid={errors.message ? "true" : undefined}
        />
        {fieldError("message")}
      </div>
      {/* Honeypot — hidden from users, catches bots */}
      <input
        className="contact__honeypot"
        type="text"
        name="company"
        value={form.company}
        onChange={onChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <button
        className="button button--primary contact__submit"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending"
          ? t("contact.form.sending")
          : t("contact.form.submit")}
      </button>
      {status === "error" && (
        <p className="contact__status contact__status--error" role="alert">
          {t("contact.form.error")}
        </p>
      )}
    </form>
  );
}

function MainPage() {
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -150px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="app">
      <AnchorNav />

      <header className="hero">
        <div className="hero__container">
          <div className="hero__content">
            <h1 className="hero__title">{t("hero.subtitle")}</h1>
            <p className="hero__text">{t("hero.text")}</p>
            <div className="hero__actions">
              <a className="button button--primary" href="#contact">
                {t("hero.ctaPrimary")}
              </a>
            </div>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <img className="hero__image" src={icons.hero} alt="" />
          </div>
        </div>
      </header>

      <main className="main">
        <section className="banner banner--accent">
          <div className="banner__container">
            <div className="banner__items">
              <span className="banner__item">
                {t("banners.accent.item1")}{" "}
                <span className="banner__highlight">
                  {t("banners.accent.highlight1")}
                </span>
              </span>
              <span className="banner__sep banner__sep--1"></span>
              <span className="banner__item">
                {t("banners.accent.item2")}{" "}
                <span className="banner__highlight">
                  {t("banners.accent.highlight2")}
                </span>
              </span>
              <span className="banner__sep banner__sep--2"></span>
              <span className="banner__item">
                {t("banners.accent.item3")}{" "}
                <span className="banner__highlight">
                  {t("banners.accent.highlight3")}
                </span>
              </span>
              <span className="banner__sep banner__sep--3"></span>
              <span className="banner__item">{t("banners.accent.item4")}</span>
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <div className="about__container">
            <div className="about__grid">
              <div className="about__item">
                <img className="about__icon" src={icons.aboutStress} alt="" />
                <h3 className="about__title">{t("about.stressTitle")}</h3>
                <p className="about__text">{t("about.stressText")}</p>
              </div>
              <div className="about__item">
                <img
                  className="about__icon"
                  src={icons.aboutSolution}
                  alt=""
                />
                <h3 className="about__title">{t("about.solutionTitle")}</h3>
                <p className="about__text">{t("about.solutionText")}</p>
              </div>
              <div className="about__item">
                <img className="about__icon" src={icons.aboutService} alt="" />
                <h3 className="about__title">{t("about.serviceTitle")}</h3>
                <p className="about__text">{t("about.serviceText")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="banner banner--eco">
          <div className="banner__container">
            <p className="banner__text">
              {t("banners.eco.part1")}{" "}
              <span className="banner__highlight">
                {t("banners.eco.highlight")}
              </span>{" "}
              {t("banners.eco.part2")}
            </p>
            <img className="banner__icon" src={icons.eco} alt="" />
          </div>
        </section>

        <section id="for-who" className="for-who">
          <div className="for-who__container">
            <h2 className="for-who__title">{t("forWho.title")}</h2>
            <div className="for-who__content">
              {t("forWho.items", { returnObjects: true }).map((item, idx) => {
                const isReverse = idx % 2 === 1;
                return (
                  <div
                    key={idx}
                    className={`for-who__item${isReverse ? " for-who__item--reverse" : ""}`}
                  >
                    <div
                      className={`for-who__card${isReverse ? " for-who__card--reverse" : ""} reveal`}
                    >
                      <h4
                        className="for-who__card-heading"
                        dangerouslySetInnerHTML={{ __html: item.heading }}
                      />
                      {item.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="for-who__card-text">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="banner banner--amber">
          <div className="banner__container">
            <p className="banner__text">
              {t("process.ecoBanner.part1")}{" "}
              <span className="banner__highlight">
                {t("process.ecoBanner.highlight")}
              </span>{" "}
              {t("process.ecoBanner.part2")}
            </p>
          </div>
        </div>

        <section id="process" className="process">
          <div className="process__container">
            <h2 className="process__title">{t("process.title")}</h2>
            <div className="process__list">
              {t("process.steps", { returnObjects: true }).map((step, idx) => (
                <div
                  key={idx}
                  className="process__step reveal"
                  style={{ transitionDelay: `${idx * 0.12}s` }}
                >
                  <span className="process__step-number"></span>
                  <div className="process__step-content">
                    <span className="process__step-title">{step.title}</span>
                    <p className="process__step-text">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="packages" className="packages">
          <div className="packages__container">
            <h2 className="packages__title">{t("packages.title")}</h2>
            <p className="packages__intro">{t("packages.intro")}</p>
            <div className="packages__items">
              {[
                { key: "s", letter: "S", cls: "s" },
                { key: "m", letter: "M", cls: "m" },
                { key: "l", letter: "L", cls: "l" },
              ].map(({ key, letter, cls }) => (
                <div
                  key={key}
                  className={`packages__item packages__item--${cls}`}
                >
                  <div className={`packages__letter packages__letter--${cls}`}>
                    {letter}
                  </div>
                  <div className="packages__name">
                    {t(`packages.${key}.name`)}
                  </div>
                  <div className="packages__tags">
                    {t(`packages.${key}.details`)
                      .split(" · ")
                      .filter((tag) => !tag.includes("€"))
                      .map((tag, i) => (
                        <span key={i} className="packages__tag">
                          {tag}
                        </span>
                      ))}
                  </div>
                  {t(`packages.${key}.details`)
                    .split(" · ")
                    .filter((tag) => tag.includes("€"))
                    .map((tag, i) => (
                      <span
                        key={i}
                        className="packages__tag packages__tag--price"
                      >
                        {tag}
                      </span>
                    ))}
                  <a href="#contact" className="packages__cta">
                    {t("packages.cta")}
                  </a>
                </div>
              ))}
            </div>
            <div className="packages__banner">
              <h3 className="packages__banner-title">
                <span className="packages__banner-xl">XL</span>
                <span className="packages__banner-heading">
                  {t("packages.bannerTitle")}
                </span>
              </h3>
              <p className="packages__banner-text">
                {t("packages.bannerText")}
              </p>
              <a href="#contact" className="packages__banner-cta">
                {t("packages.cta")}
              </a>
            </div>
          </div>
        </section>

        <div className="packages__payment">
          <h3 className="payment__title">{t("payment.title")}</h3>
          <p className="payment__schedule">{t("payment.schedule")}</p>
          <p className="payment__description">{t("payment.description")}</p>
          <p className="payment__terms-hint">
            {t("payment.termsHint")}{" "}
            <a className="payment__terms-link" href="/terms">
              {t("nav.terms")}
            </a>
          </p>
        </div>

        <section id="not-pack" className="not-pack">
          <div className="not-pack__container">
            <h2 className="not-pack__title">{t("notPack.title")}</h2>
            <div className="not-pack__grid">
              <div className="not-pack__item">
                <img
                  className="not-pack__icon"
                  src={icons.notPackFurniture}
                  alt=""
                />
                <span className="not-pack__text">{t("notPack.items.0")}</span>
              </div>
              <div className="not-pack__item">
                <img
                  className="not-pack__icon"
                  src={icons.notPackAppliances}
                  alt=""
                />
                <span className="not-pack__text">{t("notPack.items.1")}</span>
              </div>
              <div className="not-pack__item">
                <img
                  className="not-pack__icon"
                  src={icons.notPackHeavy}
                  alt=""
                />
                <span className="not-pack__text">{t("notPack.items.2")}</span>
              </div>
              <div className="not-pack__item">
                <img
                  className="not-pack__icon"
                  src={icons.notPackHazard}
                  alt=""
                />
                <span className="not-pack__text">{t("notPack.items.3")}</span>
              </div>
              <div className="not-pack__item">
                <img
                  className="not-pack__icon"
                  src={icons.notPackPlants}
                  alt=""
                />
                <span className="not-pack__text">{t("notPack.items.4")}</span>
              </div>
              <div className="not-pack__item">
                <img
                  className="not-pack__icon"
                  src={icons.notPackAnimals}
                  alt=""
                />
                <span className="not-pack__text">{t("notPack.items.5")}</span>
              </div>
            </div>
            <div className="not-pack__caption">
              <p className="not-pack__caption-text">{t("notPack.outro")}</p>
            </div>
          </div>
        </section>

        <div className="unpack-banner">
          <div className="unpack-banner__container">
            <h3 className="unpack-banner__title">
              {t("banners.unpack.title")}
            </h3>
            <p className="unpack-banner__text">{t("banners.unpack.text")}</p>
            <div className="unpack-banner__cta-wrap">
              <a
                className="button button--primary unpack-banner__cta"
                href="#contact"
              >
                {t("banners.unpack.cta")}
              </a>
              <img
                className="unpack-banner__image"
                src="/icons/cat2.png"
                alt=""
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <section id="contact" className="contact">
          <div className="contact__container">
            <h2 className="contact__title">{t("contact.title")}</h2>
            <p className="contact__text">{t("contact.text")}</p>
            <p className="contact__hint">{t("contact.hint")}</p>
            <div className="contact__layout">
              <div className="contact__main">
                <ContactForm />
                <p className="contact__reply">{t("contact.reply")}</p>
              </div>
              <div className="contact__visual" aria-hidden="true">
                <img
                  className="contact__illustration"
                  src="/icons/boxes2.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__container">
          <div className="footer__left">
            <div className="footer__brand">{t("brand.name")}</div>
            <span className="footer__email">{t("contact.email")}</span>
          </div>
          <div className="footer__note">{t("footer.note")}</div>
          <a className="footer__terms-link" href="/terms">
            {t("nav.terms")}
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function App({ initialPage = "main" }) {
  if (initialPage === "terms") {
    return <TermsPage />;
  }
  return <MainPage />;
}
