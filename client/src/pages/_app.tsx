import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import "../styles/app.scss";

import { BRANDING_DETAILS, MY_SELF_MARKINGS, SOCIAL_MEDIA_METAS_DATA } from "../../.app/branding";
import Footer from "../components/layout/Footer";
import GeneralMetas from "../components/SEO/GeneralMetas";
import MarkingMyselfMetas from "../components/SEO/MarkingMyselfMetas";
import SocialMediaMetas from "../components/SEO/SocialMediaMetas";
import InitializeApp from "../zstartup";
import store from "../redux/store";
import SignUpModal from "../components/cadmissions/accounts/SignUpModal";
import ForgotPasswordModal from "../components/cadmissions/accounts/ForgotPasswordModal";
import PickUsernameModal from "../components/cadmissions/accounts/PickUsernamePopup";
import Header from "../components/layout/Header";
import LogInModal from "../components/cadmissions/accounts/LogInModal";

const ROUTES_WITHOUT_HEADER: string[] = [];
// const ROUTES_WITHOUT_FOOTER: string[] = [PageRoutes.Home, PageRoutes.Trending];
const ROUTES_WITHOUT_FOOTER: string[] = [];

export default function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    return (
        <Provider store={store}>
            <script src="https://accounts.google.com/gsi/client" async defer></script>
            <InitializeApp />
            <div className="app">
                {/* SEO */}
                <GeneralMetas generalMetasData={BRANDING_DETAILS} />
                <SocialMediaMetas socialMediaMetasData={SOCIAL_MEDIA_METAS_DATA} />
                <MarkingMyselfMetas selfMarkingsData={MY_SELF_MARKINGS} />

                {/* page */}
                {!ROUTES_WITHOUT_HEADER.includes(router.pathname) && (
                    <>
                        <Header />
                        <div className="section-separator header-separator"></div>
                    </>
                )}
                <Component {...pageProps} />
                {!ROUTES_WITHOUT_FOOTER.includes(router.pathname) && (
                    <>
                        <div className="section-separator footer-separator" />
                        <Footer />
                    </>
                )}
            </div>

            <SignUpModal />
            <LogInModal />
            <ForgotPasswordModal />
            <PickUsernameModal />
        </Provider>
    );
}
