import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { PageRoutes } from "../utils/enums";

export default function Custom404(): JSX.Element {
    const router = useRouter();

    return (
        <div className="error-page">
            <div>Where are you going</div>
            <Button variant="contained" onClick={() => router.push(PageRoutes.Home)}>
                Go home
            </Button>
            <Button variant="contained" onClick={() => router.back()}>
                Or go back
            </Button>
        </div>
    );
}
