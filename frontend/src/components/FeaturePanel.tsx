interface FeaturePanelProps {
  title: string
  description: string
}

export default function FeaturePanel({ title, description }: FeaturePanelProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/75 px-6 py-5 shadow-soft">
      <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">{title}</p>
      <p className="mt-3 text-slate-300">{description}</p>
    </div>
  )
}
