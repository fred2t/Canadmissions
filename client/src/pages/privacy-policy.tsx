import { BRANDING_DETAILS } from "../../.app/branding";
import { PageRoutes } from "../utils/enums";

export default function PrivacyPolicy() {
    return (
        <div className="privacy-policy-page">
            <section className="header">
                <h1 className="title">{BRANDING_DETAILS.title} Privacy Policy</h1>
                <p>
                    {BRANDING_DETAILS.title} gathers, uses, and distributes information about you
                    when you use our sites, and we want you to know how and why this happens. All of
                    our services are subject to this Privacy Policy.
                </p>
            </section>

            <section className="points-list-container">
                <h1 className="heading">1. Account creation</h1>
                <p>
                    If you create a {BRANDING_DETAILS.title} account, we may require you to provide
                    a username and password. Your username is public, and it doesn&apos;t have to be
                    related to your real name. You may also provide other account information, like
                    an email address.
                </p>

                <h1 className="heading">2. Inputted content</h1>
                <p>
                    The material you post to the Services is collected by us. Your submissions and
                    comments are included in this. Unfinished versions of posts or comments will not
                    be tracked or stored in any relevant way. You may use text, links, pictures,
                    animated gifs, and videos in your material.
                </p>

                <section className="main-topic">
                    <h1 className="title">Data</h1>
                    <p className="information">
                        We never divulge any of your personal information. But in addition to the
                        publicly visible personal information mentioned above, we may also disclose
                        personal data in the following ways: with your permission, with your
                        permission, or at your direction. If a third-party service would like to
                        link your
                        {BRANDING_DETAILS.title} account with it, you have control over this sharing
                        with our suppliers of services, service providers that require access to the
                        information to provide services for us may get information from us. They
                        will be required to follow the proper confidentiality and security protocols
                        while using personal data, if we think disclosure is required or permitted
                        by any applicable law, regulation, legal process, or governmental request,
                        including, but not limited to, addressing national security or law
                        enforcement obligations, we may release information in response to a request
                        for information. We will make an effort to provide you advance notice before
                        responding to such a request, to the extent permitted by law. Additional
                        details on our responses to government inquiries may be found, during a
                        crisis, if we think it&apos;s essential to stop someone from suffering
                        significant and immediate bodily damage, we may share information, to uphold
                        our rules and legal rights, if we feel your activities are against our{" "}
                        <a href={PageRoutes.UserAgreement}>User Agreement</a>, rules, or other{" "}
                        {BRANDING_DETAILS.title} policies, or to protect our rights, our property,
                        and the safety of others, we may disclose information.
                    </p>
                </section>

                <section className="main-topic">
                    <h1 className="title">Your information leak preventions</h1>
                    <p className="information">All passwords and SSO identifiers are hashed.</p>
                </section>
            </section>

            <section className="points-list-container">
                <h1 className="heading">3. Detach</h1>
                <p>
                    From the user preferences page, you may always remove your account&apos;s data.
                    Please be aware, though, that unless you first remove the specified material,
                    the posts, comments, and messages you made before cancelling your account could
                    still be accessible to others.
                </p>
            </section>
        </div>
    );
}

// prettier-ignore
{BRANDING_DETAILS.title}
