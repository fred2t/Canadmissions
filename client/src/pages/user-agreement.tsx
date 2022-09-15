import { BRANDING_DETAILS } from "../../.app/branding";
import { PageRoutes } from "../utils/enums";

export default function UserAgreement() {
    return (
        <div className="user-agreement-page">
            <section className="header">
                <h1 className="title">{BRANDING_DETAILS.title} User Agreement</h1>
                <p>
                    This {BRANDING_DETAILS.title} User Agreement governs your access to and use of
                    {BRANDING_DETAILS.title}&apos;s websites, APIs, emails, and other online
                    products and services. You may not access or use our Services if you do not
                    agree to these Terms.
                </p>
            </section>

            <section className="points-list-container">
                <h2 className="heading">1. Privacy</h2>
                <p>
                    The <a href={PageRoutes.PrivacyPolicy}>Privacy Policy</a> of{" "}
                    {BRANDING_DETAILS.title} describes how and why we collect, use, and disclose
                    information about you when you use or use our Services. You understand that by
                    using the Services, you consent to the collecting and use of this information in
                    accordance with the Privacy Policy.
                </p>

                <h2 className="heading">2. Using services</h2>
                <p>
                    {BRANDING_DETAILS.title} now provides you a personal, non-transferable,
                    non-exclusive, revocable, limited licence to: (a) install and use on a mobile
                    device you own or control a copy of our mobile application connected with the
                    Services that you purchased from an authorised market; and (b) access and use
                    the Services, subject to your full and continuing compliance with these Terms.
                    We retain all rights that are not expressly granted to you by these Terms.
                    Except where prohibited by law, you may not modify, create a derivative work
                    from, disassemble, decompile, or reverse engineer any portion of the Services or
                    Content without our written consent. You also may not sell, transfer, assign,
                    distribute, host, or otherwise commercially exploit the Services or Content.
                </p>

                <h2 className="heading">3. {BRANDING_DETAILS.title} Account</h2>
                <p>
                    You might need to create a {BRANDING_DETAILS.title} account, provide us with a
                    username, password, and other personal information as outlined in the{" "}
                    <a href={PageRoutes.PrivacyPolicy}>Privacy Policy</a> in order to use various
                    elements of our Services. The data associated with your Account and everything
                    that happens in connection with it are solely your responsibility. You are
                    responsible for keeping your Account safe and must notify{" "}
                    {BRANDING_DETAILS.title} right once if you discover or suspect that someone has
                    accessed your Account without your permission. We advise you to make a secure
                    password for your Account. You will not licence, sell, or transfer your Account
                    without first receiving our express written authorization.
                </p>

                <h2 className="heading">4. Third-party content and advertisements</h2>
                <p>
                    Links to third-party websites, goods, or services provided by advertisers,
                    affiliates, partners, or other users may be found within the Services. We have
                    no control over any third-party websites, products, or services, and we are not
                    liable for any of their content. You do so at your own risk, and before moving
                    through with any transaction involving such Third-Party Content, you should
                    conduct all necessary investigation. On the Services, there can also be
                    sponsored Third-Party Content or advertising. You acknowledge and accept that
                    the sort, scope, and targeting of ads are subject to change and that we may post
                    advertisements in conjunction with the display of any Content or information on
                    the Services, including Your Content.
                </p>

                <h2 className="heading">5. Prohibited</h2>
                <p>
                    You must abide by these Terms as well as any and all relevant laws, rules, and
                    regulations when using or accessing {BRANDING_DETAILS.title}. You are not
                    allowed to perform any of the following: utilize the services in any way that
                    might obstruct, disable, interrupt, overload, or harm the service in any other
                    way; gain access to a different user&apos;s account or any otherwise private
                    areas of the services, including any networks or computer systems connected to
                    or utilising the services, any programme designed to disrupt the Services,
                    including its security-related features, must not be uploaded, sent, or
                    distributed to or through the services, use the Services in a way that we deem
                    to be an abuse of or fraud on {BRANDING_DETAILS.title} or any payment system,
                    including but not limited to: accessing, searching, or collecting data from the
                    Services in any way that is not expressly permitted by these Terms or in a
                    separate agreement with {BRANDING_DETAILS.title}.
                </p>
            </section>
        </div>
    );
}
