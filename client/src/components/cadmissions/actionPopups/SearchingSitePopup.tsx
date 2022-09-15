import ClickAwayListener from "@mui/material/ClickAwayListener";
import fuzzysort from "fuzzysort";
// import DOMPurify from "isomorphic-dompurify";
import SchoolIcon from "@mui/icons-material/School";

import { Cadmiss, Elements } from "../../../utils/namespaces";

interface Props extends Elements.Div {
    open: boolean;
    onClose: () => void;
    searchedText: string;
    onClickCommunity: (schoolDetails: Cadmiss.SchoolDetails) => void;
}

export default function SearchingSitePopup({
    open,
    onClose,
    searchedText,
    onClickCommunity,
    className,
    ...rest
}: Props): JSX.Element {
    if (!open || searchedText == undefined) return <></>;

    const filteredResults = fuzzysort.go(searchedText, Cadmiss.SCHOOL_DETAILS, {
        key: "fullName",
        all: true,
    });

    return (
        <ClickAwayListener onClickAway={onClose}>
            <div
                className={`header-popup searching-site-popup ${className ? className : ""}`}
                {...rest}
            >
                <p className="result-details">
                    0 trending posts, {filteredResults.length}{" "}
                    {`school${filteredResults.length > 1 ? "s" : ""}`} for &apos;{searchedText}
                    &apos;
                </p>

                <div className="icon-div">
                    <SchoolIcon className="icon" />
                    <h2>Schools</h2>
                </div>

                {filteredResults.length !== 0 ? (
                    filteredResults.map((school) => (
                        <button
                            key={school.obj.acronym}
                            className="school-search-result"
                            onClick={() => onClickCommunity(school.obj)}
                        >
                            <img
                                src={school.obj.logo.src}
                                alt="school logo"
                                className="school-logo"
                            />

                            <section className="result-information">
                                <div
                                    dangerouslySetInnerHTML={{
                                        // __html: DOMPurify.sanitize(
                                        __html:
                                            // errors when there is no searched text
                                            // package is abandoned too so this is the best option
                                            searchedText.length === 0
                                                ? school.obj.fullName
                                                : fuzzysort.highlight(school) ??
                                                  school.obj.fullName,
                                    }}
                                    className="school-name"
                                />
                                <div className="result-type">School</div>
                            </section>
                        </button>
                    ))
                ) : (
                    <div>No results</div>
                )}
            </div>
        </ClickAwayListener>
    );
}
