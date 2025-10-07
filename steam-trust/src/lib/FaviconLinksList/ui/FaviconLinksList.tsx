import React from 'react';
import { faviconLinks } from '../model/data';

export const FaviconLinksList = () => (
    <>
        {faviconLinks.map((link, index) => (
            <link
                key={index}
                rel={link.rel}
                href={link.href}
                type={link.type}
            />
        ))}
    </>
);
