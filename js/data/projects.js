const TOPICS = {
  reliability: { en: "High availability", ko: "고가용성" },
  data: { en: "Data pipeline", ko: "데이터 파이프라인" },
  serverless: { en: "Serverless", ko: "서버리스" },
  hosting: { en: "Static hosting", ko: "정적 호스팅" },
};

const PROJECTS = [
  {
    id: "ha-failover",
    type: "main",
    topic: "reliability",
    year: "2026",
    title: {
      en: "Multi-AZ Failover Validation on EKS",
      ko: "EKS Multi-AZ 장애 대응 검증",
    },
    summary: {
      en: "Built a highly available, multi-AZ shopping platform on EKS. Failure tests across pods, nodes, AZs, and the database confirmed no lost or duplicate orders.",
      ko: "EKS 기반 고가용성 쇼핑몰 인프라를 Multi-AZ로 구축했습니다. 파드, 노드, AZ, DB 장애를 주입해 주문 유실과 중복이 없는지 검증했습니다.",
    },
    meta: {
      period: "2026.09 – 2026.10",
      team: { en: "Team of 6", ko: "6인 팀" },
      role: { en: "Application & traffic entry", ko: "애플리케이션, 외부 접속 경로" },
    },
    points: {
      en: [
        "No lost or duplicate orders in any failure scenario",
        "Orders back within 21 seconds of a database failover, with no app restart",
        "I built the order service and the HTTPS entry path",
      ],
      ko: [
        "모든 장애 시나리오에서 주문 유실과 중복 0건",
        "DB 장애 전환 후 앱 재시작 없이 21초 안에 주문 재개",
        "주문 서비스와 HTTPS 접속 경로 담당",
      ],
    },
    sections: [
      {
        heading: { en: "Why", ko: "배경" },
        body: {
          en: "Recent outages we looked at shared a pattern: the service ran in a single zone or relied on manual failover, so recovery took much longer than it should have. We wanted to check, with real order traffic running, whether a multi-AZ setup on AWS actually prevents that during a high-traffic sales event.",
          ko: "참고한 실제 장애 사례들은 서비스가 하나의 영역에서만 돌아가거나 장애 전환을 사람이 직접 해야 해서 복구가 필요 이상으로 길어졌다는 공통점이 있었습니다. 트래픽이 몰리는 판매 이벤트에서 AWS의 Multi-AZ 구성이 실제로 이런 문제를 막는지, 주문이 계속 들어오는 상태에서 확인하고자 했습니다.",
        },
      },
      {
        heading: { en: "How we tested", ko: "검증 방법" },
        body: {
          en: "We injected four kinds of failure while orders kept coming in: a sudden traffic spike, pod and node failures, the loss of an entire Availability Zone, and a database primary failure. A test passed only if no successful order went missing and no order was recorded twice.",
          ko: "주문이 계속 들어오는 상태에서 트래픽 급증, 파드와 노드 장애, 가용영역 전체 장애, DB Primary 장애 네 가지를 주입했습니다. 성공 응답을 받은 주문이 하나도 빠지지 않고, 같은 주문이 두 번 기록되지 않아야 통과로 판정했습니다.",
        },
      },
      {
        heading: { en: "My part", ko: "담당 역할" },
        body: {
          en: "I built the order service and the path users take to reach it. The service records every successful and failed order, which gave the team a clear record to check each test against, and I worked with the database lead to compare order responses with stored orders and stock after each run. On the entry side, I set up the domain, HTTPS certificate, and load balancer, and kept server health and database health as separate checks so a database issue would not take every server out of service.",
          ko: "주문 서비스와 사용자가 서비스에 접속하는 경로를 맡았습니다. 주문 서비스는 성공과 실패 주문을 모두 기록해 팀이 테스트마다 대조할 기준이 되었고, DB 담당자와 함께 테스트가 끝날 때마다 주문 응답을 저장된 주문 및 재고와 비교했습니다. 접속 경로에서는 도메인, HTTPS 인증서, 로드밸런서를 구성하고, 서버 상태와 DB 상태를 따로 확인하도록 나눠 DB 문제가 생겨도 모든 서버가 서비스에서 빠지지 않게 했습니다.",
        },
      },
      {
        heading: { en: "Results", ko: "결과" },
        body: {
          en: "Every scenario passed with zero lost and zero duplicate orders. During a database primary failover, orders started going through again within 21 seconds, and the application never had to be restarted.",
          ko: "모든 시나리오에서 주문 유실 0건, 중복 0건으로 통과했습니다. DB Primary 장애 전환 중에도 21초 안에 주문이 다시 처리되었고, 애플리케이션은 한 번도 재시작하지 않았습니다.",
        },
      },
    ],
    tags: ["EKS", "RDS Multi-AZ", "ALB", "Route 53"],
    stack: ["EKS", "RDS", "ALB", "Route 53", "ACM"],
    tint: "#8c4fff",
    flow: ["route53", "elb", { zones: ["AZ a", "AZ c"], steps: ["eks", "rds"] }],
    diagram: null,
    links: { github: "https://github.com/ktcloud-basic-team02" },
  },
  {
    id: "iot-streaming",
    type: "main",
    topic: "data",
    year: "2026",
    title: {
      en: "Real-Time IoT Pipeline on EKS",
      ko: "EKS 기반 실시간 IoT 파이프라인",
    },
    summary: {
      en: "Built a real-time sensor data pipeline with Terraform. It runs on EKS, with deployments automated through ArgoCD.",
      ko: "실시간 센서 데이터를 수집하는 파이프라인을 Terraform으로 구축했습니다. EKS에서 동작하며, ArgoCD로 배포를 자동화했습니다.",
    },
    meta: {
      period: "2026.08 –",
      team: { en: "Personal", ko: "개인" },
      role: { en: "Design & build", ko: "설계 및 구축" },
    },
    points: {
      en: [
        "Four services streaming sensor events through Kinesis into DynamoDB, with Slack alerts",
        "A separate IAM role for every service",
        "Deployments traced from commit to cluster with GitHub Actions and ArgoCD",
      ],
      ko: [
        "서비스 4개가 Kinesis를 거쳐 DynamoDB로 센서 이벤트를 처리하고 Slack으로 알림",
        "서비스마다 별도 IAM 역할",
        "GitHub Actions와 ArgoCD로 커밋부터 클러스터 반영까지 추적 가능한 배포",
      ],
    },
    sections: [
      {
        heading: { en: "Why", ko: "배경" },
        body: {
          en: "After building QuizLab on managed serverless services, I wanted to run a similar event pipeline on containers I operate myself, including how it is deployed and who can access what.",
          ko: "QuizLab을 관리형 서버리스 서비스로 만든 뒤, 비슷한 이벤트 파이프라인을 직접 운영하는 컨테이너 위에서 돌려보고 싶었습니다. 배포 방식과 권한 관리까지 직접 설계하는 것이 목표였습니다.",
        },
      },
      {
        heading: { en: "Design", ko: "구성" },
        body: {
          en: "Four microservices handle ingestion, stream processing, alerting, and reads. Sensor events flow through Kinesis into DynamoDB, and readings past a threshold send an alert to Slack. Everything from the VPC to the EKS cluster is defined in Terraform, so the whole environment can be recreated from code.",
          ko: "수집, 스트림 처리, 알림, 조회를 맡는 마이크로서비스 4개로 구성했습니다. 센서 이벤트는 Kinesis를 거쳐 DynamoDB에 저장되고, 기준값을 넘는 값이 들어오면 Slack으로 알림을 보냅니다. VPC부터 EKS 클러스터까지 모두 Terraform으로 정의해, 전체 환경을 코드로 다시 만들 수 있습니다.",
        },
      },
      {
        heading: { en: "Access and deployment", ko: "권한과 배포" },
        body: {
          en: "Each service runs under its own IAM role, so if one service were compromised it could not use another service's permissions. GitHub Actions signs in to AWS with short-lived credentials instead of stored keys, builds the images, and updates a separate manifests repository. ArgoCD then applies that change to the cluster, so every release can be traced back to a commit.",
          ko: "서비스마다 별도의 IAM 역할로 실행해, 한 서비스가 침해되더라도 다른 서비스의 권한은 쓸 수 없게 했습니다. GitHub Actions는 저장된 키 대신 짧은 시간만 유효한 자격 증명으로 AWS에 접근해 이미지를 빌드하고, 별도의 매니페스트 저장소를 업데이트합니다. 이후 ArgoCD가 변경 사항을 클러스터에 반영하므로, 모든 배포를 커밋 단위로 추적할 수 있습니다.",
        },
      },
    ],
    tags: ["EKS", "Kinesis", "Terraform", "ArgoCD"],
    stack: ["EKS", "Kinesis", "DynamoDB", "Terraform"],
    tint: "#ed7100",
    flow: ["kinesis", { icon: "eks", label: "EKS, 4 services" }, "dynamodb"],
    diagram: null,
    links: { github: "https://github.com/heeyeon-yang/iot-streaming-platform" },
  },
  {
    id: "quizlab",
    type: "main",
    topic: "serverless",
    year: "2026",
    title: { en: "QuizLab, AI Quiz Platform on AWS", ko: "QuizLab, AWS 기반 AI 퀴즈 플랫폼" },
    summary: {
      en: "Rebuilt a generative AI learning platform on serverless AWS. Uploaded lecture notes are turned into practice quizzes by Amazon Bedrock.",
      ko: "생성형 AI 기반 학습 플랫폼을 AWS 서버리스로 다시 구축했습니다. 강의 자료를 올리면 Amazon Bedrock이 연습 문제를 만들어 줍니다.",
    },
    meta: {
      period: "2026.06 – 2026.07",
      team: { en: "Personal", ko: "개인" },
      role: { en: "Design & build", ko: "설계 및 구축" },
    },
    points: {
      en: [
        "No NAT Gateway, saving an estimated $45 a month",
        "Database and cache kept off the internet",
        "Failed quiz jobs retried through a queue instead of being dropped",
      ],
      ko: [
        "NAT Gateway 없이 월 약 $45 예상 비용 절감",
        "DB와 캐시는 인터넷에서 접근 불가",
        "실패한 퀴즈 생성 작업은 버려지지 않고 큐로 재시도",
      ],
    },
    sections: [
      {
        heading: { en: "Why", ko: "배경" },
        body: {
          en: "QLAB was a generative AI learning service I worked on as a designer, and it won an award in 2024. I rebuilt it on AWS myself to understand how the infrastructure behind a service like that is designed and deployed.",
          ko: "QLAB은 디자이너로 참여해 2024년에 수상한 생성형 AI 학습 서비스입니다. 이런 서비스 뒤의 인프라가 어떻게 설계되고 배포되는지 이해하기 위해 AWS에 직접 다시 구축했습니다.",
        },
      },
      {
        heading: { en: "Network and cost", ko: "네트워크와 비용" },
        body: {
          en: "The VPC has no NAT Gateway, which removes an estimated $45 in monthly cost. Lambda runs outside the VPC and reaches AWS services directly, while the database and cache stay in private subnets with no route to the internet. Each layer of the app only accepts traffic from the layer directly in front of it.",
          ko: "VPC에 NAT Gateway를 두지 않아 월 약 $45로 예상되는 비용을 없앴습니다. Lambda는 VPC 밖에서 AWS 서비스에 직접 접근하고, DB와 캐시는 인터넷으로 나가는 경로가 없는 프라이빗 서브넷에 두었습니다. 앱의 각 계층은 바로 앞 계층에서 오는 트래픽만 받도록 했습니다.",
        },
      },
      {
        heading: { en: "Keeping requests from being lost", ko: "요청 유실 방지" },
        body: {
          en: "The first version did everything in a single Lambda function, so a timeout anywhere dropped the request without a trace. I split it into a quick trigger step and a worker connected by a queue. Failed jobs are retried, and jobs that keep failing are kept in a separate queue instead of disappearing. An end-to-end test confirmed every job completed with nothing dropped.",
          ko: "처음에는 Lambda 함수 하나가 모든 작업을 처리해서, 중간에 시간이 초과되면 요청이 흔적 없이 사라졌습니다. 이를 빠르게 끝나는 시작 단계와 실제 작업을 하는 단계로 나누고 큐로 연결했습니다. 실패한 작업은 다시 시도하고, 계속 실패하는 작업은 사라지지 않고 별도 큐에 남습니다. 종단 테스트로 모든 작업이 빠짐없이 처리되는 것을 확인했습니다.",
        },
      },
      {
        heading: { en: "Monitoring", ko: "모니터링" },
        body: {
          en: "CloudWatch alarms watch only the signals that mean the service is actually broken, such as load balancer errors, unhealthy servers, function errors, and failed jobs, and send alerts by email.",
          ko: "CloudWatch 알람은 로드밸런서 오류, 비정상 서버, 함수 오류, 실패한 작업처럼 서비스가 실제로 문제가 생겼다는 신호만 감시하고, 이메일로 알림을 보냅니다.",
        },
      },
    ],
    tags: ["Lambda", "SQS", "Bedrock", "Terraform"],
    stack: ["Lambda", "SQS", "Bedrock", "CloudWatch"],
    tint: "#01a88d",
    flow: ["s3", { icon: "lambda", label: "Trigger" }, "sqs", { icon: "lambda", label: "Worker" }, "bedrock"],
    diagram: null,
    links: { github: "https://github.com/heeyeon-yang/QuizLab" },
  },
  {
    id: "draft-2",
    type: "main",
    draft: true,
    year: "",
    title: { en: "Coming soon", ko: "준비 중" },
    summary: { en: "Project write-up in progress.", ko: "정리 중인 프로젝트입니다." },
    tags: [],
    stack: [],
    diagram: null,
  },
  {
    id: "this-site",
    type: "side",
    topic: "hosting",
    year: "2026",
    thumb: "assets/thumbs/cloud-resume.svg",
    thumbFill: true,
    modal: true,
    title: { en: "Cloud Resume Challenge", ko: "Cloud Resume Challenge" },
    summary: {
      en: "Building this portfolio site on AWS, from static hosting to automated deployment.",
      ko: "해당 포트폴리오 사이트를 AWS에 구축하는 챌린지로, 정적 호스팅부터 배포 자동화까지 진행하고 있습니다.",
    },
    meta: {
      period: "2026.10 –",
      team: { en: "Personal", ko: "개인" },
      role: { en: "Design & build", ko: "설계 및 구축" },
    },
    points: {
      en: [
        "Designed and built the site with HTML, CSS, and JavaScript",
        "Static hosting on S3, served through CloudFront over HTTPS",
        "Custom domain with Route 53 and an ACM certificate",
      ],
      ko: [
        "HTML, CSS, JavaScript로 사이트 디자인과 구현",
        "S3 정적 호스팅과 CloudFront를 통한 HTTPS 제공",
        "Route 53과 ACM 인증서로 도메인 연결",
      ],
    },
    tags: ["S3", "CloudFront", "Route 53"],
    stack: ["S3", "CloudFront", "Route 53"],
    diagram: null,
    links: { github: "https://github.com/heeyeon-yang/portfolio" },
  },
];

const HOW_I_BUILT = {
  projectId: "this-site",
  title: { en: "How I built this site", ko: "이 사이트를 만든 방법" },
  stack: ["S3", "CloudFront", "Route 53", "ACM"],
  diagram: null,
  sections: [
    {
      heading: { en: "The challenge", ko: "챌린지 소개" },
      body: {
        en: "The Cloud Resume Challenge takes a resume from a plain HTML page to a website running on AWS, covering hosting, DNS, infrastructure as code, and CI/CD along the way. I left out the visitor counter that the original challenge uses as its backend feature.",
        ko: "Cloud Resume Challenge는 이력서를 HTML 페이지에서 시작해 AWS에서 운영되는 웹사이트로 만드는 과제로, 호스팅, DNS, 코드형 인프라, CI/CD를 차례로 다룹니다. 원래 챌린지의 백엔드 기능인 방문자 카운터는 넣지 않았습니다.",
      },
    },
    {
      heading: { en: "Hosting", ko: "호스팅" },
      body: {
        en: "HTML, CSS, and JavaScript files are stored in a private S3 bucket and served only through CloudFront.",
        ko: "HTML, CSS, JavaScript 파일을 비공개 S3 버킷에 두고 CloudFront를 통해서만 제공합니다.",
      },
    },
    {
      heading: { en: "Domain and HTTPS", ko: "도메인과 HTTPS" },
      body: {
        en: "The domain is managed in Route 53 and points to CloudFront, with an ACM certificate for HTTPS.",
        ko: "도메인은 Route 53에서 관리하며 CloudFront로 연결하고, HTTPS는 ACM 인증서로 처리합니다.",
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
