export enum LocalStorageKeys {
    conditionsAccepted = 'conditionsAccepted',
}

class LocalStorage {
    setItem(key: LocalStorageKeys, value: unknown) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving to local storage", error);
        }
    }

    getItem(key: LocalStorageKeys) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error("Error retrieving from local storage", error);
            return null;
        }
    }

    static removeItem(key: LocalStorageKeys) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error("Error removing from local storage", error);
        }
    }

    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error("Error clearing local storage", error);
        }
    }
}

export const localStorageStore = new LocalStorage();