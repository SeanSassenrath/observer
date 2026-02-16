#!/usr/bin/env node

/**
 * Seeds the Firestore `catalog/meditations` document from catalogData.json.
 *
 * Prerequisites:
 *   npm install firebase-admin   (or add to devDependencies)
 *
 * Usage:
 *   # Option A: Use a service account key file
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json node scripts/seedMeditationCatalog.js
 *
 *   # Option B: Use default credentials (if running on GCP or with gcloud auth)
 *   node scripts/seedMeditationCatalog.js
 *
 *   # Pass --dry-run to preview without writing
 *   node scripts/seedMeditationCatalog.js --dry-run
 */

const fs = require('fs');
const path = require('path');

const CATALOG_FILE = path.join(__dirname, 'catalogData.json');
const COLLECTION = 'catalog';
const DOC_ID = 'meditations';

const isDryRun = process.argv.includes('--dry-run');

async function main() {
  const catalogData = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf-8'));

  const medCount = Object.keys(catalogData.meditations).length;
  const groupCount = Object.keys(catalogData.groups).length;
  console.log(`Catalog: ${medCount} meditations, ${groupCount} groups, version ${catalogData.version}`);

  if (isDryRun) {
    console.log('\n--dry-run: Would write the following document to', `${COLLECTION}/${DOC_ID}:`);
    const docSize = Buffer.byteLength(JSON.stringify(catalogData), 'utf-8');
    console.log(`Document size: ${(docSize / 1024).toFixed(1)} KB`);
    console.log('Groups:', Object.keys(catalogData.groups).join(', '));
    console.log('\nSample meditation:', JSON.stringify(Object.values(catalogData.meditations)[0], null, 2));
    return;
  }

  // Dynamic import to avoid requiring firebase-admin globally
  let admin;
  try {
    admin = require('firebase-admin');
  } catch (e) {
    console.error('firebase-admin not found. Install it:');
    console.error('  npm install --save-dev firebase-admin');
    process.exit(1);
  }

  // Initialize with default or service account credentials
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  const db = admin.firestore();

  // Set the catalog document (overwrites if exists)
  const docRef = db.collection(COLLECTION).doc(DOC_ID);

  // Update timestamp to Firestore server timestamp
  catalogData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

  await docRef.set(catalogData);

  console.log(`Successfully wrote catalog to ${COLLECTION}/${DOC_ID}`);
  console.log(`Version: ${catalogData.version}`);

  process.exit(0);
}

main().catch(err => {
  console.error('Error seeding catalog:', err);
  process.exit(1);
});
