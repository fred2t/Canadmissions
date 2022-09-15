import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    startLoggingIn,
    startSigningUp,
    stopChangingPassword,
} from "../../../redux/slices/clientSlice";
import { BRANDING_DETAILS } from "../../../../.app/branding";
import TransitionModal from "../../flexible/TransitionModal";

export default function ForgotPasswordModal() {
    const { changingPassword } = useAppSelector((s) => s.client);

    const dispatch = useAppDispatch();

    const closeModal = () => {
        dispatch(stopChangingPassword());
    };

    const handleStartSigningUp = () => {
        closeModal();
        dispatch(startSigningUp());
    };

    const handleStartLoggingIn = () => {
        closeModal();
        dispatch(startLoggingIn());
    };

    return (
        <TransitionModal
            open={changingPassword}
            onClose={closeModal}
            className="forgot-password-modal"
        >
            <div className="cover"></div>

            <section className="container">
                <h1>Reset password</h1>
                <p className="description">
                    Enter the email address and password for your account to be used to confirm your
                    identity and reset your password.
                </p>

                <TextField type="email" label="Email" required className="input" />
                <Button variant="contained" className="main-btn">
                    Reset Password
                </Button>

                <h4>Don&apos;t have an account or remembered your password? Use these.</h4>
                <div className="helper-btn-container">
                    <Button className="btn" onClick={handleStartSigningUp}>
                        Sign up
                    </Button>
                    <Button className="btn" onClick={handleStartLoggingIn}>
                        Log in
                    </Button>
                </div>

                <img src={BRANDING_DETAILS.logo.src} alt="app logo" className="app-logo" />
            </section>
        </TransitionModal>
    );
}
