import ClickAwayListener from "@mui/material/ClickAwayListener";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function NotificationsPopup({ onClose, open }: Props): JSX.Element {
    if (!open) return <></>;
    return (
        <ClickAwayListener onClickAway={onClose}>
            <div className="header-popup notifications-popup">
                <h1 className="title">Notifications</h1>

                <h3 style={{ fontWeight: "normal" }}>Currently in development...</h3>
                {/* <div className="notifications-container"></div> */}
            </div>
        </ClickAwayListener>
    );
}
