-- =============================================================================
-- CareerPilot — V2 seed data (global, shared by every user; read-only in the app).
-- Roadmaps, interview hub content, contests and hackathons. User-owned rows are
-- never seeded here. Contest/hackathon times are relative so the demo never goes stale.
-- =============================================================================

-- ----------------------------------------------------------------- roadmaps
INSERT INTO roadmaps (slug, title, tagline, emoji, gradient, est_weeks, sort_order) VALUES
  ('java-backend',  'Java Backend',              'Spring Boot · REST · Microservices', '☕',   'from-orange-500 to-amber-600',   '12–16 wks', 1),
  ('fullstack',     'Full Stack',                'React · Node · PostgreSQL · AWS',    '🧩',  'from-sky-500 to-cyan-500',       '14–18 wks', 2),
  ('ai-engineer',   'AI Software Engineer',      'LLMs · RAG · Agents · MLOps',        '🤖',  'from-fuchsia-500 to-purple-600', '16–20 wks', 3),
  ('devops',        'DevOps',                    'Linux · Docker · K8s · IaC',         '🛠️', 'from-emerald-500 to-teal-600',   '12–16 wks', 4),
  ('competitive',   'Competitive Programming',   'Codeforces · AtCoder · contests',    '⚡',   'from-amber-500 to-orange-600',   '12+ wks',   5);

INSERT INTO roadmap_resources (roadmap_id, sort_order, resource)
SELECT r.id, v.sort_order, v.resource
FROM roadmaps r
JOIN (VALUES
  ('java-backend', 1, 'Spring Boot docs'), ('java-backend', 2, 'Baeldung'),
  ('java-backend', 3, 'Amigoscode'),       ('java-backend', 4, 'InterviewBit'),
  ('fullstack', 1, 'The Odin Project'),    ('fullstack', 2, 'Epic React'),
  ('fullstack', 3, 'Fullstackopen'),       ('fullstack', 4, 'AWS free tier'),
  ('ai-engineer', 1, 'DeepLearning.AI'),   ('ai-engineer', 2, 'LangChain docs'),
  ('ai-engineer', 3, 'Karpathy lectures'), ('ai-engineer', 4, 'LLM Course'),
  ('devops', 1, 'DevOps Roadmap'),         ('devops', 2, 'KodeKloud'),
  ('devops', 3, 'Kubernetes docs'),        ('devops', 4, 'Terraform up & running'),
  ('competitive', 1, 'CP-Algorithms'),     ('competitive', 2, 'Codeforces EDU'),
  ('competitive', 3, 'AtCoder Library'),   ('competitive', 4, 'Errichto streams')
) AS v(slug, sort_order, resource) ON v.slug = r.slug;

-- ------------------------------------------------------------ roadmap stages
INSERT INTO roadmap_stages (roadmap_id, stage_index, title, eta)
SELECT r.id, v.stage_index, v.title, v.eta
FROM roadmaps r
JOIN (VALUES
  -- Java Backend (14)
  ('java-backend', 0,  'Java core + OOP mastery',              'wk 1'),
  ('java-backend', 1,  'Collections & streams',                'wk 1–2'),
  ('java-backend', 2,  'JVM, GC & memory model',               'wk 2'),
  ('java-backend', 3,  'SQL & JDBC',                           'wk 3'),
  ('java-backend', 4,  'HTTP, REST & JSON',                    'wk 4'),
  ('java-backend', 5,  'Spring Core & DI',                     'wk 5'),
  ('java-backend', 6,  'Spring Boot + MVC',                    'wk 6'),
  ('java-backend', 7,  'Spring Data JPA',                      'wk 7'),
  ('java-backend', 8,  'Spring Security + JWT',                'wk 8'),
  ('java-backend', 9,  'Caching & Redis',                      'wk 9'),
  ('java-backend', 10, 'Messaging + Kafka basics',             'wk 10'),
  ('java-backend', 11, 'Microservices & discovery',            'wk 11'),
  ('java-backend', 12, 'Docker + CI/CD',                       'wk 12'),
  ('java-backend', 13, 'Cloud deploy & interview drill',       'wk 13–16'),
  -- Full Stack (12)
  ('fullstack', 0,  'HTML/CSS/JS foundations',                 'wk 1'),
  ('fullstack', 1,  'TypeScript deeply',                       'wk 2'),
  ('fullstack', 2,  'React + hooks + state',                   'wk 3–4'),
  ('fullstack', 3,  'REST + Node/Express',                     'wk 5'),
  ('fullstack', 4,  'PostgreSQL + Prisma',                     'wk 6'),
  ('fullstack', 5,  'Auth, sessions & cookies',                'wk 7'),
  ('fullstack', 6,  'Testing (unit + e2e)',                    'wk 8'),
  ('fullstack', 7,  'Next.js SSR',                             'wk 9'),
  ('fullstack', 8,  'Docker + deploy',                         'wk 10'),
  ('fullstack', 9,  'CI/CD pipelines',                         'wk 11'),
  ('fullstack', 10, 'System design basics',                    'wk 12'),
  ('fullstack', 11, 'Capstone build sprint',                   'wk 13–18'),
  -- AI Software Engineer (11)
  ('ai-engineer', 0,  'Python + data tools',                   'wk 1'),
  ('ai-engineer', 1,  'Math refresher for ML',                 'wk 2'),
  ('ai-engineer', 2,  'Prompt engineering',                    'wk 3'),
  ('ai-engineer', 3,  'LangChain & vector DBs',                'wk 4–5'),
  ('ai-engineer', 4,  'RAG deep-dive',                         'wk 6'),
  ('ai-engineer', 5,  'Fine-tuning foundations',               'wk 7–8'),
  ('ai-engineer', 6,  'Agent frameworks',                      'wk 9'),
  ('ai-engineer', 7,  'Evaluation & guardrails',               'wk 10'),
  ('ai-engineer', 8,  'MLOps + deployment',                    'wk 11–12'),
  ('ai-engineer', 9,  'Building AI products',                  'wk 13'),
  ('ai-engineer', 10, 'Portfolio + interview prep',            'wk 14–20'),
  -- DevOps (10)
  ('devops', 0,  'Linux & shell mastery',                      'wk 1'),
  ('devops', 1,  'Networking + DNS basics',                    'wk 2'),
  ('devops', 2,  'Git at scale',                               'wk 2'),
  ('devops', 3,  'Docker + compose',                           'wk 3'),
  ('devops', 4,  'CI/CD (GitHub Actions)',                     'wk 4'),
  ('devops', 5,  'Cloud essentials (AWS)',                     'wk 5–6'),
  ('devops', 6,  'Infra as code (Terraform)',                  'wk 7'),
  ('devops', 7,  'Kubernetes core',                            'wk 8–9'),
  ('devops', 8,  'Monitoring & observability',                 'wk 10'),
  ('devops', 9,  'Security & hardening',                       'wk 11–16'),
  -- Competitive Programming (10)
  ('competitive', 0,  'Language + I/O speed',                  'wk 1'),
  ('competitive', 1,  'Complexity analysis',                   'wk 1'),
  ('competitive', 2,  'Arrays, two pointers, sliding window',  'wk 2'),
  ('competitive', 3,  'Binary search mastery',                 'wk 3'),
  ('competitive', 4,  'Number theory basics',                  'wk 4'),
  ('competitive', 5,  'Graphs: BFS/DFS/Dijkstra',              'wk 5'),
  ('competitive', 6,  'DP patterns',                           'wk 6–8'),
  ('competitive', 7,  'Segment trees & fenwick',               'wk 9'),
  ('competitive', 8,  'String algorithms',                     'wk 10'),
  ('competitive', 9,  'Weekly virtual contests',               'ongoing')
) AS v(slug, stage_index, title, eta) ON v.slug = r.slug;

-- ------------------------------------------------------- interview hub
INSERT INTO interview_categories (slug, name, blurb, sort_order) VALUES
  ('java','Java','Core language, JVM, collections & concurrency — the highest-ROI interview topics.',1),
  ('oop','OOP','Design principles, SOLID and modelling problems that interviewers love.',2),
  ('dbms','DBMS','Indexes, transactions and SQL — every backend interview starts here.',3),
  ('os','Operating System','Processes, memory and scheduling — core CS that always resurfaces.',4),
  ('cn','Computer Networks','From TCP handshakes to HTTPS — networking for the modern stack.',5),
  ('hr','HR Questions','Tell me about yourself, projects and the classics — scripted and rehearsed.',6),
  ('behavioral','Behavioral','STAR-framed stories from projects, teams and conflicts.',7);

INSERT INTO interview_topics (category_id, title, summary, difficulty, minutes, sort_order)
SELECT c.id, v.title, v.summary, v.difficulty, v.minutes, v.sort_order
FROM interview_categories c
JOIN (VALUES
  ('java','Java memory model & GC','Stack vs heap, reachability, G1/ZGC trade-offs.','INTERMEDIATE',25,1),
  ('java','HashMap internals','Hashing, buckets, treeify threshold, fail-fast iterators.','INTERMEDIATE',15,2),
  ('java','Concurrency toolkit','synchronized vs locks, volatile, ExecutorService, CompletableFuture.','ADVANCED',30,3),
  ('java','Streams & functional APIs','Lazy evaluation, intermediate vs terminal ops, collectors.','INTERMEDIATE',15,4),
  ('java','Spring Boot lifecycle','Beans, autoconfiguration, starter anatomy, profiles.','ADVANCED',25,5),
  ('oop','SOLID principles with examples','Recognize violations and refactor to clean design.','INTERMEDIATE',20,1),
  ('oop','Design a parking lot','Class modelling, extensibility, edge cases.','ADVANCED',40,2),
  ('oop','Inheritance vs composition','Favor composition: decorator, strategy in practice.','INTERMEDIATE',15,3),
  ('oop','Design patterns cheat-sheet','Singleton, Factory, Builder, Observer — when and why.','INTERMEDIATE',20,4),
  ('dbms','B+ tree & indexing','Clustered vs secondary, covering index, why not all columns.','INTERMEDIATE',20,1),
  ('dbms','ACID & isolation levels','Dirty reads, MVCC, phantom vs non-repeatable reads.','ADVANCED',25,2),
  ('dbms','Normalization deep dive','1NF to BCNF with worked examples.','INTERMEDIATE',20,3),
  ('dbms','SQL window functions','ROW_NUMBER, RANK, LAG — classic interview queries.','INTERMEDIATE',25,4),
  ('dbms','N+1 problem in JPA','Lazy loading, fetch joins, batch sizing.','ADVANCED',15,5),
  ('os','Process vs thread vs coroutine','Context switch cost, shared memory, green threads.','INTERMEDIATE',15,1),
  ('os','Deadlock conditions & prevention','The four conditions plus banker''s algorithm intuition.','INTERMEDIATE',15,2),
  ('os','Virtual memory & paging','Page tables, TLB, thrashing, page replacement.','ADVANCED',25,3),
  ('os','Scheduling algorithms','FCFS, SJF, RR, MLFQ with examples.','BEGINNER',15,4),
  ('os','Race conditions in practice','Critical sections, mutex vs semaphore, spinlocks.','INTERMEDIATE',15,5),
  ('cn','TCP vs UDP in depth','Handshake, congestion control, when UDP wins.','INTERMEDIATE',20,1),
  ('cn','HTTP/1.1 to HTTP/3','Multiplexing, HOL blocking, QUIC.','INTERMEDIATE',20,2),
  ('cn','TLS handshake','Certificates, key exchange, why HTTPS matters.','ADVANCED',25,3),
  ('cn','DNS resolution journey','Recursive vs iterative, caching, DNSSEC.','BEGINNER',15,4),
  ('cn','Load balancers & proxies','L4 vs L7, sticky sessions, reverse proxies.','ADVANCED',20,5),
  ('hr','Tell me about yourself','The 60-second arc: past, present, why this role.','BEGINNER',10,1),
  ('hr','Why this company?','Research-led answer structure that sounds sincere.','BEGINNER',10,2),
  ('hr','Strengths & weaknesses','Pick a real weakness and the fix you applied.','BEGINNER',10,3),
  ('hr','Where do you see yourself in 5 years?','Ambition without sounding naive.','BEGINNER',10,4),
  ('behavioral','A project you are proud of','Build the STAR story with metrics and trade-offs.','INTERMEDIATE',15,1),
  ('behavioral','Handling disagreement','Show technical maturity, not just people-pleasing.','INTERMEDIATE',15,2),
  ('behavioral','Failure & learning','Own it, dissect it, show the system you built after.','INTERMEDIATE',15,3),
  ('behavioral','Fastest learner story','Time-boxed example of picking up a new stack.','INTERMEDIATE',15,4)
) AS v(slug, title, summary, difficulty, minutes, sort_order) ON v.slug = c.slug;

-- --------------------------------------------------- contests & hackathons
-- relative timestamps so the demo data never goes stale
INSERT INTO contests (external_id, name, platform, start_time, duration, difficulty, rated, url) VALUES
  ('cc-starter-220','CodeChef Starters 220','CODECHEF',        now() + interval '1 day',          '2h',    'EASY',  true,'https://www.codechef.com/contests'),
  ('lc-bw-467',     'LeetCode Weekly Contest 467','LEETCODE',  now() + interval '2 days',         '1h 30m','MEDIUM',true,'https://leetcode.com/contest/'),
  ('atc-abc-410',   'AtCoder Beginner Contest 410','ATCODER',  now() + interval '3 days 5 hours', '1h 40m','EASY',  true,'https://atcoder.jp/contests/'),
  ('cf-rd-2019',    'Codeforces Round 2019 (Div. 2)','CODEFORCES', now() + interval '4 days',      '2h',    'MEDIUM',true,'https://codeforces.com/contests'),
  ('lc-bw-468',     'LeetCode Biweekly Contest 162','LEETCODE', now() + interval '5 days',         '1h 30m','HARD',  true,'https://leetcode.com/contest/'),
  ('cf-global-29',  'Codeforces Global Round 29','CODEFORCES', now() + interval '7 days 4 hours', '3h',    'HARD',  true,'https://codeforces.com/contests'),
  ('cc-lunch-143',  'CodeChef Lunchtime 143','CODECHEF',       now() + interval '8 days',         '2h',    'MEDIUM',true,'https://www.codechef.com/contests'),
  ('atc-agc-075',   'AtCoder Grand Contest 075','ATCODER',     now() + interval '11 days 3 hours','2h 30m','HARD',  true,'https://atcoder.jp/contests/');

INSERT INTO hackathons (name, organizer, mode, deadline, theme, team_size, prize, difficulty, city, registration_url) VALUES
  ('Hack the Change 2026','UN SDG + CodeDay','ONLINE', now() + interval '4 days','Climate & sustainability','2–5','$8,000 pool','BEGINNER_FRIENDLY',NULL,'https://hackthechange.dev'),
  ('Devfolio Season of Code','Devfolio','ONLINE', now() + interval '6 days','Open ended — web3, AI, devtools','1–4','$10,000 pool','BEGINNER_FRIENDLY',NULL,'https://devfolio.co'),
  ('Toyota Hackathon 2026','Toyota Connected','ONLINE', now() + interval '9 days','Smart mobility & connected cars','2–5','$30,000 + job offers','INTERMEDIATE',NULL,'https://toyota-hackathon.dev'),
  ('Smart India Hackathon 2026','MoE · Govt. of India','OFFLINE', now() + interval '12 days','EdTech & Accessibility','6','₹1,00,000 + incubation','INTERMEDIATE','Pan-India','https://sih.gov.in'),
  ('Flipkart GRiD 7.0','Flipkart','ONLINE', now() + interval '15 days','E-commerce & ML systems','3','₹10L + PPI offers','INTERMEDIATE',NULL,'https://flipkart.grid'),
  ('HackMIT 2026','MIT','HYBRID', now() + interval '18 days','Open innovation','1–4','$15,000 pool','ADVANCED','Boston / Remote','https://hackmit.org'),
  ('ETHIndia 2026','ETHGlobal','OFFLINE', now() + interval '21 days','Ethereum & Web3','1–4','$100,000 pool','ADVANCED','Bengaluru','https://ethindia.co'),
  ('JP Morgan Code for Good','JPMorgan Chase','OFFLINE', now() + interval '25 days','FinTech for nonprofits','4–5','Interview fast-track','ADVANCED','Bengaluru / Mumbai','https://careers.jpmorgan.com');
