const TOPICS = {
  reliability: { en: "High availability", ko: "고가용성" },
  data: { en: "Data pipeline", ko: "데이터 파이프라인" },
  event: { en: "Event-driven", ko: "이벤트 기반 처리" },
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
      en: "Built an EKS shopping site across two Availability Zones for a high-traffic sale event, and tested whether it stayed available through pod, node, zone, and database failures.",
      ko: "트래픽이 몰리는 판매 이벤트를 가정해 EKS 기반 쇼핑몰을 두 가용 영역에 구축했습니다. 파드, 노드, 가용 영역, DB 장애 상황에서도 서비스가 유지되는지 검증했습니다.",
    },
    meta: {
      period: "2026.09 – 2026.10",
      team: { en: "Team of 6", ko: "6인 팀" },
      role: { en: "Containers & application", ko: "컨테이너, 애플리케이션" },
    },
    points: {
      en: [
        "No lost or duplicate orders during a database failover",
        "Orders back within 21 seconds of the failover, with no app restart",
        "I built the Kubernetes scaling and recovery setup and the order service",
      ],
      ko: [
        "DB 장애 전환 중 주문 유실과 중복 0건",
        "장애 전환 후 앱 재시작 없이 21초 안에 주문 재개",
        "Kubernetes 확장과 장애 복구 설정, 주문 서비스 담당",
      ],
    },
    sections: [
      {
        heading: { en: "Overview", ko: "개요" },
        body: {
          en: "A six-person team project that ran a shopping site across two Availability Zones and tested whether it stayed available through pod, node, zone, and database failures under sale-event traffic. A test passed only if every order that received a success response was saved to the database exactly once.",
          ko: "트래픽이 급증하는 판매 이벤트 상황을 가정해 쇼핑몰을 AWS의 두 가용 영역에 구성하고, 파드, 노드, 가용 영역, DB 장애 상황에서도 서비스가 유지되는지 검증한 6인 팀 프로젝트입니다. 장애 중에 성공 응답을 받은 주문이 모두 DB에 저장되고 중복 기록이 없는 것을 통과 기준으로 삼았습니다.",
        },
      },
      {
        heading: { en: "Architecture", ko: "설계" },
        body: {
          en: "The same setup runs in two Availability Zones in the Seoul region, with the network split into entry, application, and database tiers. Requests pass through Route 53 and an Application Load Balancer to EKS nodes in both zones, and the app stores data in RDS for MySQL with Multi-AZ enabled, so a standby in the other zone takes over automatically if the primary fails. With orders coming in continuously, we spiked traffic, terminated pods and nodes, took down every node in one zone, and forced a database failover.",
          ko: "서울 리전의 두 가용 영역에 같은 구성을 두고, 네트워크를 외부 진입, 애플리케이션, DB 계층으로 분리했습니다. 요청은 Route 53과 ALB를 거쳐 양쪽 영역의 EKS 노드로 분산되고, 앱은 RDS for MySQL Multi-AZ에 데이터를 저장합니다. Primary에 장애가 나면 다른 영역의 Standby가 자동으로 승격됩니다. 이 환경에서 주문이 계속 들어오는 동안 트래픽을 급격히 늘리고, 파드와 노드를 종료하고, 한 가용 영역의 노드를 모두 내리고, DB Primary를 강제로 전환했습니다.",
        },
      },
      {
        heading: { en: "Results", ko: "결과" },
        body: {
          en: "Under the traffic spike, pods scaled from two to four and back to two once the load ended, with every request served. A deleted pod was replaced within seconds. Some requests failed while a node or zone was going down, but the service kept running in the remaining zone. During the database failover, orders resumed within 21 seconds without restarting the app, and checking successful orders against stored orders and stock showed no lost or duplicate orders.",
          ko: "트래픽이 몰리자 파드가 2개에서 4개로 늘었다가 부하가 끝난 뒤 2개로 돌아왔고, 그동안 요청은 모두 정상 처리됐습니다. 삭제한 파드는 몇 초 만에 새 파드로 대체됐습니다. 노드나 가용 영역이 빠지는 동안 일부 요청은 실패했지만 남은 영역에서 서비스가 계속 동작했습니다. DB 장애 전환 중에는 앱 재시작 없이 21초 만에 주문 처리가 재개됐고, 성공 응답을 받은 주문을 DB의 주문 및 재고와 대조한 결과 유실과 중복은 없었습니다.",
        },
      },
      {
        heading: { en: "My role", ko: "역할" },
        body: {
          en: "I handled containers and the application, and ran the traffic, pod, node, and zone failure tests on Kubernetes. Pods scale between two and four based on CPU usage and are spread across nodes and zones, with at least one kept running during node maintenance. Rollouts bring up a new pod before replacing the old one, and pods get time to finish in-flight requests before shutting down. Health checks are split between whether the app is running and whether it can reach the database, so a brief database outage takes a pod out of rotation instead of restarting it; no pod restarted during the database failover test. I also built the Flask shop, which records both successful and failed orders so the team could verify each test, and set up the HTTPS entry path with Route 53, ACM, and the load balancer.",
          ko: "컨테이너와 서비스 애플리케이션을 맡아 트래픽, 파드, 노드, 가용 영역 장애 테스트를 Kubernetes에서 진행했습니다. 파드는 CPU 사용률에 따라 2개에서 4개 사이로 조절되도록 하고, 노드와 가용 영역에 고르게 배치해 노드 점검 중에도 최소 한 개가 유지되게 했습니다. 배포 시에는 새 파드가 준비된 뒤 기존 파드를 교체하고, 종료 전에 처리 중인 요청을 마칠 시간을 두었습니다. 상태 확인은 앱 동작 여부와 DB 연결 여부로 나눠, DB 연결이 잠시 끊겨도 파드가 재시작되지 않고 요청 대상에서만 빠지게 했습니다. 실제로 DB 장애 테스트 동안 파드 재시작은 없었습니다. 앱은 성공과 실패 주문을 모두 기록하는 Flask 쇼핑몰로 개발해 팀의 검증 기준으로 썼고, Route 53, ACM, ALB로 HTTPS 진입 경로를 구성했습니다.",
        },
      },
      {
        heading: { en: "Issue", ko: "이슈 대응" },
        body: {
          en: "During code review, I found that changing the order number in the order page URL showed another user's order, because orders were looked up by number without checking the owner. I changed it to respond only when the signed-in user owns the order, and to return the same response for other users' orders and nonexistent ones so it doesn't reveal which orders exist.",
          ko: "코드 리뷰에서 주문 조회 주소의 번호만 바꾸면 다른 사용자의 주문이 조회되는 문제를 발견했습니다. 주문 번호로만 조회하고 소유자를 확인하지 않은 것이 원인이었습니다. 로그인한 사용자가 주문 소유자일 때만 응답하도록 수정하고, 다른 사용자의 주문과 존재하지 않는 주문에는 같은 응답을 돌려줘 주문 존재 여부도 드러나지 않게 했습니다.",
        },
      },
    ],
    tags: ["EKS", "RDS Multi-AZ", "ALB", "Route 53"],
    stack: ["EKS", "RDS", "ALB", "Route 53", "ACM"],
    tint: "#8c4fff",
    flow: ["route53", "elb", { zones: ["AZ a", "AZ c"], steps: ["eks", "rds"] }],
    diagram: null,
    figure: "assets/diagrams/ha-failover.png",
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
      period: "2026.08 – 2026.09",
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
        heading: { en: "Overview", ko: "개요" },
        body: {
          en: "A personal project that runs a sensor data pipeline on EKS: readings are ingested, stored, and sent to Slack as alerts when they pass a threshold. I started it to work with containers and Kubernetes, which QuizLab didn't cover, with a focus on least-privilege access for each service and a deployment history tracked in Git.",
          ko: "센서 데이터를 받아 저장하고, 기준값을 넘으면 Slack으로 알림을 보내는 파이프라인을 EKS에 구성한 개인 프로젝트입니다. QuizLab에서 다루지 않은 컨테이너와 Kubernetes 운영을 경험하기 위해 시작했으며, 서비스별 최소 권한과 Git 기반 배포 이력 관리에 중점을 두었습니다.",
        },
      },
      {
        heading: { en: "Architecture", ko: "설계" },
        body: {
          en: "Four services on EKS handle ingestion, stream processing, alerting, and reads. The ingestion API writes readings to Kinesis, the processor stores them in DynamoDB, and the alerting service posts readings over the threshold to Slack. The read API only reads from DynamoDB, and each service gets just the permissions it needs through IRSA. The infrastructure is defined in Terraform, and I tore the cluster down after each session to save cost, keeping the container registry in separate state so images didn't need rebuilding every time. Deployment uses separate app and manifests repositories: GitHub Actions builds the images and updates the tags, and ArgoCD applies the change to the cluster.",
          ko: "수집, 스트림 처리, 알림, 조회를 맡는 서비스 4개를 EKS에 배포했습니다. 수집 API가 센서 데이터를 Kinesis에 쓰면 처리 서비스가 DynamoDB에 저장하고, 알림 서비스는 기준값을 넘는 데이터를 Slack으로 보냅니다. 조회 API는 DynamoDB를 읽기만 하며, 각 서비스는 IRSA로 필요한 권한만 받습니다. 인프라는 Terraform으로 정의하고, 작업이 끝날 때마다 클러스터를 내려 비용을 줄였습니다. 이미지 저장소는 state를 분리해 클러스터를 다시 만들 때마다 이미지를 새로 빌드하지 않게 했습니다. 배포는 앱 레포와 매니페스트 레포를 나눠, GitHub Actions가 이미지를 빌드하고 태그를 갱신하면 ArgoCD가 클러스터에 반영하도록 구성했습니다.",
        },
      },
      {
        heading: { en: "Results", ko: "결과" },
        body: {
          en: "I confirmed the full flow: simulated readings pass through Kinesis into DynamoDB and reach both the read API and Slack. Pushing service code to main builds the images and deploys them to the cluster with no manual steps, and GitHub holds no long-lived AWS credentials. Manual changes to the cluster are reverted to the state declared in Git, so the manifests repository history shows exactly what is deployed.",
          ko: "시뮬레이터가 보낸 데이터가 Kinesis를 거쳐 DynamoDB에 저장되고, 조회 API와 Slack 알림까지 이어지는 전체 흐름을 확인했습니다. 서비스 코드를 main에 반영하면 이미지 빌드부터 클러스터 배포까지 수작업 없이 진행되며, GitHub에는 AWS 장기 자격 증명을 두지 않았습니다. 클러스터를 수동으로 변경해도 Git에 선언된 상태로 되돌아가므로, 실제 배포 상태는 매니페스트 레포 이력으로 확인할 수 있습니다.",
        },
      },
      {
        heading: { en: "Issue", ko: "이슈 대응" },
        body: {
          en: "During a rollout, old and new pods briefly ran together, and both alerting services read the same records, sending duplicate Slack alerts. I had the service remember recently processed record numbers in memory and skip repeats, which was enough at this scale without adding a separate store. While installing ArgoCD, pods also stayed unscheduled because of the per-node pod limit, even though CPU and memory were available. Instead of moving to larger instances, I changed how nodes assign IP addresses and installed only the ArgoCD components I needed, which fixed it at no extra cost.",
          ko: "배포 중 기존 파드와 새 파드가 잠시 함께 실행되면, 두 알림 서비스가 같은 데이터를 각각 읽어 Slack 알림이 중복으로 발송됐습니다. 최근 처리한 레코드 번호를 메모리에 기록해 이미 처리한 레코드는 건너뛰도록 했고, 이 규모에서는 별도 저장소를 두는 것보다 적절하다고 판단했습니다. 또 ArgoCD 설치 중에는 CPU와 메모리가 충분한데도 노드당 파드 수 제한 때문에 파드가 배치되지 않았습니다. 인스턴스를 키우는 대신 노드의 IP 할당 방식을 변경하고 ArgoCD를 필요한 구성 요소만 설치해, 추가 비용 없이 해결했습니다.",
        },
      },
    ],
    tags: ["EKS", "Kinesis", "Terraform", "ArgoCD"],
    stack: ["EKS", "Kinesis", "DynamoDB", "Terraform"],
    tint: "#ed7100",
    flow: ["kinesis", "eks", "dynamodb"],
    diagram: null,
    figure: "assets/diagrams/iot-streaming.png",
    links: { github: "https://github.com/heeyeon-yang/iot-streaming-platform" },
  },
  {
    id: "quizlab",
    type: "main",
    topic: "event",
    year: "2026",
    title: { en: "QuizLab, AI Quiz Platform on AWS", ko: "QuizLab, AWS 기반 AI 퀴즈 플랫폼" },
    summary: {
      en: "Built a service on AWS that turns lecture PDFs into practice questions with Amazon Bedrock. The web app runs on an EC2 Auto Scaling group, and question generation runs in an asynchronous pipeline built on Lambda and SQS.",
      ko: "강의 자료 PDF를 올리면 Amazon Bedrock이 연습 문제를 만들어 주는 서비스를 AWS에 구축했습니다. 웹 앱은 EC2 Auto Scaling 그룹에서 실행하고, 문제 생성은 Lambda와 SQS로 나눈 비동기 파이프라인에서 처리합니다.",
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
        heading: { en: "Overview", ko: "개요" },
        body: {
          en: "QuizLab turns uploaded lecture notes in PDF form into practice questions using generative AI. It is based on QLAB, a learning service I planned in university that won a startup competition award, rebuilt on AWS with the focus on infrastructure design. All infrastructure is defined in Terraform, and the design avoids a NAT Gateway to keep costs down while making sure no request is lost.",
          ko: "QuizLab은 강의 자료 PDF를 올리면 생성형 AI가 연습 문제를 만들어 주는 서비스입니다. 대학 시절 기획해 창업 공모전에서 수상한 학습 서비스 QLAB을 바탕으로, 인프라 설계와 구축에 초점을 맞춰 AWS에 다시 구현했습니다. 모든 인프라를 Terraform으로 정의했고, NAT Gateway 없이 비용을 줄이면서도 요청이 유실되지 않도록 구성했습니다.",
        },
      },
      {
        heading: { en: "Architecture", ko: "설계" },
        body: {
          en: "The web app runs on an EC2 Auto Scaling group across two Availability Zones behind CloudFront and an Application Load Balancer, and files are uploaded straight to S3. Each upload triggers a Lambda function that places a job on SQS; a second function picks it up, extracts the PDF text, generates questions with Amazon Bedrock, and saves them to a separate bucket. Without a NAT Gateway, the Lambda functions run outside the VPC and reach AWS services directly, while the database and cache sit in private subnets with no outbound route. Each tier accepts traffic only from the tier in front of it, and every layer from networking to monitoring is defined in its own Terraform configuration.",
          ko: "웹 앱은 CloudFront와 ALB 뒤에서 두 가용 영역의 EC2 Auto Scaling 그룹으로 실행되고, 파일은 S3에 바로 업로드됩니다. 업로드가 일어나면 Lambda가 작업을 SQS에 넣고, 다른 Lambda가 작업을 꺼내 PDF 텍스트를 추출한 뒤 Amazon Bedrock으로 문제를 생성해 별도 버킷에 저장합니다. NAT Gateway를 두지 않는 대신 Lambda는 VPC 밖에서 AWS 서비스에 접근하고, DB와 캐시는 외부 경로가 없는 프라이빗 서브넷에 두었습니다. 각 계층은 바로 앞 계층의 트래픽만 받으며, 인프라는 네트워크부터 모니터링까지 계층별로 Terraform으로 구성했습니다.",
        },
      },
      {
        heading: { en: "Results", ko: "결과" },
        body: {
          en: "An end-to-end test from PDF upload to stored quiz emptied the queue and left nothing in the dead-letter queue. Skipping the NAT Gateway saves an estimated $45 a month. CloudWatch alarms cover only signals that mean something is actually broken, such as load balancer errors, unhealthy servers, function errors, and failed jobs, and send alerts by email.",
          ko: "PDF 업로드부터 퀴즈 저장까지 종단 테스트를 진행해, 큐가 모두 비워지고 실패 큐에 남은 작업이 없는 것을 확인했습니다. NAT Gateway를 두지 않아 월 약 45달러의 예상 비용을 줄였습니다. CloudWatch 알람은 로드밸런서 오류, 비정상 서버, 함수 오류, 실패 큐처럼 실제 장애를 뜻하는 신호에만 설정해 이메일로 받도록 했습니다.",
        },
      },
      {
        heading: { en: "Issue", ko: "이슈 대응" },
        body: {
          en: "The first version ran PDF parsing, question generation, and storage in a single Lambda function, so a timeout at any point dropped the request without a trace. I split it into a quick step that responds to the upload and a worker that does the generation, connected by SQS. Failed jobs are retried, jobs that keep failing are kept in a dead-letter queue, and each function's IAM permissions were narrowed to what it actually does.",
          ko: "처음에는 Lambda 하나가 PDF 처리, 문제 생성, 저장을 모두 맡아 중간에 시간이 초과되면 요청이 기록 없이 사라졌습니다. 업로드에 바로 응답하는 단계와 실제 생성 작업 단계로 나누고 SQS로 연결했습니다. 실패한 작업은 다시 시도하고 계속 실패하면 별도 큐에 남도록 했으며, 함수별 IAM 권한도 실제 역할에 맞게 줄였습니다.",
        },
      },
    ],
    tags: ["Lambda", "SQS", "Bedrock", "Terraform"],
    stack: ["Lambda", "SQS", "Bedrock", "CloudWatch"],
    tint: "#01a88d",
    flow: ["s3", { icon: "lambda", label: "Trigger" }, "sqs", { icon: "lambda", label: "Worker" }, "bedrock"],
    diagram: null,
    figure: "assets/diagrams/quizlab.png",
    figureSize: "narrow",
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
    tint: "#8c4fff",
    flow: ["route53", "cloudfront", "s3"],
    diagram: null,
    links: { github: "https://github.com/heeyeon-yang/portfolio" },
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
  },
];

// The "How I built" modal shows the project with this id.
const HOW_I_BUILT_ID = "this-site";
