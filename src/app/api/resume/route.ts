import { NextResponse } from 'next/server';

const resumeText = `Easwaramurthy P
Full-stack engineer and 3D web portfolio builder

Education
Final-year CSE student at Kings Engineering College

Focus Areas
- Web development
- UI/UX design systems
- AI/ML experimentation
- Secure authentication flows

Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS, Framer Motion
- Backend: Supabase, Node.js, PostgreSQL
- Other: Java, Android / Capacitor, WebAuthn, SRP, Figma

Selected Work
- Kanakku: Indian expense tracker and financial planning app
- KeyForge: secure key and authentication flow exploration
- 3D Portfolio: interactive showcase built with Next.js, R3F, and GSAP

Contact
- GitHub: https://github.com/Easwarp45
- Instagram: https://www.instagram.com/eswar.png/
- Email: contact@easwar.dev
`;

export async function GET() {
  return new NextResponse(resumeText, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Easwaramurthy-P-Resume.md"',
    },
  });
}