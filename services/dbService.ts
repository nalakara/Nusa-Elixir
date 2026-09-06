import { Recipe } from '../types';

const DB_NAME = 'NusaElixirDB';
const DB_VERSION = 1;
const STORE_NAME = 'recipes';

let dbPromise: Promise<IDBDatabase> | null = null;

// FIX: Export 'initDB' function to make it accessible from other modules.
export const initDB = (): Promise<IDBDatabase> => {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening IndexedDB');
      dbPromise = null; // Reset promise on error to allow retries
      reject(new Error('Error opening IndexedDB'));
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('spiritType', 'spiritType', { unique: false });
      }
    };
  });

  return dbPromise;
};

export const addRecipe = async (recipe: Recipe): Promise<void> => {
    try {
        const db = await initDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(recipe);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve();
            request.onerror = () => {
                console.error('Error adding recipe:', request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error("Failed to add recipe to DB:", error);
        throw error;
    }
};

export const getAllRecipes = async (): Promise<Recipe[]> => {
    try {
        const db = await initDB();
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(request.result as Recipe[]);
            };
            request.onerror = () => {
                console.error('Error getting all recipes:', request.error);
                reject(request.error);
            };
        });
    } catch(error) {
        console.error("Failed to get recipes from DB:", error);
        throw error;
    }
};