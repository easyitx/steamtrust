import dynamic from 'next/dynamic';

const FaqPage = dynamic(() => import('./FaqPage'), {
    ssr: true
});

export { FaqPage };
