import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DetailsIcon from "@mui/icons-material/Details";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { useState } from "react";
import { useRouter } from "next/router";

import ChangePasswordModal from "../components/cadmissions/accounts/ChangePasswordModal";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logOut } from "../redux/slices/clientSlice";
import { PageRoutes } from "../utils/enums";
import { API } from "../utils/namespaces";
import { appConsoleLog } from "../clientDebugging";

export default function Settings(): JSX.Element {
    const [changingPassword, setChangingPassword] = useState(false);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const toggleChangingPassword = () => {
        setChangingPassword((prevChangingPassword) => !prevChangingPassword);
    };

    const handleDeleteAccount = async () => {
        const confirmRequiredMessage = "delete";
        const confirm = window.prompt(
            `Are you sure you want to delete your account? Type "${confirmRequiredMessage}" to confirm.`
        );

        if (confirm !== confirmRequiredMessage) {
            window.alert('You did not type "delete" to confirm. Your account will not be deleted.');
        } else {
            const data = await API.appDeleteRequest<API.InteractionMap[API.Routes.DeleteAccount]>(
                `/users${API.Routes.DeleteAccount}`,
                { credentials: "include" }
            );
            appConsoleLog(data);

            dispatch(logOut());
            router.push(PageRoutes.Trending);
        }
    };

    return (
        <div className="settings-page">
            <header>
                <h4 className="title">User Settings</h4>
            </header>

            <section className="account-settings">
                <header>
                    <AccountBoxIcon className="icon" />
                    <h1 className="title">Account Settings</h1>
                </header>

                <div className="option">
                    <p className="option-name">Change password</p>
                    <Button
                        variant="contained"
                        className="option-action"
                        onClick={toggleChangingPassword}
                    >
                        Change
                    </Button>
                </div>
            </section>

            <section className="profile-settings">
                <header>
                    <DetailsIcon className="icon" />
                    <h1 className="title">Profile details</h1>
                </header>

                <p>Coming soon..</p>
            </section>

            <section className="dangerous-settings">
                <header>
                    <DangerousIcon className="icon" />
                    <h1 className="title">Dangerous Settings</h1>
                </header>

                <div className="option">
                    <p className="note">
                        Note: Deleting your account will delete all previous activity. (posts,
                        comments, likes, etc.)
                    </p>

                    <div className="option-action">
                        <Button
                            color="error"
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteAccount}
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </section>

            <ChangePasswordModal open={changingPassword} onClose={toggleChangingPassword} />
        </div>
    );
}
