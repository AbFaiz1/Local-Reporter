export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <section className="surface overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.24em] text-pine">{eyebrow}</p> : null}
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
