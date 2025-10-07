import type {Metadata} from "next";
import { Manrope } from "next/font/google";
import "../styles/globals.scss";
import {ThemeProvider} from "@/lib/providers/ThemeProvider";
import {Header} from "@/components/layout/Header/ui/Header";
import {Footer} from "@/components/layout/Footer/ui/Footer";
import { Notification } from '@/types/notification/ui';
import {UtmProvider} from "@/lib/providers/UtmProvider";
import YandexMetrikaContainer from "@/lib/metrika/YandexMetrikaContainer";
import Script from "next/script";

const manropeSans = Manrope({
    variable: "--font-manrope",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Пополнение баланса Steam 💰 | Быстрое пополнение кошелька Steam Trust (Россия, СНГ) | 1-3 минуты",
    description: "【ПОПОЛНЕНИЕ STEAM】⚡ Мгновенное зачисление рублей на баланс Steam без комиссии! ✅ Безопасные платежи, 24/7 поддержка, любые суммы от 50 ₽. Работаем с картами и криптовалютой. Лучший курс – пополните сейчас!",
    keywords: [
        "пополнить steam", 
        "баланс steam рублями",
        "кошелек steam пополнение",
        "стим trust оплата",
        "steam wallet russia",
        "как положить деньги на steam",
        "пополнение стим сбербанк",
        "steam trust оплата криптовалютой",
        "быстрое пополнение steam",
        "steam без комиссии"
    ],
    openGraph: {
        title: "Steam Trust – #1 для пополнения Steam в РФ и СНГ | 100% гарантия",
        description: "Пополняйте Steam без блокировок! Автоматическое зачисление за 47 секунд. Надёжно и выгодно.",
        images: [{
            url: "https://steamtrust.ru/st_logo.svg",
            alt: "Пополнение Steam через Trust за 1 минуту"
        }]
    }
};

export default async function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" suppressHydrationWarning>
        <head>
            <Script
                src="//code.jivosite.com/widget/NRvsCNLqzA"
                strategy="lazyOnload"
                async
            />
        </head>
        <body className={`${manropeSans.variable}`}>
        <UtmProvider>
            <ThemeProvider>
                <Header />
                {children}
                <Footer/>

                <Notification/>
            </ThemeProvider>
        </UtmProvider>
        <YandexMetrikaContainer/>
        </body>
        </html>
    );
}