// 프로젝트 데이터
// 새 프로젝트는 배열에 객체 하나 추가하면 메인/Projects 페이지 둘 다 반영됨
//
// type:     "main" | "side"
// category: 필터용 (6개 이상일 때만 필터 노출)
// diagram:  assets/diagrams/ 안의 구조도 경로. 없으면 null → 스택 이름으로 대체 표시
// thumb:    사이드 리스트용 작은 아이콘 (없으면 monogram 글자)
// modal:    true면 클릭 시 상세 페이지 대신 How I built 모달을 엶

const PROJECTS = [
  {
    id: "ha-failover",
    type: "main",
    category: "kubernetes",
    year: "2026",
    title: {
      en: "Multi-AZ Failover Validation on EKS",
      ko: "EKS Multi-AZ 장애 대응 검증",
    },
    summary: {
      en: "Injected pod, node, AZ, and DB primary failures into a shopping service and verified zero order loss and zero duplicates.",
      ko: "쇼핑몰 서비스에 파드, 노드, AZ, DB Primary 장애를 주입하고 주문 유실 0건, 중복 0건을 검증했습니다.",
    },
    meta: {
      period: "2026.09 – 2026.10",
      team: { en: "Team of 6", ko: "6인 팀" },
      role: { en: "Monitoring (CloudWatch)", ko: "모니터링 (CloudWatch)" },
    },
    // TODO: 세 번째 항목은 실제로 한 작업 기준으로 고치기
    points: {
      en: [
        "Four failure scenarios: traffic spike (HPA), pod/node failure, AZ outage, DB primary failure",
        "Pass criteria: no lost orders and no duplicate orders during each failure",
        "Built CloudWatch dashboards and alarms used to judge each scenario",
      ],
      ko: [
        "장애 시나리오 4종: 트래픽 급증(HPA), 파드/노드 장애, AZ 장애, DB Primary 장애",
        "통과 기준: 장애 중 주문 유실 0건, 중복 0건",
        "시나리오별 판정에 쓰인 CloudWatch 대시보드와 알람 구성",
      ],
    },
    tags: ["EKS", "RDS Multi-AZ", "CloudFormation", "ALB", "CloudWatch"],
    stack: ["EKS", "RDS", "ALB", "Route 53", "CloudWatch"],
    diagram: null, // TODO: Figma 구조도 export 후 경로 넣기
    links: { github: "https://github.com/ktcloud-basic-team02" },
  },
  {
    id: "iot-streaming",
    type: "main",
    category: "data",
    year: "2026",
    title: {
      en: "IoT Sensor Streaming Platform",
      ko: "IoT 센서 스트리밍 플랫폼",
    },
    summary: {
      en: "Data pipeline for IoT sensor events on EKS, Kinesis, and DynamoDB, provisioned with Terraform.",
      ko: "EKS, Kinesis, DynamoDB 기반 IoT 센서 데이터 파이프라인을 Terraform으로 구축했습니다.",
    },
    meta: {
      period: "2026", // TODO: 기간 확인
      team: { en: "Personal", ko: "개인" },
      role: { en: "Design & build", ko: "설계 및 구축" },
    },
    points: {
      en: [
        "Ingest sensor events through Kinesis Data Streams and store them in DynamoDB",
        "All infrastructure defined in Terraform (ap-northeast-2)",
      ],
      ko: [
        "Kinesis Data Streams로 센서 이벤트 수집 후 DynamoDB에 저장",
        "전체 인프라를 Terraform으로 정의 (서울 리전)",
      ],
    },
    tags: ["EKS", "Kinesis", "DynamoDB", "Terraform"],
    stack: ["EKS", "Kinesis", "DynamoDB", "Terraform"],
    diagram: null,
    links: { github: "https://github.com/heeyeon-yang/iot-streaming-platform" },
  },
  {
    id: "quizlab",
    type: "side",
    category: "serverless",
    year: "2026",
    monogram: "λ",
    title: { en: "QuizLab", ko: "QuizLab" },
    summary: {
      en: "Serverless quiz service on Lambda, RDS, and ElastiCache.",
      ko: "Lambda, RDS, ElastiCache 기반 서버리스 퀴즈 서비스",
    },
    meta: {
      period: "2026",
      team: { en: "Personal", ko: "개인" },
      role: { en: "Design & build", ko: "설계 및 구축" },
    },
    points: { en: [], ko: [] },
    tags: ["Lambda", "RDS", "ElastiCache"],
    stack: ["Lambda", "RDS", "ElastiCache"],
    diagram: null,
    links: {},
  },
  {
    id: "this-site",
    type: "side",
    category: "web",
    year: "2026",
    monogram: "CF",
    modal: true,
    title: { en: "This website", ko: "이 웹사이트" },
    summary: {
      en: "Static portfolio on S3 and CloudFront.",
      ko: "S3와 CloudFront로 배포한 정적 포트폴리오",
    },
    meta: {
      period: "2026",
      team: { en: "Personal", ko: "개인" },
      role: { en: "Design & build", ko: "설계 및 구축" },
    },
    points: { en: [], ko: [] },
    tags: ["S3", "CloudFront", "HTML/CSS/JS"],
    stack: ["S3", "CloudFront", "Route 53"],
    diagram: null,
    links: { github: "https://github.com/heeyeon-yang/portfolio" },
  },
];

// How I built 모달 내용 (이 사이트 설명)
const HOW_I_BUILT = {
  title: { en: "How I built this site", ko: "이 사이트를 만든 방법" },
  stack: ["S3", "CloudFront", "Route 53", "ACM"],
  diagram: null, // TODO: assets/diagrams/this-site.svg
  sections: [
    {
      heading: { en: "Hosting", ko: "호스팅" },
      body: {
        en: "HTML, CSS, and JavaScript files are stored in a private S3 bucket and served only through CloudFront.",
        ko: "HTML, CSS, JS 파일을 비공개 S3 버킷에 두고 CloudFront를 통해서만 제공합니다.",
      },
    },
    {
      heading: { en: "Deployment", ko: "배포" },
      body: {
        en: "To be added.",
        ko: "작성 예정",
      },
    },
  ],
};
