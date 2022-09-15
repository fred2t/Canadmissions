import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import Button from "@mui/material/Button";
// import DOMPurify from "dompurify";

import { appConsoleLog } from "../../../clientDebugging";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { removeSpaceAndNL, roundDecimal } from "../../../utils/methods/generalHelpers";
import { lengthWarningTextDecorater } from "../../../utils/namespaces/Aesthetics";
import { startSigningUp } from "../../../redux/slices/clientSlice";

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "video"],
    ["direction"],
];

interface CommunityParticipationEditorProps {
    submitButtonText: string;
    onSubmit: (bodyMetadata: string) => unknown;
    placeholderText?: string | undefined;

    clearEditorOnSubmit?: boolean | undefined;
    bannedBodyTexts?: string[] | undefined;
    showEmptyBodyTip?: boolean | undefined;
    requiredBody?: boolean | undefined;
    minBodyTextLength?: number | undefined;
    maxBodyMetadataLength?: number | undefined;
    initialBodyMetadata?: string | undefined;
    onBodyMetadataChange?: (newBodyMetadata: string) => unknown | undefined;
}

export default function CommunityParticipationEditor({
    submitButtonText,
    onSubmit,
    placeholderText,

    clearEditorOnSubmit = false,
    bannedBodyTexts = [],
    showEmptyBodyTip = false,
    requiredBody = false,
    maxBodyMetadataLength = 22000,
    minBodyTextLength,
    initialBodyMetadata,
    onBodyMetadataChange,
}: CommunityParticipationEditorProps): JSX.Element {
    const [quill, setQuill] = useState<Quill>();
    const [editorHelperText, setEditorHelperText] = useState("");
    const [spaceUsed, setSpaceUsed] = useState(0);

    const { loggedIn } = useAppSelector((s) => s.client);

    const dispatch = useAppDispatch();

    const injectEditor = useCallback(
        async (wrapper: HTMLDivElement) => {
            if (wrapper == null) return appConsoleLog("wrapper is null");

            // create and add editor
            wrapper.innerHTML = "";
            const editor = document.createElement("div");
            wrapper.append(editor);

            // dynamic import to to support SSR
            const Quill = (await import("quill")).default;
            const quill = new Quill(editor, {
                theme: "snow",
                modules: { toolbar: TOOLBAR_OPTIONS },
                placeholder: placeholderText ?? "",
            });
            setQuill(quill);
        },
        [placeholderText]
    );

    // update editor body with last saved post body
    useEffect(() => {
        if (quill == null || initialBodyMetadata == null) return;

        // quill.root.innerHTML = DOMPurify.sanitize(initialBodyMetadata);
        quill.root.innerHTML = initialBodyMetadata;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quill]);

    // quill event to update editor information
    useEffect(() => {
        if (quill == null) return;

        // extract as function to have reference to delete when finished with event listener
        const textChangeHandler = () => {
            setSpaceUsed(quill.root.innerHTML.length);
            setEditorHelperText("");

            // save current version of post to global scope
            if (onBodyMetadataChange) {
                onBodyMetadataChange(quill.root.innerHTML);
            }
        };

        quill.on("text-change", textChangeHandler);

        return () => {
            quill.off("text-change", textChangeHandler);
        };
    }, [onBodyMetadataChange, quill]);

    const handleSubmitWrapper = () => {
        if (quill == null) return;
        if (!loggedIn) return dispatch(startSigningUp());

        // empty text body submit guard
        if (requiredBody && removeSpaceAndNL(quill.root.innerText).length === 0) {
            setEditorHelperText("Must have a body");

            // make sure text (not metadata) has minimum
        } else if (minBodyTextLength && quill.root.innerText.length > minBodyTextLength) {
            setEditorHelperText(`Must have more text than ${minBodyTextLength} characters`);

            // make sure metadata (not text) is under maximum
        } else if (maxBodyMetadataLength && quill.root.innerHTML.length > maxBodyMetadataLength) {
            setEditorHelperText(`Must take less than ${maxBodyMetadataLength} space`);

            //
        } else if (bannedBodyTexts.length > 0 && bannedBodyTexts.includes(quill.root.innerText)) {
        } else {
            onSubmit(quill.root.innerHTML);

            if (clearEditorOnSubmit) quill.root.innerText = "";
        }
    };

    return (
        <div className="community-participation-editor-container">
            {/* <div
                dangerouslySetInnerHTML={{
                    __html: '<p><u>asd</u></p><p><u>as</u><em><u>da</u></em></p><p><em>sd</em></p><p><strong><em>as</em></strong></p><p><a href="https://example.com/" rel="noopener noreferrer" target="_blank">https://example.com/</a></p><p><strong>das</strong></p><p>d</p><p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJkAAACZCAMAAAALgmiIAAAAYFBMVEX///8yMjL6+vqPj4/T09M+Pj5sbGxPT0/p6ek1NTWvr6+Li4uQkJAxMTG0tLSJiYnl5eVVVVWYmJirq6tZWVlycnKfn5/u7u50dHTU1NTa2tpdXV1BQUFiYmJpaWlHR0fKwQTpAAABsElEQVR4nO3ZjW6CMBSGYQF/gCKoTN3Ubfd/l5OKSNmSWdtmZ/I+wVIaTb4caCwwmQAAAAAAAAAA4Cx2EjJZPneQh0xWRA6SkMkSl2QqZDKnmgVNJrdmTsmCXmfPOQMyuTNA7tmUOwNGejbl1kxusiLTovbT7KK21x43e52jG9IDzc7r2YzLjaHO67zZmuba6w5K3eTdF/rDTW/qNdk8MwRdYlmJ58aVIjdZJDaZ3JqR7A4ks0cye8Nk5V8H6vyfmpHsd/Fme/Gqt239NvXm4PbUavAErJj5c9x7Kp/mtNo2Ldep0GSR32ROd3XDZFLPpuSajeQ6k5uMGWBvFDNA7n+A52RyZ8Bu4eBk1mxx2BvcFkX7dJWeN92kt2bV9lY/DN+aXWZEy9YvPcf3g6fqPaA0kw3MvD5eIxnJSEYykpHs2ZIt+92lpGTmK62TXbI4T0xFYqPo94oPM9hnXRrsFpLD904+ua22AyZzvA+gZiS7M5nTXd0oayZ3BpDskWTMAGtPmyxXVaJUcm6qtlHXphlWlUpUO6yuw99+cvudPlCXZuf1+RkAAAAAAAAAAAJ8AWacMN2Y0in6AAAAAElFTkSuQmCC" data-deferred="1" class="rg_i Q4LuWd" jsname="Q4LuWd" width="153" height="153" alt="After a successful form submission, how do I redirect to another page? -  Coding and Customization - Squarespace Forum" data-atf="true" data-iml="570.3999999761581"></p>',
                }}
            /> */}

            <button onClick={() => (quill!.root.innerHTML = "")}>none</button>
            <button onClick={() => console.log(quill?.root.innerHTML)}>aasdasd</button>
            <button onClick={() => console.log(quill?.root.innerHTML.length)}>len</button>

            {/* <button
                onClick={() => {
                    if (quill == null) return;
                    quill.root.innerHTML =
                        '<p><u>asd</u></p><p><u>as</u><em><u>da</u></em></p><p><em>sd</em></p><p><strong><em>as</em></strong></p><p><a href="https://example.com/" rel="noopener noreferrer" target="_blank">https://example.com/</a></p><p><strong>das</strong></p><p>d</p><p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJkAAACZCAMAAAALgmiIAAAAYFBMVEX///8yMjL6+vqPj4/T09M+Pj5sbGxPT0/p6ek1NTWvr6+Li4uQkJAxMTG0tLSJiYnl5eVVVVWYmJirq6tZWVlycnKfn5/u7u50dHTU1NTa2tpdXV1BQUFiYmJpaWlHR0fKwQTpAAABsElEQVR4nO3ZjW6CMBSGYQF/gCKoTN3Ubfd/l5OKSNmSWdtmZ/I+wVIaTb4caCwwmQAAAAAAAAAA4Cx2EjJZPneQh0xWRA6SkMkSl2QqZDKnmgVNJrdmTsmCXmfPOQMyuTNA7tmUOwNGejbl1kxusiLTovbT7KK21x43e52jG9IDzc7r2YzLjaHO67zZmuba6w5K3eTdF/rDTW/qNdk8MwRdYlmJ58aVIjdZJDaZ3JqR7A4ks0cye8Nk5V8H6vyfmpHsd/Fme/Gqt239NvXm4PbUavAErJj5c9x7Kp/mtNo2Ldep0GSR32ROd3XDZFLPpuSajeQ6k5uMGWBvFDNA7n+A52RyZ8Bu4eBk1mxx2BvcFkX7dJWeN92kt2bV9lY/DN+aXWZEy9YvPcf3g6fqPaA0kw3MvD5eIxnJSEYykpHs2ZIt+92lpGTmK62TXbI4T0xFYqPo94oPM9hnXRrsFpLD904+ua22AyZzvA+gZiS7M5nTXd0oayZ3BpDskWTMAGtPmyxXVaJUcm6qtlHXphlWlUpUO6yuw99+cvudPlCXZuf1+RkAAAAAAAAAAAJ8AWacMN2Y0in6AAAAAElFTkSuQmCC" data-deferred="1" class="rg_i Q4LuWd" jsname="Q4LuWd" width="153" height="153" alt="After a successful form submission, how do I redirect to another page? -  Coding and Customization - Squarespace Forum" data-atf="true" data-iml="570.3999999761581"></p>';
                }}
            >
                asd
            </button> */}
            {/* <button onClick={() => quill.root.innerHTML = Cadmiss.AUTHOR_DELETED_BODY}>asd</button> */}

            {!quill && <h2>Loading editor...</h2>}
            <div ref={injectEditor} className="editor" />
            <p className="editor-error-message">{editorHelperText}</p>

            <div className="footer">
                <div>
                    {maxBodyMetadataLength && (
                        <h3
                            className={`${lengthWarningTextDecorater(
                                spaceUsed,
                                maxBodyMetadataLength
                            )}`}
                        >
                            Max space used: {spaceUsed}/{maxBodyMetadataLength} (
                            {roundDecimal((spaceUsed / maxBodyMetadataLength) * 100, 2)}%)
                        </h3>
                    )}
                    {showEmptyBodyTip && maxBodyMetadataLength && (
                        <p>
                            *Empty body can take up space because of generated initial space
                            allocation
                        </p>
                    )}
                </div>

                <Button variant="contained" className="submit-btn" onClick={handleSubmitWrapper}>
                    {submitButtonText}
                </Button>
            </div>
        </div>
    );
}
