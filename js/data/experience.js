
const EXPERIENCE = [
  {
    featured: true,
    roleFirst: true,
    role: { en: "Cloud Engineering Program, Infrastructure Track", ko: "KT Cloud 클라우드 엔지니어링(인프라) 전문가과정" },
    org: { en: "KT Cloud TECH UP", ko: "KT Cloud TECH UP 부트캠프" },
    period: { en: "2026.08 – Present", ko: "2026.08 – 진행 중" },
    desc: {
      en: "A program on designing, building, and operating cloud infrastructure. Team projects run in stages, covering high availability, hybrid cloud, security, monitoring, and automation with Terraform.",
      ko: "클라우드 인프라의 설계, 구축, 운영을 다루는 과정입니다. 고가용성, 하이브리드 클라우드, 보안, 모니터링, Terraform 기반 자동화를 주제로 단계별 팀 프로젝트를 진행합니다.",
    },
  },
  {
    featured: true,
    roleFirst: true,
    role: { en: "EFUB Team Lead", ko: "EFUB 팀 리드" },
    org: { en: "Ewha Womans University Web Development Club", ko: "이화여자대학교 웹 개발 동아리" },
    period: "2024.03 – 2025.12",
    desc: {
      en: "Acted as the link between designers and developers across three concurrent projects of 8 to 9 members each, and wrote the shared handoff guide for terms and specifications. Reviewed designs for feasibility before development so issues were caught early.",
      ko: "팀별 8~9명 규모로 동시에 진행된 프로젝트 3개에서 디자이너와 개발자 사이의 소통을 맡아, 용어와 명세를 통일한 공용 핸드오프 가이드를 작성했습니다. 개발 전에 디자인의 구현 가능성을 검토해 문제를 초기에 바로잡았습니다.",
    },
  },
  {
    featured: false,
    roleFirst: true,
    role: { en: "Undergraduate Research Assistant", ko: "학부연구생" },
    org: "UX Design & Research Lab",
    period: "2024.07",
    desc: {
      en: "Worked on a government-funded healthcare data platform project. Narrowed more than 50 proposed features down to 6 core user scenarios that wearable data could support.",
      ko: "정부 지원 헬스케어 데이터 플랫폼 과제에 참여했습니다. 제안된 기능 50여 개를 웨어러블 데이터로 구현 가능한 핵심 사용자 시나리오 6개로 정리했습니다.",
    },
  },
];

const EDUCATION = [
  {
    org: { en: "Ewha Womans University", ko: "이화여자대학교" },
    role: {
      en: "B.S. in Content Convergence, B.E. in Software (Double Major)",
      ko: "융합콘텐츠학사, 소프트웨어공학사 (복수전공)",
    },
    desc: { en: "GPA 4.15 / 4.5", ko: "학점 4.15 / 4.5" },
    period: "2022.03 – 2026.02",
  },
];

const SKILLS = [
  { label: { en: "Cloud", ko: "클라우드" }, items: ["AWS", "EC2", "S3", "VPC", "IAM", "RDS", "EKS", "Lambda", "CloudWatch"] },
  { label: { en: "IaC & CI/CD", ko: "IaC & CI/CD" }, items: ["Terraform", "GitHub Actions", "ArgoCD"] },
  { label: { en: "Container", ko: "컨테이너" }, items: ["Docker", "Kubernetes"] },
  { label: { en: "Language", ko: "언어" }, items: ["Python", "Bash", "SQL"] },
];

const CERTS = [
  {
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services (AWS)",
    date: "2026.10",
    icon: "assets/icons/stack/aws.svg",
  },
  {
    name: { en: "Engineer Information Processing", ko: "정보처리기사" },
    issuer: { en: "HRD Korea", ko: "한국산업인력공단" },
    date: "2026.06",
    icon: "assets/icons/certs/hrdk.svg",
  },
];
