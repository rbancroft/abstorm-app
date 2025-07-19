# SBOM (Software Bill of Materials) Integration Guide

This project includes automated SBOM generation and integration with Dependency Track for security and compliance monitoring.

## Overview

The SBOM integration provides:
- **Automated SBOM generation** using CycloneDX format
- **Dependency Track integration** for vulnerability management
- **CI/CD automation** via GitHub Actions
- **Security scanning** with Trivy

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate SBOM Locally

```bash
# Generate JSON format SBOM
npm run sbom:generate

# Generate XML format SBOM  
npm run sbom:generate-xml

# Generate and upload to Dependency Track
npm run sbom:all
```

### 3. Configure Dependency Track

1. Set up your environment variables (copy `.env.example` to `.env.local`):
   ```bash
   DEPENDENCY_TRACK_URL=http://your-dependency-track-server:8080
   DEPENDENCY_TRACK_API_KEY=your-api-key
   ```

2. Create an API key in Dependency Track:
   - Go to **Administration > Access Management > Teams**
   - Create or edit a team
   - Generate an API key with `BOM_UPLOAD` permission

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run sbom:generate` | Generate SBOM in JSON format |
| `npm run sbom:generate-xml` | Generate SBOM in XML format |
| `npm run sbom:upload` | Upload SBOM to Dependency Track |
| `npm run sbom:all` | Generate and upload SBOM |

## CI/CD Integration

The GitHub Actions workflow (`.github/workflows/sbom.yml`) automatically:

1. **Generates SBOMs** on every push to main/develop
2. **Uploads to Dependency Track** on main branch pushes
3. **Runs security scans** with Trivy
4. **Stores artifacts** for 30 days
5. **Runs weekly** for continuous monitoring

### Required GitHub Secrets

Configure these in your repository settings:

- `DEPENDENCY_TRACK_URL` - Your Dependency Track server URL
- `DEPENDENCY_TRACK_API_KEY` - API key with BOM_UPLOAD permission

## Configuration Options

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DEPENDENCY_TRACK_URL` | Yes | `http://localhost:8080` | Dependency Track server URL |
| `DEPENDENCY_TRACK_API_KEY` | Yes | - | API key for authentication |
| `DEPENDENCY_TRACK_PROJECT_NAME` | No | `abstorm-app` | Project name in Dependency Track |
| `DEPENDENCY_TRACK_PROJECT_VERSION` | No | `1.0.0` | Project version |
| `DEPENDENCY_TRACK_AUTO_CREATE` | No | `true` | Auto-create project if missing |

### CycloneDX Configuration

The `.cyclonedx.json` file contains metadata for SBOM generation. You can customize:
- Project namespace
- Creator information
- Schema version
- Additional metadata

## Security Features

### Vulnerability Scanning

- **Trivy** scans for known vulnerabilities in dependencies
- Results are uploaded to GitHub Security tab
- SARIF format for integration with security tools

### Dependency Monitoring

- **Automatic detection** of new vulnerabilities
- **Policy enforcement** via Dependency Track
- **Compliance reporting** for audits

## Troubleshooting

### Common Issues

1. **API Key Authentication Failed**
   - Verify your API key has `BOM_UPLOAD` permission
   - Check the API key is correctly set in environment variables

2. **Server Connection Failed**
   - Verify `DEPENDENCY_TRACK_URL` is correct and accessible
   - Check network connectivity and firewall settings

3. **Project Not Found**
   - Set `DEPENDENCY_TRACK_AUTO_CREATE=true` to auto-create projects
   - Or manually create the project in Dependency Track

### Debug Mode

Run with debug logging:
```bash
DEBUG=* npm run sbom:upload
```

## Integration with Build Process

The SBOM generation is integrated into the build pipeline:

1. **Development**: Generate SBOMs locally for testing
2. **CI/CD**: Automatic generation and upload on builds
3. **Deployment**: Include SBOM validation in deployment checks

## Best Practices

1. **Regular Updates**: Run SBOM generation on every dependency update
2. **Version Control**: Track SBOM changes in version control (optional)
3. **Monitoring**: Set up alerts in Dependency Track for new vulnerabilities
4. **Compliance**: Include SBOM generation in your security policies

## File Structure

```
├── .github/workflows/sbom.yml    # CI/CD workflow
├── scripts/upload-sbom.js        # Upload script
├── .cyclonedx.json              # SBOM configuration
├── sbom.json                    # Generated SBOM (JSON)
├── sbom.xml                     # Generated SBOM (XML)
└── .env.example                 # Configuration template
```

## Resources

- [CycloneDX Specification](https://cyclonedx.org/)
- [Dependency Track Documentation](https://docs.dependencytrack.org/)
- [NIST SBOM Guidelines](https://www.nist.gov/itl/executive-order-improving-nations-cybersecurity/software-bill-materials)
