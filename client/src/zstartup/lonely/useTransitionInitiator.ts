import { useEffect } from "react";
import { appConsoleLog } from "../../clientDebugging";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setTransitionController } from "../../redux/slices/aestheticSlice";

export default function useTransitionInitiator(): void {
    /**
     * Used for transitions on page load ---------------------------------------------------
     * Each transition will be given a code, ex. l, r, tr etc.
     * Where l = left, r = right, tr = top right, etc
     *
     * This is to add smooth transitions without breaking website layout between each step.
     * `transform` doesn't work due to breaking layout during animations.
     */

    const transitionController = useAppSelector((state) => state.aesthetic.transitionController);

    const dispatch = useAppDispatch();

    useEffect(() => {
        const IO = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // appConsoleLog("intersecting");

                        entry.target.classList.add("start-transition");
                        transitionController?.unobserve(entry.target);
                    } else {
                        // appConsoleLog("not intersecting");
                    }
                });
            },
            {
                threshold: 0.5,
            }
        );

        dispatch(setTransitionController(IO));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);
}
