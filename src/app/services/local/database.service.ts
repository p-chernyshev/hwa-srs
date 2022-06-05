import { Injectable } from '@angular/core';
import { IDBPDatabase, StoreNames, openDB, StoreKey, StoreValue, DBSchema } from 'idb';
import { Course } from '../../types/course';

interface SrsDbSchema extends DBSchema {
    'courses': {
        key: Course['id'];
        value: Course;
    };
}

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    private static async openDb(): Promise<IDBPDatabase<SrsDbSchema>> {
        return openDB<SrsDbSchema>('srs', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('courses')) db.createObjectStore('courses');
            },
        });
    }

    private static async setValue<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName, key: StoreKey<SrsDbSchema, StoreName>, value: StoreValue<SrsDbSchema, StoreName>,
    ): Promise<void> {
        const transaction = (await DatabaseService.openDb()).transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.put(value, key);
    }

    private static async deleteValue<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName, key: StoreKey<SrsDbSchema, StoreName>,
    ): Promise<void> {
        const transaction = (await DatabaseService.openDb()).transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.delete(key);
    }

    private static async getValue<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName, key: StoreKey<SrsDbSchema, StoreName>,
    ): Promise<StoreValue<SrsDbSchema, StoreName> | undefined> {
        const transaction = (await DatabaseService.openDb()).transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        return store.get(key);
    }

    private static async getKeyValueMap<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName,
    ): Promise<Map<StoreKey<SrsDbSchema, StoreName>, StoreValue<SrsDbSchema, StoreName>>> {
        const transaction = (await DatabaseService.openDb()).transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const values = await store.getAll();
        const keys = await store.getAllKeys();
        return DatabaseService.buildMap(keys, values);
    }

    private static buildMap<TKey, TValue>(keys: TKey[], values: TValue[]): Map<TKey, TValue> {
        const map = new Map<TKey, TValue>();
        for (let i = 0; i < keys.length; i++) {
            map.set(keys[i], values[i]);
        }
        return map;
    }

    constructor() {
    }

    public async getCourse(id: Course['id']): Promise<Course | undefined> {
        return DatabaseService.getValue('courses', id);
    }

    public async getCourses(): Promise<Map<Course['id'], Course>> {
        return DatabaseService.getKeyValueMap('courses');
    }

    public async saveCourse(id: Course['id'], course: Course): Promise<void> {
        return DatabaseService.setValue('courses', id, course);
    }

    public async deleteCourse(id: Course['id']): Promise<void> {
        return DatabaseService.deleteValue('courses', id);
    }
}
