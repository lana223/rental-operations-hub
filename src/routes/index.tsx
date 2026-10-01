import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Check, ClipboardCheck, Link2Off, TrendingDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import dashboardAsset from "@/assets/base360-dashboard.asset.json";
import baseLogoAsset from "@/assets/base360-logo.asset.json";
import flexLogoAsset from "@/assets/the-flex-logo.webp.asset.json";
import foundersAsset from "@/assets/founders.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flex Academy | Build a real short-term rental company" },
      { name: "description", content: "A 12-week operator programme built from the systems behind The Flex and Base360." },
      { property: "og:title", content: "Flex Academy | Build a real short-term rental company" },
      { property: "og:description", content: "A 12-week operator programme built from the systems behind The Flex and Base360." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Manrope:wght@500;600;700&display=swap" },
    ],
  }),
  component: FlexAcademy,
});

const LogoPair = ({ inverse = false }: { inverse?: boolean }) => (
  <div className="flex items-center gap-3">
    <span className={`flex h-9 w-28 items-center justify-center rounded-sm px-2 ${inverse ? "bg-background" : "bg-secondary/55"}`}>
      <img src={flexLogoAsset.url} alt="The Flex" className="h-auto w-full object-contain" />
    </span>
    <span className={`h-6 w-px ${inverse ? "bg-brand-deep-foreground/25" : "bg-border"}`} />
    <span className={`flex items-center gap-2 text-sm font-semibold ${inverse ? "text-brand-deep-foreground" : "text-foreground"}`}>
      <img src={baseLogoAsset.url} alt="" className="h-7 w-7 rounded-sm" /> Base360
    </span>
  </div>
);

const Eyebrow = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.16em] ${dark ? "text-accent" : "text-primary"}`}>{children}</p>
);

const SectionHeading = ({ eyebrow, title, intro, dark = false }: { eyebrow: string; title: string; intro?: string; dark?: boolean }) => (
  <div className="mx-auto max-w-3xl text-center">
    <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
    <h2 className={`text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl ${dark ? "text-brand-deep-foreground" : "text-foreground"}`}>{title}</h2>
    {intro && <p className={`mx-auto mt-5 max-w-2xl text-base leading-7 ${dark ? "text-brand-deep-foreground/70" : "text-muted-foreground"}`}>{intro}</p>}
  </div>
);

const problemCards = [
  { icon: ClipboardCheck, title: "Everything is manual", copy: "Messages, pricing, cleaning schedules — all tracked by hand, one spreadsheet at a time." },
  { icon: TrendingDown, title: "Margins shrink as you grow", copy: "More units should mean more profit. Instead, more units means more time lost to admin." },
  { icon: Link2Off, title: "No system to hand off", copy: "Everything depends on you. There's no playbook your team — or you — can rely on." },
];

const method = [
  ["Weekly group sessions", "Live sessions with operators scaling the same way you are — not pre-recorded videos."],
  ["Weekly accountability check-ins", "A short weekly check on what moved and what's stuck, so the programme doesn't stay theoretical."],
  ["Monthly 1:1 with a founder", "Direct time with Raouf or Michael on your specific business — not a generic curriculum."],
  ["Templates & SOPs", "The exact operating procedures used at The Flex, ready to copy into your business."],
  ["Base360 access during the programme", "Run pricing, channels and operations on the software we built — included, not upsold."],
  ["Operator community", "A closed group of operators at your stage — not a crowded Facebook group."],
];

const exclusions = [
  ["You don't have a unit yet", "This programme scales an existing operation — it doesn't teach you how to buy your first property."],
  ["You're looking for passive income", "Running a real STR company still takes real work. We teach systems, not shortcuts."],
  ["You want to stay a solo host", "If 1–2 units is exactly where you want to stay, you don't need what we're teaching."],
  ["You're not ready to change how you operate", "The systems only work if you actually implement them — not just watch."],
];

function FlexAcademy() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Flex Academy, back to top">
            <span className="flex h-10 w-28 items-center rounded-sm bg-background px-2"><img src={flexLogoAsset.url} alt="The Flex" className="w-full object-contain" /></span>
            <span className="h-5 w-px bg-brand-deep-foreground/25" />
            <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep-foreground">Academy</span>
          </a>
          <a href="#method" className="hidden items-center gap-2 text-sm font-medium text-brand-deep-foreground/75 hover:text-brand-deep-foreground sm:flex">Explore the programme <ArrowDown className="h-4 w-4" /></a>
        </div>
      </header>

      <section id="top" className="relative bg-brand-deep pt-28 text-brand-deep-foreground lg:min-h-[760px] lg:pt-36">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="animate-rise-in">
            <Eyebrow dark>Flex Academy · 12-week operator programme</Eyebrow>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] sm:text-6xl lg:text-7xl">Turn your short-term rentals into a real company.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-brand-deep-foreground/72">The playbook, systems and software the founders of The Flex used to scale — now teaching you to do the same.</p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <div>
                <Button variant="warm" size="xl" asChild><a href="#book">Book a call <ArrowRight /></a></Button>
                <p className="mt-2 text-center text-xs text-brand-deep-foreground/55">20–30 min · no pitch</p>
              </div>
              <div>
                <p className="mb-2 text-xs text-brand-deep-foreground/55">Not ready to talk yet?</p>
                <Button variant="outline" size="xl" className="border-brand-deep-foreground/25 bg-transparent text-brand-deep-foreground shadow-none hover:bg-brand-deep-foreground/10 hover:text-brand-deep-foreground" asChild>
                  <a href="/flex-academy-scaling-checklist.txt" download>Get the free checklist</a>
                </Button>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-brand-deep-foreground/15 pt-6">
              <LogoPair inverse />
              <p className="text-xs text-brand-deep-foreground/60">The team behind The Flex and Base360</p>
            </div>
          </div>

          <figure className="relative lg:translate-x-8">
            <div className="absolute -inset-3 rounded-lg border border-accent/30" />
            <div className="relative aspect-[1.18/1] overflow-hidden rounded-md bg-card shadow-2xl">
              <img src={dashboardAsset.url} alt="Base360 calendar and channel management dashboard" className="h-full w-full object-cover object-top" />
            </div>
            <figcaption className="mt-4 text-xs text-brand-deep-foreground/50">Illustrative product screen — Base360.ai</figcaption>
          </figure>
        </div>
      </section>

      <section className="border-b border-border bg-card py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <SectionHeading eyebrow="Operator proof" title="Built on [X] years, trusted by 150+ businesses" intro="Not theory. The exact numbers behind the businesses we run every day." />
          <div className="mt-14 grid grid-cols-2 gap-y-10 md:grid-cols-4">
            {[["[X]", "Years operating", "placeholder"], ["150+", "Corporate partners", "The Flex"], ["130+", "Booking platforms", "Base360"], ["[X]", "Units managed", "placeholder"]].map(([n, label, note]) => (
              <div key={label} className="border-line/60 px-3 text-center md:border-l md:first:border-l-0">
                <strong className="font-display text-4xl font-semibold text-primary sm:text-5xl">{n}</strong>
                <p className="mt-2 text-sm font-semibold">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground">({note})</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center"><LogoPair /></div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="The stall point" title="Most operators get stuck between 3 and 30 units. Here's why." />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {problemCards.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-md border border-border bg-card p-7 shadow-[var(--shadow-card)] sm:p-8">
                <Icon className="h-9 w-9 text-primary" strokeWidth={1.5} />
                <h3 className="mt-8 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-12 max-w-3xl text-center font-display text-xl font-semibold leading-8">That's the gap Flex Academy closes — with the exact systems we used to scale past it.</p>
        </div>
      </section>

      <section id="method" className="relative border-y border-border bg-background py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,var(--color-primary)_0_38%,var(--color-accent)_38%_64%,var(--color-brand-deep)_64%)]" />
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-8 border-b border-border pb-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <Eyebrow>The method · 12 weeks</Eyebrow>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">A working rhythm for operators who need implementation, not another content library.</p>
            </div>
            <h2 className="text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-7xl">Build the system.<br /><span className="font-normal text-primary">Then run it for real.</span></h2>
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <ol className="divide-y divide-border border-y border-border">
              {method.map(([title, copy], index) => (
                <li key={title} className="group grid grid-cols-[3.25rem_1fr] gap-4 py-7 sm:grid-cols-[4.5rem_1fr] sm:py-9">
                  <span className="font-display text-2xl font-semibold text-line transition-colors duration-300 group-hover:text-primary sm:text-3xl">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-lg font-semibold transition-transform duration-300 group-hover:translate-x-1 sm:text-xl">{title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="lg:sticky lg:top-10">
              <div className="relative overflow-hidden rounded-md bg-brand-deep p-4 shadow-[var(--shadow-method)] sm:p-7">
                <div className="mb-6 flex items-center justify-between text-brand-deep-foreground">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Your operating layer</p><p className="mt-2 font-display text-xl font-semibold">Base360, included</p></div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-deep-foreground/20 text-sm font-semibold">12</span>
                </div>
                <div className="overflow-hidden rounded-sm border border-brand-deep-foreground/15 bg-card">
                  <img src={dashboardAsset.url} alt="Base360 operating dashboard used during Flex Academy" className="aspect-[1.18/1] w-full object-cover object-top" />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[0.6875rem] font-semibold text-brand-deep-foreground/70">
                  <span className="border border-brand-deep-foreground/15 py-2">LEARN</span>
                  <span className="border border-brand-deep-foreground/15 py-2">INSTALL</span>
                  <span className="border border-accent/45 bg-accent/10 py-2 text-accent">OPERATE</span>
                </div>
              </div>
              <div className="ml-auto mt-4 flex w-[88%] items-center justify-between border-b border-border pb-4 text-xs text-muted-foreground">
                <span>Founder guidance</span><ArrowRight className="h-4 w-4 text-primary" /><span>Operating independence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="relative overflow-hidden rounded-md bg-secondary pt-10">
            <img src={foundersAsset.url} alt="The Flex founders Raouf Yousfi and Michael Buggy" className="mx-auto w-full object-contain" />
          </div>
          <div>
            <Eyebrow>The team behind the operation</Eyebrow>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">We built The Flex. Then we built Base360 to run it. Now we're teaching you both.</h2>
            <p className="mt-6 text-base leading-7 text-muted-foreground">Raouf and Michael run serviced apartments across 7 cities, and built the software behind them. Flex Academy is the playbook they use every day — not a course written from theory.</p>
            <div className="mt-8 grid grid-cols-2 border-y border-border py-5">
              <div><h3 className="font-semibold">Raouf Yousfi</h3><p className="mt-1 text-xs text-muted-foreground">Co-founder, The Flex & Base360</p></div>
              <div className="border-l border-border pl-5"><h3 className="font-semibold">Michael Buggy</h3><p className="mt-1 text-xs text-muted-foreground">Co-founder, The Flex & Base360</p></div>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-4"><LogoPair /><span className="text-xs text-muted-foreground">The team behind The Flex and Base360</span></div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/45 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Early results" title="What operators are already changing." />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              ["[Operator name — placeholder]", "[X] units → [X] units in [X] months", "[Quote placeholder — to be replaced with real testimonial]"],
              ["[Operator name — placeholder]", "Cut manual admin time by [X]%", "[Quote placeholder — to be replaced with real testimonial]"],
              ["[Operator name — placeholder]", "Automated pricing across all units", "[Quote placeholder — to be replaced with real testimonial]"],
            ].map(([name, result, quote]) => (
              <article key={result} className="rounded-md border border-border bg-card p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Illustrative case</p>
                <h3 className="mt-6 text-base font-semibold">{name}</h3>
                <p className="mt-5 font-display text-2xl font-semibold leading-8">{result}</p>
                <p className="mt-8 border-t border-border pt-5 text-sm italic leading-6 text-muted-foreground">“{quote}”</p>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-4xl border-t border-border pt-7 text-center text-sm font-medium leading-6">These are illustrative examples of the kind of results the programme is designed to produce. Real case studies will be added as the first cohorts complete the programme.</p>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <SectionHeading eyebrow="Before you book a call" title="This isn't for everyone. Here's who it's not for." />
          <div className="mt-14 divide-y divide-border border-y border-border">
            {exclusions.map(([title, copy]) => (
              <div key={title} className="grid grid-cols-[2rem_1fr] gap-4 py-7 sm:grid-cols-[3rem_1fr]">
                <X className="mt-1 h-5 w-5 text-muted-foreground" />
                <div><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></div>
              </div>
            ))}
          </div>
          <p className="mt-9 text-center text-sm text-muted-foreground">If that's you, the <a className="font-semibold text-primary underline underline-offset-4" href="/flex-academy-scaling-checklist.txt" download>free STR scaling checklist</a> might be a better place to start.</p>
        </div>
      </section>

      <section id="book" className="bg-primary py-20 text-primary-foreground sm:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Eyebrow dark>Ready to build the operation?</Eyebrow>
          <h2 className="text-3xl font-semibold sm:text-5xl">Let's see if Flex Academy fits your next stage.</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-primary-foreground/75">A straightforward 20–30 minute conversation about where your operation is now and what needs to change next.</p>
          <Button variant="warm" size="xl" className="mt-8" asChild><a href="mailto:academy@theflex.global?subject=Flex%20Academy%20call">Book a call <ArrowRight /></a></Button>
          <p className="mt-3 text-xs text-primary-foreground/60">20–30 min · no pitch</p>
        </div>
      </section>

      <footer className="bg-brand-deep py-8 text-brand-deep-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 sm:flex-row lg:px-8">
          <p className="font-display text-sm font-semibold">FLEX ACADEMY</p>
          <p className="text-xs text-brand-deep-foreground/50">Built by the team behind The Flex and Base360.</p>
        </div>
      </footer>
    </main>
  );
}