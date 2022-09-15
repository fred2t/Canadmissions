import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAppSelector } from "../../redux/hooks";
import { PageRoutes } from "../../utils/enums";

const GUEST_ALLOWED_ROUTES = [
    PageRoutes.Home,
    PageRoutes.Error,
    PageRoutes.Trending,
    PageRoutes.PrivacyPolicy,
    PageRoutes.UserAgreement,
    PageRoutes.CommunityNotExist,
    "/community/[community]",
    "/post/[id]/[title]",
];

export default function useGuardUnauthorized() {
    /**
     * Block non logged in users from visiting areas requiring accounts.
     */

    const { loggedIn } = useAppSelector((s) => s.client);

    const router = useRouter();

    useEffect(() => {
        if (!loggedIn && !GUEST_ALLOWED_ROUTES.includes(router.pathname)) {
            router.push(PageRoutes.Home);
        }
    }, [router, loggedIn]);
}
