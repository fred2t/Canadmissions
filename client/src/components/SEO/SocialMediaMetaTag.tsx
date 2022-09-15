import { Elements } from "../../utils/namespaces";

interface SocialMediaMetaTagProps extends Elements.Meta {}

export default function SocialMediaMetaTag({
    name,
    content,
    ...rest
}: SocialMediaMetaTagProps): JSX.Element {
    /**
     * This component forces 'name' and 'content' props to be defined.
     */

    return <meta name={name} content={content} {...rest} />;
}
