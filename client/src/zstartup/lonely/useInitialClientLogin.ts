import { useEffect } from "react";
import { appConsoleLog } from "../../clientDebugging";

import { useAppDispatch } from "../../redux/hooks";
import { logIn } from "../../redux/slices/clientSlice";
import { API } from "../../utils/namespaces";

export default function useInitialClientLogin(): void {
    /**
     * Setup custom client page based off their stored information.
     */

    const dispatch = useAppDispatch();

    useEffect(() => {
        (async function () {
            const data = await API.appGetRequest<API.InteractionMap[API.Routes.InitialLoginIn]>(
                `/startup${API.Routes.InitialLoginIn}`,
                { credentials: "include" }
            );
            appConsoleLog("star,", data);

            if ("loggedIn" in data) {
                const { clientId, clientUsername } = data;

                dispatch(logIn({ clientId, clientUsername }));
            }
        })();
    }, [dispatch]);
}
