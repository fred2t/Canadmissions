import jwtDecode from "jwt-decode";
import { useEffect, useRef } from "react";

import { ENVS } from "../../../../.app/clientEnvVars";
import { appConsoleLog } from "../../../clientDebugging";
import { useAppDispatch } from "../../../redux/hooks";
import {
    logIn,
    /* setGoogleSSOButton, */ startPickingUsername,
} from "../../../redux/slices/clientSlice";
import { API, ThirdParty } from "../../../utils/namespaces";

export default function GoogleSSOButton(): JSX.Element {
    const loginBtn = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        // @ts-ignore
        if (google == undefined) return appConsoleLog("google is undefined");

        // @ts-ignore
        google.accounts.id.initialize({
            client_id: ENVS.GOOGLE_SSO_CLIENT_ID,
            callback: async (response: ThirdParty.GoogleSSOResponse) => {
                // if (loginBtn.current != null) dispatch(setGoogleSSOButton(loginBtn.current));
                appConsoleLog(response);

                const {
                    name,
                    email,
                    sub: accountId,
                } = jwtDecode<ThirdParty.GoogleSSOUser>(response.credential);
                appConsoleLog(name, email, accountId);

                const data = await API.appPostRequest<API.InteractionMap[API.Routes.GoogleSignOn]>(
                    `/users${API.Routes.GoogleSignOn}`,
                    { username: name, email: email, googleAccountId: accountId },
                    { credentials: "include" }
                );
                appConsoleLog(data, "accountCreated" in data);

                if ("loggedIn" in data) {
                    const { clientId, clientUsername } = data;
                    dispatch(logIn({ clientId, clientUsername }));

                    // close the current modal and open one to change names if the account was just created
                } else if ("accountCreated" in data) {
                    const { clientId, temporaryUsername } = data;

                    dispatch(logIn({ clientId, clientUsername: temporaryUsername }));
                    dispatch(startPickingUsername(data.temporaryUsername));
                }
            },
        });

        // @ts-ignore
        google.accounts.id.renderButton(loginBtn.current, {
            theme: "outline",
            shape: "circle",
            size: `${window.innerWidth > 600 ? "large" : "small"}`,
        });
    }, [dispatch]);

    return <div ref={loginBtn} className="google-sso-btn-container" />;
}
