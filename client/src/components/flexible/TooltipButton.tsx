import Tooltip from "@mui/material/Tooltip";
import Button, { ButtonProps } from "@mui/material/Button";

import { Elements } from "../../utils/namespaces";

interface TooltipButtonProps extends ButtonProps {
    hoverText: string;
    icon: Elements.MUIIcon;
}

export default function TooltipButton({
    hoverText,
    icon: Icon,
    className,
    ...rest
}: TooltipButtonProps) {
    return (
        <Tooltip title={hoverText} arrow placement="bottom">
            <Button className={`tooltip-btn ${className ?? ""}`} {...rest}>
                <Icon className="icon" />
            </Button>
        </Tooltip>
    );
}
