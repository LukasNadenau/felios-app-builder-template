import { ReactNode, Ref } from 'react';

export interface ChildContainerProps {
    children: ReactNode;
}

export interface LayoutConfig {
    ripple: boolean;
    inputStyle: 'outlined' | 'filled';
    menuMode: 'static' | 'overlay';
    colorScheme: 'light' | 'dark';
    theme: string;
    scale: number;
}

export interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
}

export interface LayoutContextProps {
    layoutConfig: LayoutConfig;
    setLayoutConfig: React.Dispatch<React.SetStateAction<LayoutConfig>>;
    layoutState: LayoutState;
    setLayoutState: React.Dispatch<React.SetStateAction<LayoutState>>;
    onMenuToggle: () => void;
    showProfileSidebar: () => void;
}

export interface MenuContextProps {
    activeMenu: string;
    setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
}

export interface AppMenuItem {
    label?: string;
    icon?: string;
    to?: string;
    url?: string;
    items?: AppMenuItem[];
    seperator?: boolean;
    badge?: string;
    badgeClass?: string;
    class?: string;
    preventExact?: boolean;
    visible?: boolean;
    disabled?: boolean;
    replaceUrl?: boolean;
    target?: string;
    command?: (e: { originalEvent: React.MouseEvent; item: AppMenuItem }) => void;
}

export interface AppMenuItemProps {
    item?: AppMenuItem;
    index?: number;
    root?: boolean;
    parentKey?: string;
    className?: string;
}

export interface AppTopbarRef {
    menubutton?: HTMLButtonElement | null;
    topbarmenu?: HTMLDivElement | null;
    topbarmenubutton?: HTMLButtonElement | null;
}
