import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { appConsoleLog } from "../../../clientDebugging";
import PostInteractionVesselList from "../../../components/cadmissions/contentDelivery/PostInteractionVesselList";
import SchoolCommunitySummaryCard from "../../../components/cadmissions/SchoolCommunitySummaryCard";
import { useAppSelector } from "../../../redux/hooks";
import { API, Cadmiss } from "../../../utils/namespaces";

interface CommunityProps {
    isCommunityMember: boolean;
    communityPosts: Cadmiss.Post[];
}

export const getServerSideProps: GetServerSideProps<CommunityProps> = async (context) => {
    const { community } = context.query as { community: Cadmiss.SchoolAcronyms };
    appConsoleLog(context.query);

    const data = await API.appGetRequest<
        API.InteractionMap[API.Routes.GetInteractiveCommunityInfo]
    >(`/communities/${community}`, {
        headers: { [API.HeaderKeys.SSRCookieString]: context.req.headers.cookie ?? "" },
    });
    appConsoleLog(data);

    if (!("isCommunityMember" in data)) {
        return { notFound: true };
    }

    return { props: data };
};

export default function Community({
    isCommunityMember,
    communityPosts,
}: CommunityProps): JSX.Element {
    const router = useRouter();

    return (
        <div className="school-community-page">
            <Head>
                <title>
                    {
                        Cadmiss.SCHOOL_DETAILS.find(
                            (school) => school.acronym === router.query.community
                        )?.fullName
                    }
                </title>
            </Head>
            <SchoolCommunitySummaryCard
                isCommunityMember={isCommunityMember}
                hideable={false}
                joinable
            />

            <PostInteractionVesselList posts={communityPosts} makePostUtilBtn />
        </div>
    );
}
