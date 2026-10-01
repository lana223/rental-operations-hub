import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, CalendarDays, Check, ClipboardCheck, Link2Off, Loader2, TrendingDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const inclusions = [
  ["Weekly live sessions", "Direct access to the group, every week — not a video library you forget about."],
  ["A founder in your corner", "Monthly 1:1 time with Raouf or Michael, on your business specifically."],
  ["Our actual templates & SOPs", "Not generic worksheets — the real operating documents from The Flex."],
  ["Base360, included", "Full access to the software running our own operation, for the length of the programme."],
  ["An operator community", "A closed group of people at your exact stage — not a public forum."],
  ["Weekly accountability", "Someone checking what actually moved, every week."],
];

const faq = [
  ["How much does Flex Academy cost?", "[Price placeholder — full 12-week programme]. We'll walk you through pricing and payment options on your strategy call."],
  ["How much time does this actually take?", "About 3–4 hours a week: one live group session, plus time to apply the templates to your own units. The monthly 1:1 is extra."],
  ["Does this work if I'm not in Europe or North Africa?", "Yes. The systems are location-agnostic — they're built around how STR operations work, not a specific market. Operators can join from anywhere."],
  ["What if it's not a fit after I start?", "[Placeholder — refund policy to be confirmed with the team]. We'll discuss the policy clearly before you enrol."],
  ["Do I need Base360 already to join?", "No. Base360 access is included during the programme — you don't need to be a customer beforehand."],
];

function BookingDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState<"form" | "calendar" | "done">("form");
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState("");
  const [goal, setGoal] = useState("");
  const [budget, setBudget] = useState("");
  const [email, setEmail] = useState("");
  const ready = units.trim() && goal.trim() && budget && email.includes("@");

  const continueToCalendar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!ready) return;
    setLoading(true);
    window.setTimeout(() => { setLoading(false); setStep("calendar"); }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) window.setTimeout(() => setStep("form"), 200); }}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto rounded-md sm:max-w-xl">
        {step === "form" && <>
          <DialogHeader><DialogTitle className="font-display text-2xl">Tell us where you're operating now.</DialogTitle><DialogDescription>A short application before choosing a time. It takes about two minutes.</DialogDescription></DialogHeader>
          <form onSubmit={continueToCalendar} className="mt-3 space-y-4">
            <label className="block text-sm font-semibold">Your email<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="mt-2 h-11" required /></label>
            <label className="block text-sm font-semibold">Units you operate today<Input value={units} onChange={(e) => setUnits(e.target.value)} placeholder="e.g. 8 units" className="mt-2 h-11" required /></label>
            <label className="block text-sm font-semibold">Your next-stage goal<Textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="What do you want to change in the next 12 months?" className="mt-2 min-h-24" required /></label>
            <label className="block text-sm font-semibold">Investment range<Select value={budget} onValueChange={setBudget}><SelectTrigger className="mt-2 h-11"><SelectValue placeholder="Choose a range" /></SelectTrigger><SelectContent><SelectItem value="exploring">Still exploring</SelectItem><SelectItem value="under-5k">Under $5,000</SelectItem><SelectItem value="5k-10k">$5,000–$10,000</SelectItem><SelectItem value="10k-plus">$10,000+</SelectItem></SelectContent></Select></label>
            <Button type="submit" size="xl" className="w-full" disabled={!ready || loading}>{loading ? <><Loader2 className="animate-spin" /> Loading…</> : <>Choose a time <ArrowRight /></>}</Button>
          </form>
        </>}
        {step === "calendar" && <>
          <DialogHeader><DialogTitle className="font-display text-2xl">Choose a time.</DialogTitle><DialogDescription>Select a sample time below. The live calendar connection will be added before launch.</DialogDescription></DialogHeader>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">{["Tue · 10:00 AM", "Tue · 2:30 PM", "Wed · 11:30 AM", "Thu · 3:00 PM"].map((time) => <Button key={time} variant="outline" className="h-12 justify-start" onClick={() => setStep("done")}><CalendarDays />{time}</Button>)}</div>
        </>}
        {step === "done" && <div className="py-8 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary"><Check className="h-7 w-7" /></span><DialogTitle className="mt-5 font-display text-2xl">Your call is confirmed.</DialogTitle><DialogDescription className="mx-auto mt-3 max-w-sm">We'll send the details to your email. Bring your current numbers and the biggest bottleneck you want to solve.</DialogDescription><DialogClose asChild><Button variant="outline" className="mt-7">Back to page</Button></DialogClose></div>}
      </DialogContent>
    </Dialog>
  );
}

function ChecklistDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return <Dialog open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) window.setTimeout(() => setSent(false), 200); }}><DialogContent className="w-[calc(100%-2rem)] rounded-md sm:max-w-md">{sent ? <div className="py-7 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary"><Check /></span><DialogTitle className="mt-5 font-display text-2xl">Check your inbox.</DialogTitle><DialogDescription className="mt-3">The STR scaling checklist is on its way.</DialogDescription><DialogClose asChild><Button variant="outline" className="mt-6">Back to page</Button></DialogClose></div> : <><DialogHeader><DialogTitle className="font-display text-2xl">Get the free STR scaling checklist.</DialogTitle><DialogDescription>One practical checklist to find the next system your operation needs.</DialogDescription></DialogHeader><form className="mt-3 space-y-4" onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setSent(true); }}><label className="block text-sm font-semibold">Your email<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="mt-2 h-11" required /></label><Button type="submit" size="xl" className="w-full" disabled={!email.includes("@")}><span>Send me the checklist</span><ArrowRight /></Button></form></>}</DialogContent></Dialog>;
}

function FlexAcademy() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.querySelector("#top");
      const finalCta = document.querySelector("#book");
      if (!hero || !finalCta) return;
      setShowMobileBar(hero.getBoundingClientRect().bottom < 0 && finalCta.getBoundingClientRect().top > window.innerHeight);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Flex Academy, back to top">
            <span className="flex h-10 w-28 items-center rounded-sm bg-background px-2"><img src={flexLogoAsset.url} alt="The Flex" className="w-full object-contain" /></span>
            <span className="h-5 w-px bg-brand-deep-foreground/25" />
            <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep-foreground">Academy</span>
          </a>
          <div className="flex shrink-0 items-center gap-5"><a href="#method" className="hidden items-center gap-2 text-sm font-medium text-brand-deep-foreground/75 hover:text-brand-deep-foreground lg:flex">Explore the programme <ArrowDown className="h-4 w-4" /></a><Button variant="warm" onClick={() => setBookingOpen(true)}>Book a call</Button></div>
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
                <Button variant="warm" size="xl" onClick={() => setBookingOpen(true)}>Book a call <ArrowRight /></Button>
                <p className="mt-2 text-center text-xs text-brand-deep-foreground/55">20–30 min · no pitch</p>
              </div>
              <div>
                <p className="mb-2 text-xs text-brand-deep-foreground/55">Not ready to talk yet?</p>
                <Button variant="outline" size="xl" className="border-brand-deep-foreground/25 bg-transparent text-brand-deep-foreground shadow-none hover:bg-brand-deep-foreground/10 hover:text-brand-deep-foreground" onClick={() => setChecklistOpen(true)}>Get the free checklist</Button>
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
          <div className="mt-7 flex justify-center"><Button variant="outline" onClick={() => setBookingOpen(true)}>Book a call <ArrowRight /></Button></div>
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
          <div className="mt-10 flex justify-center"><Button onClick={() => setBookingOpen(true)}>Book a call <ArrowRight /></Button></div>
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
            <Button className="mt-8" onClick={() => setBookingOpen(true)}>Book a call with Raouf or Michael <ArrowRight /></Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-brand-deep py-24 text-brand-deep-foreground sm:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading dark eyebrow="What's included" title="Everything you need to run, not just learn." />
          <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-brand-deep-foreground/15 bg-brand-deep-foreground/15 md:grid-cols-3">
            {inclusions.map(([title, copy]) => <article key={title} className="bg-brand-deep p-7 sm:p-8"><Check className="h-5 w-5 text-accent" /><h3 className="mt-5 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-brand-deep-foreground/65">{copy}</p></article>)}
          </div>
          <div className="mt-10 flex justify-center"><Button variant="warm" onClick={() => setBookingOpen(true)}>Book a call <ArrowRight /></Button></div>
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
          <p className="mt-9 text-center text-sm text-muted-foreground">If that's you, the <button className="font-semibold text-primary underline underline-offset-4" onClick={() => setChecklistOpen(true)}>free STR scaling checklist</button> might be a better place to start.</p>
        </div>
      </section>

      <section className="border-t border-border bg-card py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <SectionHeading eyebrow="Questions before you book" title="What you need to know." />
          <Accordion type="single" defaultValue="faq-0" collapsible className="mt-14 border-t border-border">
            {faq.map(([question, answer], index) => <AccordionItem key={question} value={`faq-${index}`}><AccordionTrigger className="py-6 text-base font-semibold hover:no-underline sm:text-lg">{question}</AccordionTrigger><AccordionContent className="max-w-3xl pb-6 text-sm leading-7 text-muted-foreground sm:text-base">{answer}</AccordionContent></AccordionItem>)}
          </Accordion>
          <div className="mt-10 flex flex-col items-center gap-4"><p className="font-display text-xl font-semibold">Still have questions?</p><Button variant="outline" onClick={() => setBookingOpen(true)}>Book a call <ArrowRight /></Button></div>
        </div>
      </section>

      <section id="book" className="bg-primary py-20 text-primary-foreground sm:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Eyebrow dark>Ready to build the operation?</Eyebrow>
          <h2 className="text-3xl font-semibold sm:text-5xl">Let's see if Flex Academy fits your next stage.</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-primary-foreground/75">A straightforward 20–30 minute conversation about where your operation is now and what needs to change next.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button variant="warm" size="xl" onClick={() => setBookingOpen(true)}>Book a call <ArrowRight /></Button><Button variant="outline" size="xl" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => setChecklistOpen(true)}>Get the free checklist</Button></div>
          <p className="mt-3 text-xs text-primary-foreground/60">20–30 min · no pitch</p>
        </div>
      </section>

      <footer className="bg-brand-deep py-8 text-brand-deep-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 sm:flex-row lg:px-8">
          <p className="font-display text-sm font-semibold">FLEX ACADEMY</p>
          <p className="text-xs text-brand-deep-foreground/50">Built by the team behind The Flex and Base360.</p>
        </div>
      </footer>
      {showMobileBar && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur sm:hidden"><Button className="w-full" size="lg" onClick={() => setBookingOpen(true)}>Book a call <ArrowRight /></Button></div>}
      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
      <ChecklistDialog open={checklistOpen} onOpenChange={setChecklistOpen} />
    </main>
  );
}