import { IDBPDatabase, StoreNames, openDB, StoreKey, StoreValue } from 'idb';
import { Observable, from } from 'rxjs';
import { SrsDbSchema } from './srs-database-schema';

export class SrsDatabase {
    private static autoIncrementIdParameters: IDBObjectStoreParameters = {
        keyPath: 'id',
        autoIncrement: true,
    };

    public static setValue<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName,
        value: StoreValue<SrsDbSchema, StoreName> | Omit<StoreValue<SrsDbSchema, StoreName>, 'id'>,
        key?: StoreKey<SrsDbSchema, StoreName>,
    ): Observable<StoreKey<SrsDbSchema, StoreName>> {
        return from(this.setValueAsync(storeName, value, key));
    }

    public static deleteValue<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName, key: StoreKey<SrsDbSchema, StoreName>,
    ): Observable<void> {
        return from(this.deleteValueAsync(storeName, key));
    }

    public static getValue<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName, key: StoreKey<SrsDbSchema, StoreName>,
    ): Observable<StoreValue<SrsDbSchema, StoreName> | undefined> {
        return from(this.getValueAsync(storeName, key));
    }

    public static getValues<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName,
    ): Observable<StoreValue<SrsDbSchema, StoreName>[]> {
        return from(this.getValuesAsync(storeName));
    }

    public static getKeyValueMap<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName,
    ): Observable<Map<StoreKey<SrsDbSchema, StoreName>, StoreValue<SrsDbSchema, StoreName>>> {
        return from(this.getKeyValueMapAsync(storeName));
    }

    private static async openDb(): Promise<IDBPDatabase<SrsDbSchema>> {
        return openDB<SrsDbSchema>('srs', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('courses')) {
                    db.createObjectStore('courses', SrsDatabase.autoIncrementIdParameters);
                }
                if (!db.objectStoreNames.contains('cards')) {
                    db.createObjectStore('cards', SrsDatabase.autoIncrementIdParameters);
                }
                if (!db.objectStoreNames.contains('card_types')) {
                    db.createObjectStore('card_types', SrsDatabase.autoIncrementIdParameters);
                }
                if (!db.objectStoreNames.contains('card_type_fields')) {
                    db.createObjectStore('card_type_fields', SrsDatabase.autoIncrementIdParameters);
                }
                if (!db.objectStoreNames.contains('card_progresses')) {
                    db.createObjectStore('card_progresses');
                }
                if (!db.objectStoreNames.contains('card_reviews')) {
                    db.createObjectStore('card_reviews');
                }
            },
        });
    }

    private static async setValueAsync<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName,
        value: StoreValue<SrsDbSchema, StoreName> | Omit<StoreValue<SrsDbSchema, StoreName>, 'id'>,
        key?: StoreKey<SrsDbSchema, StoreName>,
    ): Promise<StoreKey<SrsDbSchema, StoreName>> {
        const db = await SrsDatabase.openDb();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const savedValue = value as StoreValue<SrsDbSchema, StoreName>;
        return store.put(savedValue, key);
    }

    private static async deleteValueAsync<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName, key: StoreKey<SrsDbSchema, StoreName>,
    ): Promise<void> {
        const db = await SrsDatabase.openDb();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.delete(key);
    }

    private static async getValueAsync<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName, key: StoreKey<SrsDbSchema, StoreName>,
    ): Promise<StoreValue<SrsDbSchema, StoreName> | undefined> {
        const db = await SrsDatabase.openDb();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        return store.get(key);
    }

    private static async getValuesAsync<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName,
    ): Promise<StoreValue<SrsDbSchema, StoreName>[]> {
        const db = await SrsDatabase.openDb();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        return store.getAll();
    }

    private static async getKeyValueMapAsync<StoreName extends StoreNames<SrsDbSchema>>(
        storeName: StoreName,
    ): Promise<Map<StoreKey<SrsDbSchema, StoreName>, StoreValue<SrsDbSchema, StoreName>>> {
        const db = await SrsDatabase.openDb();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const values = await store.getAll();
        const keys = await store.getAllKeys();
        return SrsDatabase.buildMap(keys, values);
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
}
