import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import PostAddIcon from "@mui/icons-material/PostAdd";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Tooltip from "@mui/material/Tooltip";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useRouter } from "next/router";
import { useState } from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WorkIcon from "@mui/icons-material/Work";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import HomeIcon from "@mui/icons-material/Home";

import { BRANDING_DETAILS, SITE_EMAIL } from "../../../.app/branding";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { PageRoutes } from "../../utils/enums";
import { startLoggingIn, startSigningUp } from "../../redux/slices/clientSlice";
import { Cadmiss } from "../../utils/namespaces";
import UtilityMenuPopup from "../cadmissions/actionPopups/UtilityMenuPopup";
import NotificationsPopup from "../cadmissions/actionPopups/NotificationsPopup";
import SearchingSitePopup from "../cadmissions/actionPopups/SearchingSitePopup";
import { setSelectedSchool } from "../../redux/slices/contentSlice";
import TooltipButton from "../flexible/TooltipButton";

export default function Header(): JSX.Element {
    const [searchingSite, setSearchingSite] = useState(false);
    const [searchedText, setSearchedText] = useState("");
    const [utilityMenuOpen, setUtilityMenuOpen] = useState(false);
    const [viewingNotifications, setViewingNotifications] = useState(false);

    const { loggedIn } = useAppSelector((s) => s.client);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleStartSigningUp = () => {
        dispatch(startSigningUp());
    };

    const handleStartLoggingIn = () => {
        dispatch(startLoggingIn());
    };

    const toggleSearchingSite = (toggleTo?: boolean | undefined) => {
        setSearchingSite((prevSearchingSite) => toggleTo ?? !prevSearchingSite);
    };

    const handleClickCommunity = (school: Cadmiss.SchoolDetails) => {
        router.push(`/community/${school.acronym}`);

        // close popup
        toggleSearchingSite(false);
        setSearchedText("");
        dispatch(setSelectedSchool(school));
    };

    const handleCreatePost = () => {
        if (!loggedIn) return dispatch(startSigningUp());

        router.push(PageRoutes.CreatePost);

        // make the client select the community being posted to at the create post location,
        // otherwise the post location isn't known
        dispatch(setSelectedSchool(null));
    };

    const toggleViewingNotifications = () => {
        setViewingNotifications((prevViewingNotifications) => !prevViewingNotifications);
    };

    const toggleUtilityMenuAppearance = () => {
        setUtilityMenuOpen((prevMenuOpen) => !prevMenuOpen);
    };

    return (
        <header className="app-header">
            <div
                className="point website-brand-container"
                onClick={() => router.push(PageRoutes.Home)}
            >
                <img src={BRANDING_DETAILS.logo.src} alt="" className="logo" />
                <div className="website-name">{BRANDING_DETAILS.title}</div>
            </div>

            <div className="site-utility-container">
                <TextField
                    className="input"
                    placeholder={`Search ${BRANDING_DETAILS.title}`}
                    InputProps={{
                        startAdornment: <SearchIcon />,
                        endAdornment: searchingSite ? (
                            <KeyboardArrowDownIcon />
                        ) : (
                            <KeyboardArrowUpIcon />
                        ),
                    }}
                    onClick={() => toggleSearchingSite(true)}
                    value={searchedText}
                    onChange={(e) => setSearchedText(e.target.value)}
                />

                <nav className="navigation-container">
                    {loggedIn ? (
                        <>
                            <TooltipButton
                                hoverText="Contact, Ads, Business"
                                href={`mailto:${SITE_EMAIL}`}
                                icon={WorkIcon}
                                className="feature-btn"
                            />

                            <TooltipButton
                                icon={UpcomingIcon}
                                hoverText="Coming features: Chat"
                                className="feature-btn"
                            />

                            {/* if they're not following any communities, their homepage is the trending page */}
                            <TooltipButton
                                icon={TrendingUpIcon}
                                hoverText="Trending"
                                onClick={() => router.push(PageRoutes.Trending)}
                                className="feature-btn"
                            />

                            <TooltipButton
                                icon={HomeIcon}
                                hoverText="Home"
                                onClick={() => router.push(PageRoutes.Home)}
                                className="feature-btn"
                            />

                            <TooltipButton
                                hoverText="Notifications"
                                icon={CircleNotificationsIcon}
                                onClick={toggleViewingNotifications}
                                className="feature-btn"
                            />

                            <TooltipButton
                                hoverText="New Post"
                                icon={PostAddIcon}
                                onClick={handleCreatePost}
                                className="feature-btn"
                            />
                        </>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                className="action-btn"
                                onClick={handleStartSigningUp}
                            >
                                Sign Up
                            </Button>

                            <Button
                                variant="outlined"
                                className="action-btn login-btn"
                                onClick={handleStartLoggingIn}
                            >
                                Log In
                            </Button>
                        </>
                    )}

                    <Tooltip title="Utility" arrow placement="bottom">
                        <div
                            className="tooltip-btn feature-btn profile-container"
                            onClick={toggleUtilityMenuAppearance}
                        >
                            <AccountCircleIcon className="icon" />
                            {utilityMenuOpen ? (
                                <KeyboardArrowDownIcon className="icon" />
                            ) : (
                                <KeyboardArrowUpIcon className="icon" />
                            )}
                        </div>
                    </Tooltip>
                </nav>
            </div>

            <SearchingSitePopup
                open={searchingSite}
                onClose={() => toggleSearchingSite(false)}
                searchedText={searchedText}
                onClickCommunity={handleClickCommunity}
            />
            <NotificationsPopup open={viewingNotifications} onClose={toggleViewingNotifications} />
            <UtilityMenuPopup open={utilityMenuOpen} onClose={toggleUtilityMenuAppearance} />
        </header>
    );
}
