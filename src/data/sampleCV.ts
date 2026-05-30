export type DateRange = { start: string; end: string; current?: boolean };

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  links: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  location: string;
  range: DateRange;
  details: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  range: DateRange;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  stack: string;
  range: DateRange;
  bullets: string[];
}

export interface ActivityItem {
  id: string;
  organization: string;
  role: string;
  location: string;
  range: DateRange;
  bullets: string[];
}

export interface CVData {
  personal: PersonalInfo;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  activities: ActivityItem[];
  skills: {
    technical: string[];
    languages: string[];
    certifications: string[];
    interests: string[];
  };
}

export const sampleCV: CVData = {
  personal: {
    fullName: "Alex Morgan",
    title: "Software Engineer · Business Analyst",
    email: "alex.morgan@email.com",
    phone: "+1 (415) 555-0142",
    location: "San Francisco, CA",
    links: "linkedin.com/in/alexmorgan · github.com/alexmorgan",
  },
  summary:
    "Software engineer with 5+ years building reliable internal tools and data workflows. Comfortable owning features end-to-end and translating ambiguous business needs into shippable, well-measured solutions.",
  education: [
    {
      id: "e1",
      school: "University of California, Berkeley",
      degree: "B.S. in Computer Science, Minor in Business",
      location: "Berkeley, CA",
      range: { start: "Aug 2016", end: "May 2020" },
      details: [
        "GPA: 3.8 / 4.0 — Dean's List (6 semesters)",
        "Relevant coursework: Distributed Systems, Databases, Operations Research",
      ],
    },
  ],
  experience: [
    {
      id: "x1",
      company: "Northwind Technologies",
      role: "Senior Software Engineer",
      location: "San Francisco, CA",
      range: { start: "Jun 2022", end: "Present", current: true },
      bullets: [
        "Improved monthly reporting workflow by reducing manual reconciliation time by 40% across 6 finance teams.",
        "Built a reusable invoice template system used across quotation, invoice, and billing workflows.",
        "Integrated third-party APIs and improved synchronization reliability across internal systems to 99.95% uptime.",
        "Mentored 3 junior engineers through structured code reviews and weekly architecture sessions.",
      ],
    },
    {
      id: "x2",
      company: "Helios Analytics",
      role: "Software Engineer",
      location: "Remote",
      range: { start: "Jul 2020", end: "May 2022" },
      bullets: [
        "Designed and shipped an internal data catalog adopted by 12 analyst teams within 4 months.",
        "Migrated legacy ETL jobs to a managed orchestrator, cutting average pipeline runtime by 35%.",
        "Partnered with product to define acceptance criteria for 20+ analytics features.",
      ],
    },
  ],
  projects: [
    {
      id: "p1",
      name: "OpenLedger",
      stack: "TypeScript, Postgres, Next.js",
      range: { start: "Jan 2024", end: "Present", current: true },
      bullets: [
        "Open-source double-entry bookkeeping engine with 800+ GitHub stars.",
        "Designed pluggable adapter system supporting CSV, QuickBooks, and Stripe imports.",
      ],
    },
    {
      id: "p2",
      name: "Calendly-for-Clinics",
      stack: "React, Node.js, Twilio",
      range: { start: "Mar 2023", end: "Sep 2023" },
      bullets: [
        "Booking platform piloted at 3 clinics, handling 1,200+ appointments per month.",
        "Implemented SMS reminders that reduced no-show rate from 18% to 7%.",
      ],
    },
  ],
  activities: [
    {
      id: "a1",
      organization: "Code the Bay",
      role: "Volunteer Mentor",
      location: "San Francisco, CA",
      range: { start: "Sep 2021", end: "Present", current: true },
      bullets: [
        "Coach a cohort of 8 career-switchers through weekly project reviews and mock interviews.",
      ],
    },
  ],
  skills: {
    technical: [
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "PostgreSQL",
      "AWS",
      "Docker",
      "GraphQL",
    ],
    languages: ["English (native)", "Spanish (professional)"],
    certifications: ["AWS Certified Solutions Architect — Associate"],
    interests: ["Open-source tooling", "Bouldering", "Specialty coffee"],
  },
};

export const sectionIds = [
  "personal",
  "summary",
  "education",
  "experience",
  "projects",
  "activities",
  "skills",
  "review",
] as const;

export type SectionId = (typeof sectionIds)[number];

export const sectionMeta: Record<
  SectionId,
  { label: string; description: string; hint: string }
> = {
  personal: {
    label: "Personal Info",
    description: "Name, contact, and where to reach you.",
    hint: "Keep it scannable — recruiters spend ~7 seconds here.",
  },
  summary: {
    label: "Summary",
    description: "A 2–3 sentence positioning statement.",
    hint: "Lead with years of experience and the value you ship.",
  },
  education: {
    label: "Education",
    description: "Schools, degrees, and notable coursework.",
    hint: "Most recent first. Drop GPA after 5 years of experience.",
  },
  experience: {
    label: "Work Experience",
    description: "Where you've worked and what you delivered.",
    hint: "Action verb + task + measurable result + tools.",
  },
  projects: {
    label: "Projects",
    description: "Side projects, open source, or internal builds.",
    hint: "Pick projects that show range, not just resume filler.",
  },
  activities: {
    label: "Activities",
    description: "Volunteering, communities, leadership.",
    hint: "Anything that shows initiative outside of paid work.",
  },
  skills: {
    label: "Skills & Additional",
    description: "Stack, languages, certifications, interests.",
    hint: "Group by category. Skip outdated tools.",
  },
  review: {
    label: "Review & Export",
    description: "Final checks before downloading.",
    hint: "Run a quick ATS sanity pass.",
  },
};