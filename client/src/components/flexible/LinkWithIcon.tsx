import { Button } from "@mui/material";
import Link from "next/link";

import { Elements } from "../../utils/namespaces";

interface Props extends Elements.Div {
    href: string;
    children: React.ReactNode;
    icon: Elements.MUIIcon;
    className?: string;
}

function LinkWithIcon({ href, children, icon: Icon, className }: Props): JSX.Element {
    const editedClass = `link-with-icon ${className ?? ""}`;

    return (
        <Link href={href}>
            <Button className={editedClass}>
                <Icon />
                {children}
            </Button>
        </Link>
    );
}

export default LinkWithIcon;
