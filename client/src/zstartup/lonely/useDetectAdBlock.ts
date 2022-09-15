import { useEffect } from "react";
import { appConsoleLog } from "../../clientDebugging";

import { useAppDispatch } from "../../redux/hooks";
import { setUsingAdBlock } from "../../redux/slices/clientSlice";

function useDetectAdBlock(): void {
    /**
     * Use in useEffect block to avoid multiple checks cause of
     * re-renders.
     */

    const dispatch = useAppDispatch();

    useEffect(() => {
        (async () => {
            // holding the status of the adblocker in a temp variable here
            // to set the state at once. This prevents pointless re-renders
            let adBlockEnabled = false;

            try {
                // make and open the request to see if the request was successful
                await fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
            } catch (e) {
                adBlockEnabled = true;
            } finally {
                // appConsoleLog(`AdBlock Enabled: ${adBlockEnabled}`);

                // put in state
                dispatch(setUsingAdBlock(adBlockEnabled));
            }
        })();
    }, [dispatch]);
}

export default useDetectAdBlock;
