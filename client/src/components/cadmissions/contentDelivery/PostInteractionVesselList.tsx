import Button from "@mui/material/Button";
import StyleIcon from "@mui/icons-material/Style";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CreateIcon from "@mui/icons-material/Create";
import { useRouter } from "next/router";

import { Cadmiss } from "../../../utils/namespaces";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { startSigningUp } from "../../../redux/slices/clientSlice";

import CommunityPostList from "./CommunityPostList";

interface PostsListProps {
    posts: Cadmiss.Post[];
    makePostUtilBtn?: boolean | undefined;
}

export default function PostInteractionVesselList({
    posts,
    makePostUtilBtn = false,
}: PostsListProps): JSX.Element {
    const [pickingTag, setPickingTag] = useState(false);
    const [filters, setFilters] = useState(Cadmiss.DEFAULT_MAPPABLE_POST_FILTERS);

    const { loggedIn } = useAppSelector((s) => s.client);
    const { selectedCommunity } = useAppSelector((s) => s.content);

    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleStartMakingAccount = () => {
        dispatch(startSigningUp());
    };

    const handlePickingTag = () => {
        setPickingTag((prevPickingTag) => !prevPickingTag);
    };

    const handleSelectFilter = (filter: Omit<Cadmiss.MappablePostFilters, "startIcon">) => {
        setFilters((prevFilters) =>
            prevFilters.map((prevFilter) => {
                return { ...prevFilter, selected: prevFilter.name === filter.name };
            })
        );
    };

    return (
        <div className="community-interaction-vessel">
            <header className="community-header">
                {!loggedIn ? (
                    <div className="bar not-logged-in-bar">
                        <Button
                            className="btn"
                            variant="contained"
                            color="info"
                            style={{ marginRight: ".5rem" }}
                            startIcon={<CreateIcon />}
                            onClick={handleStartMakingAccount}
                        >
                            Make an account
                        </Button>
                        <span>to create and filter posts</span>
                    </div>
                ) : (
                    <>
                        {makePostUtilBtn && (
                            <div className="bar make-post-bar">
                                <Button
                                    variant="contained"
                                    className="btn full-width-btn"
                                    startIcon={<PostAddIcon />}
                                    onClick={() =>
                                        router.push(`/create-post/${selectedCommunity?.acronym}`)
                                    }
                                >
                                    Make a post
                                </Button>
                            </div>
                        )}

                        <div className="bar filter-posts-bar">
                            <div
                                className="icon-div tag-filter-container"
                                onClick={handlePickingTag}
                            >
                                <StyleIcon className="icon" />
                                <div>Tags</div>
                                {pickingTag ? (
                                    <KeyboardArrowDownIcon className="icon" />
                                ) : (
                                    <KeyboardArrowUpIcon className="icon" />
                                )}
                            </div>

                            <div className="main-filters">
                                {filters.map(({ startIcon: StartIcon, ...filter }) => (
                                    <Button
                                        key={filter.name}
                                        startIcon={<StartIcon />}
                                        className={`btn ${
                                            filter.selected ? "selected" : "unselected"
                                        }`}
                                        onClick={() => handleSelectFilter(filter)}
                                    >
                                        {filter.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </header>

            <CommunityPostList posts={posts} />
        </div>
    );
}
