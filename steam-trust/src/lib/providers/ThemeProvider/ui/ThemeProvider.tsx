'use client';

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes';
import {useDeviceType} from "@/lib/useDeviceType";

const ThemeAttribute = 'class';

export enum Theme {
    DARK = 'dark',
    LIGHT = 'light'
}

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
    const { theme: defaultTheme } = { theme: Theme.DARK };
    useDeviceType()

    return (
        <NextThemesProvider
            attribute={ThemeAttribute}
            defaultTheme={defaultTheme}
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
};
