import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { z } from "zod";
import { ArrowDown, ArrowRight, CalendarDays, Check, ClipboardCheck, Download, Link2Off, Loader2, TrendingDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name must be 100 characters or fewer."),
  email: z.string().trim().email("Please enter a valid email address.").max(255, "Email must be 255 characters or fewer."),
  units: z.enum(["0", "1–2", "3–10", "11–30", "30+"], { message: "Please choose your current number of units." }),
  target: z.enum(["Double my units", "Automate operations", "Improve margins"], { message: "Please choose your target." }),
  city: z.string().trim().max(100, "City must be 100 characters or fewer."),
  budget: z.enum(["Still exploring", "Under $5,000", "$5,000–$10,000", "$10,000+"], { message: "Please choose a budget band." }),
});

type BookingData = z.infer<typeof bookingSchema>;
type BookingField = keyof BookingData;

const initialBookingData: BookingData = { name: "", email: "", units: "" as BookingData["units"], target: "" as BookingData["target"], city: "", budget: "" as BookingData["budget"] };
const timeSlots = ["9:30 AM", "11:00 AM", "2:00 PM", "4:30 PM"];

function BookingDialog({ open, onOpenChange, onChecklist }: { open: boolean; onOpenChange: (open: boolean) => void; onChecklist: () => void }) {
  const [step, setStep] = useState<"form" | "calendar" | "done">("form");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [data, setData] = useState<BookingData>(initialBookingData);
  const [errors, setErrors] = useState<Partial<Record<BookingField, string>>>({});
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";
  const ready = bookingSchema.safeParse(data).success;

  const setField = (field: BookingField, value: string) => {
    setData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  };

  const validateField = (field: BookingField) => {
    const result = bookingSchema.safeParse(data);
    if (result.success) return;
    const issue = result.error.issues.find((item) => item.path[0] === field);
    setErrors((current) => ({ ...current, [field]: issue?.message }));
  };

  const continueToCalendar = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = bookingSchema.safeParse(data);
    if (!result.success) {
      const nextErrors: Partial<Record<BookingField, string>> = {};
      result.error.issues.forEach((issue) => { const field = issue.path[0] as BookingField; if (!nextErrors[field]) nextErrors[field] = issue.message; });
      setErrors(nextErrors);
      return;
    }
    setLoading(true);
    setSubmitError("");
    try {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 600));
      if (!window.navigator.onLine) throw new Error("Offline");
      setStep("calendar");
    } catch {
      setSubmitError("Something went wrong. Please try again — your answers have been saved.");
    } finally {
      setLoading(false);
    }
  };

  const appointmentDate = selectedDate && selectedTime ? `${format(selectedDate, "EEEE, MMMM d")} · ${selectedTime}` : "";

  const addToCalendar = () => {
    if (!selectedDate || !selectedTime) return;
    const [clock, period] = selectedTime.split(" ");
    if (!clock || !period) return;
    const [rawHour, minute] = clock.split(":").map(Number);
    if (rawHour === undefined || minute === undefined) return;
    const hour = (rawHour % 12) + (period === "PM" ? 12 : 0);
    const start = new Date(selectedDate);
    start.setHours(hour, minute, 0, 0);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const calendar = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, "SUMMARY:Flex Academy strategy call", "DESCRIPTION:Free strategy call with Raouf or Michael.", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "flex-academy-strategy-call.ics";
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetAfterClose = () => {
    setStep("form"); setLoading(false); setSubmitError(""); setErrors({}); setData(initialBookingData); setSelectedDate(undefined); setSelectedTime("");
  };

  const fieldError = (field: BookingField) => errors[field] ? <p className="mt-1.5 text-xs font-medium text-destructive" role="alert">{errors[field]}</p> : null;

  return (
    <Dialog open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) window.setTimeout(resetAfterClose, 200); }}>
      <DialogContent className="bottom-0 left-0 top-auto max-h-[calc(100dvh-0.5rem)] w-full translate-x-0 translate-y-0 overflow-y-auto rounded-t-xl border-x-0 border-b-0 bg-background px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-6 sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[calc(100dvh-1.5rem)] sm:max-w-3xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-md sm:border sm:p-7">
        {step === "form" && <>
          <DialogHeader className="pr-7 text-left"><DialogTitle className="font-display text-2xl leading-tight sm:text-3xl">Book your free strategy call</DialogTitle><DialogDescription className="mt-1">20–30 min · no pitch</DialogDescription></DialogHeader>
          <form onSubmit={continueToCalendar} className="mt-4 grid gap-4 sm:grid-cols-2" noValidate>
            <label className="block text-sm font-semibold">Name<Input value={data.name} onChange={(e) => setField("name", e.target.value)} onBlur={() => validateField("name")} maxLength={100} className="mt-2 h-11 w-full" aria-invalid={!!errors.name} />{fieldError("name")}</label>
            <label className="block text-sm font-semibold">Email<Input type="email" value={data.email} onChange={(e) => setField("email", e.target.value)} onBlur={() => validateField("email")} maxLength={255} className="mt-2 h-11 w-full" aria-invalid={!!errors.email} />{fieldError("email")}</label>
            <label className="block text-sm font-semibold">Units today<Select value={data.units} onValueChange={(value) => setField("units", value)}><SelectTrigger aria-label="Units today" className="mt-2 h-11 w-full" aria-invalid={!!errors.units}><SelectValue placeholder="Choose a range" /></SelectTrigger><SelectContent>{["0", "1–2", "3–10", "11–30", "30+"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>{fieldError("units")}</label>
            <label className="block text-sm font-semibold">Target<Select value={data.target} onValueChange={(value) => setField("target", value)}><SelectTrigger aria-label="Target" className="mt-2 h-11 w-full" aria-invalid={!!errors.target}><SelectValue placeholder="Choose your target" /></SelectTrigger><SelectContent>{["Double my units", "Automate operations", "Improve margins"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>{fieldError("target")}</label>
            <label className="block text-sm font-semibold">City <span className="font-normal text-muted-foreground">(optional)</span><Input aria-label="City" value={data.city} onChange={(e) => setField("city", e.target.value)} onBlur={() => validateField("city")} placeholder="e.g. London" maxLength={100} className="mt-2 h-11 w-full" aria-invalid={!!errors.city} /><span className="mt-1.5 block text-xs font-normal text-muted-foreground">Helps us prepare for the call</span>{fieldError("city")}</label>
            <label className="block text-sm font-semibold">Budget band<Select value={data.budget} onValueChange={(value) => setField("budget", value)}><SelectTrigger aria-label="Budget band" className="mt-2 h-11 w-full" aria-invalid={!!errors.budget}><SelectValue placeholder="Choose a range" /></SelectTrigger><SelectContent>{["Still exploring", "Under $5,000", "$5,000–$10,000", "$10,000+"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>{fieldError("budget")}</label>
            {data.units === "0" && <div className="rounded-md border border-accent/50 bg-accent/10 p-4 text-sm leading-6 sm:col-span-2"><p>You’re welcome to continue. If you’re still getting started, the free checklist may be more useful right now.</p><Button type="button" variant="link" className="mt-2" onClick={onChecklist}>Get the free checklist <ArrowRight /></Button></div>}
            {submitError && <p className="text-sm font-medium text-destructive sm:col-span-2" role="alert">{submitError}</p>}
            <Button type="submit" size="xl" className="w-full sm:col-span-2" disabled={!ready || loading}>{loading ? <><Loader2 className="animate-spin" /> Loading…</> : <>Choose a time <ArrowRight /></>}</Button>
          </form>
        </>}
        {step === "calendar" && <>
          <DialogHeader className="pr-7 text-left"><DialogTitle className="font-display text-2xl leading-tight sm:text-3xl">Pick a time for your 20–30 min call</DialogTitle><DialogDescription className="mt-1">Times shown in {timeZone}.</DialogDescription></DialogHeader>
          <div className="mt-3 grid gap-6 md:grid-cols-[auto_1fr]">
            <div className="pointer-events-auto overflow-x-auto rounded-md border border-border"><Calendar mode="single" selected={selectedDate} onSelect={(date) => { setSelectedDate(date); setSelectedTime(""); }} disabled={(date) => isBefore(date, startOfDay(new Date())) || date.getDay() === 0 || date.getDay() === 6} fromDate={new Date()} toDate={addDays(new Date(), 45)} initialFocus className="pointer-events-auto mx-auto p-3" /></div>
            <div><p className="text-sm font-semibold">{selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Choose a date to see times"}</p><div className="mt-3 grid grid-cols-2 gap-3">{timeSlots.map((time) => <Button key={time} type="button" variant={selectedTime === time ? "secondary" : "outline"} className="h-11 w-full" disabled={!selectedDate} aria-pressed={selectedTime === time} onClick={() => setSelectedTime(time)}>{time}</Button>)}</div><Button type="button" size="xl" className="mt-5 w-full" disabled={!selectedDate || !selectedTime} onClick={() => setStep("done")}>Confirm time <ArrowRight /></Button><Button type="button" variant="link" className="mt-4" onClick={() => setStep("form")}>Back to details</Button></div>
          </div>
        </>}
        {step === "done" && <div className="py-3 text-center sm:py-6"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary"><Check className="h-7 w-7" /></span><DialogTitle className="mt-5 font-display text-3xl">You're booked.</DialogTitle><DialogDescription className="mx-auto mt-3 max-w-md text-base">{appointmentDate}<br />{timeZone} · with Raouf or Michael</DialogDescription><div className="mx-auto mt-7 max-w-md rounded-md border border-border bg-secondary/35 p-5 text-left"><h3 className="font-display text-lg font-semibold">What to prepare</h3><ul className="mt-3 space-y-2 text-sm text-muted-foreground"><li>• Your number of units: {data.units}</li><li>• Your target: {data.target}</li><li>• Your biggest blocker</li></ul></div><div className="mx-auto mt-7 flex max-w-md flex-col gap-3"><Button size="xl" onClick={addToCalendar}><Download /> Add to calendar</Button><Button variant="outline" size="xl" onClick={onChecklist}>Get the free checklist</Button><Button variant="link" className="mx-auto" onClick={() => { setStep("calendar"); setSelectedTime(""); }}>Reschedule</Button></div><p className="mt-6 text-xs text-muted-foreground">A confirmation email is on its way.</p></div>}
      </DialogContent>
    </Dialog>
  );
}

function ChecklistDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const emailValid = z.string().trim().email().max(255).safeParse(email).success;
  return <Dialog open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) window.setTimeout(() => { setSent(false); setEmail(""); }, 200); }}><DialogContent className="w-[calc(100%-1.5rem)] rounded-md sm:max-w-md">{sent ? <div className="py-7 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary"><Check /></span><DialogTitle className="mt-5 font-display text-2xl">Check your inbox.</DialogTitle><DialogDescription className="mt-3">The STR scaling checklist is on its way.</DialogDescription><DialogClose asChild><Button variant="outline" className="mt-6">Back to page</Button></DialogClose></div> : <><DialogHeader><DialogTitle className="font-display text-2xl">Get the free STR scaling checklist.</DialogTitle><DialogDescription>One practical checklist to find the next system your operation needs.</DialogDescription></DialogHeader><form className="mt-3 space-y-4" onSubmit={(e) => { e.preventDefault(); if (emailValid) setSent(true); }} noValidate><label className="block text-sm font-semibold">Your email<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" maxLength={255} className="mt-2 h-11 w-full" aria-invalid={email.length > 0 && !emailValid} /></label>{email.length > 0 && !emailValid && <p className="text-xs font-medium text-destructive" role="alert">Please enter a valid email address.</p>}<Button type="submit" size="xl" className="w-full" disabled={!emailValid}><span>Send me the checklist</span><ArrowRight /></Button></form></>}</DialogContent></Dialog>;
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
          <div className="flex shrink-0 items-center gap-5"><a href="#method" className="hidden items-center gap-2 text-sm font-medium text-brand-deep-foreground/75 transition-colors hover:text-brand-deep-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:text-accent lg:flex">Explore the programme <ArrowDown className="h-4 w-4" /></a><Button variant="warm" size="xl" onClick={() => setBookingOpen(true)}>Book a call</Button></div>
        </div>
      </header>

      <section id="top" className="relative bg-brand-deep pt-28 text-brand-deep-foreground lg:min-h-[760px] lg:pt-36">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 sm:gap-14 sm:pb-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="animate-rise-in">
            <Eyebrow dark>Flex Academy · 12-week operator programme</Eyebrow>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] sm:text-6xl lg:text-7xl">Turn your short-term rentals into a real company.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-brand-deep-foreground/72">The playbook, systems and software the founders of The Flex used to scale — now teaching you to do the same.</p>
            <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-end">
              <div className="w-full sm:w-auto">
                <Button variant="warm" size="xl" className="w-full sm:w-auto" onClick={() => setBookingOpen(true)}>Book a call <ArrowRight /></Button>
                <p className="mt-2 text-center text-xs text-brand-deep-foreground/55">20–30 min · no pitch</p>
              </div>
              <div className="w-full sm:w-auto">
                <p className="mb-2 text-xs text-brand-deep-foreground/55">Not ready to talk yet?</p>
                 <Button variant="outline" size="xl" className="w-full border-brand-deep-foreground/40 text-brand-deep-foreground shadow-none hover:border-brand-deep-foreground/70 hover:bg-brand-deep-foreground/10 hover:text-brand-deep-foreground active:bg-brand-deep-foreground/20 sm:w-auto" onClick={() => setChecklistOpen(true)}>Get the free checklist</Button>
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
          <div className="mt-10 flex justify-center"><Button variant="outline" size="xl" onClick={() => setBookingOpen(true)}>Book a call <ArrowRight /></Button></div>
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
            <Button variant="outline" size="xl" className="mt-8" onClick={() => setBookingOpen(true)}>Book a call <ArrowRight /></Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-brand-deep py-24 text-brand-deep-foreground sm:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading dark eyebrow="What's included" title="Everything you need to run, not just learn." />
          <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-brand-deep-foreground/15 bg-brand-deep-foreground/15 md:grid-cols-3">
            {inclusions.map(([title, copy]) => <article key={title} className="bg-brand-deep p-7 sm:p-8"><Check className="h-5 w-5 text-accent" /><h3 className="mt-5 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-brand-deep-foreground/85">{copy}</p></article>)}
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
              <div key={title} className="grid grid-cols-[2rem_1fr] gap-4 py-5 sm:grid-cols-[3rem_1fr] sm:py-6">
                <X className="mt-0.5 h-6 w-6 text-muted-foreground" />
                <div><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></div>
              </div>
            ))}
          </div>
          <p className="mt-9 text-center text-sm text-muted-foreground">If that's you, the <Button variant="link" onClick={() => setChecklistOpen(true)}>free STR scaling checklist <ArrowRight className="h-3.5 w-3.5" /></Button> might be a better place to start.</p>
        </div>
      </section>

      <section className="border-t border-border bg-card py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <SectionHeading eyebrow="Questions before you book" title="What you need to know." />
          <Accordion type="single" defaultValue="faq-0" collapsible className="mt-14 border-t border-border">
            {faq.map(([question, answer], index) => <AccordionItem key={question} value={`faq-${index}`}><AccordionTrigger className="py-6 text-base font-semibold hover:no-underline sm:text-lg">{question}</AccordionTrigger><AccordionContent className="max-w-3xl pb-6 text-sm leading-7 text-muted-foreground sm:text-base">{answer}</AccordionContent></AccordionItem>)}
          </Accordion>
          <div className="mt-10 flex flex-col items-center gap-4"><p className="font-display text-xl font-semibold">Still have questions?</p><Button variant="outline" size="xl" onClick={() => setBookingOpen(true)}>Book a call <ArrowRight /></Button></div>
        </div>
      </section>

      <section id="book" className="bg-primary py-20 text-primary-foreground sm:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Eyebrow dark>Ready to build the operation?</Eyebrow>
          <h2 className="text-3xl font-semibold sm:text-5xl">Let's see if Flex Academy fits your next stage.</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-primary-foreground/75">A straightforward 20–30 minute conversation about where your operation is now and what needs to change next.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button variant="warm" size="xl" onClick={() => setBookingOpen(true)}>Book a call <ArrowRight /></Button><Button variant="outline" size="xl" className="border-primary-foreground/40 text-primary-foreground hover:border-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground active:bg-primary-foreground/20" onClick={() => setChecklistOpen(true)}>Get the free checklist</Button></div>
          <p className="mt-3 text-xs text-primary-foreground/60">20–30 min · no pitch</p>
        </div>
      </section>

      <footer className="bg-brand-deep py-8 text-brand-deep-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 sm:flex-row lg:px-8">
          <p className="font-display text-sm font-semibold">FLEX ACADEMY</p>
          <p className="text-xs text-brand-deep-foreground/50">Built by the team behind The Flex and Base360.</p>
        </div>
      </footer>
      {showMobileBar && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur sm:hidden"><Button variant="warm" className="w-full" size="xl" onClick={() => setBookingOpen(true)}>Book a call <ArrowRight /></Button></div>}
      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} onChecklist={() => { setBookingOpen(false); window.setTimeout(() => setChecklistOpen(true), 200); }} />
      <ChecklistDialog open={checklistOpen} onOpenChange={setChecklistOpen} />
    </main>
  );
}