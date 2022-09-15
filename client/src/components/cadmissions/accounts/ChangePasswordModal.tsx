import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { API, Forms } from "../../../utils/namespaces";
import TransitionModal from "../../flexible/TransitionModal";
import { appConsoleLog } from "../../../clientDebugging";

interface ChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({
    open,
    onClose,
}: ChangePasswordModalProps): JSX.Element {
    // stores extra error notifications from the server
    const [usernameHelperText, setUsernameHelperText] = useState("");
    const [oldPasswordHelperText, setOldPasswordHelperText] = useState("");
    const [newPasswordHelperText, setNewPasswordHelperText] = useState("");

    const { register, handleSubmit, formState, reset, getValues } =
        useForm<Forms.ChangePasswordSchema>({
            resolver: yupResolver(Forms.CHANGE_PASSWORD_SCHEMA),
        });

    const handleOldPasswordSameAsNew = () => {
        setNewPasswordHelperText("New password must be different from old password");
    };

    const handleChangePassword = async ({
        username,
        oldPassword,
        newPassword,
    }: Forms.ChangePasswordSchema) => {
        appConsoleLog(username, oldPassword, newPassword);
        // don't send another request until the last server error is resolved
        if (
            [usernameHelperText, oldPasswordHelperText, newPasswordHelperText].some(
                (text) => text !== ""
            )
        ) {
            return;
        }
        if (oldPassword === newPassword) return handleOldPasswordSameAsNew();

        const data = await API.appPutRequest<API.InteractionMap[API.Routes.ChangePassword]>(
            `/users${API.Routes.ChangePassword}`,
            { username, oldPassword, newPassword }
        );

        if ("noAccountWithUsername" in data) {
            setUsernameHelperText("No account with that username exists");
        } else if ("wrongPassword" in data) {
            setOldPasswordHelperText("Wrong password");
        } else if ("oldPasswordSameAsNew" in data) {
            handleOldPasswordSameAsNew();
        } else if ("passwordChanged" in data) {
            onClose();
            reset(Forms.RHFEmptyForm(getValues()));
        }
    };

    return (
        <TransitionModal open={open} onClose={onClose} className="change-password-modal">
            <div className="cover" />

            <section className="container">
                <header>
                    <h1 className="title">Change Password</h1>
                </header>

                <TextField
                    type="text"
                    required
                    className="input"
                    label="Username"
                    {...Forms.RHFRegisterWithMessageHelpers(register, "username", formState.errors)}
                    {...(!formState.errors.username && { helperText: "Spaces will be removed" })}
                    // notify user if server sent back an error
                    {...(usernameHelperText && {
                        error: true,
                        helperText: usernameHelperText,
                        onChange: () => setUsernameHelperText(""),
                    })}
                />
                <TextField
                    type="password"
                    required
                    className="input"
                    label="Old Password"
                    {...Forms.RHFRegisterWithMessageHelpers(
                        register,
                        "oldPassword",
                        formState.errors
                    )}
                    {...(oldPasswordHelperText && {
                        error: true,
                        helperText: oldPasswordHelperText,
                        onChange: () => setOldPasswordHelperText(""),
                    })}
                />
                <TextField
                    type="password"
                    required
                    label="New Password"
                    className="input"
                    {...Forms.RHFRegisterWithMessageHelpers(
                        register,
                        "newPassword",
                        formState.errors
                    )}
                    {...(newPasswordHelperText && {
                        error: true,
                        helperText: newPasswordHelperText,
                        onChange: () => setNewPasswordHelperText(""),
                    })}
                />

                <Button
                    variant="contained"
                    className="main-btn sign-up-btn"
                    onClick={handleSubmit(handleChangePassword)}
                >
                    Change
                </Button>
            </section>
        </TransitionModal>
    );
}
