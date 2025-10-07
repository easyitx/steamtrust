import { create } from 'zustand';

export type NoticeType = 'success' | 'info' | 'warning' | 'error';

interface Notice {
    id: number;
    type: NoticeType;
    message: string;
    description: string;
}

interface NoticeConfig {
    type: NoticeType;
    message: string;
    description: string;
}

interface NotificationState {
    notifications: Notice[];
    show: (config: NoticeConfig) => void;
    deleteNotice: (id: number) => void;
    showErrorNotice: (err: { message: string; error: string }) => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [] as Notice[],
    show: (config: NoticeConfig) =>
        set((state) => ({
            notifications: [{ ...config, id: Math.random() }, ...state.notifications]
        })),
    deleteNotice: (id: number) =>
        set((state) => ({
            notifications: state.notifications.filter((notice) => notice.id !== id)
        })),
    showErrorNotice: (err: { message: string; error: string }) =>
        set((state) => ({
            notifications: [
                {
                    message: err.message,
                    description: err.error,
                    type: 'error',
                    id: Math.random()
                },
                ...state.notifications
            ]
        }))
}));

export default useNotificationStore;

// Экспортируем функции для использования в других компонентах
export const useNotificationActions = () => {
    const { show, deleteNotice, showErrorNotice } = useNotificationStore((state) => state);

    return { show, deleteNotice, showErrorNotice };
};

// Хук для получения уведомлений
export const useNotifications = () => useNotificationStore((state) => state.notifications);
