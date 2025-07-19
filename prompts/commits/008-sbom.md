# Commit 008: SBOM Generation and Dependency Track Integration

## Summary
Add comprehensive SBOM (Software Bill of Materials) generation and automated integration with Dependency Track server for security vulnerability management and compliance monitoring.

## Changes Made

### Package Dependencies
- Added `@cyclonedx/cyclonedx-npm` for SBOM generation in CycloneDX format
- Updated package.json with SBOM-related scripts

### New Scripts
- `sbom:generate` - Generate SBOM in JSON format
- `sbom:generate-xml` - Generate SBOM in XML format  
- `sbom:upload` - Upload SBOM to Dependency Track server
- `sbom:all` - Generate and upload in one command

### Automation & CI/CD
- **GitHub Actions workflow** (`.github/workflows/sbom.yml`):
  - Automatic SBOM generation on pushes to main/develop
  - Automated upload to Dependency Track
  - Weekly scheduled runs for continuous monitoring
  - Trivy security scanning integration
  - Artifact storage for 30 days

### Configuration Files
- `.cyclonedx.json` - CycloneDX SBOM generation configuration
- `scripts/upload-sbom.js` - Node.js script for Dependency Track API integration
- Updated `.env.example` with Dependency Track configuration
- Updated `.gitignore` to exclude generated SBOM files

### Documentation
- Comprehensive `docs/SBOM_INTEGRATION.md` with setup and usage guide
- Environment variable configuration
- Troubleshooting guide
- Best practices documentation

## Key Features

### Security & Compliance
- **CycloneDX standard** SBOM format for maximum compatibility
- **Vulnerability detection** via Dependency Track integration
- **Automated security scanning** with Trivy
- **SARIF output** for GitHub Security tab integration

### Automation
- **CI/CD integration** with GitHub Actions
- **Automatic project creation** in Dependency Track
- **Scheduled monitoring** for continuous security assessment
- **Manual trigger** capability for on-demand scans

### Developer Experience
- **Simple npm scripts** for local development
- **Environment-based configuration** for different environments
- **Detailed error handling** and status reporting
- **Debug mode** support for troubleshooting

## Environment Variables Required

```bash
# Required for Dependency Track integration
DEPENDENCY_TRACK_URL=http://your-server:8080
DEPENDENCY_TRACK_API_KEY=your-api-key

# Optional configuration
DEPENDENCY_TRACK_PROJECT_NAME=abstorm-app
DEPENDENCY_TRACK_PROJECT_VERSION=1.0.0
DEPENDENCY_TRACK_AUTO_CREATE=true
```

## Usage Examples

```bash
# Local development
npm run sbom:generate      # Generate SBOM locally
npm run sbom:all          # Generate and upload

# CI/CD (automatic via GitHub Actions)
# - Triggers on push to main/develop
# - Weekly scheduled runs
# - Manual workflow dispatch
```

## Benefits
- **Supply chain security** visibility
- **Vulnerability management** automation
- **Compliance reporting** for audits
- **Risk assessment** capabilities
- **Integration** with existing security tools

This implementation provides a production-ready SBOM solution that integrates seamlessly with the existing Vite + React + Cloudflare Workers architecture.