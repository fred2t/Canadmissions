export enum NodeEnvironments {
    Development = "dev",
    Production = "prod",
}

export enum KeyDownKeys {
    Alt = "Alt",
    Enter = "Enter",
}

export enum PageRoutes {
    /**
     * Does not involve dynamic routes.
     */

    Home = "/",
    Error = "/404",
    Settings = "/settings",
    UserAgreement = "/user-agreement",
    PrivacyPolicy = "/privacy-policy",
    CreatePost = "/create-post",
    Trending = "/trending",
    CommunityNotExist = "/community-not-exist",
}

export enum DynamicRoutes {
    CreatePost = "/create-post",
    Community = "/community",
}

export enum LocalStorageKeys {
    // make sure result is typed as string when empty enum
    placeholder = "placeholder",
}

export enum SessionStorageKeys {}

export enum CookieKeys {}
