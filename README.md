# AI-DLC (AI-Driven Development Life Cycle)

AI-DLC is an intelligent software development workflow that adapts to your needs, maintains quality standards, and keeps you in control of the process. For learning more about AI-DLC Methodology, read this [blog](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/) and the [Method Definition Paper](https://prod.d13rzhkk8cj2z0.amplifyapp.com/) referred in it.

## Table of Contents

- [Tenets](#tenets)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Platform-Specific Setup](#platform-specific-setup)
  - [Amazon Q Developer IDE Plugin](#amazon-q-developer-ide-pluginextension)
  - [Kiro CLI](#kiro-cli-formerly-amazon-q-cli)
  - [Cursor IDE](#cursor-ide)
  - [Cline](#cline)
  - [Claude Code](#claude-code)
  - [GitHub Copilot](#github-copilot)
- [Usage](#usage)
- [Three-Phase Adaptive Workflow](#three-phase-adaptive-workflow)
- [Key Features](#key-features)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

---

## Tenets

These are our core principles to guide our decision making.

- **No duplication**. The source of truth lives in one place. If we add support for new tools or formats that require specific files, we generate them from the source rather than maintaining separate copies.

- **Methodology first**. AI-DLC is fundamentally a methodology, not a tool. Users shouldn't need to install anything to get started. That said, we're open to convenience tooling (scripts, CLIs) down the road if it helps users adopt or extend the methodology.

- **Reproducible**. Rules should be clear enough that different models produce similar outcomes. We know models behave differently, but the methodology should minimize variance through explicit guidance.

- **Agnostic**. The methodology works with any IDE, agent, or model. We don't tie ourselves to specific tools or vendors.

- **Human in the loop**. Critical decisions require explicit user confirmation. The agent proposes, the human approves.

---

## Prerequisites

Have one of our supported platforms/tools for Assisted AI Coding installed:

| Platform | Installation Link |
|----------|------------------|
| Kiro | [Install](https://kiro.dev/) |
| Kiro CLI | [Install](https://kiro.dev/cli/) |
| Amazon Q Developer IDE Plugin | [Install](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-in-IDE.html) |
| Cursor IDE | [Install](https://cursor.com/) |
| Cline VS Code Extension | [Install](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) |
| Claude Code CLI | [Install](https://github.com/anthropics/claude-code) |
| GitHub Copilot | [Install](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) + [Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) |


---

## Get the AIDLC

### From Packaged Zip

1. Download the latest release zip from the [Releases page](../../releases/latest) to a folder **outside** your project directory (e.g., `~/Downloads`).
2. Extract the zip. It contains an `aidlc-rules/` folder with two subdirectories:
   - `aws-aidlc-rules/` — the core AI-DLC workflow rules
   - `aws-aidlc-rule-details/` — supporting documents referenced by the rules
3. Copy both folders into your project, following the setup for your platform below.

> **Note**: The extracted folder may contain a top-level directory (e.g., `aidlc-workflows-0.1.0/`). Navigate into it first so that `aidlc-rules/` is directly accessible.

---

### Clone from Repository

#### Step 1: Clone this Repository

```bash
git clone <this-repo>
```

#### Step 2: Create a New Project Folder

**Unix/Linux/macOS:**
```bash
mkdir <my-project>
cd <my-project>
```

**Windows PowerShell:**
```powershell
New-Item -ItemType Directory -Name "<my-project>"
Set-Location "<my-project>"
```

**Windows CMD:**
```cmd
mkdir <my-project>
cd <my-project>
```

#### Step 3: Follow Platform-Specific Setup

Choose your platform below and follow the setup instructions.

---

## Platform-Specific Setup

---

### Amazon Q Developer IDE Plugin/Extension

AI-DLC uses [Amazon Q Rules](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/context-project-rules.html) to implement its intelligent workflow.

**Unix/Linux/macOS:**
```bash
mkdir -p .amazonq/rules 
cp -R ../aidlc-workflows/aidlc-rules/aws-aidlc-rules .amazonq/rules/ 
mkdir -p .aidlc-rule-details
cp -R ../aidlc-workflows/aidlc-rules/aws-aidlc-rule-details/* .aidlc-rule-details/
```

**Windows PowerShell:**
```powershell
New-Item -ItemType Directory -Force -Path ".amazonq\rules"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules" ".amazonq\rules\" -Recurse
New-Item -ItemType Directory -Force -Path ".aidlc-rule-details"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details\*" ".aidlc-rule-details\" -Recurse
```

**Windows CMD:**
```cmd
mkdir .amazonq\rules
xcopy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules" ".amazonq\rules\" /E /I
mkdir .aidlc-rule-details
xcopy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details" ".aidlc-rule-details\" /E /I
```

**Verify Setup:**
1. In the Amazon Q Chat window, locate the `Rules` button in the lower right corner
2. Verify that you see entries for `.amazonq/rules/aws-aidlc-rules` in the displayed list

![AI-DLC Rules in Q Developer IDE](./assets/images/q-ide-aidlc-rules-loaded.png?raw=true "AI-DLC Rules in Q Developer")

**Directory Structure:**
```
<my-project>/
├── .amazonq/
│   └── rules/
│       └── aws-aidlc-rules/
│           └── core-workflow.md
└── .aidlc-rule-details/
    ├── common/
    ├── inception/
    ├── construction/
    └── operations/
```

---

### Kiro CLI (formerly Amazon Q CLI)

AI-DLC uses [Kiro Steering Files](https://kiro.dev/docs/cli/steering/) to implement its intelligent workflow.

**Unix/Linux/macOS:**
```bash
mkdir -p .kiro/steering
cp -R ../aidlc-workflows/aidlc-rules/aws-aidlc-rules .kiro/steering/
mkdir -p .aidlc-rule-details
cp -R ../aidlc-workflows/aidlc-rules/aws-aidlc-rule-details/* .aidlc-rule-details/
```

**Windows PowerShell:**
```powershell
New-Item -ItemType Directory -Force -Path ".kiro\steering"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules" ".kiro\steering\" -Recurse
New-Item -ItemType Directory -Force -Path ".aidlc-rule-details"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details\*" ".aidlc-rule-details\" -Recurse
```

**Windows CMD:**
```cmd
mkdir .kiro\steering
xcopy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules" ".kiro\steering\" /E /I
mkdir .aidlc-rule-details
xcopy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details" ".aidlc-rule-details\" /E /I
```

**Verify Setup:**
1. Start Kiro CLI: `kiro-cli`
2. Check your context contents: `/context show`
3. Verify that you see all entries for `.kiro/steering/aws-aidlc-rules`

![AI-DLC Rules in Kiro CLI](./assets/images/kiro-cli-aidlc-rules-loaded.png?raw=true "AI-DLC Rules in Kiro CLI")

**Directory Structure:**
```
<my-project>/
├── .kiro/
│   └── steering/
│       └── aws-aidlc-rules/
│           └── core-workflow.md
└── .aidlc-rule-details/
    ├── common/
    ├── inception/
    ├── construction/
    └── operations/
```

---

### Cursor IDE

AI-DLC uses [Cursor Rules](https://cursor.com/docs/context/rules) to implement its intelligent workflow.

#### Option 1: Project Rules (Recommended)

**Unix/Linux/macOS:**
```bash
# Create .cursor/rules directory
mkdir -p .cursor/rules

# Create .mdc file with frontmatter and workflow content
cat > .cursor/rules/ai-dlc-workflow.mdc << 'EOF'
---
description: "AI-DLC (AI-Driven Development Life Cycle) adaptive workflow for software development"
alwaysApply: true
---

EOF
cat ../aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md >> .cursor/rules/ai-dlc-workflow.mdc

# Copy rule details to .aidlc-rule-details (loaded on-demand by the workflow)
mkdir -p .aidlc-rule-details
cp -R ../aidlc-workflows/aidlc-rules/aws-aidlc-rule-details/* .aidlc-rule-details/
```

**Windows PowerShell:**
```powershell
# Create .cursor/rules directory
New-Item -ItemType Directory -Force -Path ".cursor\rules"

# Create frontmatter and write to .mdc file
$frontmatter = @"
---
description: "AI-DLC (AI-Driven Development Life Cycle) adaptive workflow for software development"
alwaysApply: true
---

"@
$frontmatter | Out-File -FilePath ".cursor\rules\ai-dlc-workflow.mdc" -Encoding utf8

# Append core workflow content to .mdc file
Get-Content "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" | Add-Content ".cursor\rules\ai-dlc-workflow.mdc"

# Copy rule details to .aidlc-rule-details (loaded on-demand by the workflow)
New-Item -ItemType Directory -Force -Path ".aidlc-rule-details"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details\*" ".aidlc-rule-details\" -Recurse
```

**Windows CMD:**
```cmd
REM Create .cursor/rules directory
mkdir .cursor\rules

REM Create frontmatter in .mdc file
(
echo ---
echo description: "AI-DLC (AI-Driven Development Life Cycle) adaptive workflow for software development"
echo alwaysApply: true
echo ---
echo.
) > .cursor\rules\ai-dlc-workflow.mdc

REM Append core workflow content to .mdc file
type "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" >> .cursor\rules\ai-dlc-workflow.mdc

REM Copy rule details to .aidlc-rule-details (loaded on-demand by the workflow)
mkdir .aidlc-rule-details
xcopy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details" ".aidlc-rule-details\" /E /I
```

#### Option 2: AGENTS.md (Simple Alternative)

**Unix/Linux/macOS:**
```bash
cp ../aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md ./AGENTS.md
mkdir -p .aidlc-rule-details
cp -R ../aidlc-workflows/aidlc-rules/aws-aidlc-rule-details/* .aidlc-rule-details/
```

**Windows PowerShell:**
```powershell
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".\AGENTS.md"
New-Item -ItemType Directory -Force -Path ".aidlc-rule-details"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details\*" ".aidlc-rule-details\" -Recurse
```

**Windows CMD:**
```cmd
copy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".\AGENTS.md"
mkdir .aidlc-rule-details
xcopy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details" ".aidlc-rule-details\" /E /I
```

**Verify Setup:**
1. Open **Cursor Settings → Rules, Commands**
2. Under **Project Rules**, you should see `ai-dlc-workflow` listed
3. For `AGENTS.md`, it will be automatically detected and applied

![AI-DLC Rules in Cursor](./assets/images/cursor-ide-aidlc-rules-loaded.png?raw=true "AI-DLC Rules in Cursor")

**Directory Structure (Option 1):**
```
<my-project>/
├── .cursor/
│   └── rules/
│       └── ai-dlc-workflow.mdc
└── .aidlc-rule-details/
    ├── common/
    ├── inception/
    ├── construction/
    └── operations/
```

---

### Cline

AI-DLC uses Cline Rules to implement its intelligent workflow.

#### Option 1: .clinerules Directory (Recommended)

**Unix/Linux/macOS:**
```bash
mkdir -p .clinerules
cp ../aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md .clinerules/
mkdir -p .aidlc-rule-details
cp -R ../aidlc-workflows/aidlc-rules/aws-aidlc-rule-details/* .aidlc-rule-details/
```

**Windows PowerShell:**
```powershell
New-Item -ItemType Directory -Force -Path ".clinerules"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".clinerules\"
New-Item -ItemType Directory -Force -Path ".aidlc-rule-details"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details\*" ".aidlc-rule-details\" -Recurse
```

**Windows CMD:**
```cmd
mkdir .clinerules
copy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".clinerules\"
mkdir .aidlc-rule-details
xcopy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details" ".aidlc-rule-details\" /E /I
```

#### Option 2: AGENTS.md (Alternative)

**Unix/Linux/macOS:**
```bash
cp ../aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md ./AGENTS.md
mkdir -p .aidlc-rule-details
cp -R ../aidlc-workflows/aidlc-rules/aws-aidlc-rule-details/* .aidlc-rule-details/
```

**Windows PowerShell:**
```powershell
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".\AGENTS.md"
New-Item -ItemType Directory -Force -Path ".aidlc-rule-details"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details\*" ".aidlc-rule-details\" -Recurse
```

**Windows CMD:**
```cmd
copy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".\AGENTS.md"
mkdir .aidlc-rule-details
xcopy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details" ".aidlc-rule-details\" /E /I
```

**Verify Setup:**
1. In Cline's chat interface, look for the Rules popover under the chat input field
2. Verify that `core-workflow.md` is listed and active
3. You can toggle the rule file on/off as needed

![AI-DLC Rules in Cline](./assets/images/cline-ide-aidlc-rules-loaded.png?raw=true "AI-DLC Rules in Cline")

**Directory Structure (Option 1):**
```
<my-project>/
├── .clinerules/
│   └── core-workflow.md
└── .aidlc-rule-details/
    ├── common/
    ├── inception/
    ├── construction/
    └── operations/
```

---

### Claude Code

AI-DLC uses Claude Code's project memory file (`CLAUDE.md`) to implement its intelligent workflow.

#### Option 1: Project Root (Recommended)

**Unix/Linux/macOS:**
```bash
cp ../aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md ./CLAUDE.md
mkdir -p .aidlc-rule-details
cp -R ../aidlc-workflows/aidlc-rules/aws-aidlc-rule-details/* .aidlc-rule-details/
```

**Windows PowerShell:**
```powershell
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".\CLAUDE.md"
New-Item -ItemType Directory -Force -Path ".aidlc-rule-details"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details\*" ".aidlc-rule-details\" -Recurse
```

**Windows CMD:**
```cmd
copy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".\CLAUDE.md"
mkdir .aidlc-rule-details
xcopy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details" ".aidlc-rule-details\" /E /I
```

#### Option 2: .claude Directory

**Unix/Linux/macOS:**
```bash
mkdir -p .claude
cp ../aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md .claude/CLAUDE.md
mkdir -p .aidlc-rule-details
cp -R ../aidlc-workflows/aidlc-rules/aws-aidlc-rule-details/* .aidlc-rule-details/
```

**Windows PowerShell:**
```powershell
New-Item -ItemType Directory -Force -Path ".claude"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".claude\CLAUDE.md"
New-Item -ItemType Directory -Force -Path ".aidlc-rule-details"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details\*" ".aidlc-rule-details\" -Recurse
```

**Windows CMD:**
```cmd
mkdir .claude
copy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".claude\CLAUDE.md"
mkdir .aidlc-rule-details
xcopy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details" ".aidlc-rule-details\" /E /I
```

**Verify Setup:**
1. Start Claude Code in your project directory (CLI: `claude` or VS Code extension)
2. Use the `/config` command to view current configuration
3. Ask Claude: "What instructions are currently active in this project?"

**Directory Structure (Option 1):**
```
<my-project>/
├── CLAUDE.md
└── .aidlc-rule-details/
    ├── common/
    ├── inception/
    ├── construction/
    └── operations/
```

---

### GitHub Copilot

AI-DLC uses project context files and Copilot's Chat capabilities to implement its intelligent workflow.

#### Option 1: .copilot Directory (Recommended)

**Unix/Linux/macOS:**
```bash
mkdir -p .copilot
cp ../aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md .copilot/instructions.md
mkdir -p .aidlc-rule-details
cp -R ../aidlc-workflows/aidlc-rules/aws-aidlc-rule-details/* .aidlc-rule-details/
```

**Windows PowerShell:**
```powershell
New-Item -ItemType Directory -Force -Path ".copilot"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".copilot\instructions.md"
New-Item -ItemType Directory -Force -Path ".aidlc-rule-details"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details\*" ".aidlc-rule-details\" -Recurse
```

**Windows CMD:**
```cmd
mkdir .copilot
copy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".copilot\instructions.md"
mkdir .aidlc-rule-details
xcopy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details" ".aidlc-rule-details\" /E /I
```

#### Option 2: Project Root COPILOT.md

**Unix/Linux/macOS:**
```bash
cp ../aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md ./COPILOT.md
mkdir -p .aidlc-rule-details
cp -R ../aidlc-workflows/aidlc-rules/aws-aidlc-rule-details/* .aidlc-rule-details/
```

**Windows PowerShell:**
```powershell
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".\COPILOT.md"
New-Item -ItemType Directory -Force -Path ".aidlc-rule-details"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details\*" ".aidlc-rule-details\" -Recurse
```

**Windows CMD:**
```cmd
copy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".\COPILOT.md"
mkdir .aidlc-rule-details
xcopy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details" ".aidlc-rule-details\" /E /I
```

**Verify Setup:**
1. Open VS Code with your project folder
2. Open the Copilot Chat panel (Cmd/Ctrl+Shift+I)
3. Reference the instructions by typing `#file .copilot/instructions.md` or `#file COPILOT.md` in the chat

**Directory Structure (Option 1):**
```
<my-project>/
├── .copilot/
│   └── instructions.md
└── .aidlc-rule-details/
    ├── common/
    ├── inception/
    ├── construction/
    └── operations/
```

---

## Usage

1. Start any software development project by stating your intent starting with the phrase **"Using AI-DLC, ..."** in the chat
2. AI-DLC workflow automatically activates and guides you from there
3. Answer structured questions that AI-DLC asks you
4. Carefully review every plan that AI generates. Provide your oversight and validation
5. Review the execution plan to see which stages will run
6. Carefully review the artifacts and approve each stage to maintain control
7. All the artifacts will be generated in the `aidlc-docs/` directory

---

## Three-Phase Adaptive Workflow

AI-DLC follows a structured three-phase approach that adapts to your project's complexity:

### 🔵 INCEPTION PHASE
Determines **WHAT** to build and **WHY**
- Requirements analysis and validation
- User story creation (when applicable)
- Application Design and creating units of work for parallel development
- Risk assessment and complexity evaluation

### 🟢 CONSTRUCTION PHASE
Determines **HOW** to build it
- Detailed component design
- Code generation and implementation
- Build configuration and testing strategies
- Quality assurance and validation

### 🟡 OPERATIONS PHASE
Deployment and monitoring (future)
- Deployment automation and infrastructure
- Monitoring and observability setup
- Production readiness validation

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Adaptive Intelligence** | Only executes stages that add value to your specific request |
| **Context-Aware** | Analyzes existing codebase and complexity requirements |
| **Risk-Based** | Complex changes get comprehensive treatment, simple changes stay efficient |
| **Question-Driven** | Structured multiple-choice questions in files, not chat |
| **Always in Control** | Review execution plans and approve each phase |

---

## Troubleshooting

### General Issues

| Problem | Solution |
|---------|----------|
| Rules not loading | Check file exists in the correct location for your platform |
| File encoding issues | Ensure files are UTF-8 encoded |
| Rules not applied in session | Start a new chat session after file changes |
| Rule details not loading | Verify `.aidlc-rule-details/` exists with subdirectories |

### Platform-Specific Issues

#### Amazon Q Developer / Kiro CLI
- Use `/context show` to verify rules are loaded
- Check `.amazonq/rules/` or `.kiro/steering/` directory structure

#### Cursor
- For "Apply Intelligently", ensure a description is defined in frontmatter
- Check **Cursor Settings → Rules** to ensure the rule is enabled
- If rule is too large (>500 lines), split into multiple focused rules

#### Cline
- Check the Rules popover under the chat input field
- Toggle rule files on/off as needed using the popover UI

#### Claude Code
- Use `/config` command to view current configuration
- Ask "What instructions are currently active in this project?"

#### GitHub Copilot
- Use `#file <path>` syntax to reference instruction files
- For large instructions, reference specific rule detail files instead of pasting everything

### File Path Issues on Windows
- Use forward slashes `/` in file paths within markdown files
- Windows paths with backslashes may not work correctly

---

## Version Control Recommendations

**Commit to repository:**
```gitignore
# These should be version controlled
CLAUDE.md
COPILOT.md
AGENTS.md
.amazonq/rules/
.kiro/steering/
.cursor/rules/
.clinerules/
.copilot/
.aidlc-rule-details/
```

**Optional - Add to `.gitignore` (if needed):**
```gitignore
# Local-only settings
.claude/settings.local.json
.copilot/context/
```

---

## Additional Resources

| Resource | Link |
|----------|------|
| AI-DLC Methodology Blog | [AWS Blog](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/) |
| AI-DLC Method Definition Paper | [Paper](https://prod.d13rzhkk8cj2z0.amplifyapp.com/) |
| Amazon Q Developer Documentation | [Docs](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-in-IDE.html) |
| Kiro CLI Documentation | [Docs](https://kiro.dev/docs/cli/steering/) |
| Cursor Rules Documentation | [Docs](https://cursor.com/docs/context/rules) |
| Claude Code Documentation | [GitHub](https://github.com/anthropics/claude-code) |
| GitHub Copilot Documentation | [Docs](https://docs.github.com/en/copilot) |
| Contributing Guidelines | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Code of Conduct | [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) |

---

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.