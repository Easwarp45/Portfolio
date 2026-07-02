'use client';

import Link from 'next/link';
import { useMemo, type ComponentType } from 'react';
import { ArrowRight, BriefcaseBusiness, Code2, ExternalLink, FolderGit2, GraduationCap, Mail, NotebookText, Sparkles } from 'lucide-react';
import { GithubIcon } from './Icons';
import { ProjectData, projectsData } from '../canvas/DeploymentContainers';

interface PortfolioSectionsProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onSelectProject: (project: ProjectData | null) => void;
}

const skillGroups = [
  {
    label: 'Frontend',
    accent: 'text-cyber-cyan',
    chips: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    label: 'Backend',
    accent: 'text-cyber-purple',
    chips: ['Supabase', 'Node.js', 'PostgreSQL', 'API routes', 'Auth flows'],
  },
  {
    label: 'Other',
    accent: 'text-cyber-green',
    chips: ['Java', 'Android / Capacitor', 'WebAuthn', 'SRP', 'Figma'],
  },
];

const insightNotes = [
  {
    title: 'Placement prep',
    body: 'I am balancing campus drives, coding practice, and system design revision while shipping portfolio work that proves I can build and explain real products.',
  },
  {
    title: 'What I care about',
    body: 'Clean interaction design, secure sign-in flows, and product decisions that help users finish a task with less friction.',
  },
];

function SectionHeader({ title, eyebrow, icon: Icon }: { title: string; eyebrow: string; icon: ComponentType<{ className?: string }>; }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded border border-cyber-cyan/25 bg-slate-950/80 text-cyber-cyan">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-cyber-cyan/60">{eyebrow}</div>
        <h2 className="text-lg font-semibold uppercase tracking-wide text-white">{title}</h2>
      </div>
    </div>
  );
}

function ActionLink({ href, label, icon: Icon, variant = 'primary' }: { href: string; label: string; icon: ComponentType<{ className?: string }>; variant?: 'primary' | 'secondary'; }) {
  const base = 'inline-flex h-10 w-full min-w-0 items-center justify-start gap-2 rounded px-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300';
  const styles = variant === 'primary'
    ? 'border border-cyber-cyan/40 bg-cyber-cyan/15 text-cyber-cyan hover:bg-cyber-cyan/25 hover:text-white'
    : 'border border-white/10 bg-white/5 text-gray-300 hover:border-cyber-cyan/40 hover:text-white';

  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer noopener' : undefined} className={`${base} ${styles}`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="truncate">{label}</span>
    </a>
  );
}

export default function PortfolioSections({ activeSection, setActiveSection, onSelectProject }: PortfolioSectionsProps) {
  const featuredProjects = useMemo(() => projectsData.slice(0, 3), []);

  return (
    <aside className="fixed bottom-4 left-1/2 z-20 w-[min(92vw,470px)] -translate-x-1/2 pointer-events-auto md:left-auto md:right-5 md:top-24 md:bottom-5 md:translate-x-0 font-mono">
      <div className="glass-panel max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-cyber-cyan/20 bg-slate-950/75 p-4 text-sm text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-5">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-cyber-cyan/60">Section feed</div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/80">Focused portfolio content</div>
          </div>
          <Link href="/api/resume" className="inline-flex items-center gap-2 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyber-cyan transition hover:bg-cyber-cyan/20">
            <Sparkles className="h-3.5 w-3.5" />
            Resume
          </Link>
        </div>

        {activeSection === 'home' && (
          <div className="mt-4 space-y-4">
            <SectionHeader eyebrow="Home" title="Full-stack builder focused on useful interfaces" icon={BriefcaseBusiness} />
            <p className="text-sm leading-7 text-gray-300">
              Final-year CSE student at Kings Engineering College building polished web apps, 3D interfaces, and secure product flows that solve real problems for users and recruiters.
            </p>

            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-cyber-cyan/60">Quick actions</div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setActiveSection('projects')} className="inline-flex items-center gap-2 rounded border border-cyber-cyan/35 bg-cyber-cyan/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyber-cyan transition hover:bg-cyber-cyan/20">
                  View projects <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setActiveSection('about')} className="inline-flex items-center gap-2 rounded border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-200 transition hover:border-cyber-cyan/35 hover:text-white">
                  About me
                </button>
                <ActionLink href="/api/resume" label="Download resume" icon={NotebookText} />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="mt-4 space-y-4">
            <SectionHeader eyebrow="About" title="A builder who likes clear systems and good taste" icon={GraduationCap} />

            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm leading-7 text-gray-300">
                I am a final-year CSE student at Kings Engineering College. My work sits at the intersection of web development, UI/UX, and AI/ML exploration, with a bias toward interfaces that feel fast, intentional, and easy to trust.
              </p>
              <p className="text-sm leading-7 text-gray-300">
                Right now I am sharpening my placement prep through campus-drive style interview practice, coding rounds, and project narratives that show how I think through product and engineering tradeoffs.
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cyber-cyan/60">
                <Code2 className="h-3.5 w-3.5" />
                Skills / Tech Stack
              </div>
              <div className="space-y-3">
                {skillGroups.map((group) => (
                  <div key={group.label} className="space-y-2">
                    <div className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${group.accent}`}>{group.label}</div>
                    <div className="flex flex-wrap gap-2">
                      {group.chips.map((chip) => (
                        <span key={chip} className="rounded-full border border-white/10 bg-slate-950/80 px-2.5 py-1 text-[10px] text-gray-200">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {insightNotes.map((note) => (
                <div key={note.title} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-cyber-cyan/60">Insight</div>
                  <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-white">{note.title}</div>
                  <p className="text-sm leading-7 text-gray-300">{note.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="mt-4 space-y-4">
            <SectionHeader eyebrow="Projects" title="Selected builds and what they solve" icon={FolderGit2} />

            <div className="space-y-3">
              {featuredProjects.map((project) => (
                <article key={project.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyber-cyan/30">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-cyber-cyan/60">{project.category}</div>
                      <h3 className="mt-1 text-base font-semibold uppercase tracking-wide text-white">{project.name}</h3>
                    </div>
                    <button onClick={() => onSelectProject(project)} className="rounded-full border border-cyber-cyan/20 bg-cyber-cyan/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyber-cyan transition hover:bg-cyber-cyan/20">
                      Inspect
                    </button>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-gray-300">{project.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="rounded-full border border-white/10 bg-slate-950/80 px-2.5 py-1 text-[10px] text-gray-200">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <ActionLink href={project.liveUrl} label="Live demo" icon={ExternalLink} />
                    <ActionLink href={project.githubUrl} label="GitHub repo" icon={GithubIcon} variant="secondary" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'contact' && (
          <div className="mt-4 space-y-4">
            <SectionHeader eyebrow="Contact" title="Get in touch" icon={Mail} />

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm leading-7 text-gray-300">
                Open to internships, freelance work, and conversations about front-end systems, auth flows, or product design.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <ActionLink href="mailto:contact@easwar.dev" label="Email me" icon={Mail} />
                <ActionLink href="https://github.com/Easwarp45" label="GitHub" icon={GithubIcon} variant="secondary" />
                <ActionLink href="https://www.instagram.com/eswar.png/" label="Instagram" icon={ExternalLink} variant="secondary" />
                <ActionLink href="https://www.linkedin.com/search/results/all/?keywords=Easwaramurthy%20P" label="LinkedIn" icon={ExternalLink} variant="secondary" />
              </div>

              <div className="mt-4 rounded-xl border border-cyber-cyan/15 bg-slate-950/70 p-3 text-[11px] leading-6 text-cyber-cyan/80">
                Prefer the terminal-style form below for longer notes. For faster contact, email is the most reliable path.
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}