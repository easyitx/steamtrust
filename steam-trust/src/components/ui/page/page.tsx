import cls from "./styles.module.scss"
import {ReactNode} from "react";

type Props = {
    children: ReactNode
}

export const Page = ({ children }: Props) => {
    return (
        <main className={cls.page}>
            {children}
        </main>
    )
}

export const PageContent = ({ children }: Props) => {
    return (
        <main className={cls.pageContent}>
            {children}
        </main>
    )
}