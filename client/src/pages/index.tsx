import { GetServerSideProps } from "next";
import Head from "next/head";

import PostInteractionVesselList from "../components/cadmissions/contentDelivery/PostInteractionVesselList";
import { API, Cadmiss } from "../utils/namespaces";
import { HeaderKeys } from "../utils/namespaces/API";

interface HomeProps {
    posts: Cadmiss.Post[];
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
    // appConsoleLog(context.req.headers.cookie);

    const data = await API.appGetRequest<API.InteractionMap[API.Routes.GetHomepage]>(
        `${API.Space.Users}${API.Routes.GetHomepage}`,
        {
            credentials: "include",
            headers: { [HeaderKeys.SSRCookieString]: context.req.headers.cookie ?? "" },
        }
    );
    // console.log(data);

    return {
        props: {
            // posts: Cadmiss.PLACEHOLDER_POSTS,
            posts: data.posts,
        },
    };
};

export default function Home({ posts }: HomeProps): JSX.Element {
    // useEffect(() => {
    // async function testReq() {
    //     const data = await API.appPostRequest("/a/", { stuff: 1 });
    //     console.log(data);
    // }
    // testReq();

    // API.appGetRequest("/cook", { credentials: "include" });

    // API.appDeleteRequest("/posts/asd", { credentials: "include" })
    //     .then(console.log)
    //     .catch(console.log);

    // const data = API.appDeleteRequest<API.InteractionMap[API.Routes.DeleteComment]>(
    //     `${API.Space.Comments}/bruh`,
    //     { credentials: "include" }
    // ).then(console.log);
    // }, []);

    const onGetProfile = async () => {
        const data = await API.appGetRequest("/users/profile", { credentials: "include" });
        console.log(data);
    };

    return (
        <div className="homepage-container">
            <PostInteractionVesselList posts={posts} />
        </div>
    );
}
