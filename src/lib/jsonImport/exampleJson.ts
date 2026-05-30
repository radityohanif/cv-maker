export const exampleImportJson = {
  personalInfo: {
    fullName: "Jordan Lee",
    headline: "Full-Stack Engineer",
    location: "Austin, TX",
    email: "jordan.lee@email.com",
    phone: "+1 (512) 555-0198",
    website: "jordanlee.dev",
    linkedin: "linkedin.com/in/jordanlee",
  },
  summary: {
    shortBio: "Full-stack engineer with 4 years building SaaS products.",
    profileDescription:
      "Experienced in React, Node.js, and cloud infrastructure. Passionate about clean APIs and measurable product outcomes.",
  },
  topSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
  sections: {
    education: [
      {
        institution: "University of Texas at Austin",
        degree: "B.S. Computer Science",
        fieldOfStudy: "Software Engineering",
        location: "Austin, TX",
        date: { start: "Aug 2017", end: "May 2021" },
        details: ["GPA: 3.7/4.0", "Relevant coursework: Algorithms, Web Development"],
      },
    ],
    workExperience: [
      {
        company: "BrightPath SaaS",
        position: "Software Engineer",
        location: "Remote",
        date: { start: "Mar 2022", end: "Present" },
        summary: "Own features across billing and onboarding flows.",
        responsibilities: [
          "Reduced checkout drop-off by 18% through streamlined onboarding.",
          "Built internal admin tools used by 40+ support agents daily.",
        ],
      },
    ],
    projects: [
      {
        projectName: "TaskFlow",
        category: "Side Project",
        description: "Lightweight project management app for small teams.",
        technologies: ["React", "Supabase", "Tailwind CSS"],
      },
    ],
    additional: {
      technicalSkills: ["JavaScript", "Python", "Docker"],
      businessSkills: ["Agile", "Stakeholder communication"],
      languages: ["English (native)", "Korean (conversational)"],
      certificationsAndTraining: ["AWS Cloud Practitioner"],
      awards: ["Dean's List"],
    },
  },
  metadata: {
    sourceType: ["portfolio", "ai-generated"],
    pageSize: "A4",
  },
};

export const exampleImportJsonString = JSON.stringify(exampleImportJson, null, 2);

export const schemaGuideExample = `{
  "personalInfo": {
    "fullName": "Your Name",
    "headline": "Job Title",
    "email": "you@email.com",
    "phone": "+1 555 123 4567",
    "location": "City, Country",
    "linkedin": "linkedin.com/in/you",
    "website": "yoursite.com"
  },
  "summary": {
    "profileDescription": "2–3 sentence professional summary…"
  },
  "topSkills": ["Skill A", "Skill B"],
  "sections": {
    "education": [{ "institution": "…", "degree": "…", "date": { "start": "…", "end": "…" } }],
    "workExperience": [{ "company": "…", "position": "…", "responsibilities": ["…"] }],
    "projects": [{ "projectName": "…", "technologies": ["…"] }],
    "additional": { "technicalSkills": ["…"], "languages": ["…"] }
  }
}`;
