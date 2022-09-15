import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

import { Elements } from "../../utils/namespaces";

const _EMERGENCY_STYLE = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    width: "400px",
    height: "50vh",
    backgroundColor: "white",
    color: "black",

    border: "1px solid black",
    boxShadow: "3px 5px 8px white",
};

export interface TransitionModalProps extends Elements.Div {
    open: boolean;
    onClose: () => void;

    noCloseButton?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export default function TransitionModal({
    className,
    open,
    noCloseButton = false,
    onClose,
    children,
    ...rest
}: TransitionModalProps): JSX.Element {
    /**
     * Creates a modal with properties that can be adjusted in css.
     *
     * How to use:
     * Wrap the react node(s) around a single element with a className that
     * will be used for styling the entire modal in css.
     *
     * Ex.
     * JSX snippet
     * <TransitionModal className="cart-modal" open={...} onClose={...}>
     *     ...
     * </TransitionModal>
     *
     * CSS snippet
     * .cart-modal {
     *     position: fixed;
     *     top: 0;
     *     left: 0;
     * }
     *
     * @NOTE position: (fixed | absolute) is required for the modal to be
     * in front of the shade.
     *
     */

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade
                in={open}
                style={className ? {} : _EMERGENCY_STYLE}
                className={`modal ${className}`}
            >
                <div {...rest}>
                    {!noCloseButton && (
                        <Button color="error" className="close-btn" onClick={onClose}>
                            X
                        </Button>
                    )}

                    {children}
                </div>
            </Fade>
        </Modal>
    );
}
