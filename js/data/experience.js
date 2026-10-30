// 경험 / 학력 / 기술 / 자격증
// featured: true 인 경험만 메인 페이지에 노출

// TODO: 기간, 설명 전부 실제 내용으로 교체
const EXPERIENCE = [
  {
    featured: true,
    org: "kt cloud TECH UP",
    role: { en: "Cloud Infrastructure Bootcamp", ko: "클라우드 인프라 부트캠프" },
    period: "2026",
    desc: {
      en: "Built and operated AWS infrastructure in team projects, focusing on EKS, RDS, and monitoring.",
      ko: "팀 프로젝트로 AWS 인프라를 구축하고 운영했습니다. EKS, RDS, 모니터링 중심.",
    },
  },
  {
    featured: true,
    org: "Undergraduate Research",
    role: { en: "Research Student", ko: "학부연구생" },
    period: "20XX – 20XX",
    desc: {
      en: "Description goes here.",
      ko: "설명이 들어갈 자리입니다.",
    },
  },
  {
    featured: false,
    org: "EFUB",
    role: { en: "Organizer", ko: "운영진" },
    period: "20XX – 20XX",
    desc: {
      en: "Description goes here.",
      ko: "설명이 들어갈 자리입니다.",
    },
  },
];

const EDUCATION = [
  {
    org: { en: "Ewha Womans University", ko: "이화여자대학교" },
    role: {
      en: "B.S. — Double major in Software Engineering",
      ko: "학사 — 소프트웨어학 복수전공",
    },
    period: "20XX – 20XX",
  },
];

// 메인/Experience 둘 다 이걸 씀
const SKILLS = [
  { label: { en: "Cloud", ko: "클라우드" }, items: ["AWS", "EKS", "RDS", "Lambda", "S3", "CloudFront", "Route 53"] },
  { label: { en: "IaC", ko: "IaC" }, items: ["Terraform", "CloudFormation"] },
  { label: { en: "Container", ko: "컨테이너" }, items: ["Kubernetes", "Nginx Ingress"] },
  { label: { en: "Monitoring", ko: "모니터링" }, items: ["CloudWatch"] },
  { label: { en: "Language / DB", ko: "언어 / DB" }, items: ["Python", "MySQL"] },
];

const CERTS = [
  {
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    date: "2026", // TODO
  },
  {
    name: { en: "Engineer Information Processing", ko: "정보처리기사" },
    issuer: { en: "HRD Korea", ko: "한국산업인력공단" },
    date: "20XX",
  },
];
