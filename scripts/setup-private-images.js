#!/usr/bin/env node

/**
 * Setup script for linking private images repository
 * Run this after cloning both repos to set up the local development environment
 */

import { existsSync, symlinkSync, mkdirSync, readdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const privateImagesPath = join(root, 'private-images');
const publicImagesPath = join(root, 'public', 'images');

console.log('Setting up private images...');

// Check if private-images exists
if (!existsSync(privateImagesPath)) {
  console.error('❌ private-images directory not found.');
  console.log('Please clone your private images repository first:');
  console.log('  git clone https://github.com/YOUR_USERNAME/chrismuscat-images.git private-images');
  process.exit(1);
}

// Check if private-images/public/images exists
const sourceImagesPath = join(privateImagesPath, 'public', 'images');
if (!existsSync(sourceImagesPath)) {
  console.error('❌ private-images/public/images not found.');
  console.log('Please ensure your private images repo has the structure:');
  console.log('  private-images/public/images/');
  process.exit(1);
}

// Remove existing public/images if it exists (and isn't a symlink)
if (existsSync(publicImagesPath)) {
  console.log('⚠️  public/images already exists. Removing...');
  try {
    // On Windows, we need to remove junction points differently
    // For now, we'll just warn the user
    console.log('Please manually remove public/images before running this script.');
    console.log('Or use: rm -rf public/images (Linux/Mac) or rmdir /S /Q public\\images (Windows)');
    process.exit(1);
  } catch (e) {
    console.error('Error removing public/images:', e.message);
    process.exit(1);
  }
}

// Create the symlink
try {
  symlinkSync(sourceImagesPath, publicImagesPath, 'junction');
  console.log('✅ Created symlink: public/images → private-images/public/images');
  console.log('✅ Setup complete! Images will now be loaded from the private repository.');
} catch (e) {
  console.error('❌ Failed to create symlink:', e.message);
  console.log('\nFallback: copying images instead...');
  
  // Fallback to copying
  try {
    mkdirSync(publicImagesPath, { recursive: true });
    copyDirectory(sourceImagesPath, publicImagesPath);
    console.log('✅ Copied images from private-images to public/images');
    console.log('⚠️  Note: Copied images won\'t sync automatically. Use symlink for auto-sync.');
  } catch (copyError) {
    console.error('❌ Failed to copy images:', copyError.message);
    process.exit(1);
  }
}

function copyDirectory(src, dest) {
  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}
