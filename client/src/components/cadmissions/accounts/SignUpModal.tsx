import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    logIn,
    markClientAsRobot,
    startLoggingIn,
    stopSigningUp,
} from "../../../redux/slices/clientSlice";
import { API, Forms } from "../../../utils/namespaces";
import TransitionModal from "../../flexible/TransitionModal";
import { PageRoutes } from "../../../utils/enums";
import { appConsoleLog } from "../../../clientDebugging";

export default function SignUpModal(): JSX.Element {
    // stores extra error notifications from the server
    const [usernameHelperText, setUsernameHelperText] = useState("");
    const [emailHelperText, setEmailHelperText] = useState("");

    const { signingUp } = useAppSelector((s) => s.client);

    const { register, handleSubmit, formState, reset, getValues } = useForm<Forms.SignUpSchema>({
        resolver: yupResolver(Forms.SIGNUP_SCHEMA),
    });

    const dispatch = useAppDispatch();

    const closeModal = () => {
        dispatch(stopSigningUp());
    };

    const handleSignUp = async ({ username, email, password }: Forms.SignUpSchema) => {
        // don't send another request until the last server error is resolved
        if ([usernameHelperText, emailHelperText].some((text) => text !== "")) return;

        // const reCAPTCHAToken = await reCAPTCHA?.executeAsync();
        // appConsoleLog("retok", reCAPTCHAToken?.slice(-25));
        // if (reCAPTCHAToken == null) return;
        // reCAPTCHA?.reset();

        const data = await API.appPostRequest<API.InteractionMap[API.Routes.SignUp]>(
            `/users${API.Routes.SignUp}`,
            { username, email, password /* , reCAPTCHAToken */ },
            { credentials: "include" }
        );
        appConsoleLog(data);

        if ("clientIsRobot" in data) {
            dispatch(markClientAsRobot());
        } else if ("duplicatedColumn" in data) {
            switch (data.duplicatedColumn) {
                case "username":
                    setUsernameHelperText("Username already exists");
                    break;
                case "email":
                    setEmailHelperText("Email already registered");
                    break;
            }
        } else if ("userCreated" in data) {
            const { clientId, clientUsername } = data;

            dispatch(logIn({ clientId, clientUsername }));

            // reset form
            reset(Forms.RHFEmptyForm(getValues()));
        }
    };

    const handleStartLoggingIn = () => {
        closeModal();
        dispatch(startLoggingIn());
    };

    return (
        <TransitionModal open={signingUp} onClose={closeModal} className="sign-on-modal sign-up">
            <div className="cover" />

            <section className="container">
                <h1 className="title">Sign up</h1>
                <p className="agreement-confirmation">
                    By signing up, you agree to the{" "}
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
                    // notify user if server sent back an error
                    {...(usernameHelperText.length !== 0 && {
                        error: true,
                        helperText: usernameHelperText,
                        // once they're notified, clear the message when they change the username
                        onChange: () => setUsernameHelperText(""),
                    })}
                />
                <TextField
                    type="email"
                    required
                    className="uniform-width input"
                    label="Email"
                    {...Forms.RHFRegisterWithMessageHelpers(register, "email", formState.errors)}
                    {...(emailHelperText.length !== 0 && {
                        error: true,
                        helperText: emailHelperText,
                        // once they're notified, clear the message when they change the email
                        onChange: () => setEmailHelperText(""),
                    })}
                />
                <TextField
                    type="password"
                    required
                    className="uniform-width input"
                    label="Password"
                    {...Forms.RHFRegisterWithMessageHelpers(register, "password", formState.errors)}
                />
                <Button
                    variant="contained"
                    className="uniform-width main-btn sign-up-btn"
                    onClick={handleSubmit(handleSignUp)}
                >
                    Sign up
                </Button>

                <p className="forgot-password-btn">
                    Already have an account? <Button onClick={handleStartLoggingIn}>Log in</Button>
                </p>
            </section>
        </TransitionModal>
    );
}
