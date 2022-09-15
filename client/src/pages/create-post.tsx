import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useRouter } from "next/router";
import SchoolIcon from "@mui/icons-material/School";

import SearchingSitePopup from "../components/cadmissions/actionPopups/SearchingSitePopup";
import CommunityParticipationEditor from "../components/cadmissions/contentDelivery/CommunityParticipationEditor";
import { API, Cadmiss } from "../utils/namespaces";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { savePost, setSelectedSchool } from "../redux/slices/contentSlice";
import SchoolCommunitySummaryCard from "../components/cadmissions/SchoolCommunitySummaryCard";
import { objectFill } from "../utils/methods/objectHelpers";
import { DynamicRoutes } from "../utils/enums";
import { appConsoleLog } from "../clientDebugging";

interface CreatePostProps {}

export default function CreatePost({}: CreatePostProps): JSX.Element {
    const [choosingCommunity, setChoosingCommunity] = useState(false);
    const [searchedText, setSearchedText] = useState("");
    const [chooseSchoolHelperText, setChooseSchoolHelperText] = useState("");
    const [titleHelperText, setTitleHelperText] = useState("");
    const chooseCommunityInputRef = useRef<HTMLDivElement>(null);

    const { selectedCommunity, savedPost } = useAppSelector((s) => s.content);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const toggleChoosingCommunity = () => {
        if (chooseSchoolHelperText) return setChooseSchoolHelperText("Please select a community");

        setChoosingCommunity((prevChoosingCommunity) => !prevChoosingCommunity);
    };

    const handleClickCommunity = (school: Cadmiss.SchoolDetails) => {
        // redirect to submit page for specific school
        router.push(`/create-post/${school.acronym}`);

        // they can't call this method if the dropdown isn't open so this will close it
        toggleChoosingCommunity();
        dispatch(setSelectedSchool(school));
    };

    const handleEditTitle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // update stored text and error message when changed
        dispatch(
            savePost((prevSavedPost) => {
                return { ...prevSavedPost, title: e.target.value };
            })
        );

        setTitleHelperText("");
    };

    const handleEditBodyMetadata = (newBodyMetadata: string) => {
        dispatch(
            savePost((prevSavedPost) => {
                return { ...prevSavedPost, bodyMetadata: newBodyMetadata };
            })
        );
    };

    const handleCreatePost = async (bodyMetadata: string) => {
        // title validations
        if (!savedPost.title) {
            return setTitleHelperText("Title is required");
        } else if (savedPost.title.length > Cadmiss.MAX_POST_TITLE_LENGTH) {
            return setTitleHelperText(
                `Title must be less than ${Cadmiss.MAX_POST_TITLE_LENGTH} characters`
            );
        }

        if (selectedCommunity == null) {
            chooseCommunityInputRef.current?.click();
            chooseCommunityInputRef.current?.scrollIntoView({ behavior: "smooth" });
            alert("Please select a community");
            return;
        }

        const data = await API.appPostRequest<API.InteractionMap[API.Routes.CreatePost]>(
            `/posts/create-post`,
            { title: savedPost.title, bodyMetadata, community: selectedCommunity.acronym },
            { credentials: "include" }
        );
        appConsoleLog(data);

        // delete saved post
        dispatch(savePost((prevPost) => objectFill(prevPost, "")));

        // route the user to the community they just made a post in
        router.push(`${DynamicRoutes.Community}/${selectedCommunity.acronym}`);
    };

    useEffect(() => {
        // if (router.asPath.startsWith(PageRoutes.CreatePost)) {
        //     window.onbeforeunload = () => {
        //         return "Are you sure you want to leave this page? Your unfinished posts will not be saved.";
        //     };
        // }
    }, [router.asPath]);

    return (
        <div className="create-post-page">
            <header className="header">
                <h1 className="title">Create a post in </h1>

                <div className="input-container">
                    <TextField
                        ref={chooseCommunityInputRef}
                        className="input"
                        type="text"
                        required
                        placeholder={"Choose Schools"}
                        InputProps={{
                            startAdornment: selectedCommunity ? <SchoolIcon /> : <SearchIcon />,
                            endAdornment: choosingCommunity ? (
                                <KeyboardArrowDownIcon />
                            ) : (
                                <KeyboardArrowUpIcon />
                            ),
                        }}
                        onClick={toggleChoosingCommunity}
                        value={searchedText}
                        onChange={(e) => setSearchedText(e.target.value)}
                    />
                    <SearchingSitePopup
                        open={choosingCommunity}
                        onClose={toggleChoosingCommunity}
                        searchedText={searchedText}
                        onClickCommunity={handleClickCommunity}
                        className="pick-community-popup"
                    />
                </div>
            </header>

            {selectedCommunity != null && <SchoolCommunitySummaryCard hideable />}

            <section className="create-post-container">
                <TextField
                    label="Title"
                    className="input title-input"
                    fullWidth
                    value={savedPost.title}
                    onChange={handleEditTitle}
                    helperText={`${savedPost.title.length}/${Cadmiss.MAX_POST_TITLE_LENGTH}`}
                    {...(titleHelperText && {
                        error: true,
                        helperText: titleHelperText,
                    })}
                />

                <CommunityParticipationEditor
                    submitButtonText="Create Post"
                    placeholderText="Your post"
                    showEmptyBodyTip
                    requiredBody
                    initialBodyMetadata={savedPost.bodyMetadata}
                    maxBodyMetadataLength={Cadmiss.MAX_POST_CONTENT_LENGTH}
                    onBodyMetadataChange={handleEditBodyMetadata}
                    onSubmit={handleCreatePost}
                />
            </section>
        </div>
    );
}
