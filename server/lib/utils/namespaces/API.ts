// enums
export enum Space {
    Startup = "/startup",
    Users = "/users",
    Communities = "/communities",
    Posts = "/posts",
    Comments = "/comments",
}

export enum Routes {
    // /startup
    InitialLoginIn = "/initial-login-in",

    // /users
    SignUp = "/sign-up",
    LogIn = "/log-in",
    GoogleSignOn = "/google-sign-on",
    ChangeUsername = "/change-username",
    LogOut = "/log-out",
    ChangePassword = "/change-password",
    DeleteAccount = "/delete-account",
    GetHomepage = "/get-homepage",
    GetProfile = "/users/profile",

    // /communities
    ToggleJoinCommunity = "/toggle-join-community",
    GetInteractiveCommunityInfo = "get-int-com-inf",

    // /posts
    CreatePost = "/create-post",
    LikePost = "/likepost",
    GetInteractivePostInfo = "getintpostinfo",
    DeletePost = "/delpos",

    // /comments
    CreateComment = "crecom",
    DeleteComment = "delcom",
    LikeComment = "likecom",
}

export enum Middlewares {
    ValidateToken = "auth-middleware",
    ValidateTokenAlwaysContinue = "valitokalwcont",
    ValidateHuman = "human-middleware",
    ValidateCommunityExist = "vali-comm",
}

export interface MiddlewareAddons {
    [Middlewares.ValidateToken]: {
        client?: { clientId: number; clientUsername: string };
    };
    [Middlewares.ValidateTokenAlwaysContinue]: {
        client?: { clientId?: number; clientUsername?: string };
    };
    [Middlewares.ValidateHuman]: { reCAPTCHAToken?: string };
    [Middlewares.ValidateCommunityExist]: void;
}

export enum HeaderKeys {
    // cookies sent through header in getServerSideProps
    SSRCookieString = "ssr-cookie-string",
}
