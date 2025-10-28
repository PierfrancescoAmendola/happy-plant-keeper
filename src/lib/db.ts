import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Plant } from '@/types/plant';

interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

interface PlantCareLog {
  id: string;
  plantId: string;
  careType: string;
  careDate: string;
  notes?: string;
  createdAt: string;
}

interface GiardinoDB extends DBSchema {
  users: {
    key: string;
    value: User;
    indexes: { 'by-email': string };
  };
  plants: {
    key: string;
    value: Plant;
    indexes: { 'by-user': string };
  };
  careLogs: {
    key: string;
    value: PlantCareLog;
    indexes: { 'by-plant': string };
  };
}

let dbInstance: IDBPDatabase<GiardinoDB> | null = null;

export const initDB = async (): Promise<IDBPDatabase<GiardinoDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<GiardinoDB>('giardino-db', 1, {
    upgrade(db) {
      // Users store
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by-email', 'email', { unique: true });
      }

      // Plants store
      if (!db.objectStoreNames.contains('plants')) {
        const plantStore = db.createObjectStore('plants', { keyPath: 'id' });
        plantStore.createIndex('by-user', 'user_id');
      }

      // Care logs store
      if (!db.objectStoreNames.contains('careLogs')) {
        const careStore = db.createObjectStore('careLogs', { keyPath: 'id' });
        careStore.createIndex('by-plant', 'plantId');
      }
    },
  });

  return dbInstance;
};

// User operations
export const createUser = async (email: string, passwordHash: string): Promise<User> => {
  const db = await initDB();
  const id = crypto.randomUUID();
  const user: User = {
    id,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  await db.add('users', user);
  return user;
};

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  const db = await initDB();
  return db.getFromIndex('users', 'by-email', email);
};

export const getUser = async (id: string): Promise<User | undefined> => {
  const db = await initDB();
  return db.get('users', id);
};

// Plant operations
export const createPlant = async (plant: Omit<Plant, 'id' | 'created_at' | 'updated_at'>): Promise<Plant> => {
  const db = await initDB();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const newPlant: Plant = {
    ...plant,
    id,
    created_at: now,
    updated_at: now,
  };
  await db.add('plants', newPlant);
  return newPlant;
};

export const getPlantsByUser = async (userId: string): Promise<Plant[]> => {
  const db = await initDB();
  return db.getAllFromIndex('plants', 'by-user', userId);
};

export const getPlant = async (id: string): Promise<Plant | undefined> => {
  const db = await initDB();
  return db.get('plants', id);
};

export const updatePlant = async (id: string, updates: Partial<Plant>): Promise<void> => {
  const db = await initDB();
  const plant = await db.get('plants', id);
  if (!plant) throw new Error('Plant not found');
  
  const updated = {
    ...plant,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  await db.put('plants', updated);
};

export const deletePlant = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete('plants', id);
  
  // Delete associated care logs
  const careLogs = await db.getAllFromIndex('careLogs', 'by-plant', id);
  for (const log of careLogs) {
    await db.delete('careLogs', log.id);
  }
};

// Care log operations
export const createCareLog = async (log: Omit<PlantCareLog, 'id' | 'createdAt'>): Promise<PlantCareLog> => {
  const db = await initDB();
  const id = crypto.randomUUID();
  const newLog: PlantCareLog = {
    ...log,
    id,
    createdAt: new Date().toISOString(),
  };
  await db.add('careLogs', newLog);
  return newLog;
};

export const getCareLogsByPlant = async (plantId: string): Promise<PlantCareLog[]> => {
  const db = await initDB();
  return db.getAllFromIndex('careLogs', 'by-plant', plantId);
};
