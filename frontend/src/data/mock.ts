// ---------------------------------------------------------------------------
// CareerPilot V1 — mock data layer.
// Shapes mirror the future REST API so swapping in axios + react-query is trivial.
// ---------------------------------------------------------------------------

export type Platform = "github" | "leetcode" | "codeforces" | "codechef" | "atcoder";

export interface User {
  name: string;
  handle: string;
  email: string;
  college: string;
  batch: string;
  location: string;
  headline: string;
  bio: string;
  avatarHue: number;
  skills: string[];
  resumeProgress: number;
  readinessScore: number;
  goalsCompleted: number;
  joinedOn: string;
}

export const user: User = {
  name: "Karan Rana",
  handle: "@karan.codes",
  email: "karan@careerpilot.app",
  college: "B.Tech CSE · Madhav Institute of Technology and Science, Gwalior",
  batch: "2nd Year · Class of 2028",
  location: "Gwalior, India",
  headline: "2nd-year SDE aspirant · Competitive programmer · Open source",
  bio: "Building my way through DSA, systems and real products. 300+ problems solved, specialist on Codeforces, always shipping.",
  avatarHue: 258,
  skills: ["Java", "Spring Boot", "TypeScript", "React", "SQL", "DSA", "System Design", "Git", "Docker"],
  resumeProgress: 82,
  readinessScore: 78,
  goalsCompleted: 6,
  joinedOn: "Jan 2026",
};

export interface CodingStat {
  username: string;
  label: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  solved: number;
  easy?: number;
  medium?: number;
  hard?: number;
  streak: number;
  globalRank?: string;
  accent: string;
  connected: boolean;
}

export const codingStats: Record<Exclude<Platform, "codechef" | "atcoder">, CodingStat> = {
  github: {
    username: "karan-rana",
    label: "GitHub",
    solved: 0,
    streak: 9,
    accent: "#8b5cf6",
    connected: true,
  },
  leetcode: {
    username: "karan_codes",
    label: "LeetCode",
    rating: 1723,
    rank: "Knight",
    solved: 312,
    easy: 141,
    medium: 126,
    hard: 45,
    streak: 23,
    globalRank: "Top 8.2%",
    accent: "#ffb020",
    connected: true,
  },
  codeforces: {
    username: "karanSh",
    label: "Codeforces",
    rating: 1523,
    maxRating: 1591,
    rank: "Specialist",
    solved: 214,
    streak: 12,
    globalRank: "#41,280",
    accent: "#3f9cfb",
    connected: true,
  },
};

export const upcomingPlatforms = [
  { platform: "codechef" as const, label: "CodeChef", note: "API sync coming soon" },
  { platform: "atcoder" as const, label: "AtCoder", note: "API sync coming soon" },
];

export interface GhStats {
  contributionsYear: number;
  currentStreak: number;
  longestStreak: number;
  repos: number;
  stars: number;
  forks: number;
  followers: number;
  following: number;
  topLanguages: { name: string; pct: number; color: string }[];
}

export const ghStats: GhStats = {
  contributionsYear: 1284,
  currentStreak: 9,
  longestStreak: 41,
  repos: 47,
  stars: 318,
  forks: 94,
  followers: 128,
  following: 96,
  topLanguages: [
    { name: "TypeScript", pct: 38, color: "#3178c6" },
    { name: "Java", pct: 27, color: "#e76f00" },
    { name: "Python", pct: 16, color: "#ffd43b" },
    { name: "C++", pct: 11, color: "#f34b7d" },
    { name: "Other", pct: 8, color: "#6e7681" },
  ],
};

export interface WeeklyPoint {
  week: string;
  solved: number;
  commits: number;
  hours: number;
}

export const weeklyActivity: WeeklyPoint[] = [
  { week: "W1", solved: 9, commits: 18, hours: 14 },
  { week: "W2", solved: 14, commits: 26, hours: 19 },
  { week: "W3", solved: 8, commits: 21, hours: 13 },
  { week: "W4", solved: 17, commits: 34, hours: 24 },
  { week: "W5", solved: 12, commits: 29, hours: 18 },
  { week: "W6", solved: 21, commits: 42, hours: 28 },
  { week: "W7", solved: 16, commits: 37, hours: 22 },
];

export interface TopicStat {
  name: string;
  solved: number;
  accuracy: number;
  weak: boolean;
}

export const topicStats: TopicStat[] = [
  { name: "Arrays", solved: 46, accuracy: 84, weak: false },
  { name: "Strings", solved: 38, accuracy: 78, weak: false },
  { name: "Hash Table", solved: 33, accuracy: 81, weak: false },
  { name: "Dynamic Prog.", solved: 29, accuracy: 54, weak: true },
  { name: "Trees", solved: 31, accuracy: 69, weak: false },
  { name: "Graphs", solved: 18, accuracy: 46, weak: true },
  { name: "Binary Search", solved: 24, accuracy: 76, weak: false },
  { name: "Greedy", solved: 22, accuracy: 71, weak: false },
  { name: "SQL / DB", solved: 27, accuracy: 88, weak: false },
];

export interface Repo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  langColor: string;
  updated: string;
  readmePreview: string;
  score: number;
  topics: string[];
  demoUrl?: string;
}

export const repos: Repo[] = [
  {
    name: "careerpilot",
    description: "All-in-one placement OS — connect coding profiles, track goals, prep for interviews.",
    stars: 186,
    forks: 47,
    language: "TypeScript",
    langColor: "#3178c6",
    updated: "2 days ago",
    readmePreview: "# CareerPilot 🚀  Your placement journey, orchestrated. Auto-syncs LeetCode/Codeforces/GitHub, plans goals and roadmaps, and prepares interview docs — all in one dashboard.",
    score: 94,
    topics: ["react", "spring-boot", "ai", "education"],
    demoUrl: "https://careerpilot.app",
  },
  {
    name: "jvm-note",
    description: "Java + Spring Boot crash-notes from my placement prep — concurrency, JVM internals, Hibernate.",
    stars: 64,
    forks: 21,
    language: "Java",
    langColor: "#e76f00",
    updated: "1 week ago",
    readmePreview: "# jvm-note ☕  Condensed JVM/Spring knowledge: memory model, GC, Spring lifecycle, JPA pitfalls. Written for speed, maintained for interviews.",
    score: 87,
    topics: ["java", "spring", "interview-prep", "documentation"],
  },
  {
    name: "dsa-grind",
    description: "Pattern-based DSA solutions — 40+ recurring templates across arrays, trees, DP and graphs.",
    stars: 142,
    forks: 33,
    language: "Java",
    langColor: "#e76f00",
    updated: "3 days ago",
    readmePreview: "# dsa-grind 🧠  Every solution categorized by pattern, not platform. Includes complexity notes, one-line intuition and clean Java implementations.",
    score: 91,
    topics: ["dsa", "algorithms", "competitive-programming"],
    demoUrl: "https://dsa-grind.vercel.app",
  },
  {
    name: "cf-solutions",
    description: "Accepted Codeforces solutions with editorials written in my own words.",
    stars: 28,
    forks: 12,
    language: "C++",
    langColor: "#f34b7d",
    updated: "3 weeks ago",
    readmePreview: "# cf-solutions  Accepted C++ solutions for Codeforces rounds, each with a short 'why it works' note and complexity analysis.",
    score: 72,
    topics: ["competitive-programming", "cpp", "codeforces"],
  },
  {
    name: "shadcn-inspector",
    description: "Devtools companion that highlights copy-paste React components on any page.",
    stars: 311,
    forks: 42,
    language: "TypeScript",
    langColor: "#3178c6",
    updated: "5 days ago",
    readmePreview: "# shadcn-inspector 🧩  A browser extension that detects shadcn/ui component usage, shows source snippets and theme tokens. 12k+ installs.",
    score: 96,
    topics: ["typescript", "extension", "react", "tooling"],
    demoUrl: "https://shadcn-inspector.dev",
  },
  {
    name: "capstone-smart-parking",
    description: "IoT + CV based smart parking occupancy system (semester project).",
    stars: 9,
    forks: 4,
    language: "Python",
    langColor: "#ffd43b",
    updated: "2 months ago",
    readmePreview: "# smart-parking  Edge AI occupancy detection using YOLOv8 + a FastAPI gateway and Flutter client. Alerting via Telegram bot.",
    score: 61,
    topics: ["python", "iot", "computer-vision", "college"],
    demoUrl: "https://smart-parking-demo.vercel.app",
  },
];

// --------------------------- contests ---------------------------

export type ContestPlatform = "LeetCode" | "Codeforces" | "CodeChef" | "AtCoder";

export interface Contest {
  id: string;
  name: string;
  platform: ContestPlatform;
  startTime: string; // ISO
  duration: string;
  difficulty: "Warm-up" | "Easy" | "Medium" | "Hard";
  rated: boolean;
  url: string;
}

const iso = (days: number, hours = 10): string => {
  const d = new Date(Date.now() + days * 86_400_000 + hours * 3_600_000);
  return d.toISOString();
};

export const contests: Contest[] = [
  { id: "lc-bw-467", name: "LeetCode Weekly Contest 467", platform: "LeetCode", startTime: iso(2), duration: "1h 30m", difficulty: "Medium", rated: true, url: "#" },
  { id: "cf-rd-2019", name: "Codeforces Round 2019 (Div. 2)", platform: "Codeforces", startTime: iso(4), duration: "2h", difficulty: "Medium", rated: true, url: "#" },
  { id: "cc-starter-220", name: "CodeChef Starters 220", platform: "CodeChef", startTime: iso(1), duration: "2h", difficulty: "Easy", rated: true, url: "#" },
  { id: "atc-abc-410", name: "AtCoder Beginner Contest 410", platform: "AtCoder", startTime: iso(3, 5), duration: "1h 40m", difficulty: "Easy", rated: true, url: "#" },
  { id: "lc-bw-468", name: "LeetCode Biweekly Contest 162", platform: "LeetCode", startTime: iso(5), duration: "1h 30m", difficulty: "Hard", rated: true, url: "#" },
  { id: "cf-global-29", name: "Codeforces Global Round 29", platform: "Codeforces", startTime: iso(7, 4), duration: "3h", difficulty: "Hard", rated: true, url: "#" },
  { id: "cc-lunch-143", name: "CodeChef Lunchtime 143", platform: "CodeChef", startTime: iso(8), duration: "2h", difficulty: "Medium", rated: true, url: "#" },
  { id: "atc-agc-075", name: "AtCoder Grand Contest 075", platform: "AtCoder", startTime: iso(11, 3), duration: "2h 30m", difficulty: "Hard", rated: true, url: "#" },
];

// --------------------------- hackathons ---------------------------

export interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  mode: "Online" | "Hybrid" | "Offline";
  deadline: string;
  theme: string;
  teamSize: string;
  prize: string;
  difficulty: "Beginner-friendly" | "Intermediate" | "Advanced";
  city?: string;
}

export const hackathons: Hackathon[] = [
  { id: "h1", name: "Smart India Hackathon 2026", organizer: "MoE · Govt. of India", mode: "Offline", deadline: iso(12), theme: "EdTech & Accessibility", teamSize: "6", prize: "₹1,00,000 + incubation", difficulty: "Intermediate", city: "Pan-India" },
  { id: "h2", name: "Devfolio Season of Code", organizer: "Devfolio", mode: "Online", deadline: iso(6), theme: "Open ended — web3, AI, devtools", teamSize: "1–4", prize: "$10,000 pool", difficulty: "Beginner-friendly" },
  { id: "h3", name: "HackMIT 2026", organizer: "MIT", mode: "Hybrid", deadline: iso(18), theme: "Open innovation", teamSize: "1–4", prize: "$15,000 pool", difficulty: "Advanced", city: "Boston / Remote" },
  { id: "h4", name: "Toyota Hackathon 2026", organizer: "Toyota Connected", mode: "Online", deadline: iso(9), theme: "Smart mobility & connected cars", teamSize: "2–5", prize: "$30,000 + job offers", difficulty: "Intermediate" },
  { id: "h5", name: "ETHIndia 2026", organizer: "ETHGlobal", mode: "Offline", deadline: iso(21), theme: "Ethereum & Web3", teamSize: "1–4", prize: "$100,000 pool", difficulty: "Advanced", city: "Bengaluru" },
  { id: "h6", name: "Hack the Change 2026", organizer: "UN SDG + CodeDay", mode: "Online", deadline: iso(4), theme: "Climate & sustainability", teamSize: "2–5", prize: "$8,000 pool", difficulty: "Beginner-friendly" },
  { id: "h7", name: "Flipkart GRiD 7.0", organizer: "Flipkart", mode: "Online", deadline: iso(15), theme: "E-commerce & ML systems", teamSize: "3", prize: "₹10L + PPI offers", difficulty: "Intermediate" },
  { id: "h8", name: "JP Morgan Code for Good", organizer: "JPMorgan Chase", mode: "Offline", deadline: iso(25), theme: "FinTech for nonprofits", teamSize: "4–5", prize: "Interview fast-track", difficulty: "Advanced", city: "Bengaluru / Mumbai" },
];

// --------------------------- goals ---------------------------

export interface Goal {
  id: string;
  title: string;
  category: "DSA" | "Backend" | "SQL" | "Projects" | "Interviews";
  target: number;
  current: number;
  unit: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
  status: "active" | "done";
}

export const goals: Goal[] = [
  { id: "g1", title: "Solve 200 DSA questions", category: "DSA", target: 200, current: 152, unit: "questions", deadline: iso(21), priority: "High", status: "active" },
  { id: "g2", title: "Finish Java Backend roadmap", category: "Backend", target: 14, current: 8, unit: "stages", deadline: iso(45), priority: "High", status: "active" },
  { id: "g3", title: "Grind SQL on LeetCode", category: "SQL", target: 50, current: 31, unit: "problems", deadline: iso(14), priority: "Medium", status: "active" },
  { id: "g4", title: "Ship 2 portfolio projects", category: "Projects", target: 2, current: 2, unit: "projects", deadline: iso(-3), priority: "Medium", status: "done" },
  { id: "g5", title: "Mock interviews completed", category: "Interviews", target: 10, current: 4, unit: "interviews", deadline: iso(38), priority: "High", status: "active" },
];

// --------------------------- roadmaps ---------------------------

export interface RoadmapStage {
  title: string;
  done: boolean;
  eta: string;
}

export interface Roadmap {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  gradient: string;
  estWeeks: string;
  totalStages: number;
  doneStages: number;
  stages: RoadmapStage[];
  resources: string[];
}

export const roadmaps: Roadmap[] = [
  {
    id: "java-backend",
    title: "Java Backend",
    tagline: "Spring Boot · REST · Microservices",
    emoji: "☕",
    gradient: "from-orange-500 to-amber-600",
    estWeeks: "12–16 wks",
    totalStages: 14,
    doneStages: 8,
    stages: [
      { title: "Java core + OOP mastery", done: true, eta: "wk 1" },
      { title: "Collections & streams", done: true, eta: "wk 1–2" },
      { title: "JVM, GC & memory model", done: true, eta: "wk 2" },
      { title: "SQL & JDBC", done: true, eta: "wk 3" },
      { title: "HTTP, REST & JSON", done: true, eta: "wk 4" },
      { title: "Spring Core & DI", done: true, eta: "wk 5" },
      { title: "Spring Boot + MVC", done: true, eta: "wk 6" },
      { title: "Spring Data JPA", done: true, eta: "wk 7" },
      { title: "Spring Security + JWT", done: false, eta: "wk 8" },
      { title: "Caching & Redis", done: false, eta: "wk 9" },
      { title: "Messaging + Kafka basics", done: false, eta: "wk 10" },
      { title: "Microservices & discovery", done: false, eta: "wk 11" },
      { title: "Docker + CI/CD", done: false, eta: "wk 12" },
      { title: "Cloud deploy & interview drill", done: false, eta: "wk 13–16" },
    ],
    resources: ["Spring Boot docs", "Baeldung", "Amigoscode", "InterviewBit"],
  },
  {
    id: "fullstack",
    title: "Full Stack",
    tagline: "React · Node · PostgreSQL · AWS",
    emoji: "🧩",
    gradient: "from-sky-500 to-cyan-500",
    estWeeks: "14–18 wks",
    totalStages: 12,
    doneStages: 4,
    stages: [
      { title: "HTML/CSS/JS foundations", done: true, eta: "wk 1" },
      { title: "TypeScript deeply", done: true, eta: "wk 2" },
      { title: "React + hooks + state", done: true, eta: "wk 3–4" },
      { title: "REST + Node/Express", done: true, eta: "wk 5" },
      { title: "PostgreSQL + Prisma", done: false, eta: "wk 6" },
      { title: "Auth, sessions & cookies", done: false, eta: "wk 7" },
      { title: "Testing (unit + e2e)", done: false, eta: "wk 8" },
      { title: "Next.js SSR", done: false, eta: "wk 9" },
      { title: "Docker + deploy", done: false, eta: "wk 10" },
      { title: "CI/CD pipelines", done: false, eta: "wk 11" },
      { title: "System design basics", done: false, eta: "wk 12" },
      { title: "Capstone build sprint", done: false, eta: "wk 13–18" },
    ],
    resources: ["The Odin Project", "Epic React", "Fullstackopen", "AWS free tier"],
  },
  {
    id: "ai-engineer",
    title: "AI Software Engineer",
    tagline: "LLMs · RAG · Agents · MLOps",
    emoji: "🤖",
    gradient: "from-fuchsia-500 to-purple-600",
    estWeeks: "16–20 wks",
    totalStages: 11,
    doneStages: 2,
    stages: [
      { title: "Python + data tools", done: true, eta: "wk 1" },
      { title: "Math refresher for ML", done: true, eta: "wk 2" },
      { title: "Prompt engineering", done: false, eta: "wk 3" },
      { title: "LangChain & vector DBs", done: false, eta: "wk 4–5" },
      { title: "RAG deep-dive", done: false, eta: "wk 6" },
      { title: "Fine-tuning foundations", done: false, eta: "wk 7–8" },
      { title: "Agent frameworks", done: false, eta: "wk 9" },
      { title: "Evaluation & guardrails", done: false, eta: "wk 10" },
      { title: "MLOps + deployment", done: false, eta: "wk 11–12" },
      { title: "Building AI products", done: false, eta: "wk 13" },
      { title: "Portfolio + interview prep", done: false, eta: "wk 14–20" },
    ],
    resources: ["DeepLearning.AI", "LangChain docs", "Karpathy lectures", "LLM Course"],
  },
  {
    id: "devops",
    title: "DevOps",
    tagline: "Linux · Docker · K8s · IaC",
    emoji: "🛠️",
    gradient: "from-emerald-500 to-teal-600",
    estWeeks: "12–16 wks",
    totalStages: 10,
    doneStages: 0,
    stages: [
      { title: "Linux & shell mastery", done: false, eta: "wk 1" },
      { title: "Networking + DNS basics", done: false, eta: "wk 2" },
      { title: "Git at scale", done: false, eta: "wk 2" },
      { title: "Docker + compose", done: false, eta: "wk 3" },
      { title: "CI/CD (GitHub Actions)", done: false, eta: "wk 4" },
      { title: "Cloud essentials (AWS)", done: false, eta: "wk 5–6" },
      { title: "Infra as code (Terraform)", done: false, eta: "wk 7" },
      { title: "Kubernetes core", done: false, eta: "wk 8–9" },
      { title: "Monitoring & observability", done: false, eta: "wk 10" },
      { title: "Security & hardening", done: false, eta: "wk 11–16" },
    ],
    resources: ["DevOps Roadmap", "KodeKloud", "Kubernetes docs", "Terraform up & running"],
  },
  {
    id: "competitive",
    title: "Competitive Programming",
    tagline: "Codeforces · AtCoder · contests",
    emoji: "⚡",
    gradient: "from-amber-500 to-orange-600",
    estWeeks: "12+ wks",
    totalStages: 10,
    doneStages: 5,
    stages: [
      { title: "Language + I/O speed", done: true, eta: "wk 1" },
      { title: "Complexity analysis", done: true, eta: "wk 1" },
      { title: "Arrays, two pointers, sliding window", done: true, eta: "wk 2" },
      { title: "Binary search mastery", done: true, eta: "wk 3" },
      { title: "Number theory basics", done: true, eta: "wk 4" },
      { title: "Graphs: BFS/DFS/Dijkstra", done: false, eta: "wk 5" },
      { title: "DP patterns", done: false, eta: "wk 6–8" },
      { title: "Segment trees & fenwick", done: false, eta: "wk 9" },
      { title: "String algorithms", done: false, eta: "wk 10" },
      { title: "Weekly virtual contests", done: false, eta: "ongoing" },
    ],
    resources: ["CP-Algorithms", "Codeforces EDU", "AtCoder Library", "Errichto streams"],
  },
];

// --------------------------- interview hub ---------------------------

export interface InterviewTopic {
  title: string;
  summary: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  minutes: number;
}

export interface InterviewCategory {
  id: string;
  name: string;
  blurb: string;
  items: InterviewTopic[];
}

export const interviewCategories: InterviewCategory[] = [
  {
    id: "java",
    name: "Java",
    blurb: "Core language, JVM, collections & concurrency — the highest-ROI interview topics.",
    items: [
      { title: "Java memory model & GC", summary: "Stack vs heap, reachability, G1/ZGC trade-offs.", difficulty: "Intermediate", minutes: 25 },
      { title: "HashMap internals", summary: "Hashing, buckets, treeify threshold, fail-fast iterators.", difficulty: "Intermediate", minutes: 15 },
      { title: "Concurrency toolkit", summary: "synchronized vs locks, volatile, ExecutorService, CompletableFuture.", difficulty: "Advanced", minutes: 30 },
      { title: "Streams & functional APIs", summary: "Lazy evaluation, intermediate vs terminal ops, collectors.", difficulty: "Intermediate", minutes: 15 },
      { title: "Spring Boot lifecycle", summary: "Beans, autoconfiguration, starter anatomy, profiles.", difficulty: "Advanced", minutes: 25 },
    ],
  },
  {
    id: "oop",
    name: "OOP",
    blurb: "Design principles, SOLID and modelling problems that interviewers love.",
    items: [
      { title: "SOLID principles with examples", summary: "Recognize violations and refactor to clean design.", difficulty: "Intermediate", minutes: 20 },
      { title: "Design a parking lot", summary: "Class modelling, extensibility, edge cases.", difficulty: "Advanced", minutes: 40 },
      { title: "Inheritance vs composition", summary: "Favor composition: decorator, strategy in practice.", difficulty: "Intermediate", minutes: 15 },
      { title: "Design patterns cheat-sheet", summary: "Singleton, Factory, Builder, Observer — when and why.", difficulty: "Intermediate", minutes: 20 },
    ],
  },
  {
    id: "dbms",
    name: "DBMS",
    blurb: "Indexes, transactions and SQL — every backend interview starts here.",
    items: [
      { title: "B+ tree & indexing", summary: "Clustered vs secondary, covering index, why not all columns.", difficulty: "Intermediate", minutes: 20 },
      { title: "ACID & isolation levels", summary: "Dirty reads, MVCC, phantom vs non-repeatable reads.", difficulty: "Advanced", minutes: 25 },
      { title: "Normalization deep dive", summary: "1NF → BCNF with worked examples.", difficulty: "Intermediate", minutes: 20 },
      { title: "SQL window functions", summary: "ROW_NUMBER, RANK, LAG — classic interview queries.", difficulty: "Intermediate", minutes: 25 },
      { title: "N+1 problem in JPA", summary: "Lazy loading, fetch joins, batch sizing.", difficulty: "Advanced", minutes: 15 },
    ],
  },
  {
    id: "os",
    name: "Operating System",
    blurb: "Processes, memory and scheduling — core CS that always resurfaces.",
    items: [
      { title: "Process vs thread vs coroutine", summary: "Context switch cost, shared memory, green threads.", difficulty: "Intermediate", minutes: 15 },
      { title: "Deadlock conditions & prevention", summary: "The 4 conditions + banker's algorithm intuition.", difficulty: "Intermediate", minutes: 15 },
      { title: "Virtual memory & paging", summary: "Page tables, TLB, thrashing, page replacement.", difficulty: "Advanced", minutes: 25 },
      { title: "Scheduling algorithms", summary: "FCFS, SJF, RR, MLFQ with examples.", difficulty: "Beginner", minutes: 15 },
      { title: "Race conditions in practice", summary: "Critical sections, mutex vs semaphore, spinlocks.", difficulty: "Intermediate", minutes: 15 },
    ],
  },
  {
    id: "cn",
    name: "Computer Networks",
    blurb: "From TCP handshakes to HTTPS — networking for the modern stack.",
    items: [
      { title: "TCP vs UDP in depth", summary: "Handshake, congestion control, when UDP wins.", difficulty: "Intermediate", minutes: 20 },
      { title: "HTTP/1.1 → HTTP/2 → HTTP/3", summary: "Multiplexing, HOL blocking, QUIC.", difficulty: "Intermediate", minutes: 20 },
      { title: "TLS handshake", summary: "Certificates, key exchange, why HTTPS matters.", difficulty: "Advanced", minutes: 25 },
      { title: "DNS resolution journey", summary: "Recursive vs iterative, caching, DNSSEC.", difficulty: "Beginner", minutes: 15 },
      { title: "Load balancers & proxies", summary: "L4 vs L7, sticky sessions, reverse proxies.", difficulty: "Advanced", minutes: 20 },
    ],
  },
  {
    id: "hr",
    name: "HR Questions",
    blurb: "Tell me about yourself, projects and the classics — scripted and rehearsed.",
    items: [
      { title: "Tell me about yourself", summary: "The 60-second arc: past → present → why this role.", difficulty: "Beginner", minutes: 10 },
      { title: "Why this company?", summary: "Research-led answer structure that sounds sincere.", difficulty: "Beginner", minutes: 10 },
      { title: "Strengths & weaknesses", summary: "Pick a real weakness + the fix you applied.", difficulty: "Beginner", minutes: 10 },
      { title: "Where do you see yourself in 5 years?", summary: "Ambition without sounding naive.", difficulty: "Beginner", minutes: 10 },
    ],
  },
  {
    id: "behavioral",
    name: "Behavioral",
    blurb: "STAR-framed stories from projects, teams and conflicts.",
    items: [
      { title: "A project you're proud of", summary: "Build the STAR story with metrics and trade-offs.", difficulty: "Intermediate", minutes: 15 },
      { title: "Handling disagreement", summary: "Show technical maturity, not just people-pleasing.", difficulty: "Intermediate", minutes: 15 },
      { title: "Failure & learning", summary: "Own it, dissect it, show the system you built after.", difficulty: "Intermediate", minutes: 15 },
      { title: "Fastest learner story", summary: "Time-boxed example of picking up a new stack.", difficulty: "Intermediate", minutes: 15 },
    ],
  },
];

// --------------------------- notes ---------------------------

export type NoteCategory = "DSA" | "Java" | "Interview" | "Revision" | "General";

export interface Note {
  id: string;
  title: string;
  category: NoteCategory;
  content: string;
  pinned: boolean;
  updatedAt: string;
}

export const initialNotes: Note[] = [
  {
    id: "n1",
    title: "Sliding Window — template",
    category: "DSA",
    content: "## When to use\nContiguous subarray / substring with a constraint.\n\n## Template\n\nextend right, shrink while invalid, record best window.\n\n## Classic problems\n- Longest substring without repeating chars\n- Min window substring (hard)\n- Max consecutive ones III",
    pinned: true,
    updatedAt: "2h ago",
  },
  {
    id: "n2",
    title: "Spring Security + JWT flow",
    category: "Java",
    content: "## Filter chain order\n1. SecurityContextHolder\n2. JwtAuthFilter (OncePerRequest)\n3. AuthorizationFilter\n\n## Gotchas\n- Stateless session → don't use httpBasic + csrf defaults\n- Remember to whitelist /auth/**\n- Refresh token: store httpOnly cookie, rotate on use",
    pinned: true,
    updatedAt: "Yesterday",
  },
  {
    id: "n3",
    title: "Indexing cheat sheet",
    category: "Revision",
    content: "- WHERE + low selectivity → skip index\n- Composite: leftmost prefix rule\n- Avoid functions on indexed column\n- Covering index beats everything\n- NULLs usually not indexed in MySQL",
    pinned: false,
    updatedAt: "2d ago",
  },
  {
    id: "n4",
    title: "HashMap vs ConcurrentHashMap",
    category: "Java",
    content: "- HashMap: O(1) avg, resizes at 0.75, never in prod for shared state\n- CHM: lock striping → segmented buckets (Java 7), CAS + synchronized on bin head (Java 8+)\n- size() is approximate — use when consistency matters",
    pinned: false,
    updatedAt: "3d ago",
  },
  {
    id: "n5",
    title: "My STAR story — CF rating jump",
    category: "Interview",
    content: "S — stalled at 1200 rating for 3 months\nT — reach Specialist (1400+) in 6 weeks\nA — built spaced-repetition review of failed problems, 2 virtual contests/wk\nR — 1523 rating, Top ~4%, cracked pattern recall",
    pinned: false,
    updatedAt: "4d ago",
  },
  {
    id: "n6",
    title: "Questions to ask interviewers",
    category: "Interview",
    content: "- What does a typical week look like here?\n- What was the last technical bet the team made?\n- How is feedback given?\n- What's the hardest problem the team solved recently?",
    pinned: false,
    updatedAt: "1w ago",
  },
];

// --------------------------- misc ---------------------------

export interface ActivityItem {
  icon: "leetcode" | "codeforces" | "github" | "goal" | "star";
  text: string;
  meta: string;
  time: string;
}

export const recentActivity: ActivityItem[] = [
  { icon: "leetcode", text: "Solved 3 medium problems", meta: "LeetCode · Two Pointers", time: "35m ago" },
  { icon: "github", text: "Pushed 14 commits to careerpilot", meta: "auth module → v0.2", time: "2h ago" },
  { icon: "goal", text: 'Goal "Grind SQL" reached 62%', meta: "31 of 50 problems", time: "5h ago" },
  { icon: "codeforces", text: "Rating 1523 — new Specialist", meta: "Codeforces Round #2016", time: "1d ago" },
  { icon: "github", text: "Starred microsoft/TypeScript", meta: "1.2k stars this week", time: "1d ago" },
  { icon: "goal", text: 'Roadmap "Java Backend" stage 8/14 done', meta: "Spring Data JPA ✓", time: "2d ago" },
  { icon: "leetcode", text: "Streak extended to 23 days", meta: "Daily challenge", time: "2d ago" },
];

export const quotes = [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Fall seven times, stand up eight.", author: "Japanese proverb" },
  { text: "Consistency beats intensity. Show up daily.", author: "CareerPilot" },
];

export const quickActions = [
  { label: "Add a goal", sub: "Keep the streak of ships going", to: "/app/goals" },
  { label: "Write a note", sub: "Capture an interview insight", to: "/app/notes" },
  { label: "Join a contest", sub: "Next one starts in 1 day", to: "/app/contests" },
  { label: "Resume roadmap", sub: "Java Backend · stage 9", to: "/app/roadmaps" },
];

// deterministic heatmap for GitHub contribution graph
export function makeHeatmap(weeks = 26): number[][] {
  let seed = 1337;
  const rnd = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: weeks }, () =>
    Array.from({ length: 7 }, () => {
      const r = rnd();
      if (r > 0.72) return 0;
      if (r > 0.55) return 1;
      if (r > 0.32) return 2;
      if (r > 0.12) return 3;
      return 4;
    })
  );
}

export const currentDateLabel = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});
