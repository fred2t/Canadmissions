import { SEO } from "../src/utils/namespaces";
import logo from "../public/images/logo.png";

export const SITE_EMAIL = "";

export const BRANDING_DETAILS: SEO.GeneralMetasData = Object.freeze({
    title: "Canadmissions",
    keywords:
        // all unis
        "canada, college, university, admissions, canadians, high, school, secondary, grades, ecs, extracurriculars, scholarships, questions, rate, chances",
    description: "",

    logo: logo,
    author: "Fred",
});

export const SOCIAL_MEDIA_METAS_DATA: SEO.SocialMediaMetasData = Object.freeze({
    // twit
    twitterCard: SEO.TwitterCardTypes.SummaryLargeImage,
    twitterCompanyUser: "n/a",
    twitterCreatorUser: "mytwit",

    // og
    url: "string;",
    type: SEO.OGCardTypes.Website,

    // general
    title: "KaijiKrack",
    description: BRANDING_DETAILS.description,
    image: logo,
});

export const MY_SELF_MARKINGS: readonly SEO.MarkingMyselfMetaData[] = Object.freeze([
    { name: "my-name", content: "Frederic Tu or Fred Tu" },
    {
        name: "my-message",
        content: "SUp, ",
    },
    {
        name: "my-github",
        content: "https://github.com/khyreek",
    },
    {
        name: "my-linkedin",
        content: "https://www.linkedin.com/in/frederic-tu/",
    },
    { name: "my-professional-email", content: "frederictu.me@gmail.com" },
]);
