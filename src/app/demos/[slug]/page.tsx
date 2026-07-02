import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';

const demoProjects = {
  kanakku: {
    title: 'Kanakku',
    summary: 'An Indian-market expense tracker that helps users log spending, budget better, and understand cash flow without clutter.',
    problem: 'Most personal finance tools are either too generic or too heavy for everyday tracking.',
    solution: 'Kanakku keeps the interaction simple, mobile-first, and focused on clear tracking, summaries, and quick entries.',
    stack: ['Flutter', 'Supabase', 'Riverpod', 'PostgreSQL', 'Auth'],
    github: 'https://github.com/Easwarp45/kanakku',
  },
  keyforge: {
    title: 'KeyForge',
    summary: 'A secure auth and key-management concept built around passwordless flows, WebAuthn, and modern identity UX.',
    problem: 'Traditional password flows are noisy, fragile, and expensive to support.',
    solution: 'KeyForge explores a cleaner sign-in experience with passwordless interaction patterns and stronger user trust.',
    stack: ['Next.js', 'TypeScript', 'WebAuthn', 'Supabase', 'Node.js'],
    github: 'https://github.com/Easwarp45/keyforge',
  },
  portfolio: {
    title: '3D Portfolio',
    summary: 'The interactive showcase you are browsing now, designed to make projects and skills feel tactile instead of static.',
    problem: 'Typical portfolios are hard to remember and do not explain the builder well enough.',
    solution: 'This portfolio uses motion, 3D composition, and layered information to make exploration feel intentional.',
    stack: ['Next.js', 'React Three Fiber', 'GSAP', 'Tailwind CSS', 'TypeScript'],
    github: 'https://github.com/Easwarp45/Portfolio',
  },
} as const;

type DemoSlug = keyof typeof demoProjects;

export function generateStaticParams() {
  return Object.keys(demoProjects).map((slug) => ({ slug }));
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = demoProjects[slug as DemoSlug];

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#030712] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col gap-6 rounded-[28px] border border-cyber-cyan/15 bg-[radial-gradient(circle_at_top,_rgba(0,240,255,0.12),_transparent_35%),linear-gradient(180deg,_rgba(8,12,24,0.96),_rgba(3,7,18,0.98))] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-200 transition hover:border-cyber-cyan/30 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber-cyan/20 bg-cyber-cyan/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-cyber-cyan">
            <Sparkles className="h-4 w-4" />
            Live demo
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <div className="space-y-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-cyber-cyan/60">Project showcase</div>
              <h1 className="mt-2 text-4xl font-semibold uppercase tracking-tight text-white sm:text-5xl">{project.title}</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">{project.summary}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-[10px] uppercase tracking-[0.3em] text-cyber-cyan/60">Problem</div>
                <p className="mt-2 text-sm leading-7 text-gray-200">{project.problem}</p>
              </article>
              <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-[10px] uppercase tracking-[0.3em] text-cyber-cyan/60">Solution</div>
                <p className="mt-2 text-sm leading-7 text-gray-200">{project.solution}</p>
              </article>
            </div>
          </div>

          <aside className="space-y-4 rounded-3xl border border-cyber-cyan/15 bg-slate-950/70 p-5">
            <div className="text-[10px] uppercase tracking-[0.35em] text-cyber-cyan/60">Stack</div>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-gray-200">{item}</span>
              ))}
            </div>

            <div className="space-y-3 border-t border-white/10 pt-4">
              <a href={project.github} target="_blank" rel="noreferrer noopener" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-200 transition hover:border-cyber-cyan/30 hover:text-white">
                <GithubIcon className="h-4 w-4" />
                Source code
              </a>
              <Link href="/api/resume" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyber-cyan/30 bg-cyber-cyan/15 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyber-cyan transition hover:bg-cyber-cyan/25 hover:text-white">
                <ExternalLink className="h-4 w-4" />
                Download resume
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}