import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { changeUsername } from "../../../redux/slices/clientSlice";
import { API } from "../../../utils/namespaces";
import { requestChangeUsername } from "../../../utils/services";
import { appConsoleLog } from "../../../clientDebugging";

interface PickUsernamePopupProps {}

export default function PickUsernamePopup({}: PickUsernamePopupProps): JSX.Element {
    const [changingUsername, setChangingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [helperMessage, setHelperMessage] = useState("");

    const { pickingUsername, temporaryUsername } = useAppSelector((s) => s.client);

    const dispatch = useAppDispatch();

    useEffect(() => {
        const usernameValidated = validateUsername();
        if (usernameValidated) setHelperMessage("");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newUsername]);

    const handleStartChangingUsername = () => {
        setChangingUsername(true);
    };

    const handleStopChangingUsername = () => {
        setChangingUsername(false);
    };

    const validateUsername = () => {
        if (newUsername.length === 0) {
            return setHelperMessage("Username cannot be empty");
        } else if (newUsername.length > 20) {
            return setHelperMessage("Username must be less than 20 characters");
        }

        return true;
    };

    const confirmUsernameDecision = (username: string) => {
        const confirmed = confirm(
            `Are you sure you want to use the username, '${username}' forever?`
        );
        return confirmed;
    };

    const handleAcceptGivenUsername = async () => {
        const confirmed = confirmUsernameDecision(temporaryUsername);

        if (confirmed) dispatch(changeUsername(null));
    };

    const handleContinueChangingUsername = async () => {
        // validation
        const usernameValidated = validateUsername();
        if (!usernameValidated) return;

        const data = await requestChangeUsername(newUsername);
        appConsoleLog(data);

        if ("usernameTaken" in data) {
            return setHelperMessage("Username taken");
        } else {
            const { newUsername } = data;

            dispatch(changeUsername(newUsername));
        }
    };

    if (!pickingUsername) return <></>;
    return (
        <div className="pick-username-popup">
            {!changingUsername ? (
                <>
                    <p className="message">
                        This is your current assigned username. You cannot change it after this is
                        closed.
                    </p>
                    <h3>{temporaryUsername}</h3>
                    <Button
                        variant="contained"
                        className="btn"
                        onClick={handleStartChangingUsername}
                    >
                        Change Username
                    </Button>
                    <Button variant="outlined" className="btn" onClick={handleAcceptGivenUsername}>
                        Keep Username
                    </Button>
                </>
            ) : (
                <>
                    <Button onClick={handleStopChangingUsername}>Go Back</Button>

                    <TextField
                        label="Username"
                        className="input"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        error={helperMessage.length > 0}
                        // remove spaces from username
                        helperText={helperMessage}
                        {...(helperMessage.length === 0 && {
                            helperText: `Your username: ${newUsername.replaceAll(" ", "")}`,
                        })}
                    />

                    <Button
                        variant="contained"
                        className="btn"
                        onClick={handleContinueChangingUsername}
                    >
                        Change
                    </Button>
                </>
            )}
        </div>
    );
}
