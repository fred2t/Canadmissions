import ClickAwayListener from "@mui/material/ClickAwayListener";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import { useRouter } from "next/router";
import LogoutIcon from "@mui/icons-material/Logout";

import { PageRoutes } from "../../../utils/enums";
import { BRANDING_DETAILS, SITE_EMAIL } from "../../../../.app/branding";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { logOut } from "../../../redux/slices/clientSlice";
import { API } from "../../../utils/namespaces";
import { appConsoleLog } from "../../../clientDebugging";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function UtilityMenuPopup({ onClose, open }: Props): JSX.Element {
    const { loggedIn } = useAppSelector((s) => s.client);

    const router = useRouter();
    const dispatch = useAppDispatch();

    const redirectAndClose = (route: PageRoutes | string) => {
        router.push(route);
        onClose();
    };

    const handleLogOut = async () => {
        dispatch(logOut());

        const data = await API.appPostRequest<API.InteractionMap[API.Routes.LogOut]>(
            `/users${API.Routes.LogOut}`,
            {},
            { credentials: "include" }
        );
        appConsoleLog(data);

        onClose();
    };

    if (!open) return <></>;
    return (
        <ClickAwayListener onClickAway={onClose}>
            <div className="header-popup header-utility-menu-popup">
                {loggedIn && (
                    <section>
                        <h1 className="section-header">
                            <AccountCircleIcon className="icon" />
                            <div>Your account</div>
                        </h1>
                        <Button className="btn" onClick={() => redirectAndClose(`/users/1`)}>
                            Profile
                        </Button>
                        <Button
                            className="btn"
                            onClick={() => redirectAndClose(PageRoutes.Settings)}
                        >
                            Settings
                        </Button>
                    </section>
                )}

                <section>
                    <h1 className="section-header">
                        <MiscellaneousServicesIcon className="icon" />
                        <div>Miscellaneous</div>
                    </h1>
                    <Button
                        className="btn"
                        onClick={() => redirectAndClose(PageRoutes.UserAgreement)}
                    >
                        User Agreement
                    </Button>
                    <Button
                        className="btn"
                        onClick={() => redirectAndClose(PageRoutes.PrivacyPolicy)}
                    >
                        Privacy Policy
                    </Button>
                    <Button className="btn">
                        <a href={`mailto:${SITE_EMAIL}`} className="email-contact-link">
                            Contact {BRANDING_DETAILS.title}
                        </a>
                    </Button>
                </section>

                {loggedIn && (
                    <section>
                        <h1 className="section-header">
                            <LogoutIcon className="icon" />
                            <div>Exit</div>
                        </h1>
                        <Button className="btn" onClick={handleLogOut}>
                            Log Out
                        </Button>
                    </section>
                )}
            </div>
        </ClickAwayListener>
    );
}
