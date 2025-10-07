import {Page, PageContent} from "@/components/ui/page/page";
import {SteamDeposit} from "@/components/features/SteamDeposit/ui/SteamDeposit";
import {FaqSection} from "@/components/features/FaqSection/FaqSection";
import {AdvantagesSection} from "@/components/features/AdvantagesSection/AdvantagesSection";
import {getPaymentMethods} from "@/api/getPaymentMethods";
import { LiveTape } from "@/components/features/LiveTape/ui/LiveTape";
import { PaymentMethod } from "@/types/index";

import cls from "./styles.module.scss"

export default async function Home() {
    let methodsFiat: PaymentMethod[] = [];
    
    try {
        const response = await getPaymentMethods();
        if (response.success && response.data && response.data.items) {
            methodsFiat = response.data.items;
        }
    } catch (error) {
        console.error('Ошибка загрузки методов оплаты:', error);
    }

    return (
        <>
            <Page>
                <PageContent>
                    {methodsFiat.length > 0 && <SteamDeposit methodsFiat={methodsFiat}/>}
                </PageContent>

                <LiveTape/>

                <PageContent>
                    <div className={cls.section}>
                        <div className={cls.leftSide}>
                            <FaqSection />
                        </div>
                        <div className={cls.rightSide}>
                            <AdvantagesSection />
                        </div>
                    </div>
                </PageContent>
            </Page>
        </>
    );
}
