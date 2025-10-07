'use client'
import { useEffect } from 'react';
import { create } from 'zustand';

interface DeviceState {
    deviceType: {
        isMobile: boolean;
        isTablet: boolean;
        isLaptop: boolean;
        isDesktop: boolean;
    };
    updateDeviceType: () => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
    deviceType: {
        isMobile: false,
        isTablet: false,
        isLaptop: false,
        isDesktop: false
    },
    updateDeviceType: () => {
        const width = window.innerWidth;

        set({
            deviceType: {
                isMobile: width < 768,
                isTablet: width >= 768 && width < 1024,
                isLaptop: width >= 1024 && width < 1440,
                isDesktop: width >= 1440
            }
        });
    }
}));

export const useDeviceType = () => {
    const { deviceType, updateDeviceType } = useDeviceStore((state) => state);

    useEffect(() => {
        updateDeviceType();
        window.addEventListener('resize', updateDeviceType);

        return () => {
            window.removeEventListener('resize', updateDeviceType);
        };
    }, [updateDeviceType]);

    return deviceType;
};

export const useDevice = () => useDeviceStore((state) => state.deviceType);
