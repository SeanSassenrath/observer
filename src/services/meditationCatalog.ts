import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {MeditationBaseMap} from '../types';
import {meditationBaseMap as staticFallback} from '../constants/meditation-data';
import {getBackgroundImage} from '../constants/meditationImageRegistry';

const CATALOG_CACHE_KEY = '@meditation_catalog_cache';
const CATALOG_COLLECTION = 'catalog';
const CATALOG_DOC_ID = 'meditations';

export interface MatchingData {
  knownFileSizes?: number[];
  knownStringSizes?: string[];
  fileNamePatterns?: string[];
}

export interface FirestoreMeditation {
  artist: string;
  backgroundImageKey: string;
  color?: string;
  formattedDuration: string;
  groupName: string;
  meditationBaseId: string;
  name: string;
  type: number;
  updatedId?: string;
  matchingData?: MatchingData;
}

interface MeditationCatalogDocument {
  version: number;
  updatedAt: string;
  groups: Record<
    string,
    {
      groupName: string;
      displayOrder: number;
      meditationIds: string[];
    }
  >;
  meditations: Record<string, FirestoreMeditation>;
}

interface CachedCatalog {
  version: number;
  data: MeditationCatalogDocument;
  cachedAt: number;
}

/**
 * Transform Firestore meditation data into the MeditationBaseMap shape
 * that the rest of the app expects.
 */
function transformToMeditationBaseMap(
  doc: MeditationCatalogDocument,
): MeditationBaseMap {
  const result: MeditationBaseMap = {};

  for (const [id, med] of Object.entries(doc.meditations)) {
    result[id] = {
      artist: med.artist,
      backgroundImage: getBackgroundImage(med.backgroundImageKey),
      formattedDuration: med.formattedDuration,
      groupName: med.groupName,
      meditationBaseId: med.meditationBaseId,
      name: med.name,
      type: med.type,
      url: '',
      id: '',
      color: med.color,
      updatedId: med.updatedId,
    };
  }

  return result;
}

async function getCachedCatalog(): Promise<CachedCatalog | null> {
  try {
    const cached = await AsyncStorage.getItem(CATALOG_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.log('Error reading catalog cache:', e);
  }
  return null;
}

async function setCachedCatalog(
  doc: MeditationCatalogDocument,
): Promise<void> {
  try {
    const cache: CachedCatalog = {
      version: doc.version,
      data: doc,
      cachedAt: Date.now(),
    };
    await AsyncStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.log('Error writing catalog cache:', e);
  }
}

async function fetchCatalogFromFirestore(): Promise<MeditationCatalogDocument | null> {
  try {
    const doc = await firestore()
      .collection(CATALOG_COLLECTION)
      .doc(CATALOG_DOC_ID)
      .get();

    if (doc.exists) {
      return doc.data() as MeditationCatalogDocument;
    }
  } catch (e) {
    console.log('Error fetching catalog from Firestore:', e);
  }
  return null;
}

interface CatalogResult {
  map: MeditationBaseMap;
  doc: MeditationCatalogDocument | null;
}

/**
 * Main entry point. Returns MeditationBaseMap using this priority:
 * 1. Firestore (if newer version than cache)
 * 2. AsyncStorage cache
 * 3. Static fallback (bundled meditation-data.ts)
 */
async function getMeditationCatalog(): Promise<CatalogResult> {
  try {
    const cached = await getCachedCatalog();
    const firestoreDoc = await fetchCatalogFromFirestore();

    if (firestoreDoc) {
      if (!cached || firestoreDoc.version > cached.version) {
        console.log(
          'Catalog: updating from Firestore, version',
          firestoreDoc.version,
        );
        await setCachedCatalog(firestoreDoc);
        return {map: transformToMeditationBaseMap(firestoreDoc), doc: firestoreDoc};
      }
      console.log('Catalog: Firestore version matches cache, using cache');
    }

    if (cached) {
      console.log('Catalog: using cached data, version', cached.version);
      return {map: transformToMeditationBaseMap(cached.data), doc: cached.data};
    }
  } catch (e) {
    console.log('Error in getMeditationCatalog, using static fallback:', e);
  }

  console.log('Catalog: using static fallback');
  return {map: staticFallback, doc: null};
}

let _catalogSingleton: MeditationBaseMap | null = null;
let _rawCatalogDoc: MeditationCatalogDocument | null = null;

/**
 * Call during app initialization to pre-load the catalog.
 * Must be awaited before any sync access.
 */
export async function initMeditationCatalog(): Promise<MeditationBaseMap> {
  const result = await getMeditationCatalog();
  _catalogSingleton = result.map;
  _rawCatalogDoc = result.doc;
  return _catalogSingleton;
}

/**
 * Synchronous access to the loaded catalog.
 * Returns static fallback if init hasn't completed yet.
 */
export function getFullMeditationCatalogSync(): MeditationBaseMap {
  return _catalogSingleton || staticFallback;
}

/**
 * Synchronous access to the raw catalog document (includes matchingData).
 * Returns null if catalog hasn't been loaded from Firestore/cache.
 */
export function getRawCatalogSync(): Record<string, FirestoreMeditation> | null {
  return _rawCatalogDoc?.meditations ?? null;
}
