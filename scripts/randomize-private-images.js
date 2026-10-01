#!/usr/bin/env node

import { readFileSync, writeFileSync, renameSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Generate random 32-character alphanumeric string
function generateRandomString(length = 32) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Read private.json
const privateJsonPath = join(root, 'content', 'private.json');
const privateData = JSON.parse(readFileSync(privateJsonPath, 'utf-8'));

const imagesDir = join(root, 'public', 'images', 'uploads');
const imageMap = new Map(); // old path -> new path

// Process each gallery and each image
for (const gallery of privateData.galleries) {
  const newImages = [];
  
  for (const imagePath of gallery.images) {
    const filename = imagePath.split('/').pop();
    const oldPath = join(imagesDir, filename);
    
    if (!existsSync(oldPath)) {
      console.log(`Warning: ${filename} not found, skipping`);
      newImages.push(imagePath);
      continue;
    }
    
    // Get file extension
    const ext = filename.split('.').pop();
    
    // Generate random filename
    const randomName = generateRandomString();
    const newFilename = `${randomName}.${ext}`;
    const newPath = join(imagesDir, newFilename);
    
    // Rename the file
    try {
      renameSync(oldPath, newPath);
      console.log(`Renamed: ${filename} -> ${newFilename}`);
      
      // Store mapping
      imageMap.set(imagePath, `/images/uploads/${newFilename}`);
      newImages.push(`/images/uploads/${newFilename}`);
    } catch (error) {
      console.error(`Error renaming ${filename}:`, error.message);
      newImages.push(imagePath);
    }
  }
  
  // Update gallery images
  gallery.images = newImages;
  
  // Update cover image if it's in the renamed set
  if (imageMap.has(gallery.coverImage)) {
    gallery.coverImage = imageMap.get(gallery.coverImage);
  }
}

// Write updated private.json
writeFileSync(privateJsonPath, JSON.stringify(privateData, null, 2), 'utf-8');

console.log('\nDone! Random filenames generated for private gallery images.');
console.log('Commit the changes to deploy.');
