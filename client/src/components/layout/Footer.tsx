import Button from "@mui/material/Button";

import { BRANDING_DETAILS, SITE_EMAIL } from "../../../.app/branding";

interface Props {}

export default function Footer({}: Props): JSX.Element {
    return (
        <footer className="app-footer">
            <section className="section social-media-container">
                <h1>Visit our social medias</h1>
                <div className="social-media-links">Coming soon...</div>
            </section>

            <section className="section contact-section">
                <Button className="contact-btn">
                    <a href={`mailto:${SITE_EMAIL}`} className="link">
                        Have something to say? Contact us.
                    </a>
                </Button>
            </section>

            <section className="section main-portion">
                <img
                    src={BRANDING_DETAILS.logo.src}
                    alt={`${BRANDING_DETAILS.title} logo`}
                    className="logo"
                />
                <div className="title">{BRANDING_DETAILS.title}. All rights reserved.</div>
            </section>
        </footer>
    );
}
