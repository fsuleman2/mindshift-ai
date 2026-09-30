# PROJECT CONTEXT — Enterprise Java Migration Platform

## 0. Instructions to the Next Coding Agent

You are continuing an existing technical project.

Do **not** treat this as a greenfield request.

Before writing code:

1. Read this entire document.
2. Inspect the repository.
3. Identify what is actually implemented versus stubbed.
4. Preserve the architecture and decisions documented here.
5. Do not redesign components merely because you would choose a different technology.
6. Improve or replace an implementation only when there is a concrete technical reason.
7. Prefer deterministic tooling over LLM reasoning whenever deterministic tooling can safely perform the migration.
8. Never allow an LLM to directly execute arbitrary shell commands.
9. Treat LLM output as untrusted input.
10. Keep migration execution auditable and reproducible.
11. Validate assumptions against an actual Java repository as early as possible.

The objective is to build a real enterprise-grade Java modernization platform, not merely a chatbot that generates migration suggestions.

---

# 1. Project Objective

Build an agentic AI platform that automates modernization of enterprise Java applications.

The platform should eventually support migrations such as:

* Java 8 → 17
* Java 11 → 17
* Java 17 → 21
* Spring Boot 2.x → 3.x
* Spring Framework 5 → 6
* Spring Security 5 → 6
* Spring Security 6 → 7
* `javax.*` → `jakarta.*`
* Maven migrations
* Gradle migrations
* dependency upgrades
* API changes
* configuration changes
* source-code transformations
* test migrations
* build/test repair
* migration validation
* Git branch/commit/PR creation

The system must distinguish between:

### Deterministic transformations

Examples:

* dependency version changes
* known API migrations
* `javax` → `jakarta`
* known Spring migration recipes
* mechanical source transformations

Use:

* OpenRewrite
* AST transformations
* custom deterministic transformers

### Reasoning-heavy transformations

Examples:

* unusual application-specific API adaptations
* complicated configuration changes
* migration failures requiring root-cause reasoning
* code changes where no deterministic recipe exists

Use:

* AI coding executor / LLM

The platform should therefore follow:

```text
Reasoning → Plan → Deterministic Execution where possible
                         ↓
                  AI only where needed
                         ↓
                  Build/Test/Validate
```

---

# 2. Core Architecture

Target architecture:

```text
                    ┌──────────────────┐
                    │    Next.js UI    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   FastAPI API    │
                    └────────┬─────────┘
                             │
                             ▼
                 ┌────────────────────────┐
                 │ Migration Orchestrator │
                 └────────────┬───────────┘
                              │
          ┌───────────────────┼────────────────────┐
          │                   │                    │
          ▼                   ▼                    ▼
   Interviewer Agent   Repository Intelligence   Knowledge Base
          │                   │                    │
          └───────────────────┼────────────────────┘
                              ▼
                       Planner Agent
                              │
                              ▼
                     Migration Plan
                              │
                              ▼
                       Human Approval
                              │
                              ▼
                     Execution Engine
                              │
              ┌───────────────┼────────────────┐
              ▼               ▼                ▼
         OpenRewrite          AI              AST
              │               │                │
              └───────────────┼────────────────┘
                              ▼
                       Build / Compile
                              │
                              ▼
                          Test Suite
                              │
                              ▼
                     Failure Analyzer
                              │
                    ┌─────────┴─────────┐
                    │                   │
                  PASS                FAIL
                    │                   │
                    │                   ▼
                    │             Repair Agent
                    │                   │
                    │                   ▼
                    │              Rebuild/Test
                    │
                    ▼
                       Validation
                              │
                              ▼
                    Git Branch / Commit
                              │
                              ▼
                       Pull Request
```

Important architectural principle:

> Agents reason. Services authorize. Deterministic tools transform and verify. The orchestrator controls state. Humans approve high-risk actions.

Do not create a chain such as:

```text
Agent → Agent → Copilot → Code
```

Instead:

```text
Orchestrator
    ↓
Agent reasoning
    ↓
Structured plan
    ↓
Authorized execution service
    ↓
Deterministic/AI executor
    ↓
Verification
```

---

# 3. Migration State Machine

The migration lifecycle is:

```text
CREATED
   ↓
INTERVIEWING
   ↓
ANALYZING
   ↓
PLANNING
   ↓
PLAN_READY
   ↓
WAITING_FOR_APPROVAL
   ↓
APPROVED
   ↓
PREPARING_WORKSPACE
   ↓
TRANSFORMING
   ↓
BUILDING
   ↓
TESTING
   ↓
VALIDATING
   │
   ├── FAIL
   │      ↓
   │  ANALYZING_FAILURE
   │      ↓
   │  REPAIRING
   │      ↓
   │  BUILDING
   │
   └── PASS
          ↓
       VALIDATED
          ↓
      CREATING_PR
          ↓
       COMPLETED
```

Additional terminal/interruption states:

```text
BLOCKED
FAILED
CANCELLED
```

Only the orchestrator should advance migration state.

Individual agents must not arbitrarily mutate workflow state.

---

# 4. Repository Intelligence

Do not send an entire enterprise repository blindly to an LLM.

First construct a deterministic repository manifest.

Initial intelligence should detect:

* Maven / Gradle
* wrapper files
* Java version
* Spring Boot version
* Spring Framework version
* Spring Security version
* modules
* dependencies
* test framework
* approximate test count
* source count
* configuration files
* resources
* Docker
* Kubernetes
* Helm
* CI/CD
* GitHub Actions
* GitLab CI
* Jenkins
* Azure Pipelines
* Spring indicators

Future deeper intelligence:

* AST
* symbols
* call graph
* dependency graph
* test-to-code mapping
* configuration graph
* service graph
* module graph
* inter-module dependencies

For monoliths:

```text
Module Graph
Dependency Graph
Call Graph
Configuration Graph
Test Graph
```

For microservices:

```text
Service Graph
API Graph
Dependency Graph
Configuration Graph
Test Graph
```

Repository intelligence is one of the important long-term platform capabilities.

---

# 5. Migration Knowledge Base

Migration knowledge must be structured.

Conceptually:

```text
Migration
 ├── prerequisites
 ├── breaking_changes
 ├── recipes
 ├── detection_rules
 ├── transformation_rules
 ├── known_issues
 └── validation_rules
```

Examples:

```text
Java 11 → Java 17
Spring Boot 2.7 → 3.x
Spring Framework 5 → 6
Spring Security 5 → 6
Spring Security 6 → 7
javax → jakarta
Hibernate changes
Jackson changes
JPA changes
configuration changes
```

The planner should consume:

```text
Migration Specification
+
Repository Manifest
+
Migration Knowledge
```

and produce a structured migration plan.

---

# 6. Migration Specification

Use structured data rather than relying on free-form agent text.

Example:

```python
class VersionSpec(BaseModel):
    java: str | None = None
    springBoot: str | None = None
    springSecurity: str | None = None


class MigrationRequirements(BaseModel):
    updateTests: bool = True
    followCodingStandards: bool = True
    preserveBusinessLogic: bool = True
    allowSecurityChanges: bool = False


class MigrationSpecification(BaseModel):
    source: VersionSpec
    target: VersionSpec
    requirements: MigrationRequirements
```

Use `Field(default_factory=...)` for mutable defaults.

The interviewer must identify missing information rather than invent it.

---

# 7. Migration Plan

Planner output should be structured.

Example:

```json
{
  "migrationId": "MIG-1001",
  "summary": "Migrate Java 11 application to Java 17",
  "tasks": [
    {
      "id": "MIG-001",
      "category": "DEPENDENCY",
      "description": "Upgrade Java-compatible dependencies",
      "executor": "OPENREWRITE",
      "risk": "LOW",
      "requiresApproval": false,
      "dependsOn": []
    }
  ],
  "warnings": [],
  "assumptions": []
}
```

Executor types:

```text
OPENREWRITE
AI
AST
CUSTOM
```

Risk:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

High/critical changes should normally require human approval.

Security-sensitive and business-logic-sensitive changes should require approval unless explicitly allowed.

---

# 8. Agent Architecture

## Migration Interviewer

Responsibilities:

* determine source version
* determine target version
* identify test requirements
* identify coding standards
* identify business-logic preservation requirements
* identify security-change permissions
* identify other migration constraints

Must NOT:

* modify code
* execute shell commands
* invent versions
* invent repository facts

Output only structured JSON matching its schema.

---

## Migration Planner

Input:

```text
MigrationSpecification
RepositoryManifest
MigrationKnowledge
```

Responsibilities:

* identify dependency changes
* identify source changes
* identify configuration changes
* identify test changes
* choose executor
* determine risk
* establish task dependencies
* determine approval requirements

Prefer:

```text
Deterministic executor > AI executor
```

when both can safely perform the same transformation.

Output only structured JSON matching `MigrationPlan`.

---

## Failure Analyzer

Input:

* build output
* test output
* repository context
* previous migration changes

It should identify root causes rather than treating every compiler error independently.

Example:

```text
247 compilation errors
        ↓
cluster
        ↓
javax/jakarta issue
        ↓
single root cause
```

---

## Repair Agent

The repair agent should:

1. receive failure clusters
2. inspect relevant code/context
3. determine repair
4. produce structured changes
5. apply changes through controlled services
6. rebuild
7. rerun affected tests
8. eventually run full validation

Repair must be bounded.

Recommended maximum:

```text
3 repair iterations
```

If still failing:

```text
BLOCKED
```

Do not create infinite autonomous repair loops.

---

# 9. Agent Definition Files

Use `.agent.md` definitions.

Example:

```text
migration-interviewer.agent.md
migration-planner.agent.md
failure-analyzer.agent.md
repair-agent.agent.md
```

The system should load agent definitions through an `AgentDefinitionLoader`.

LLM interface:

```python
class LLMClient(Protocol):
    def generate(
        self,
        system_prompt: str,
        user_prompt: str
    ) -> str:
        ...
```

Agent execution flow:

```text
Load definition
      ↓
Construct context
      ↓
Call LLM
      ↓
Parse JSON
      ↓
Pydantic validation
      ↓
Accept structured result
```

Malformed output must fail safely or enter a repair path.

Never trust raw LLM output.

---

# 10. Execution Layer

Use a registry:

```text
ExecutorRegistry
 ├── OPENREWRITE
 ├── AI
 ├── AST
 └── CUSTOM
```

Common interface:

```python
class MigrationExecutor:
    def execute(task, workspace) -> ExecutionResult:
        ...
```

The task runner should respect the dependency DAG.

Example:

```text
DEPENDENCY
    ↓
IMPORT/API
    ↓
SOURCE
    ↓
CONFIGURATION
    ↓
TEST
```

Do not execute dependent tasks before prerequisites.

---

# 11. OpenRewrite

OpenRewrite should be a first-class deterministic executor.

Example:

```json
{
  "executor": "OPENREWRITE",
  "parameters": {
    "recipe": "org.openrewrite.java.migrate.UpgradeToJava17",
    "buildTool": "maven"
  }
}
```

Support:

* Maven wrapper
* Gradle wrapper

Capture:

* exit code
* stdout
* stderr
* changed files
* duration
* success/failure

Do not use arbitrary shell execution.

Use controlled argument lists.

---

# 12. AI Coding Executor

The AI executor is provider-neutral.

It should receive:

```text
Migration Task
+
Relevant Repository Context
+
Migration Rules
+
Failure Information
```

It should return structured changes.

The AI model must NOT have unrestricted shell access.

Changes must pass through:

* workspace validation
* path validation
* patch validation
* authorization
* diff inspection
* build/test
* migration validation

Reject:

```text
../
.git/
secrets
credentials
outside-workspace paths
```

---

# 13. LLM Gateway

Use a provider-neutral interface:

```python
class LLMGateway(Protocol):
    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        model: str | None = None,
    ) -> LLMResponse:
        ...
```

The platform should not be architecturally tied to one model provider.

Possible providers:

```text
OpenAI
Claude
Gemini
Azure OpenAI
Enterprise-hosted models
Local models
```

The enterprise implementation should use only organization-approved providers and credentials.

---

# 14. Build and Test

Build flow:

```text
Detect Maven/Gradle
        ↓
Compile
        ↓
If successful
        ↓
Run tests
```

Prefer compile-first before the full test suite.

Capture:

* command
* exit code
* logs
* duration
* status

Test runner captures:

* total
* passed
* failed
* skipped
* duration
* report location

After a repair:

```text
Build
 ↓
Affected tests
 ↓
Full test suite
```

Do not claim migration success based solely on LLM confidence.

---

# 15. Failure Model

Example:

```python
class Failure(BaseModel):
    id: str
    type: Literal[
        "COMPILATION",
        "TEST",
        "DEPENDENCY",
        "CONFIGURATION",
        "RUNTIME",
        "UNKNOWN"
    ]
    file: str | None
    line: int | None
    message: str
    raw_log: str | None
```

Failure cluster:

```python
class FailureCluster(BaseModel):
    id: str
    category: str
    rootCause: str
    failures: list[str]
    suggestedAction: str
    confidence: float
```

Important:

> The objective is root-cause repair, not error-count reduction.

---

# 16. Validation

Validation must be deterministic wherever possible.

Checks include:

### Build

```text
Build passes
```

### Tests

```text
Required tests pass
```

### Target versions

```text
Target Java version present
Target Spring Boot version present
Target dependencies present
```

### Forbidden/deprecated items

```text
Deprecated dependencies absent
Forbidden APIs absent
Old namespace absent
```

### Configuration

Required migration configuration exists.

### Diff/risk

Ensure the actual changes are within the approved migration scope.

### Approval

Ensure required approvals exist.

LLM confidence is not proof.

---

# 17. Database Model

Distinguish:

```text
Migration
```

from:

```text
MigrationRun
```

because one migration may have multiple attempts.

Example:

```text
Migration
 ├── Run #1 → FAILED
 └── Run #2 → COMPLETED
```

Core entities:

```text
Migration
MigrationRun
Repository
MigrationTask
Workspace
BuildRun
TestRun
Approval
MigrationEvent
```

Important Migration fields:

```text
id
name
status
source_java
source_spring_boot
source_spring_security
target_java
target_spring_boot
target_spring_security
requirements_json
specification_json
repository_manifest_json
plan_json
created_at
updated_at
```

---

# 18. API

Primary APIs:

```text
POST /api/v1/migrations
GET  /api/v1/migrations/{id}

POST /api/v1/migrations/{id}/start
GET  /api/v1/migrations/{id}/runs

POST /api/v1/migrations/{id}/interview
POST /api/v1/migrations/{id}/analyze
POST /api/v1/migrations/{id}/plan
POST /api/v1/migrations/{id}/approve
POST /api/v1/migrations/{id}/execute

POST /api/v1/migrations/{id}/build
POST /api/v1/migrations/{id}/analyze-failures
POST /api/v1/migrations/{id}/validate

POST /api/v1/migrations/{id}/repair-plan
POST /api/v1/migrations/{id}/pull-request

POST /api/v1/migrations/{id}/repository

POST /api/v1/migrations/{id}/approvals
GET  /api/v1/migrations/{id}/approvals

POST /api/v1/approvals/{approvalId}/resolve

GET /api/v1/migrations/{id}/events

GET /api/v1/migrations/{id}/observability/llm
GET /api/v1/migrations/{id}/observability/metrics
```

Long-running migrations must not depend on FastAPI `BackgroundTasks`.

---

# 19. Worker Architecture

Use a queue:

```text
Next.js
   ↓
FastAPI
   ↓
MigrationRun
   ↓
Redis Queue
   ↓
Migration Worker
   ↓
Orchestrator
```

Start API:

```text
uvicorn
```

Worker:

```text
python -m app.worker
```

Infrastructure:

```text
docker compose up -d
```

Queue should eventually support:

```text
pause
resume
cancel
retry
progress events
recovery
```

---

# 20. Human Approval and Audit

High-risk operations require explicit approval.

Approval model includes:

```text
id
migration_id
task_id
type
status
requested_by
approved_by
reason
created_at
resolved_at
```

Approval APIs:

```text
POST /api/v1/migrations/{migration_id}/approvals
GET  /api/v1/migrations/{migration_id}/approvals

POST /api/v1/approvals/{approval_id}/resolve
```

Audit events:

```text
MigrationEvent
```

Every important action should eventually be auditable.

---

# 21. Git and Pull Request Delivery

Git should be provider-neutral.

```text
GitService
 ├── create_branch
 ├── commit
 └── push
```

PR service:

```text
PullRequestService
 ├── GitHub
 ├── GitLab
 ├── Bitbucket
 └── Azure DevOps
```

Only create the PR after:

```text
VALIDATED
```

PR body should contain:

* migration summary
* source/target versions
* migration tasks
* changes
* validation results
* repair iterations
* approvals
* risk information

Never store raw credentials.

Use organization-approved secret management.

---

# 22. Security / RBAC

Foundation should support:

```text
Organization
Users
Roles
```

Roles:

```text
ADMIN
MIGRATION_MANAGER
DEVELOPER
REVIEWER
VIEWER
```

Current security foundation includes:

* JWT authentication
* password hashing
* tenant isolation
* authorization checks
* approval authorization
* migration authorization

Auth APIs:

```text
POST /api/v1/auth/bootstrap
POST /api/v1/auth/login
POST /api/v1/auth/users
```

Production direction:

```text
OIDC / SSO
Enterprise identity provider
Secret manager
SAST
Dependency scanning
Secret scanning
Container scanning
Network policies
```

Do not consider local JWT/password auth production-ready enterprise identity.

---

# 23. Secure Execution / Sandbox

Every migration/run should have an isolated workspace.

Controls:

```text
Path traversal protection
Executable allowlist
No arbitrary shell commands
Restricted environment
Execution timeout
Resource limits
```

Docker sandbox direction:

```text
Network disabled by default
Read-only root filesystem
Temporary writable volume
CPU limit
Memory limit
PID limit
Execution timeout
```

Current target defaults:

```text
Network: OFF
Memory: 2 GB
CPU: 2
PIDs: 256
Timeout: 30 minutes
```

Production isolation must still be independently validated and hardened.

---

# 24. Observability

Every operation should be traceable with:

```text
organizationId
migrationId
runId
taskId
```

LLM telemetry:

```text
provider
model
prompt version
migrationId
runId
taskId
input tokens
output tokens
latency
status
retry count
```

Execution telemetry:

```text
task duration
build duration
test duration
repair count
changed files
failure count
```

Limits:

```text
max repair attempts
max AI tasks
max LLM calls
max execution time
max workspace size
```

Potential OpenTelemetry integration.

Current observability should be treated as foundation until verified end-to-end.

---

# 25. Next.js Dashboard

Dashboard concept:

```text
Migration Control Room
```

Should display:

* migration status
* workflow timeline
* current stage
* run/attempt
* approvals
* task list
* executor
* risk
* AI call count
* repository information
* build status
* test status
* validation
* failure clusters
* repair attempts
* event stream
* LLM telemetry

The UI should consume the API rather than rely on mock-only state.

Future:

```text
SSE
WebSockets
real-time events
```

---

# 26. IMPLEMENTATION STATUS — HONEST BASELINE

Previously generated architecture/code contains a substantial platform foundation.

Do NOT assume every component is production-complete.

Approximate conceptual status from previous development:

```text
Architecture/platform foundation      ~90%
Production implementation              ~55–65%
Real migration capability              ~30–40%
```

These are informal estimates, not measured engineering metrics.

The most important next activity is NOT creating more abstract architecture.

The most important next activity is:

> Prove the system against a real Java repository.

---

# 27. PREVIOUSLY ESTABLISHED TECHNICAL PROGRESSION — STEPS 21–30

The following represents the intended continuation of the project. Treat these as the previously established development sequence/context, not as permission to blindly assume every item has already been implemented.

## Step 21 — Real Repository Integration

Move from synthetic/demo repository behavior to an actual Java repository.

First target:

```text
Small/medium Maven Spring Boot application
```

Prefer a safe sample/open-source repository approved for development.

Prove:

```text
clone
 ↓
analyze
 ↓
manifest
 ↓
migration specification
 ↓
migration plan
```

Do not begin with a huge enterprise monolith.

Success criteria:

* repository is detected
* Maven/Gradle detected
* Java version detected
* Spring versions detected
* dependencies detected
* tests detected
* configuration detected
* migration manifest is persisted

---

## Step 22 — Real OpenRewrite Execution

Execute an actual OpenRewrite migration against the test repository.

Example:

```text
Java migration recipe
```

or:

```text
Spring migration recipe
```

Prove:

```text
repository
 ↓
workspace
 ↓
OpenRewrite
 ↓
changed files
 ↓
diff
```

Capture:

* command
* exit code
* logs
* changed files
* duration

The platform must not merely claim OpenRewrite support.

Actually run it.

---

## Step 23 — Real Build/Test Loop

After transformation:

```text
compile
 ↓
test
 ↓
collect failures
```

Integrate actual Maven/Gradle execution.

The platform should recognize:

```text
BUILD SUCCESS
BUILD FAILURE
TEST FAILURE
```

and persist results.

---

## Step 24 — Failure Clustering and Repair

Introduce the real failure-analysis loop.

Example:

```text
Build
 ↓
100 compilation errors
 ↓
Failure Analyzer
 ↓
5 root-cause clusters
 ↓
Repair Plan
 ↓
Controlled changes
 ↓
Build again
```

Do not ask an AI agent to fix the entire repository blindly.

Repair should be:

```text
bounded
structured
auditable
repeatable
```

Maximum repair attempts:

```text
3
```

After the limit:

```text
BLOCKED
```

---

## Step 25 — AI Coding Executor

Connect the provider-neutral AI coding executor to an approved model/provider.

The AI should receive only relevant context.

Example:

```text
Task:
Migrate deprecated API

Context:
affected source files
relevant symbols
migration rule
build failure
```

The model returns structured changes.

The execution service applies and validates them.

The model must not receive unrestricted shell access.

---

## Step 26 — Migration Validation Engine

Build migration-specific validation.

Examples:

### Java

```text
Expected Java version = 17
```

### Spring Boot

```text
Expected Spring Boot = 3.x
```

### Namespace

```text
No javax.* references where migration requires jakarta.*
```

### Dependency

```text
Old dependency absent
Target dependency present
```

### Build

```text
Build succeeds
```

### Tests

```text
Required tests pass
```

### Diff

```text
Changes remain inside approved scope
```

Validation must produce structured results.

---

## Step 27 — Human Approval Integration

Connect approval requirements directly to execution.

Example:

```text
Planner
 ↓
Task marked HIGH risk
 ↓
Approval requested
 ↓
Migration pauses
 ↓
Human approves
 ↓
Executor allowed
```

The executor must reject:

```text
HIGH/CRITICAL task
+
required approval missing
```

Do not rely solely on the UI to enforce approval.

The backend/execution layer must enforce it.

---

## Step 28 — Secure Enterprise Execution

Harden the execution environment.

Implement/test:

```text
workspace isolation
path protection
command allowlist
network restrictions
resource limits
timeouts
secret protection
```

Then verify the controls through tests.

Security should be enforced server-side.

Never trust:

```text
UI
agent
LLM
user-supplied task
```

as the security boundary.

---

## Step 29 — Git/PR and End-to-End Migration

Prove the complete workflow:

```text
Repository
 ↓
Analyze
 ↓
Plan
 ↓
Approval
 ↓
Workspace
 ↓
Transform
 ↓
Build
 ↓
Test
 ↓
Failure analysis
 ↓
Repair
 ↓
Validate
 ↓
Branch
 ↓
Commit
 ↓
Push
 ↓
PR
```

The PR must include meaningful migration metadata.

Do not create a PR when validation has failed.

---

## Step 30 — Production-Readiness / Real Repository Validation

Once the complete workflow works against a controlled Java repository:

Test progressively larger/realistic repositories.

Test categories:

```text
Simple Maven project
Spring Boot application
Multi-module Maven project
Gradle project
Spring Security application
JPA/Hibernate application
Application with configuration migration
Application with tests
Application with intentional migration failures
```

Measure:

```text
migration success rate
build repair rate
test repair rate
human intervention rate
AI usage
LLM cost
execution time
changed files
rollback rate
false-positive validation
failure categories
```

Only after these measurements should architecture changes be considered.

---

# 28. What NOT To Do

Do not:

```text
restart architecture
replace FastAPI without a concrete reason
replace Next.js without a concrete reason
remove the orchestrator
make the LLM the orchestrator
give agents unrestricted shell access
give agents unrestricted repository access
blindly dump repositories into LLM context
let AI make arbitrary filesystem changes
allow unlimited repair loops
claim migration success from LLM confidence
skip build/test validation
skip human approval for high-risk changes
store secrets in code
hardcode provider credentials
couple the platform to one LLM provider
```

---

# 29. What To Prioritize

Priority order:

```text
1. Real repository analysis
2. Real OpenRewrite execution
3. Real build/test execution
4. Failure clustering
5. Controlled AI repair
6. Deterministic validation
7. Approval enforcement
8. Secure workspace
9. Git/PR
10. End-to-end proof
11. Observability
12. Scale/performance
13. Additional migration families
```

Do not spend the next development cycle polishing UI while the actual migration engine remains unproven.

---

# 30. Definition of "Actually Working"

The platform should eventually be able to take:

```text
Git repository
+
source version
+
target version
+
migration requirements
```

and perform:

```text
Repository analysis
        ↓
Migration plan
        ↓
Human approval
        ↓
Isolated workspace
        ↓
Deterministic transformations
        ↓
AI-assisted transformations when necessary
        ↓
Build
        ↓
Test
        ↓
Failure analysis
        ↓
Bounded repair
        ↓
Rebuild/Test
        ↓
Validation
        ↓
Human-reviewable diff
        ↓
Git branch/commit
        ↓
Pull Request
```

The result must be:

```text
SUCCESS
```

only when the deterministic validation criteria are satisfied.

Otherwise:

```text
BLOCKED / FAILED
```

with a useful explanation.

---

# 31. Immediate Next Action

Do NOT implement another abstract subsystem immediately.

First inspect the current repository.

Produce a report:

```text
CURRENT IMPLEMENTATION AUDIT

1. Backend
   - implemented
   - partial
   - stubbed
   - missing

2. Dashboard
   - implemented
   - partial
   - stubbed
   - missing

3. Database
   - implemented
   - migrations
   - missing

4. Authentication/RBAC
   - implemented
   - production gaps

5. Orchestrator
   - implemented
   - missing

6. Repository intelligence
   - implemented
   - missing

7. OpenRewrite
   - implemented
   - actually executable?
   
8. Build/test
   - implemented
   - actually executable?

9. AI executor
   - interface
   - real provider

10. Failure analyzer
11. Repair loop
12. Validation
13. Approval enforcement
14. Sandbox
15. Git/PR
16. Observability
17. Dashboard
```

Then identify the **first real end-to-end milestone**.

Do not write large amounts of code until this audit is complete.

---

# 32. Development Method

For every major feature:

```text
Understand
 ↓
Inspect existing implementation
 ↓
Implement smallest useful version
 ↓
Unit test
 ↓
Integration test
 ↓
Run against real repository
 ↓
Inspect logs/diff
 ↓
Fix
 ↓
Document
```

Avoid:

```text
Generate hundreds of files
 ↓
Assume they work
 ↓
Move to next architecture stage
```

The platform must be proven incrementally.

---

# 33. Agent Collaboration Model

The coding agent may use its own reasoning and available coding tools.

However, maintain this conceptual separation:

```text
Claude Code / Copilot
        ↓
Development assistant
```

versus:

```text
Migration Platform
        ↓
Runtime agentic system
```

The fact that Claude Code or Copilot is used to DEVELOP this platform does not mean the final platform should depend on Claude Code/Copilot as its runtime architecture.

The runtime platform should retain the provider-neutral:

```text
LLM Gateway
AI Coding Executor
```

interfaces.

---

# 34. Enterprise Constraints

Assume the final platform will operate in an enterprise environment.

Therefore design for:

```text
SSO
RBAC
tenant isolation
audit
approval
secret management
network restrictions
sandboxing
observability
policy enforcement
repository permissions
data governance
```

Do not assume personal developer credentials or local machine access are acceptable in production.

Use organization-approved:

* repositories
* model providers
* package registries
* secret stores
* CI/CD
* containers
* infrastructure

---

# 35. Current Strategic Direction

The project is now focused on:

> Building the actual migration platform.

Do not spend time on:

* startup positioning
* sales pitch
* competitor slides
* presentation decks
* market messaging

unless explicitly requested later.

Technical correctness and real repository validation are the current priorities.

---

# 36. Final Instruction to the Next Agent

You are not starting from zero.

The architecture has already been reasoned through.

Your job is now to:

```text
INSPECT
→ VERIFY
→ IMPLEMENT
→ TEST
→ PROVE
→ ITERATE
```

The most important question is no longer:

> "What architecture should we build?"

It is:

> "Can this platform successfully migrate a real Java repository, explain what it changed, repair failures safely, validate the result, and produce a reviewable PR?"

Work toward proving that capability incrementally.
