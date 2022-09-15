import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAppDispatch } from "../../redux/hooks";
import { setSelectedSchool } from "../../redux/slices/contentSlice";
import { PageRoutes } from "../../utils/enums";
import { Cadmiss } from "../../utils/namespaces";

export default function useControlDynamicCommunity() {
    /**
     * Utility blocks for dynamic school loading.
     *
     * Each condition block will cover every dynamic community page so all routes
     * with the dynamic :community won't all have to define them.
     */

    const router = useRouter();
    const dispatch = useAppDispatch();

    const { community: urlSchoolAcronym } = router.query as { community: string };
    const routeCommunity = Cadmiss.SCHOOL_DETAILS.find(
        (school) => school.acronym === urlSchoolAcronym
    );

    // update the state instantly if the user enters the site on a community page
    useEffect(() => {
        if (routeCommunity != null) {
            // update the page ui with the school-related state if they load into
            // a school's page instead of selecting a school state by clicking it
            dispatch(setSelectedSchool(routeCommunity));
        }
    }, [dispatch, routeCommunity]);

    // whenever the user goes to a dynamic community route that doesn't exist,
    // redirect them
    useEffect(() => {
        if (!urlSchoolAcronym) return;

        // if they visited a non-existing community, redirect to home
        if (routeCommunity == null) {
            router.push(PageRoutes.CommunityNotExist);
            return;
        }
    }, [dispatch, urlSchoolAcronym]);
}
