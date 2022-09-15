import useDetectAdBlock from "./lonely/useDetectAdBlock";
import useTransitionInitiator from "./lonely/useTransitionInitiator";
import AppReCAPTCHA from "./lonely/ReCAPTCHA";
import useControlDynamicCommunity from "./lonely/useControlDynamicCommunity";
import useInitialClientLogin from "./lonely/useInitialClientLogin";
import useGuardUnauthorized from "./lonely/useGuardUnauthorized";

function InitializeApp(): JSX.Element {
    /**
     * This can't be done in the _app.tsx file since it would have to be
     * outside of the redux provider.
     *
     * This also can't be in the index.ts file in case the user enters
     * the website on a route that isn't the main landing page.
     */

    // useDetectAdBlock();
    useTransitionInitiator();
    useControlDynamicCommunity();
    useInitialClientLogin();
    useGuardUnauthorized();

    return (
        <>
            <AppReCAPTCHA />
        </>
    );
}

export default InitializeApp;
