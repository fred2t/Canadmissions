import { Elements } from "../utils/namespaces";

export interface ClientBuildSettings {
    BASE_URL: string;
    WS_BASE_URL: string;
    
    GOOGLE_SSO_CLIENT_ID?: string | undefined;
}

export interface DrawerItem {
    text: string;
    icon: Elements.MUIIcon;
    onClick: () => void;
}
