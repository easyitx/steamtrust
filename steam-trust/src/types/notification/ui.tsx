'use client'
import clsx from 'clsx';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portal } from '@/components/ui/portal';
import { useNotificationActions, useNotifications } from './model';
import styles from './styles.module.scss';
import { classNames } from '@/lib/classNames/classNames';
import { CircleX } from 'lucide-react';

const DELETE_DELAY = 5000;

export const Notification = () => {
    const notifications = useNotifications();
    const { deleteNotice } = useNotificationActions();

    const closeNoticeHandler = (id: number) => () => {
        deleteNotice(id);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            notifications.forEach(({ id }) => {
                deleteNotice(id);
            });
        }, DELETE_DELAY);

        return () => clearTimeout(timeout);
    }, [notifications, deleteNotice]);

    return (
        <Portal rootId='body'>
            <div className={clsx(styles.notifications, {
                [styles.isVisible]: notifications.length
            })}>
                <AnimatePresence>
                    {notifications.map(({ id, message, description, type }) => (
                        <motion.div
                            key={id}
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.3 }}
                            className={classNames(styles.notice, {}, [styles[type]])}
                        >
                            <span className={styles.icon}></span>
                            <div className={styles.content}>
                                <span className={styles.message}>{message}</span>
                                <p className={styles.desc}>{description}</p>
                            </div>
                            <button
                                className={classNames('btn-reset', {}, [styles.close])}
                                onClick={closeNoticeHandler(id)}
                            >
                                <CircleX size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </Portal>
    );
};