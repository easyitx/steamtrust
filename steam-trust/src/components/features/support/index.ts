import dynamic from 'next/dynamic';

const SupportPage = dynamic(() => import('./SupportPage'), {
    ssr: true
});

export { SupportPage };
