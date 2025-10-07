import React from "react";
import { Page, PageContent } from "@/components/ui/page/page";
import { Typography } from "@/components/ui/Text/Text";

import cls from "./styles.module.scss"
import { socialLinks } from "@/lib/social";

const SupportPage = async () => {
    // const params = await props.params;

    return (
        <Page>
            <PageContent>
                <>
                    <Typography size='5' weight='bold'>Отправить запрос</Typography>

                    <br/>
                    <div className={cls.support}>

                        <Typography size='2' weight='bold'>
                            Вы можете написать в онлайн чат и получить ответ.
                        </Typography>
                    </div>
                </>
            </PageContent>
        </Page>
    )
}

export default SupportPage