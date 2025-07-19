#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Uploads SBOM to Dependency Track server
 */
async function uploadSBOM() {
  const config = {
    dependencyTrackUrl: process.env.DEPENDENCY_TRACK_URL || 'http://localhost:8080',
    apiKey: process.env.DEPENDENCY_TRACK_API_KEY,
    projectName: process.env.DEPENDENCY_TRACK_PROJECT_NAME || 'abstorm-app',
    projectVersion: process.env.DEPENDENCY_TRACK_PROJECT_VERSION || '1.0.0',
    autoCreate: process.env.DEPENDENCY_TRACK_AUTO_CREATE === 'true' || true,
  };

  // Validate required configuration
  if (!config.apiKey) {
    console.error('❌ DEPENDENCY_TRACK_API_KEY environment variable is required');
    process.exit(1);
  }

  if (!config.dependencyTrackUrl) {
    console.error('❌ DEPENDENCY_TRACK_URL environment variable is required');
    process.exit(1);
  }

  const sbomPath = path.join(__dirname, '..', 'sbom.json');
  
  if (!fs.existsSync(sbomPath)) {
    console.error('❌ SBOM file not found. Run "npm run sbom:generate" first.');
    process.exit(1);
  }

  try {
    const sbomContent = fs.readFileSync(sbomPath, 'utf8');
    const base64Content = Buffer.from(sbomContent).toString('base64');

    console.log('📤 Uploading SBOM to Dependency Track...');
    console.log(`   Server: ${config.dependencyTrackUrl}`);
    console.log(`   Project: ${config.projectName} v${config.projectVersion}`);

    const uploadPayload = {
      project: config.projectName,
      projectVersion: config.projectVersion,
      autoCreate: config.autoCreate,
      bom: base64Content
    };

    const response = await fetch(`${config.dependencyTrackUrl}/api/v1/bom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.apiKey
      },
      body: JSON.stringify(uploadPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ SBOM uploaded successfully!');
    console.log(`   Token: ${result.token}`);
    
    // Optional: Check processing status
    if (result.token) {
      await checkProcessingStatus(config, result.token);
    }

  } catch (error) {
    console.error('❌ Failed to upload SBOM:', error.message);
    process.exit(1);
  }
}

/**
 * Check the processing status of uploaded SBOM
 */
async function checkProcessingStatus(config, token) {
  console.log('🔄 Checking processing status...');
  
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds timeout
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${config.dependencyTrackUrl}/api/v1/bom/token/${token}`, {
        headers: {
          'X-API-Key': config.apiKey
        }
      });

      if (response.ok) {
        const status = await response.json();
        if (status.processing === false) {
          console.log('✅ SBOM processing completed!');
          return;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    } catch (error) {
      console.warn('⚠️  Failed to check processing status:', error.message);
      break;
    }
  }
  
  console.log('⏱️  Processing status check timed out, but upload was successful');
}

// Run the upload
uploadSBOM().catch(console.error);
