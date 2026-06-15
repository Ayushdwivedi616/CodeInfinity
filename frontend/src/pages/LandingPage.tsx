import AuthCard from '../components/AuthCard'
import FeaturePanel from '../components/FeaturePanel'

export default function LandingPage() {
  return (
    <section className="grid min-h-[calc(100vh-88px)] gap-12 lg:grid-cols-[1.3fr_0.9fr]">
      <div className="flex flex-col justify-center gap-8">
        <div className="max-w-2xl rounded-[40px] border border-slate-800 bg-slate-950/75 p-10 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-cyan-300">Enterprise assessment suite</p>
          <h1 className="mt-6 text-5xl font-semibold leading-tight text-white">Hire smarter with a premium coding assessment experience.</h1>
          <p className="mt-6 text-lg text-slate-300">
            Build assessments, assign exams, and evaluate candidate submissions from a modern enterprise dashboard.
            Fast, secure, and designed for hiring teams that value quality and speed.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <FeaturePanel title="Assessments" description="Create rich programming challenges with hidden and visible test cases." />
            <FeaturePanel title="Real-time review" description="View clean candidate submission data, test results, and scoring at a glance." />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-[36px] border border-slate-800 bg-slate-950/80 p-8 shadow-soft">
          <AuthCard
            title="Admin"
            description="Log in to build exams, manage questions, and review candidate progress."
            cta="Go to Admin"
            href="/admin"
            accent="bg-cyan-500/15 text-cyan-200"
          />
        </div>
        <div className="rounded-[36px] border border-slate-800 bg-slate-950/80 p-8 shadow-soft">
          <AuthCard
            title="Candidate"
            description="Access exams, run code in the browser, and track your submission history."
            cta="Take a Test"
            href="/candidate"
            accent="bg-slate-700/80 text-slate-100"
          />
        </div>
      </div>
    </section>
  )
}
