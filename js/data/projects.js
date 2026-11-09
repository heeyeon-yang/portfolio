const TOPICS = {
  reliability: { en: "High availability", ko: "고가용성" },
  data: { en: "Data pipeline", ko: "데이터 파이프라인" },
  event: { en: "Event-driven", ko: "이벤트 기반 처리" },
  hosting: { en: "Static hosting", ko: "정적 호스팅" },
  monitoring: { en: "Monitoring", ko: "모니터링" },
};

const PROJECTS = [
  {
    id: "ha-failover",
    type: "main",
    topic: "reliability",
    year: "2026",
    title: {
      en: "Failure Recovery Under Peak Traffic on EKS Multi-AZ",
      ko: "트래픽 급증 대비 EKS Multi-AZ 장애 복구 검증",
    },
    summary: {
      en: "Set up the Kubernetes deployment and HTTPS entry path so the service survives failures on EKS, then broke pods, nodes, and a whole zone to confirm recovery within 60 seconds.",
      ko: "EKS에서 서비스가 장애를 견디도록 Kubernetes 배포 설정과 HTTPS 접속 경로를 구성하고, 파드, 노드, 가용 영역 장애를 일으켜 60초 안에 복구되는 것을 확인했습니다.",
    },
    meta: {
      period: "2026.09 – 2026.10",
      team: { en: "Team project", ko: "팀 프로젝트" },
      role: { en: "Kubernetes deployment, entry path, app", ko: "Kubernetes 배포, 접속 경로, 서비스 개발" },
    },
    points: {
      en: [
        "Recovered on the remaining nodes within 60 seconds after node and zone failures",
        "No pod restarts during the database failover, after splitting liveness and readiness checks",
        "HTTPS entry path built with Route 53, ACM, and ALB",
      ],
      ko: [
        "노드와 가용 영역 장애 시 60초 안에 남은 노드로 복구",
        "liveness와 readiness 분리로 DB 장애 전환 중 파드 재시작 0회",
        "Route 53, ACM, ALB로 HTTPS 접속 경로 구성",
      ],
    },
    sections: [
      {
        heading: { en: "Project goal", ko: "프로젝트 목표" },
        body: {
          en: "When orders flood in at an event launch, losing one server or one Availability Zone can make orders fail, disappear, or get saved twice. Splitting a service across two zones doesn't show whether the remaining zone actually takes over, so we tested it by causing real failures. We ran a commerce service on EKS and RDS Multi-AZ across two zones in Seoul and injected pod, node, zone, and database failures while orders kept coming in. To pass, the service had to recover within 60 seconds with no lost or duplicate orders.",
          ko: "이벤트 오픈처럼 주문이 한꺼번에 몰리는 시점에 서버나 가용 영역 하나가 멈추면, 주문이 실패하거나 유실, 중복될 수 있습니다. 가용 영역을 나눠 두는 것만으로는 남은 쪽이 요청을 이어받는지 알 수 없어, 장애를 실제로 일으켜 확인했습니다. 서울 리전 두 가용 영역에 EKS와 RDS Multi-AZ로 커머스 서비스를 올리고, 주문이 들어오는 중에 파드, 노드, 가용 영역, DB 장애를 주입했습니다. 통과 기준은 60초 안의 서비스 복구와 주문 유실 0건, 중복 0건입니다.",
        },
      },
      {
        heading: { en: "Key decisions", ko: "주요 판단" },
        body: { en: "", ko: "" },
        list: {
          en: [
            "ALB with a NodePort. An NLB works at L4 and can't redirect HTTP to HTTPS, and the AWS Load Balancer Controller needed its own install and IAM setup. I put ingress-nginx on a NodePort behind the ALB.",
            "TLS ends at the ALB. ACM issues and renews the certificate, so the cluster holds no certificates.",
            "Split health checks. A database outage hits every node the same way, so an ALB check on the database would drop all nodes at once. The ALB checks nodes through /healthz, and the readinessProbe checks the database through /health.",
          ],
          ko: [
            "ALB와 NodePort: NLB는 L4라 HTTP를 HTTPS로 리다이렉트할 수 없고, AWS Load Balancer Controller는 별도 설치와 IAM 구성이 필요했습니다. ALB 뒤에 ingress-nginx를 NodePort로 연결했습니다.",
            "TLS는 ALB에서 종료: ACM이 인증서 발급과 갱신을 맡아 클러스터에 인증서를 둘 필요가 없습니다.",
            "헬스체크 분리: DB 장애는 모든 노드에 똑같이 영향을 줍니다. ALB가 DB까지 확인하면 노드가 한꺼번에 빠지므로, ALB는 /healthz로 노드만, readinessProbe는 /health로 DB 연결을 확인합니다.",
          ],
        },
      },
      {
        heading: { en: "Networking: HTTPS entry path with Route 53, ACM, and ALB", ko: "네트워크: Route 53, ACM, ALB로 HTTPS 접속 경로 구성" },
        body: { en: "", ko: "" },
        list: {
          en: [
            "beaver-shop.cloud points to the ALB through a Route 53 A alias record",
            "The 443 listener ends TLS with an ACM certificate (TLS 1.2 and 1.3), and port 80 redirects to 443 with a 301",
            "Only requests for the registered host reach the target group; everything else gets a 403",
            "The target group sends traffic to NodePort 30887 on nodes that pass /healthz, and ingress-nginx routes it to the app Service",
            "The node group runs 2 to 4 nodes, one in each zone",
          ],
          ko: [
            "Route 53 A 별칭 레코드로 beaver-shop.cloud를 ALB에 연결",
            "443 리스너에서 ACM 인증서로 TLS 종료(TLS 1.2, 1.3), 80은 443으로 301 리다이렉트",
            "등록된 호스트만 대상 그룹으로 전달하고 나머지 요청은 403으로 차단",
            "대상 그룹은 /healthz를 통과한 노드의 NodePort 30887로만 전달, ingress-nginx가 앱 Service로 라우팅",
            "노드 그룹은 최소 2대, 최대 4대로 두고 가용 영역마다 1대씩 배치",
          ],
        },
        figure: "assets/diagrams/ha-failover-ingress.png",
      },
      {
        heading: { en: "Kubernetes: deployment settings for availability", ko: "Kubernetes: 고가용성 배포 설정" },
        body: {
          en: "The manifests are split into app.yaml, ingress.yaml, hpa.yaml, and pdb.yaml.",
          ko: "매니페스트는 app.yaml, ingress.yaml, hpa.yaml, pdb.yaml로 나눠 관리했습니다.",
        },
        list: {
          en: [
            "HPA: 2 to 4 pods at 60% of the CPU request, with a 60-second scale-down window",
            "Spreading: pod counts across zones and nodes differ by at most one, with a PDB of minAvailable 1",
            "Rollouts: maxSurge 1 and maxUnavailable 0, and a new pod must stay Ready for 10 seconds before replacing an old one",
            "Shutdown: a 10-second preStop wait so the ALB and Service stop sending traffic first",
            "Probes: liveness checks only that the app responds through /live, and readiness also checks the database through /health",
          ],
          ko: [
            "HPA: CPU 요청량 대비 60% 기준으로 파드 2개에서 4개 사이 조절, 축소 안정화 60초",
            "분산 배치: 가용 영역과 노드 간 파드 수 차이 1 이하, PDB minAvailable 1",
            "롤링 업데이트: maxSurge 1, maxUnavailable 0, 새 파드가 10초간 Ready를 유지한 뒤 교체",
            "종료 처리: preStop 10초 대기로 ALB와 Service가 요청 대상을 먼저 바꾸도록 설정",
            "상태 확인: liveness는 /live로 앱 응답만, readiness는 /health로 DB 연결까지 확인",
          ],
        },
      },
      {
        heading: { en: "Application: Flask service for failure testing", ko: "애플리케이션: 장애 검증용 Flask 서비스" },
        body: {
          en: "I built a Flask app with accounts, products, cart, orders, and stock. It records both successful and failed orders, and the team used those records to check each test for lost or duplicate orders. The page header shows which pod served the request, so a pod switch during a failure is visible right away.",
          ko: "회원, 상품, 장바구니, 주문, 재고 기능을 갖춘 Flask 앱을 만들었습니다. 성공과 실패 주문을 모두 DB에 기록해, 팀이 장애 후 주문 유실과 중복을 판정하는 기준으로 썼습니다. 화면에는 응답한 파드 이름을 표시해 장애 중 파드 전환을 바로 볼 수 있게 했습니다.",
        },
      },
      {
        heading: { en: "Results", ko: "검증 결과" },
        body: { en: "", ko: "" },
        list: {
          en: [
            "Traffic spike: pods scaled from 2 to 4 and back to 2, with no probe failures",
            "Pod failure: all 88 requests succeeded while pods were deleted",
            "Node failure: recovered in 59 seconds, with no failed requests after recovery",
            "Zone failure: recovered in the remaining zone in 50 seconds, with no failed requests after recovery",
            "Database failure: no pod restarts during the failover, and no lost or duplicate orders",
          ],
          ko: [
            "트래픽 급증: 파드 2개에서 4개로 확장 후 2개로 복귀, probe 실패 없음",
            "파드 장애: 파드 삭제 중 요청 88건 모두 성공",
            "노드 장애: 59초 만에 복구, 복구 후 요청 실패 0건",
            "가용 영역 장애: 50초 만에 남은 영역에서 복구, 복구 후 요청 실패 0건",
            "DB 장애: 전환 중 파드 재시작 0회, 주문 유실과 중복 0건",
          ],
        },
        figure: "assets/diagrams/ha-failover-hpa.png",
      },
      {
        heading: { en: "Next steps", ko: "개선 방안" },
        body: { en: "", ko: "" },
        list: {
          en: [
            "ingress-nginx reached end of maintenance in March 2026, so the next step is a Gateway API controller or the AWS Load Balancer Controller. With the AWS Load Balancer Controller, the ALB targets pod IPs directly and the NodePort hop goes away.",
            "Shorter health check intervals and thresholds on the target group would cut recovery time after a node failure.",
          ],
          ko: [
            "ingress-nginx는 2026년 3월 유지보수가 종료되어 Gateway API 기반 컨트롤러나 AWS Load Balancer Controller로 옮길 계획입니다. AWS Load Balancer Controller를 쓰면 ALB가 파드 IP를 바로 대상으로 삼아 NodePort 단계가 빠집니다.",
            "대상 그룹의 헬스체크 간격과 임계값을 줄이면 노드 장애 시 복구 시간을 더 줄일 수 있습니다.",
          ],
        },
      },
    ],
    tags: ["Kubernetes", "EKS", "ALB", "RDS Multi-AZ"],
    stack: ["EKS", "Kubernetes", "ALB", "Route 53", "RDS"],
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
    id: "hackathon-monitoring",
    type: "side",
    topic: "monitoring",
    year: "2026",
    thumb: "assets/icons/stack/grafana.svg",
    title: {
      en: "NAT Redundancy and Unified Monitoring for a Hybrid Setup",
      ko: "하이브리드 인프라 NAT 이중화와 모니터링 통합",
    },
    summary: {
      en: "Brought AWS and on-premises metrics into one Prometheus and connected Grafana alerts to email, in a three-day hackathon on another team's hybrid infrastructure.",
      ko: "AWS와 온프레미스 지표를 Prometheus 하나로 모으고 Grafana 알림을 메일로 연결했습니다. 다른 팀의 하이브리드 인프라를 고객사로 정해 3일간 진행한 해커톤입니다.",
    },
    meta: {
      period: "2026.11",
      team: { en: "Hackathon team", ko: "해커톤 팀" },
      role: { en: "Monitoring", ko: "모니터링" },
    },
    points: {
      en: [
        "Metrics split between CloudWatch and Prometheus brought into a single Prometheus",
        "Grafana alert at a 5xx rate over 5%, delivered by email and confirmed by injecting HTTP 500 errors",
      ],
      ko: [
        "CloudWatch와 Prometheus 두 곳에서 받던 지표를 Prometheus 하나로 통합",
        "5xx 비율 5% 초과 시 Grafana 알림을 메일로 전달, HTTP 500 에러 주입으로 동작 확인",
      ],
    },
    sections: [
      {
        heading: { en: "Project goal", ko: "프로젝트 목표" },
        body: {
          en: "The client ran a sign-up service on AWS and on-premises k3s, connected over WireGuard, with traffic peaking at deadlines. Both Availability Zones shared one NAT instance, and metrics were split between CloudWatch for AWS and Prometheus for on-premises. After meeting the client team, we set two requirements: keep outbound traffic working if one NAT fails, and see all metrics in one place. Their spend was already $49.52 against a $30 monthly budget, so added cost had to stay small.",
          ko: "고객사는 접수 마감 때 트래픽이 몰리는 서비스를 AWS와 온프레미스 k3s에 나눠 운영하고 WireGuard로 연결한 구성이었습니다. 두 가용 영역이 NAT Instance 1대를 같이 썼고, 지표는 AWS가 CloudWatch, 온프레미스가 Prometheus로 나뉘어 있었습니다. 담당자 미팅을 거쳐 NAT 1대가 멈춰도 외부 통신이 유지될 것, 모든 지표를 한 곳에서 볼 수 있을 것을 요구사항으로 정했습니다. 월 예산 30달러에 실사용이 이미 49.52달러여서 추가 비용은 최소로 잡았습니다.",
        },
      },
      {
        heading: { en: "Key decisions", ko: "주요 판단" },
        body: { en: "", ko: "" },
        list: {
          en: [
            "Prometheus as the single collector. CloudWatch would have needed an agent on every on-premises server and a charge per custom metric. The client already ran Prometheus on-premises, so I had it collect AWS metrics too.",
            "Istio and Kiali to find the failing service. Prometheus alone showed only totals. Istio sidecars report requests, errors, and latency between services without changing the app.",
          ],
          ko: [
            "수집은 Prometheus 하나로: CloudWatch로 옮기면 온프레미스 서버마다 에이전트가 필요하고 커스텀 지표마다 요금이 붙습니다. 고객사가 이미 쓰던 Prometheus로 AWS 지표까지 수집했습니다.",
            "장애 위치는 Istio와 Kiali로: Prometheus 지표만으로는 총량만 보였습니다. Istio 사이드카는 앱을 고치지 않고 서비스 간 요청량, 에러, 지연 시간을 수집합니다.",
          ],
        },
      },
      {
        heading: { en: "Monitoring: metrics and dashboards in Prometheus and Grafana", ko: "모니터링: Prometheus와 Grafana로 지표 통합" },
        body: { en: "", ko: "" },
        list: {
          en: [
            "Prometheus and Grafana on a t3.medium in a private subnet, pulling on-premises metrics over WireGuard",
            "Node Exporter Full dashboard for CPU, memory, disk, and network",
            "Istio Mesh Dashboard for request rate, success rate, 5xx, and P50 to P99 latency per service",
            "A Kiali link at the top of the dashboard that opens the service graph, colored by state",
          ],
          ko: [
            "Prometheus와 Grafana를 프라이빗 서브넷의 t3.medium 1대에 두고 온프레미스 지표는 WireGuard로 수집",
            "Node Exporter Full 대시보드로 CPU, 메모리, 디스크, 네트워크 확인",
            "Istio Mesh Dashboard로 서비스별 요청량, 성공률, 5xx, P50에서 P99까지의 응답 시간 확인",
            "대시보드 상단 Kiali 링크로 상태별 색상이 표시된 서비스 호출 그래프로 이동",
          ],
        },
        figure: "assets/diagrams/hackathon-dashboard.png",
      },
      {
        heading: { en: "Alerting: from Grafana to email", ko: "알림: Grafana에서 메일까지" },
        body: {
          en: "Alert rules moved from CloudWatch to Grafana to sit next to the metrics. The Istio-High-5xx-Error-Rate rule fires when 5xx responses pass 5% of requests over one minute, and the alert reaches email through API Gateway, Lambda, and SNS. The Lambda and SNS were already in the client's account.",
          ko: "알림 규칙을 CloudWatch에서 Grafana로 옮겨 지표와 같은 곳에서 관리하게 했습니다. Istio-High-5xx-Error-Rate 규칙은 1분간 5xx 응답 비율이 5%를 넘으면 발생하고, API Gateway, Lambda, SNS를 거쳐 메일로 전달됩니다. Lambda와 SNS는 고객사가 쓰던 것을 그대로 활용했습니다.",
        },
        figure: "assets/diagrams/hackathon-alert.png",
      },
      {
        heading: { en: "Results", ko: "검증 결과" },
        body: { en: "", ko: "" },
        list: {
          en: [
            "After injecting HTTP 500 errors, the 5xx rate rose to about 15.5%; the alert moved from Pending to Firing past 5% and the email arrived",
            "Metric collection went from two systems to one Prometheus",
          ],
          ko: [
            "HTTP 500 에러 주입 후 5xx 비율이 약 15.5%까지 상승, 5%를 넘자 알림이 Pending에서 Firing으로 바뀌고 메일 수신",
            "지표 수집처를 CloudWatch와 Prometheus 두 곳에서 Prometheus 한 곳으로 통합",
          ],
        },
        figure: "assets/diagrams/hackathon-architecture.png",
      },
      {
        heading: { en: "Next steps", ko: "개선 방안" },
        body: {
          en: "Collection, dashboards, and alerts run on one monitoring instance. The operations plan includes an AMI backup and rebuild procedure, and putting the instance in an Auto Scaling group with a minimum of 1 would bring it back automatically.",
          ko: "수집, 대시보드, 알림이 모니터링 EC2 1대에서 동작합니다. 운영 방안에 AMI 백업과 재구축 절차를 넣었고, 이 인스턴스를 최소 1대인 Auto Scaling 그룹으로 묶으면 서버가 멈춰도 자동으로 다시 뜨게 할 수 있습니다.",
        },
      },
    ],
    tags: ["Prometheus", "Grafana", "Istio", "Kiali"],
    stack: ["Prometheus", "Grafana", "Lambda", "SNS"],
    tint: "#e6522c",
    flow: [{ icon: "prometheus", label: "Prometheus" }, { icon: "grafana", label: "Grafana" }, { icon: "lambda", label: "Alert" }],
    diagram: null,
    figure: null,
    links: {},
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
    links: {
      github: "https://github.com/heeyeon-yang/portfolio",
      reference: { label: "Cloud Resume Challenge", url: "https://cloudresumechallenge.dev/" },
    },
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
