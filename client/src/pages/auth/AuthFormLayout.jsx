import { Link } from "react-router-dom";

export default function AuthFormLayout({
  title,
  description,
  footerText,
  footerLink,
  footerLabel,
  children
}) {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr,0.95fr]">
      <section className="surface flex flex-col justify-between gap-6 p-8 sm:p-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-pine">Citizen access</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink">{title}</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-ink/70">{description}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Nearby issue feed", value: "Geo-aware" },
            { label: "Media uploads", value: "Cloudinary" },
            { label: "Issue tracking", value: "Live updates" }
          ].map(item => (
            <div key={item.label} className="rounded-3xl bg-mist p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-moss">{item.value}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface p-8 sm:p-10">
        {children}
        <p className="mt-6 text-sm text-ink/65">
          {footerText}{" "}
          <Link to={footerLink} className="font-bold text-pine hover:text-ink">
            {footerLabel}
          </Link>
        </p>
      </section>
    </div>
  );
}
