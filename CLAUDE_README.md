# AI-DLC for Claude Code

AI-DLC is an intelligent software development workflow that adapts to your needs, maintains quality standards, and keeps you in control of the process. This guide shows how to set up AI-DLC with Claude Code.

## Prerequisites

- [Claude Code CLI](https://github.com/anthropics/claude-code)
- VS Code or compatible editor (for the Claude Code VS Code extension)

## Quick Start

Clone this repo:
```bash
git clone <this-repo>
```

Create a new project folder:

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

### Claude Code Setup

AI-DLC uses Claude Code's project memory file (`CLAUDE.md`) to implement its intelligent workflow. Claude Code automatically loads instructions from `CLAUDE.md` in your project root or from `.claude/CLAUDE.md`.

#### Setting Up AI-DLC Rules

Copy the AI-DLC workflow to your project's workspace:

**Unix/Linux/macOS:**
```bash
# Copy core workflow to CLAUDE.md in project root
cp ../aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md ./CLAUDE.md

# Copy rule details to .aidlc-rule-details (loaded on-demand by the workflow)
mkdir -p .aidlc-rule-details
cp -R ../aidlc-workflows/aidlc-rules/aws-aidlc-rule-details/* .aidlc-rule-details/
```

**Windows PowerShell:**
```powershell
# Copy core workflow to CLAUDE.md in project root
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".\CLAUDE.md"

# Copy rule details to .aidlc-rule-details (loaded on-demand by the workflow)
New-Item -ItemType Directory -Force -Path ".aidlc-rule-details"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details\*" ".aidlc-rule-details\" -Recurse
```

**Windows CMD:**
```cmd
REM Copy core workflow to CLAUDE.md in project root
copy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".\CLAUDE.md"

REM Copy rule details to .aidlc-rule-details (loaded on-demand by the workflow)
mkdir .aidlc-rule-details
xcopy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details" ".aidlc-rule-details\" /E /I
```

### Alternative Setup: Using .claude Directory

You can also place the instructions file in the `.claude/` directory:

**Unix/Linux/macOS:**
```bash
# Create .claude directory
mkdir -p .claude

# Copy core workflow to .claude/CLAUDE.md
cp ../aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md .claude/CLAUDE.md

# Copy rule details to .aidlc-rule-details (loaded on-demand by the workflow)
mkdir -p .aidlc-rule-details
cp -R ../aidlc-workflows/aidlc-rules/aws-aidlc-rule-details/* .aidlc-rule-details/
```

**Windows PowerShell:**
```powershell
# Create .claude directory
New-Item -ItemType Directory -Force -Path ".claude"

# Copy core workflow to .claude/CLAUDE.md
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".claude\CLAUDE.md"

# Copy rule details to .aidlc-rule-details (loaded on-demand by the workflow)
New-Item -ItemType Directory -Force -Path ".aidlc-rule-details"
Copy-Item "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details\*" ".aidlc-rule-details\" -Recurse
```

**Windows CMD:**
```cmd
REM Create .claude directory
mkdir .claude

REM Copy core workflow to .claude/CLAUDE.md
copy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rules\core-workflow.md" ".claude\CLAUDE.md"

REM Copy rule details to .aidlc-rule-details (loaded on-demand by the workflow)
mkdir .aidlc-rule-details
xcopy "..\aidlc-workflows\aidlc-rules\aws-aidlc-rule-details" ".aidlc-rule-details\" /E /I
```

### Understanding the Configuration

**`CLAUDE.md` File:**
- **Purpose**: Contains project-specific instructions and memory for Claude Code
- **Location**: Place in project root (`./CLAUDE.md`) or in `.claude/CLAUDE.md`
- **Format**: Plain markdown file
- **Auto-loading**: Claude Code automatically detects and loads this file

**Directory Structure After Setup (Option 1 - Project Root):**
```
<my-project>/
├── CLAUDE.md                              # Core AI-DLC workflow (loaded at startup)
└── .aidlc-rule-details/                   # Detailed rules (loaded on-demand)
    ├── common/                            # Common rules and standards
    ├── inception/                         # Inception phase rules
    ├── construction/                      # Construction phase rules
    └── operations/                        # Operations phase rules
```

**Directory Structure After Setup (Option 2 - .claude Directory):**
```
<my-project>/
├── .claude/
│   └── CLAUDE.md                          # Core AI-DLC workflow (loaded at startup)
└── .aidlc-rule-details/                   # Detailed rules (loaded on-demand)
    ├── common/                            # Common rules and standards
    ├── inception/                         # Inception phase rules
    ├── construction/                      # Construction phase rules
    └── operations/                        # Operations phase rules
```

### Verifying Setup

To confirm that the AI-DLC rules are correctly set up:

1. **Check file structure:**
   - `CLAUDE.md` should exist in your project root OR `.claude/CLAUDE.md` should exist
   - `.aidlc-rule-details/` should contain subdirectories with detailed rule files

2. **Verify in Claude Code:**
   - Start Claude Code in your project directory (CLI: `claude` or VS Code extension)
   - Use the `/config` command to view current configuration
   - Ask Claude: "What instructions are currently active in this project?"
   - Claude should acknowledge the AI-DLC workflow

3. **Test the workflow:**
   - Start a new conversation: "Using AI-DLC, create a simple hello world application"
   - The AI-DLC workflow should activate and guide you through the process

**Why this separation?**
- **Core Workflow** (`CLAUDE.md`): Main workflow logic loaded by Claude Code at startup
- **Rule Details** (`.aidlc-rule-details/`): Detailed stage-specific instructions loaded on-demand by the workflow
- This keeps Claude Code's context lean while providing full functionality when needed

**Benefits:**
- **Project-specific**: Each project can have its own AI-DLC configuration
- **Version controlled**: `CLAUDE.md` is part of your repository
- **Simple**: Plain markdown file, no complex configuration needed
- **On-demand loading**: Detailed rules are only loaded when needed, saving context tokens
- **Auto-detected**: Claude Code automatically finds and loads `CLAUDE.md`

## Best Practices for Claude Code

### 1. Keep Instructions Focused

- Keep `CLAUDE.md` concise and actionable
- Use file references for large instruction sets
- Provide concrete examples and templates
- Avoid vague guidance - be specific about expected behaviors

### 2. Use Project Settings for Configuration

For additional configuration beyond instructions, use `.claude/settings.json`:

```json
{
  "model": "claude-sonnet-4-5",
  "maxTokens": 8192,
  "temperature": 0.7
}
```

### 3. Maintain Up-to-Date Documentation

- Regularly update `CLAUDE.md` to reflect current project decisions
- Document architectural decisions and their rationale
- Keep instructions synchronized with your team's practices

### 4. Leverage Memory Management

Claude Code maintains conversation memory. You can:
- Use `/forget` to clear specific memory
- Use `/memory` to view current memory state
- Edit `CLAUDE.md` to update persistent project instructions

### 5. Version Control Considerations

**Add to `.gitignore` (if needed):**
```gitignore
# If you have local-only settings or secrets
.claude/settings.local.json
.claude/secrets/
```

**Commit to repository:**
```gitignore
# These should be version controlled
CLAUDE.md
.claude/CLAUDE.md
.claude/settings.json
.aidlc-rule-details/
```

## Managing Custom Instructions

### Viewing Current Configuration

To view your current Claude Code configuration:

**View Instructions:**
```bash
# If using project root
cat CLAUDE.md

# If using .claude directory
cat .claude/CLAUDE.md
```

**View Settings:**
```bash
# In Claude Code CLI or VS Code extension
/config
```

This will show:
- Current configuration status
- Loaded settings from all scopes
- Permission rules
- Environment variables

### Editing Instructions

1. Edit the `CLAUDE.md` file directly:
   ```bash
   # Unix/Linux/macOS
   vim CLAUDE.md
   # or
   vim .claude/CLAUDE.md

   # Windows
   notepad CLAUDE.md
   # or
   notepad .claude\CLAUDE.md
   ```

2. Changes take effect immediately in new conversations
3. For existing conversations, Claude will use the version from when the conversation started

### Adding Supplementary Instructions

While `CLAUDE.md` contains the main AI-DLC workflow, you can reference additional guidelines within it:

```markdown
# AI-DLC Workflow

[Main workflow content here...]

## Project-Specific Guidelines

For frontend development, see: `.aidlc-rule-details/frontend-standards.md`
For backend development, see: `.aidlc-rule-details/backend-standards.md`
```

## Usage

1. Start any software development project by stating your intent starting with the phrase "Using AI-DLC, ..." in the chat
2. AI-DLC workflow automatically activates and guides you from there
3. Answer structured questions that AI-DLC asks you
4. Carefully review every plan that AI generates. Provide your oversight and validation
5. Review the execution plan to see which stages will run
6. Carefully review the artifacts and approve each stage to maintain control
7. All the artifacts will be generated in the `aidlc-docs/` directory

## Three-Phase Adaptive Workflow

AI-DLC follows a structured three-phase approach that adapts to your project's complexity:

- **🔵 INCEPTION PHASE**: Determines **WHAT** to build and **WHY**
  - Requirements analysis and validation
  - User story creation (when applicable)
  - Application Design and creating units of work for parallel development
  - Risk assessment and complexity evaluation

- **🟢 CONSTRUCTION PHASE**: Determines **HOW** to build it
  - Detailed component design
  - Code generation and implementation
  - Build configuration and testing strategies
  - Quality assurance and validation

- **🟡 OPERATIONS PHASE**: Deployment and monitoring (future)
  - Deployment automation and infrastructure
  - Monitoring and observability setup
  - Production readiness validation

## Key Features

- **Adaptive Intelligence**: Only executes stages that add value to your specific request
- **Context-Aware**: Analyzes existing codebase and complexity requirements
- **Risk-Based**: Complex changes get comprehensive treatment, simple changes stay efficient
- **Question-Driven**: Structured multiple-choice questions in files, not chat
- **Always in Control**: Review execution plans and approve each phase

## Troubleshooting

### Instructions Not Being Applied

1. **Check file exists**: Verify `CLAUDE.md` or `.claude/CLAUDE.md` exists
2. **Check file content**: Ensure the file contains the AI-DLC workflow content
3. **Ask Claude**: Use the command "What instructions are currently active?"
4. **Verify file encoding**: Ensure the file is UTF-8 encoded
5. **Start new conversation**: Instructions are loaded at conversation start

### Configuration Not Loading

1. **Use `/config` command**: View current configuration and loaded settings
2. **Check file location**: Ensure `CLAUDE.md` is in the correct location
3. **Check permissions**: Ensure Claude Code can read the file
4. **Review logs**: Check Claude Code output for any error messages

### Rule Details Not Loading

1. **Verify directory structure**: Ensure `.aidlc-rule-details/` exists with subdirectories
2. **Check file permissions**: Ensure Claude Code can read the rule detail files
3. **Review workflow references**: Ensure the core workflow correctly references rule detail paths
4. **Test manually**: Try asking Claude to read a specific rule detail file

### File Path Issues on Windows

- Use forward slashes `/` in file paths within `CLAUDE.md`:
  ```markdown
  Read the detailed requirements from: `.aidlc-rule-details/inception/requirements-analysis.md`
  ```
- Windows paths with backslashes may not work correctly in markdown

## Integration with VS Code Extension

If you're using the Claude Code VS Code extension:

1. **Open your project in VS Code**
2. **Ensure `CLAUDE.md` is in the workspace root or `.claude/` directory**
3. **Start Claude Code from the VS Code extension**
4. **Instructions will be automatically loaded**

The VS Code extension uses the same file-based configuration as the CLI.

### Checking if Instructions are Loaded

In the Claude Code VS Code extension:

1. Open Claude Code chat panel
2. Type: `/config` to view current configuration
3. Or ask: "What project instructions are currently active?"
4. Claude will confirm if `CLAUDE.md` has been loaded

## Advanced Configuration

### Multi-Project Workspaces

For VS Code multi-root workspaces, place `CLAUDE.md` in each workspace folder:

```
workspace/
├── project-a/
│   ├── CLAUDE.md
│   └── .aidlc-rule-details/
├── project-b/
│   ├── CLAUDE.md
│   └── .aidlc-rule-details/
```

Claude Code will use the instructions from the active project folder.

### Settings Hierarchy

Claude Code applies settings in this order (earlier takes precedence):

1. **Enterprise** - System-level managed settings
2. **Command-line arguments** - Temporary overrides
3. **Local project settings** (`.claude/settings.local.json`) - Personal overrides
4. **Shared project settings** (`.claude/settings.json`) - Team settings
5. **User settings** (`~/.claude/settings.json`) - Personal global settings

### Project-Specific Settings

Create `.claude/settings.json` for project-specific configuration:

```json
{
  "model": "claude-sonnet-4-5",
  "maxTokens": 8192,
  "permissions": {
    "allowedTools": ["bash", "read", "write", "edit"],
    "deniedPaths": ["secrets/", "*.key"]
  }
}
```

## Additional Resources

- [Claude Code Documentation](https://github.com/anthropics/claude-code)
- [Claude Code Settings Guide](https://code.claude.com/docs/en/settings.md)
- [Claude API Documentation](https://docs.anthropic.com/)
- [AI-DLC Methodology Blog](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/)
- [AI-DLC Method Definition Paper](https://prod.d13rzhkk8cj2z0.amplifyapp.com/)

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
