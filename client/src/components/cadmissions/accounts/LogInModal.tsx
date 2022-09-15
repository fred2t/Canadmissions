import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    logIn,
    startChangingPassword,
    startSigningUp,
    stopLoggingIn,
} from "../../../redux/slices/clientSlice";
import { API, Forms } from "../../../utils/namespaces";
import TransitionModal from "../../flexible/TransitionModal";
import { PageRoutes } from "../../../utils/enums";
import { appConsoleLog } from "../../../clientDebugging";

import GoogleSSOButton from "./GoogleSSOButton";

export default function LogInModal(): JSX.Element {
    // stores extra error notifications from the server
    const [usernameHelperText, setUsernameHelperText] = useState("");
    const [passwordHelperText, setPasswordHelperText] = useState("");

    const { loggingIn } = useAppSelector((s) => s.client);

    const { register, handleSubmit, formState, reset, getValues } = useForm<Forms.LoginSchema>({
        resolver: yupResolver(Forms.LOGIN_SCHEMA),
    });

    const dispatch = useAppDispatch();

    const closeModal = () => {
        dispatch(stopLoggingIn());
    };

    const handleLogin = async ({ password, username }: Forms.LoginSchema) => {
        // don't send another request until the last server error is resolved
        if ([usernameHelperText, passwordHelperText].some((text) => text !== "")) return;

        const data = await API.appPostRequest<API.InteractionMap[API.Routes.LogIn]>(
            `/users${API.Routes.LogIn}`,
            { username, password },
            { credentials: "include" }
        );
        appConsoleLog(data);

        if ("userNotFound" in data) {
            setUsernameHelperText("No user found with that username");
        } else if ("wrongPassword" in data) {
            setPasswordHelperText("Wrong password");
        } else if ("loggedIn" in data) {
            const { clientId, clientUsername } = data;

            dispatch(logIn({ clientId, clientUsername }));

            reset(Forms.RHFEmptyForm(getValues()));
        }
    };

    const handleStartSigningUp = () => {
        dispatch(startSigningUp());
    };

    const handleStartChangingPassword = () => {
        dispatch(startChangingPassword());
    };

    return (
        <TransitionModal open={loggingIn} onClose={closeModal} className="sign-on-modal login">
            <div className="cover" />

            <section className="container">
                <h1 className="title">Log in</h1>
                <p className="agreement-confirmation">
                    By logging in, you agree to the{" "}
                    <a href={PageRoutes.UserAgreement} className="link">
                        User Agreement
                    </a>{" "}
                    and{" "}
                    <a href={PageRoutes.PrivacyPolicy} className="link">
                        Privacy Policy
                    </a>
                    .
                </p>

                {/* <div className="sso-container">
                    <GoogleSSOButton />
                </div> */}

                <div className="uniform-width login-method-separator">
                    <span className="divider-line"></span>
                    <span className="divider-text">Also</span>
                    <span className="divider-line"></span>
                </div>

                <TextField
                    type="text"
                    required
                    className="uniform-width input"
                    label="Username"
                    {...Forms.RHFRegisterWithMessageHelpers(register, "username", formState.errors)}
                    {...(!formState.errors.username && { helperText: "Spaces will be removed" })}
                    // if there's an extra username helper message, override the default one
                    {...(usernameHelperText.length !== 0 && {
                        error: true,
                        helperText: usernameHelperText,
                        onChange: () => setUsernameHelperText(""),
                    })}
                />
                <TextField
                    type="password"
                    required
                    className="uniform-width input"
                    label="Password"
                    {...Forms.RHFRegisterWithMessageHelpers(register, "password", formState.errors)}
                    // if there's an extra pwd helper message, override the default one
                    {...(passwordHelperText.length !== 0 && {
                        error: true,
                        helperText: passwordHelperText,
                        onChange: () => setPasswordHelperText(""),
                    })}
                />

                <Button
                    variant="contained"
                    className="uniform-width main-btn login-btn"
                    onClick={handleSubmit(handleLogin)}
                >
                    Log In
                </Button>

                <Button className="forgot-password-btn" onClick={handleStartChangingPassword}>
                    Forgot your password?
                </Button>

                <p>
                    New visitor?{" "}
                    <Button className="sign-up-btn" onClick={handleStartSigningUp}>
                        Sign up
                    </Button>
                </p>
            </section>
        </TransitionModal>
    );
}
