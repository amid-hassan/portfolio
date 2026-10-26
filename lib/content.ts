export interface Moon {
  name: string;
  tech: string;
  color: number;
  css: string;
  radius: number;
  orbit: number;
  speed: number;
  tilt: number;
  phase: number;
}

/** The three moons of the hero scene: each one is a layer of the stack. */
export const MOONS: Moon[] = [
  { name: 'Frontend', tech: 'React, Next.js', color: 0xbfe9ff, css: '--c0', radius: 0.36, orbit: 4.5, speed: 0.32, tilt: 0.35, phase: 0.8 },
  { name: 'API', tech: 'Node.js, Express', color: 0xb7a3ff, css: '--c1', radius: 0.3, orbit: 5.6, speed: 0.22, tilt: -0.5, phase: 2.6 },
  { name: 'Cloud', tech: 'AWS', color: 0xffc98a, css: '--c3', radius: 0.42, orbit: 6.9, speed: 0.15, tilt: 0.18, phase: 4.4 },
];

export const REQUESTS = ['GET /projects', 'POST /login', '200 OK', 'GET /skills', '201 Created', 'GET /resume'];

export interface Stop {
  date: string;
  title: string;
  text: string;
}

export const JOURNEY: Stop[] = [
  { date: 'Jul 2025 to present', title: 'MCA, SRM Institute of Science and Technology', text: 'Master of Computer Application in Chennai, where I build full-stack projects with React, Next.js, Node.js and PostgreSQL.' },
  { date: '2024', title: 'Research paper', text: '“Ethical Considerations in Autonomous Systems”, presented at the Amity UG Research Conclave 2024.' },
  { date: 'Jun to Aug 2023', title: 'Machine learning intern, Acmegrade', text: 'I built a breast cancer classifier on the Diagnostic dataset and a movie recommender using collaborative filtering on IMDb data.' },
  { date: 'Sep 2021 to Jul 2024', title: 'BCA, Amity University, Noida', text: 'Bachelor of Computer Application at the Amity Institute of Information Technology.' },
];

export interface Project {
  title: string;
  meta: string;
  text: string;
  chips?: { label: string; layer: 0 | 1 | 2 | 3 }[];
  shots?: { src: string; alt: string; caption: string }[];
  links?: { label: string; href: string }[];
  note?: string;
}

export const PROJECTS: Project[] = [
  {
    title: 'Project Management App',
    meta: 'Aug to Sep 2026',
    text: 'A project management dashboard with a Next.js frontend, Tailwind CSS, Material UI Data Grid and Redux Toolkit Query. The API runs on EC2 behind API Gateway, the database sits on RDS in a private subnet, and users sign in through Cognito.',
    chips: [
      { label: 'Next.js on Amplify', layer: 0 },
      { label: 'API Gateway', layer: 1 },
      { label: 'Express and Prisma on EC2', layer: 1 },
      { label: 'PostgreSQL on RDS', layer: 2 },
      { label: 'S3 images', layer: 3 },
      { label: 'Cognito sign-in', layer: 3 },
    ],
    links: [
      { label: 'Open live demo', href: 'https://main.d3d3o795rn8y2x.amplifyapp.com/' },
      { label: 'Source on GitHub', href: 'https://github.com/amid-hassan/project-management' },
    ],
    note: 'The demo asks you to sign in. It runs on the AWS free plan, so it may be offline after March 2027.',
  },
  {
    title: 'Admin Dashboard',
    meta: 'Feb to Jun 2026',
    text: 'A classroom and university dashboard with multi-role sign-in and secure join codes. The React and Refine frontend uses shadcn/ui, TanStack Table, react-hook-form and Zod. The Express API stores data in Neon PostgreSQL through Drizzle ORM, with Cloudinary for uploads and Arcjet for rate limiting.',
    shots: [
      { src: '/shots/subjects.jpg', alt: 'Subjects table with code, name, department and description columns', caption: 'Subjects, with search and a department filter.' },
      { src: '/shots/classes.jpg', alt: 'Classes table with banner, status, subject, teacher and capacity', caption: 'Classes, with banners, status and teacher filters.' },
      { src: '/shots/limit.jpg', alt: 'Error message: guest request limit exceeded, status 429', caption: 'Arcjet answers with a 429 after repeated refreshes within a second.' },
    ],
    links: [
      { label: 'Frontend repo', href: 'https://github.com/amid-hassan/classroom-frontend' },
      { label: 'Backend repo', href: 'https://github.com/amid-hassan/classroom-backend' },
    ],
    note: 'The Railway free trial has ended, so there is no live site. These screenshots are from my local build.',
  },
  {
    title: 'CRUD Web Application',
    meta: '2024. Academic project.',
    text: 'A web app with sign-up, login and landing pages and full create, read, update and delete operations, written in HTML, CSS, JavaScript and PHP on MySQL.',
  },
];

export const SKILLS: { layer: 0 | 1 | 2 | 3; name: string; items: string }[] = [
  { layer: 0, name: 'Frontend', items: 'React, Next.js, TypeScript, Tailwind CSS, shadcn/ui, Refine, Redux Toolkit' },
  { layer: 1, name: 'API', items: 'Node.js, Express, REST, Prisma, Drizzle ORM, PHP' },
  { layer: 2, name: 'Database', items: 'PostgreSQL, MySQL, Neon' },
  { layer: 3, name: 'Cloud', items: 'AWS Amplify, EC2, API Gateway, RDS, S3, Cognito, Cloudinary, Arcjet' },
];

export const TOEFL = {
  date: '25 May 2024',
  total: 86,
  myBest: 88,
  sections: [
    { name: 'Reading', score: 18 },
    { name: 'Listening', score: 26 },
    { name: 'Speaking', score: 20 },
    { name: 'Writing', score: 22 },
  ],
};

export type SocialId = 'github' | 'linkedin' | 'instagram' | 'x';

export const SOCIALS: { id: SocialId; label: string; handle: string; href: string }[] = [
  { id: 'github', label: 'GitHub', handle: 'amid-hassan', href: 'https://github.com/amid-hassan' },
  { id: 'linkedin', label: 'LinkedIn', handle: 'ah07', href: 'https://www.linkedin.com/in/ah07' },
  { id: 'instagram', label: 'Instagram', handle: '@amid.hassan', href: 'https://www.instagram.com/amid.hassan/' },
  { id: 'x', label: 'X', handle: '@amid_hassan7', href: 'https://x.com/amid_hassan7' },
];

export const EMAIL = 'amidhassan589@gmail.com';
