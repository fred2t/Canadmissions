import { ENVS } from "../../../.app/clientEnvVars";

import { Cadmiss } from ".";

export enum Space {
    Startup = "/startup",
    Users = "/users",
    Communities = "/communities",
    Posts = "/posts",
    Comments = "/comments",
}

// enums
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
    GetProfile = "/users/profile",
    GetHomepage = "/get-homepage",

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
    // users
    ValidateToken = "auth-middleware",
    ValidateHuman = "human-middleware",
    ValidateParamsUserId = "valuseid",

    // comms
    ValidateCommunityExist = "vali-comm",

    // posts
    ValidateParamsPostId = "valposid",

    // comments
    ValidateParamsCommentId = "valcommid",
}

export enum HeaderKeys {
    // cookies sent through header in getServerSideProps
    SSRCookieString = "ssr-cookie-string",
}

export enum DeliveryDirection {
    Incoming = "incoming",
    Outgoing = "outgoing",
}

// types
export type InteractionPartnership = {
    [D in DeliveryDirection]: unknown;
};

export interface MiddleWareInteractionMap {
    // /users
    [Middlewares.ValidateHuman]: {
        [DeliveryDirection.Outgoing]: { reCAPTCHAToken: string };
        [DeliveryDirection.Incoming]: { clientIsRobot: true };
    };
    [Middlewares.ValidateToken]: {
        [DeliveryDirection.Outgoing]: {};
        [DeliveryDirection.Incoming]: { noAccessToken: true } | { badAccessToken: true };
    };
    [Middlewares.ValidateParamsUserId]: {
        [DeliveryDirection.Outgoing]: {};
        [DeliveryDirection.Incoming]: { invalidParamsUserId: true };
    };

    // /communities
    [Middlewares.ValidateCommunityExist]: {
        [DeliveryDirection.Outgoing]: void | { community: Cadmiss.SchoolAcronyms };
        [DeliveryDirection.Incoming]: { communityNotExist: true };
    };

    // /posts
    [Middlewares.ValidateParamsPostId]: {
        [DeliveryDirection.Outgoing]: {};
        [DeliveryDirection.Incoming]: { invalidParamsPostId: true };
    };

    // comments
    [Middlewares.ValidateParamsCommentId]: {
        [DeliveryDirection.Outgoing]: {};
        [DeliveryDirection.Incoming]: { invalidParamsCommentId: true };
    };
}

export interface InteractionMap {
    /**
     * Of the form:
     * Route: {
     *    body information (DeliveryDirection.Incoming, and usually just errors): {...}
     *    response data (DeliveryDirection.Outgoing): {...}
     * }
     *
     * If the endpoint doesn't return anything back, the function won't continue execution,
     * so there's no point adding | undefined to all Incoming streams.
     */

    // startup
    [Routes.InitialLoginIn]: WithMiddlewares<
        {
            [DeliveryDirection.Outgoing]: void;
            [DeliveryDirection.Incoming]: {
                loggedIn: true;
                clientId: number;
                clientUsername: string;
            };
        },
        MiddleWareInteractionMap[Middlewares.ValidateToken]
    >;

    // users
    [Routes.SignUp]: // WithMiddlewares<
    {
        [DeliveryDirection.Outgoing]: { username: string; email: string; password: string };
        [DeliveryDirection.Incoming]:
            | { duplicatedColumn: "username" | "email" }
            | { userCreated: true; clientId: number; clientUsername: string };
    };
    //     MiddleWareInteractionMap[Middlewares.ValidateHuman]
    // >;
    [Routes.LogIn]: {
        [DeliveryDirection.Outgoing]: { username: string; password: string };
        [DeliveryDirection.Incoming]:
            | { userNotFound: true }
            | { wrongPassword: true }
            | { loggedIn: true; clientId: number; clientUsername: string };
    };
    [Routes.GoogleSignOn]: {
        [DeliveryDirection.Outgoing]: { username: string; email: string; googleAccountId: string };
        [DeliveryDirection.Incoming]:
            | { loggedIn: true; clientId: number; clientUsername: string }
            | { accountCreated: true; clientId: number; temporaryUsername: string };
    };
    [Routes.ChangeUsername]: {
        [DeliveryDirection.Outgoing]: { newUsername: string };
        [DeliveryDirection.Incoming]:
            | { usernameTaken: true }
            | { usernameChanged: true; newUsername: string };
    };
    [Routes.LogOut]: {
        [DeliveryDirection.Outgoing]: {};
        [DeliveryDirection.Incoming]: { loggedOut: true };
    };
    [Routes.ChangePassword]: {
        [DeliveryDirection.Outgoing]: {
            username: string;
            oldPassword: string;
            newPassword: string;
        };
        [DeliveryDirection.Incoming]:
            | { noAccountWithUsername: true }
            | { wrongPassword: true }
            | { oldPasswordSameAsNew: true }
            | { passwordChanged: true };
    };
    [Routes.DeleteAccount]: WithMiddlewares<
        {
            [DeliveryDirection.Outgoing]: void;
            [DeliveryDirection.Incoming]: { accountDeleted: true };
        },
        MiddleWareInteractionMap[Middlewares.ValidateToken]
    >;
    [Routes.GetHomepage]: {
        [DeliveryDirection.Outgoing]: void;
        [DeliveryDirection.Incoming]: { posts: Cadmiss.Post[] };
    };

    // communities
    [Routes.ToggleJoinCommunity]: WithMiddlewares<
        {
            [DeliveryDirection.Outgoing]: { community: Cadmiss.SchoolAcronyms };
            [DeliveryDirection.Incoming]: { joinedCommunity: true } | { leftCommunity: true };
        },
        MiddleWareInteractionMap[Middlewares.ValidateToken]
    >;
    [Routes.GetInteractiveCommunityInfo]: WithMiddlewares<
        {
            [DeliveryDirection.Outgoing]: void;
            [DeliveryDirection.Incoming]: {
                isCommunityMember: boolean;
                communityPosts: Cadmiss.Post[];
            };
        },
        MiddleWareInteractionMap[Middlewares.ValidateToken],
        MiddleWareInteractionMap[Middlewares.ValidateCommunityExist]
    >;

    // /posts
    [Routes.CreatePost]: {
        [DeliveryDirection.Outgoing]: { community: Cadmiss.SchoolAcronyms } & Cadmiss.NewPost;
        [DeliveryDirection.Incoming]: { postMade: true } | { lackingInfo: true };
    };
    [Routes.LikePost]: WithMiddlewares<
        {
            [DeliveryDirection.Outgoing]: null;
            [DeliveryDirection.Incoming]: { error: unknown } | { actionCompleted: true };
        },
        MiddleWareInteractionMap[Middlewares.ValidateParamsPostId],
        MiddleWareInteractionMap[Middlewares.ValidateToken]
    >;
    [Routes.GetInteractivePostInfo]: {
        [DeliveryDirection.Outgoing]: void;
        [DeliveryDirection.Incoming]:
            | { invalidParamsPostId: true }
            | { post: Cadmiss.Post; comments: Cadmiss.Comment[] };
    };
    [Routes.DeletePost]: WithMiddlewares<
        {
            [DeliveryDirection.Outgoing]: void;
            [DeliveryDirection.Incoming]: { postDeleted: true };
        },
        MiddleWareInteractionMap[Middlewares.ValidateParamsPostId],
        MiddleWareInteractionMap[Middlewares.ValidateToken]
    >;

    // /comments
    [Routes.CreateComment]: WithMiddlewares<
        {
            [DeliveryDirection.Outgoing]: { parentCommentId: number | null; bodyMetadata: string };
            [DeliveryDirection.Incoming]:
                | { invalidParamsPostId: true }
                | { emptyBody: true }
                | {
                      commented: true;
                      commentMetadata: {
                          commentId: number;
                          createdAt: number;
                      };
                  };
        },
        MiddleWareInteractionMap[Middlewares.ValidateToken]
    >;
    [Routes.DeleteComment]: WithMiddlewares<
        {
            [DeliveryDirection.Outgoing]: void;
            [DeliveryDirection.Incoming]: { commentDeleted: true };
        },
        MiddleWareInteractionMap[Middlewares.ValidateParamsCommentId]
    >;
    [Routes.LikeComment]: WithMiddlewares<
        {
            [DeliveryDirection.Outgoing]: {};
            [DeliveryDirection.Incoming]: { actionCompleted: true } | { error: unknown };
        },
        MiddleWareInteractionMap[Middlewares.ValidateParamsCommentId],
        MiddleWareInteractionMap[Middlewares.ValidateToken]
    >;
}

export type WithMiddlewares<
    OriginInteractionObject extends Record<DeliveryDirection, unknown>,
    /**
     * Makeshift variadic generic.
     *
     * Use like: WIthMiddleware<OriginInteractionObject, Middleware1, Middleware2, ...>
     */
    // make no changes to the original object
    A extends InteractionPartnership = OriginInteractionObject,
    B extends InteractionPartnership = OriginInteractionObject,
    C extends InteractionPartnership = OriginInteractionObject,
    D extends InteractionPartnership = OriginInteractionObject
> = {
    /**
     * Concatenates the outgoing data since there can only be one body in a request.
     *
     * Unions the incoming data since they will be sent separately because each
     * request can only have one response.
     */

    [DeliveryDirection.Outgoing]: OriginInteractionObject[DeliveryDirection.Outgoing] &
        A[DeliveryDirection.Outgoing] &
        B[DeliveryDirection.Outgoing] &
        C[DeliveryDirection.Outgoing] &
        D[DeliveryDirection.Outgoing];
    [DeliveryDirection.Incoming]:
        | OriginInteractionObject[DeliveryDirection.Incoming]
        | A[DeliveryDirection.Incoming]
        | B[DeliveryDirection.Incoming]
        | C[DeliveryDirection.Incoming]
        | D[DeliveryDirection.Incoming];
};

// helpers
export async function appFetch<M extends InteractionPartnership>(
    targetRoute: string,
    init?: RequestInit | undefined
): Promise<M[DeliveryDirection.Incoming]> {
    /**
     * Doesn't include response details.
     */

    const res = await fetch(`${ENVS.BASE_URL}${targetRoute}`, init);

    return res.json();
}

export async function appGetRequest<M extends InteractionPartnership>(
    route: string,
    init?: RequestInit | undefined
): Promise<M[DeliveryDirection.Incoming]> {
    const res = await fetch(`${ENVS.BASE_URL}${route}`, { method: "GET", ...init });

    return res.json();
}

export async function appPostRequest<M extends InteractionPartnership>(
    route: string,
    data?: M[DeliveryDirection.Outgoing] | undefined,
    init?: RequestInit | undefined
): Promise<M[DeliveryDirection.Incoming]> {
    const res = await fetch(`${ENVS.BASE_URL}${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        ...init,
    });

    return await res.json();
}

export async function appPutRequest<M extends InteractionPartnership>(
    route: string,
    data?: M[DeliveryDirection.Outgoing] | undefined,
    init?: RequestInit | undefined
): Promise<M[DeliveryDirection.Incoming]> {
    const res = await fetch(`${ENVS.BASE_URL}${route}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        ...init,
    });

    return await res.json();
}

export async function appDeleteRequest<M extends InteractionPartnership>(
    route: string,
    init?: RequestInit | undefined
): Promise<M[DeliveryDirection.Incoming]> {
    const res = await fetch(`${ENVS.BASE_URL}${route}`, { method: "DELETE", ...init });

    return await res.json();
}
