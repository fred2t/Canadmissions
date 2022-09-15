import Button from "@mui/material/Button";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import useLocalStorage from "../../utils/hooks/useLocalStorage";
import { API, Cadmiss } from "../../utils/namespaces";
import { startSigningUp } from "../../redux/slices/clientSlice";
import { appConsoleLog } from "../../clientDebugging";

interface SchoolCommunitySummaryCardProps {
    isCommunityMember?: boolean | undefined;
    hideable?: boolean | undefined;
    joinable?: boolean | undefined;
}

export default function SchoolCommunitySummaryCard({
    isCommunityMember,
    hideable = false,
    joinable = false,
}: SchoolCommunitySummaryCardProps): JSX.Element {
    const { selectedCommunity } = useAppSelector((s) => s.content);
    const cardHiddenKey: `${Cadmiss.SchoolAcronyms}-card-hidden` = `${
        // should not be undefined because they picked a school before making a post,
        // if there're errors with, just do a lookup with 'undefined' code since
        // this is a low-priority feature and causes negligible damage
        selectedCommunity?.acronym as Cadmiss.SchoolAcronyms
    }-card-hidden`;

    const [cardHidden, setCardHidden] = useLocalStorage(cardHiddenKey, false);
    const [isFollowingSchool, setIsFollowingSchool] = useState(isCommunityMember);

    const { loggedIn } = useAppSelector((s) => s.client);

    const dispatch = useAppDispatch();
    const router = useRouter();

    // propogate new state after new ssr data is received
    // necessary cause useState initial value won't change after the first render
    useEffect(() => {
        setIsFollowingSchool(isCommunityMember);
    }, [router.query.community]);

    // there should be a selected school when they navigate to this page
    // return right now if there isn't
    if (selectedCommunity == null) return <></>;

    const toggleCardVisibility = () => {
        setCardHidden((prevCardHidden) => !prevCardHidden);
    };

    const handleFollowCommunity = async () => {
        if (!loggedIn) return dispatch(startSigningUp());

        setIsFollowingSchool((prevFollow) => !prevFollow);

        const data = await API.appPostRequest<API.InteractionMap[API.Routes.ToggleJoinCommunity]>(
            `/communities${API.Routes.ToggleJoinCommunity}`,
            { community: selectedCommunity.acronym },
            { credentials: "include" }
        );
        appConsoleLog(data);
    };

    return (
        <div className="school-community-summary-card">
            {cardHidden ? (
                <div className="hidden-card-bar">
                    <h1>{selectedCommunity.fullName}</h1>

                    <Button
                        variant="contained"
                        className="open-card-btn"
                        onClick={toggleCardVisibility}
                    >
                        Open
                    </Button>
                </div>
            ) : (
                <>
                    {hideable && (
                        <Button
                            variant="contained"
                            className="hide-card-btn"
                            onClick={toggleCardVisibility}
                        >
                            Hide
                        </Button>
                    )}

                    <img
                        src={selectedCommunity.logo.src}
                        alt={`${selectedCommunity.fullName} community logo`}
                        className="school-logo"
                    />

                    <div className="school-community-information">
                        <div className="main-info">
                            <div className="top-bar">
                                <h1 className="full-name">{selectedCommunity.fullName}</h1>
                                {joinable && (
                                    <Button
                                        variant="contained"
                                        startIcon={
                                            isFollowingSchool ? (
                                                <BookmarkRemoveIcon />
                                            ) : (
                                                <BookmarkIcon />
                                            )
                                        }
                                        className="join-btn"
                                        onClick={handleFollowCommunity}
                                    >
                                        {isFollowingSchool ? "Leave" : "Join"}{" "}
                                        {selectedCommunity.acronym}
                                    </Button>
                                )}
                            </div>

                            <p className="summary">{selectedCommunity.summary}</p>
                            <p className="learn-more-link">
                                Learn more about{" "}
                                <a href={selectedCommunity.moreInformationLink}>
                                    {selectedCommunity.fullName}
                                </a>
                            </p>
                        </div>

                        <div className="random-details">
                            <h6>{selectedCommunity.acronym}</h6>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
