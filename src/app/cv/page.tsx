import type { Metadata } from 'next';
import Link from 'next/link';
import { onlyOn } from '@/site/only';
import { PrintButton } from './PrintButton';

export const metadata: Metadata = {
  title: 'CV',
  description: 'Rifah Sajida Deya: junior full-stack engineer, backend focus.',
};

// The web version of the CV: same content as the PDF, minus phone number and
// home address (a public page gets scraped). "Save as PDF" uses the print
// stylesheet in globals.css.
export default function CvPage() {
  onlyOn('DEVSCRIPT');
  return (
    <div className="stack">
      <div className="spread">
        <div>
          <h1 style={{ margin: 0 }}>Rifah Sajida Deya</h1>
          <p className="kicker" style={{ margin: '0.3rem 0 0' }}>
            junior full-stack engineer · backend focus
          </p>
        </div>
        <PrintButton />
      </div>
      <p className="row meta">
        <a href="mailto:rifahsajida7@gmail.com">rifahsajida7@gmail.com</a>
        <a href="https://github.com/rifah07">GitHub</a>
        <a href="https://www.linkedin.com/in/rifah-sajida-deya-1011/">LinkedIn</a>
        <a href="https://leetcode.com/u/rifah07/">LeetCode</a>
        <Link href="/projects">Projects</Link>
      </p>
      <p>
        Full-stack engineer with a backend focus. I work at Periscale AI on a commerce platform used by online sellers,
        building Django REST APIs, React/TypeScript screens and parts of the LangGraph AI agent. Most comfortable with
        Node.js, TypeScript, Python and PostgreSQL.
      </p>

      <h2 className="kicker">experience</h2>
      <div className="cv-entry">
        <div className="spread">
          <h3>Junior Full-Stack Engineer · Periscale AI</h3>
          <span className="meta">06/2026 – present · remote</span>
        </div>
        <p className="meta">Joined as intern, promoted Oct 2026</p>
        <ul>
          <li>Build features across the Django REST backend, React/TypeScript dashboard and FastAPI + LangGraph agent; 95+ commits in my first three months.</li>
          <li>Added order taking, product photo and voice note understanding, and returning-customer memory to the AI sales agent (Messenger, Instagram, web chat; English, Bangla, Banglish).</li>
          <li>Built the human handoff flow so the agent passes a conversation to staff, and staff replies still reach the customer after they leave the chat.</li>
          <li>Fixed dropped and stuck AI replies in production with caching, timeouts and retries around LLM calls.</li>
          <li>Integrated three courier APIs (Carrybee, Pathao, Steadfast) with signature-verified webhooks and cascading location search.</li>
          <li>Redesigned the Orders &amp; Finance page into role-specific Call Center, Processing and Shipment boards.</li>
          <li>Shipped discounts, location-based delivery charges, invoices, follow-ups and inbox analytics, DB to UI.</li>
        </ul>
      </div>

      <h2 className="kicker">projects</h2>
      {[
        ['DevScript', 'NestJS, GraphQL, MongoDB, Next.js, Gemini', 'Two-site writing platform with security-first auth, per-user AI quotas and semantic related posts.'],
        ['HallMate', 'Express, PostgreSQL, Prisma, Next.js, SSLCommerz', 'Women’s hall portal with ten role dashboards, server-enforced privacy and online bill payment.'],
        ['ShopSphere', 'TypeScript, Express, MongoDB, Puppeteer', 'Multi-vendor marketplace with payments and a competitor price scraper.'],
        ['Multi-Tenant Workspace API', 'TypeScript, Express, PostgreSQL, Prisma, Zod', 'Tenant-isolated organisations, projects and tasks with three roles.'],
        ['ExpenseBot', 'TypeScript, Express, PostgreSQL, Prisma, React, Gemini', 'Telegram expense tracker that understands plain-language messages.'],
      ].map(([name, tech, line]) => (
        <div key={name} className="cv-entry">
          <h3>{name}</h3>
          <p className="meta" style={{ margin: '0.2rem 0' }}>{tech}</p>
          <p style={{ margin: 0 }}>{line}</p>
        </div>
      ))}

      <h2 className="kicker">skills</h2>
      <div className="cv-entry">
        <p><strong>Languages:</strong> TypeScript, JavaScript, Python, C++, Ruby</p>
        <p><strong>Backend:</strong> Node.js, Express, NestJS, Django REST Framework, FastAPI, Hono, GraphQL, REST, webhooks</p>
        <p><strong>Frontend:</strong> React, Next.js, TanStack Query, Tailwind CSS</p>
        <p><strong>Data:</strong> PostgreSQL, MySQL, MongoDB, Redis, Prisma, TypeORM, Mongoose</p>
        <p><strong>AI:</strong> LangGraph, Google Gemini API, embeddings, RAG, pgvector</p>
        <p><strong>Security:</strong> JWT with rotation, RBAC, multi-tenant isolation, rate limiting, input validation</p>
        <p><strong>Tools:</strong> Git, Docker, Swagger/OpenAPI, Postman, Vercel</p>
      </div>

      <h2 className="kicker">education</h2>
      <div className="cv-entry">
        <div className="spread">
          <h3>B.Sc. in Computer Science and Engineering · Jagannath University, Dhaka</h3>
          <span className="meta">2019 – 2025 · CGPA 3.53</span>
        </div>
      </div>
    </div>
  );
}
