import { DB } from ".";

// enums
export enum SchoolAcronyms {
    /**
     * Values without spaces for flexible use.
     * Ex. in dynamic URL making api endpoints access easy.
     */

    Toronto = "uoft",
    BritishColumbia = "ubc",
    McGill = "mcgill",
    McMaster = "mcmaster",
    Alberta = "uofa",
    Montreal = "montreal",
    Calgary = "calgary",
    Ottawa = "ottawa",
    Waterloo = "uw",
    Western = "western",
    SimonFraser = "simonfraser",
    Dalhousie = "dalhousie",
    Victoria = "victoria",
    Laval = "laval",
    Manitoba = "manitoba",
    Queens = "queens",
    York = "york",
    Carleton = "carleton",
    Guelph = "guelph",
    Saskatchewan = "saskatchewan",
    Concordia = "concordia",
    QuebecAMontreal = "québec-mon",
    Memorial = "memorial",
    Sherbrooke = "sherbrooke",
    Ryerson = "ryerson",
    NewBrunswick = "new-brunswick",
    Regina = "regina",
    OntarioInstituteOfTechnology = "uoit",
    Windsor = "windsor",
    EcoleDeTechnologieSuperieure = "ecole-tech",
    WilfridLaurier = "wilfrid-laurier",
    Lakehead = "lakehead",
    Brock = "brock",
    Laurentian = "laurentian",
    Trent = "trent",
    QuebecTroisRivieres = "trois-riv",
    Lethbridge = "lethbridge",
    NorthernOntarioMedicine = "north-on-med",
    RoyalMilitary = "royal-military",
    PrinceEdwardIsland = "uofpei",
    Other = "other",
}

// intf
export interface Post extends DB.PostsRow {
    authorUsername: string;
    totalComments: number;
    totalLikes: number;
    clientLiked: boolean;
}
export interface Comment extends DB.CommentsRow {
    authorUsername: string;
    totalLikes: number;
    clientLiked: boolean;
}

// consts
export const AUTHOR_DELETED_BODY = "█ author deleted █";
export const MAX_USERNAME_LENGTH = 15;
export const MAX_EMAIL_LENGTH = 50;
export const MAX_POST_TITLE_LENGTH = 150;
export const MAX_POST_CONTENT_LENGTH = 15000;

// meds
export function communityExists(community: string) {
    return Object.values(SchoolAcronyms).includes(community as SchoolAcronyms);
}
