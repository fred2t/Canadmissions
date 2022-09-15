import { API } from "./namespaces";

export function requestChangeUsername(newUsername: string) {
    return API.appPutRequest<API.InteractionMap[API.Routes.ChangeUsername]>(
        `/users${API.Routes.ChangeUsername}`,
        { newUsername },
        { credentials: "include" }
    );
}
