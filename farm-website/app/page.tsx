"use client";

import { useState, useEffect, useRef } from "react";
import { siteContent } from "@/content/site";
import {
  Leaf, Flower2, Sprout, CarrotIcon,
  MapPin, Mail, Clock, Send, Menu, X,
} from "lucide-react";

const offeringIcons: Record<string, React.ReactNode> = {
  freerange: <Sprout     className="w-6 h-6 text-green-700" />,
  heritage:  <Flower2    className="w-6 h-6 text-green-700" />,
  graded:    <Leaf       className="w-6 h-6 text-green-700" />,
  fertile:   <CarrotIcon className="w-6 h-6 text-green-700" />,
};

const inputBase =
  "w-full bg-white/60 border rounded-sm px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none transition-colors";

type FormFields = { name: string; email: string; message: string };
type FormErrors = Partial<FormFields>;

function validate(data: FormFields): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim())                        errors.name    = "Name is required.";
  if (!data.email.trim())                       errors.email   = "Email is required.";
  else if (!/\S+@\S+\.\S+/.test(data.email))   errors.email   = "Enter a valid email address.";
  if (!data.message.trim())                     errors.message = "Message cannot be empty.";
  return errors;
}

export default function HomePage() {
  const { farm, hero, about, offerings, contact } = siteContent;

  // Nav
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  // Form
  const [formData,  setFormData]  = useState<FormFields>({ name: "", email: "", message: "" });
  const [errors,    setErrors]    = useState<FormErrors>({});
  const [touched,   setTouched]   = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  // Fade-in refs
  const heroRef    = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trigger hero animation shortly after mount
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Close mobile menu on nav click
  const handleNavClick = () => setMenuOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name as keyof FormFields]) {
      setErrors(validate({ ...formData, [name]: value }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    // EmailJS call goes here
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const fieldClass = (field: keyof FormFields) =>
    `${inputBase} ${
      touched[field] && errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-stone-200 focus:border-green-600"
    }`;

  return (
    <main
      className="min-h-screen text-gray-900"
      style={{ backgroundColor: "#f7f3ec", fontFamily: "var(--font-inter)" }}
    >

      {/* ── Nav ── */}
      <nav
        className={`fixed top-0 left-0 right-0 flex justify-between items-center py-5 px-6 md:px-12 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#f7f3ec]/90 backdrop-blur-md shadow-sm border-b border-stone-200"
            : "bg-transparent"
        }`}
      >
        <span
          style={{ fontFamily: "var(--font-lora)" }}
          className={`font-medium text-base tracking-wide transition-colors duration-300 ${
            scrolled ? "text-green-800" : "text-white"
          }`}
        >
          {farm.name}
        </span>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-10 text-xs uppercase tracking-widest">
          {[["#about", "About"], ["#offerings", "What We Grow"], ["#contact", "Contact"]].map(
            ([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className={`transition-colors duration-300 hover:text-green-400 ${
                    scrolled ? "text-stone-500" : "text-white/90"
                  }`}
                >
                  {label}
                </a>
              </li>
            )
          )}
        </ul>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden transition-colors duration-300 ${scrolled ? "text-stone-700" : "text-white"}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[#f7f3ec] flex flex-col justify-center items-center gap-10 transition-all duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {[["#about", "About"], ["#offerings", "What We Grow"], ["#contact", "Contact"]].map(
          ([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={handleNavClick}
              style={{ fontFamily: "var(--font-lora)" }}
              className="text-3xl text-stone-800 hover:text-green-700 transition-colors"
            >
              {label}
            </a>
          )
        )}
      </div>

      {/* ── Hero ── */}
      <section
        className="relative flex flex-col justify-center items-start text-left min-h-screen px-6 md:px-12 border-b border-stone-200 overflow-hidden"
        style={{ backgroundImage: "url('/hero.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div ref={heroRef} className="relative z-10 pt-32">

          <p
            className="text-xs uppercase tracking-[0.25em] text-green-300 mb-4"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            Est. {farm.established}
          </p>

          <h1
            style={{
              fontFamily: "var(--font-lora)",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
            }}
            className="text-5xl md:text-7xl lg:text-8xl font-medium text-white mb-5 leading-tight max-w-3xl"
          >
            {hero.title}
          </h1>

          <p
            className="text-lg md:text-xl text-white/75 mb-8 max-w-md font-light"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
            }}
          >
            {hero.subtitle}
          </p>

          <a
            href="#about"
            className="inline-block text-white border border-white/50 hover:border-white text-sm tracking-widest uppercase px-6 py-3 transition-all hover:bg-white/10"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s",
            }}
          >
            {hero.cta.text} ↓
          </a>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-20 md:py-32 px-6 md:px-12 border-b border-stone-200" style={{ backgroundColor: "#f7f3ec" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left — text */}
          <div>
            <span className="block text-xs uppercase tracking-[0.2em] text-green-700 mb-6">About</span>
            <p
              style={{ fontFamily: "var(--font-lora)" }}
              className="text-stone-700 text-xl md:text-2xl leading-relaxed font-normal italic mb-10"
            >
              {about}
            </p>
            <div className="flex gap-8 border-t border-stone-200 pt-8">
              <div>
                <p style={{ fontFamily: "var(--font-lora)" }} className="text-2xl font-medium text-green-800">40+</p>
                <p className="text-xs uppercase tracking-widest text-stone-400 mt-1">Acres</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-lora)" }} className="text-2xl font-medium text-green-800">Est. {farm.established}</p>
                <p className="text-xs uppercase tracking-widest text-stone-400 mt-1">Founded</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-lora)" }} className="text-2xl font-medium text-green-800">3</p>
                <p className="text-xs uppercase tracking-widest text-stone-400 mt-1">Generations</p>
              </div>
            </div>
          </div>

          {/* Right — image */}
          <div className="h-72 md:h-[480px] overflow-hidden border border-stone-200 rounded-2xl">
            <img
              src="/about.jpg"
              alt="Fresh eggs collected in a galvanized bucket on the farm"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
            />
          </div>

        </div>
      </section>

      {/* ── Offerings ── */}
      <section id="offerings" className="py-20 md:py-32 px-6 md:px-12 border-b border-stone-200" style={{ backgroundColor: "#f0ebe1" }}>
        <span className="block text-xs uppercase tracking-[0.2em] text-green-700 mb-10">The Ephant Advantage</span>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offerings.map((item) => (
            <li
              key={item.name}
              className="flex gap-4 items-start p-6 border border-stone-200 rounded-sm hover:-translate-y-1 transition-transform duration-200 bg-white/50"
            >
              <div className="mt-0.5 shrink-0">
                {offeringIcons[item.icon] ?? <Leaf className="w-6 h-6 text-green-700" />}
              </div>
              <div className="flex flex-col gap-1">
                <span style={{ fontFamily: "var(--font-lora)" }} className="text-green-900 font-medium text-lg">
                  {item.name}
                </span>
                <span className="text-stone-500 text-sm leading-relaxed">{item.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-20 md:py-32 px-6 md:px-12 border-b border-stone-200" style={{ backgroundColor: "#f7f3ec" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

          {/* Left — Find Us */}
          <div>
            <span className="block text-xs uppercase tracking-[0.2em] text-green-700 mb-8">Find Us</span>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 shrink-0 text-green-700" />
                <p style={{ fontFamily: "var(--font-lora)" }} className="text-xl font-medium text-stone-800">
                  {contact.location}
                </p>
              </div>
              {contact.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 shrink-0 text-green-700" />
                  <a href={`mailto:${contact.email}`} className="text-green-700 text-sm hover:underline">
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.hours && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0 text-green-700" />
                  <p className="text-stone-500 text-sm leading-relaxed">{contact.hours}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right — Reach Us */}
          <div>
            <span className="block text-xs uppercase tracking-[0.2em] text-green-700 mb-8">Reach Us</span>

            {submitted ? (
              <div className="flex flex-col gap-3 py-8">
                <p style={{ fontFamily: "var(--font-lora)" }} className="text-stone-800 text-lg italic">
                  Thank you for reaching out.
                </p>
                <p className="text-stone-500 text-sm">We'll be in touch soon.</p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", message: "" }); setTouched({}); setErrors({}); }}
                  className="text-green-700 text-xs uppercase tracking-widest mt-2 hover:underline w-fit"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Name</label>
                  <input
                    type="text" name="name" placeholder="Your name"
                    value={formData.name} onChange={handleChange} onBlur={handleBlur}
                    className={fieldClass("name")}
                  />
                  {touched.name && errors.name && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Email</label>
                  <input
                    type="email" name="email" placeholder="your@email.com"
                    value={formData.email} onChange={handleChange} onBlur={handleBlur}
                    className={fieldClass("email")}
                  />
                  {touched.email && errors.email && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Message</label>
                  <textarea
                    name="message" rows={5} placeholder="What's on your mind?"
                    value={formData.message} onChange={handleChange} onBlur={handleBlur}
                    className={`${fieldClass("message")} resize-none`}
                  />
                  {touched.message && errors.message && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 w-fit mt-1 text-white bg-green-700 hover:bg-green-800 transition-colors text-xs uppercase tracking-widest px-6 py-3"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Message
                </button>

              </form>
            )}
          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-3" style={{ backgroundColor: "#f0ebe1" }}>
        <p style={{ fontFamily: "var(--font-lora)" }} className="text-stone-400 text-sm italic">
          "{hero.subtitle}"
        </p>
        <p className="text-stone-400 text-xs tracking-wide">
          © {new Date().getFullYear()} {farm.name}
        </p>
      </footer>

    </main>
  );
}