import { Injectable } from '@angular/core';
import { IDBPDatabase, StoreNames, openDB, StoreKey, StoreValue, DBSchema } from 'idb';
import { Observable, from } from 'rxjs';
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

    private static async setValueAsync<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName, key: StoreKey<SrsDbSchema, StoreName>, value: StoreValue<SrsDbSchema, StoreName>,
    ): Promise<void> {
        const transaction = (await DatabaseService.openDb()).transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.put(value, key);
    }

    private static async deleteValueAsync<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName, key: StoreKey<SrsDbSchema, StoreName>,
    ): Promise<void> {
        const transaction = (await DatabaseService.openDb()).transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.delete(key);
    }

    private static async getValueAsync<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName, key: StoreKey<SrsDbSchema, StoreName>,
    ): Promise<StoreValue<SrsDbSchema, StoreName> | undefined> {
        const transaction = (await DatabaseService.openDb()).transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        return store.get(key);
    }

    private static async getKeyValueMapAsync<StoreName extends StoreNames<SrsDbSchema>>(
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

    private static setValue<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName, key: StoreKey<SrsDbSchema, StoreName>, value: StoreValue<SrsDbSchema, StoreName>,
    ): Observable<void> {
        return from(this.setValueAsync(storeName, key, value));
    }

    private static deleteValue<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName, key: StoreKey<SrsDbSchema, StoreName>,
    ): Observable<void> {
        return from(this.deleteValueAsync(storeName, key));
    }

    private static getValue<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName, key: StoreKey<SrsDbSchema, StoreName>,
    ): Observable<StoreValue<SrsDbSchema, StoreName> | undefined> {
        return from(this.getValueAsync(storeName, key));
    }

    private static getKeyValueMap<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName,
    ): Observable<Map<StoreKey<SrsDbSchema, StoreName>, StoreValue<SrsDbSchema, StoreName>>> {
        return from(this.getKeyValueMapAsync(storeName));
    }

    constructor() {
    }

    public getCourse(id: Course['id']): Observable<Course | undefined> {
        return DatabaseService.getValue('courses', id);
    }

    public getCourses(): Observable<Map<Course['id'], Course>> {
        return DatabaseService.getKeyValueMap('courses');
    }

    public saveCourse(id: Course['id'], course: Course): Observable<void> {
        return DatabaseService.setValue('courses', id, course);
    }

    public deleteCourse(id: Course['id']): Observable<void> {
        return DatabaseService.deleteValue('courses', id);
    }
}
