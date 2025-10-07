import React from "react";

import cls from "./styles.module.scss"

import { Page, PageContent } from "@/components/ui/page/page";
import { Typography } from "@/components/ui/Text/Text";
import { contentDocs } from "@/components/features/docs/data";

type Props = {
    params: Promise<{
        slug: string;
    }>
};

const DocsPage = async (props: Props) => {
    const params = await props.params;
    const { slug } = params;

    const page = slug === 'privacy_policy' ? contentDocs.privacy_policy : contentDocs.agreement;

    return (
        <Page>
            <PageContent>
                <div className={cls.content}>
                    <Typography size='8' weight='bold'>{page.title}</Typography>

                    <div
                        className={cls.article}
                        dangerouslySetInnerHTML={{__html: page.content}}
                    />
                </div>
            </PageContent>
        </Page>
    )
}

export default DocsPage