import type { Metadata } from 'next';
import { onlyOn } from '@/site/only';

export const metadata: Metadata = { title: 'Projects' };

type Project = { name: string; stack: string; what: string; proud: string; links: [string, string][] };

// Strongest first: what a reviewer with two minutes should see
const PROJECTS: Project[] = [
  {
    name: 'HallMate',
    stack: 'Express 5 · PostgreSQL · Prisma · Next.js 16 · SSLCommerz',
    what: 'The website and resident portal for a women’s hall at Jagannath University: ten roles, from residents and house tutors to the provost, guard and dining staff, each with a dashboard for their job, and a public site with admission, events and notices.',
    proud:
      'Privacy rules enforced in the API, not just hidden in the UI (support staff never see residents’ phones or rooms, tutors see only their floor), online bill payment verified server to server, a phone-camera ID scanner for the gate, and public demo logins the API keeps read-only.',
    links: [
      ['Live site', 'https://hallmate.vercel.app'],
      ['Try every role', 'https://github.com/rifah07/hallmate-backend/blob/master/docs/DEMO_ACCOUNTS.md'],
      ['API code', 'https://github.com/rifah07/hallmate-backend'],
      ['Web code', 'https://github.com/rifah07/hallmate-frontend'],
    ],
  },
  {
    name: 'DevScript',
    stack: 'NestJS · GraphQL · MongoDB · Next.js 16 · Gemini',
    what: 'The platform behind this site and a sister poetry journal: two branded sites, one API, strict per-site data isolation, open for other writers.',
    proud:
      'Found and fixed real access-control bugs, rate limiting that works behind serverless proxies, per-user AI quotas enforced atomically in MongoDB, and semantic related posts with a hand-written top-k heap over Gemini embeddings.',
    links: [
      ['Live site', 'https://devscript-seven.vercel.app'],
      ['API code', 'https://github.com/rifah07/devscript-api'],
      ['Web code', 'https://github.com/rifah07/devscript-web'],
    ],
  },
  {
    name: 'ShopBot',
    stack: 'Next.js 15 · TypeScript · MongoDB · Gemini 2.5 Flash',
    what: 'A shop you can use by chatting: browse, add to cart, change quantities, check out or cancel an order in plain language, next to a normal storefront and an admin dashboard.',
    proud: 'Gemini only extracts the intent and its details (ten intents); the actual cart and order changes run in ordinary, tested server code, so the AI can never change data on its own.',
    links: [
      ['Live site', 'https://ai-ecommerce-chatbot-six.vercel.app/shop'],
      ['Code', 'https://github.com/rifah07/ai-ecommerce-chatbot'],
    ],
  },
  {
    name: 'ShopSphere',
    stack: 'TypeScript · Node.js · Express · MongoDB · Puppeteer',
    what: 'A multi-vendor marketplace with admin, seller and buyer roles: cart, wishlist, orders, coupons, refunds, reviews and Stripe/PayPal/COD payments.',
    proud: 'A competitor price scraper that suggests prices to sellers, with a Cheerio fallback where headless Chrome was blocked.',
    links: [
      ['Backend', 'https://github.com/rifah07/ShopSphere__A-Complete-World-for-Shopping__Backend'],
      ['Frontend', 'https://github.com/rifah07/shopsphere-frontend'],
      ['API docs', 'https://shopsphere-a-complete-world-for-shopping.onrender.com/api-docs'],
    ],
  },
  {
    name: 'Multi-Tenant Workspace API',
    stack: 'TypeScript · Express · PostgreSQL · Prisma · Zod',
    what: 'Organisations, projects, tasks and users, where every query is scoped to one organisation.',
    proud: 'The tenant id comes from the token, never the request, so isolation can’t be forgotten. Three roles, Swagger docs.',
    links: [
      ['Backend', 'https://github.com/rifah07/multi_tenant_organization'],
      ['Frontend', 'https://github.com/rifah07/multi-tenant-workspace-frontend'],
      ['API docs', 'https://multi-tenant-organization-9d2r.onrender.com/api-docs'],
    ],
  },
  {
    name: 'ExpenseBot',
    stack: 'TypeScript · Express · PostgreSQL · Prisma · Gemini · React',
    what: 'Type “500 uber yesterday” to a Telegram bot; Gemini pulls out the amount, category and date. Budget alerts and a dashboard.',
    proud: 'Common phrases are matched by keywords first, so the AI is only called when it’s actually needed.',
    links: [
      ['Try the bot', 'https://t.me/ExpenseTrack_R_Bot'],
      ['Backend', 'https://github.com/rifah07/expense-tracker-telegram-bot-backend'],
      ['Dashboard', 'https://expense-tracker-telegram-bot-fronte.vercel.app/'],
    ],
  },
];

export default function ProjectsPage() {
  onlyOn('DEVSCRIPT');
  return (
    <>
      <p className="kicker">projects</p>
      <h1>Things I’ve built</h1>
      <p className="muted">Each one started as my own idea. The hardest part of each is written next to it.</p>
      {PROJECTS.map((p) => (
        <section key={p.name} className="project">
          <h2>{p.name}</h2>
          <p className="meta">{p.stack}</p>
          <p>{p.what}</p>
          <p className="muted">
            <strong>Hardest part:</strong> {p.proud}
          </p>
          <p className="row meta">
            {p.links.map(([label, href]) => (
              <a key={href} href={href} rel="noopener noreferrer" target="_blank">
                {label} ↗
              </a>
            ))}
          </p>
        </section>
      ))}
    </>
  );
}
