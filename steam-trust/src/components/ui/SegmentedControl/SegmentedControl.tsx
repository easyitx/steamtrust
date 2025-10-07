'use client'
import React from 'react';

import cls from "./styles.module.scss"

type Props = {
    children: React.ReactNode;
    defaultValue?: string;
    value?: string;
    size?: string;
    setSelectedValue?: (value: string) => void;
};

interface ChildProps {
    value: string;
    isActive?: boolean;
    onClick: (value: string) => void;
}

const SegmentedControlRoot = ({ children, value, setSelectedValue }: Props) => {
    const handleItemClick = (value: string) => {
        if (setSelectedValue) {
            setSelectedValue(value)
        }
    };

    return (
        <div className={cls.segmentedControlRoot}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement<ChildProps>(child)) {
                    return React.cloneElement(child, {
                        isActive: child.props.value === value,
                        onClick: handleItemClick,
                    });
                }
                return child;
            })}
        </div>
    );
};

const SegmentedControlItem = ({ children, isActive, value, onClick }: { children: React.ReactNode; value: string; isActive?: boolean, onClick?: (value: string) => void }) => {
    return (
        <div
            className={`${cls.segmentedControlItem} ${isActive ? cls.active : ''}`}
            onClick={() => onClick && onClick(value)}
        >
            {children}
        </div>
    );
};

export {
    SegmentedControlItem,
    SegmentedControlRoot
}