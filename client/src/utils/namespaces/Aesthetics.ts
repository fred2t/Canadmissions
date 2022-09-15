import { MutableRefObject } from "react";
import { v4 } from "uuid";
import { appConsoleLog } from "../../clientDebugging";

export interface MappableCharacter {
    id: string;
    character: string;
}

export interface MappableWord {
    id: string;
    characters: MappableCharacter[];
}

export enum TextColourClass {
    Green = "cgreen",
    Gold = "cgold",
    DGRod = "cdgrod",
    Orange = "corange",
    Coral = "ccoral",
    Red = "cred",
    DRed = "cdred",
    Miscellaneous = "cmisc",
}

export enum BackgroundClass {
    Green = "bgreen",
    Red = "bred",
}

export type TransitionStartingDeliveryDirection =
    /**
     * l = left
     * r = right
     * t = top
     * b = bottom
     * tl = top left
     * tr = top right
     * bl = bottom left
     * br = bottom right
     */
    "none" | "in-place" | "l" | "r" | "t" | "b" | "tl" | "tr" | "bl" | "br";

// functions
export function sentenceToMappableCharacters(sentence: string): MappableWord[] {
    return sentence.split(" ").map<MappableWord>((word) => {
        const characterArray = word.split("");

        return {
            id: v4(),
            characters: characterArray.map<MappableCharacter>((character) => {
                return { id: v4(), character };
            }),
        };
    });
}

export function lengthWarningTextDecorater(
    currentLength: number,
    maxLength: number
): TextColourClass {
    const decimalUsed = currentLength / maxLength;

    if (decimalUsed < 0.25) {
        return TextColourClass.Green;
    } else if (decimalUsed < 0.5) {
        return TextColourClass.DGRod;
    } else if (decimalUsed <= 1) {
        return TextColourClass.Coral;
    } else {
        return TextColourClass.Red;
    }
}

export function addTransition<N extends HTMLElement | null>(
    intersectionObserver: IntersectionObserver | null,
    transitionStartingDeliveryDirection: TransitionStartingDeliveryDirection
): (node: N) => void {
    /**
     * react element ref values can be null so '| null' is required to pass the typechecker
     * otherwise it is useless
     *
     * the intersectionobserver argument is useless (*in react - not next) since this method
     * is context-specific however this is to avoid circular imports
     */

    return (node: N) => {
        if (node == null) return;
        if (transitionStartingDeliveryDirection === "none") return;

        appConsoleLog("adding transition");
        node.classList.add("transition", `transition-${transitionStartingDeliveryDirection}`);
        intersectionObserver?.observe(node);
    };
}

export function addTransitionAndStoreNode<N extends HTMLElement | null>(
    intersectionObserver: IntersectionObserver,
    refStorage: React.RefObject<N>,
    transitionStartingDeliveryDirection?: TransitionStartingDeliveryDirection
): (node: N) => void {
    /**
     * Reasoning of intesectionobserver argument can be found by referring to
     * @addTransition export function.
     */

    return (node: N) => {
        if (node == null) return;

        // includetransition effect
        addTransition(intersectionObserver, transitionStartingDeliveryDirection ?? "none")(node);

        // update ref to node
        // because the node type isn't instantiated here, the typechecker
        // thinks the ref value was meant to be readonly when it isn't
        (refStorage as MutableRefObject<N>).current = node;
    };
}
