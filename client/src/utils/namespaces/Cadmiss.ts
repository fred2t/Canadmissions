import { StaticImageData } from "next/image";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import StarIcon from "@mui/icons-material/Star";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

import britishColumbiaLogo from "../../../public/images/school-logos/british-columbia-logo.png";
import torontoLogo from "../../../public/images/school-logos/toronto.png";
import McGillLogo from "../../../public/images/school-logos/mcgill.png";
import McMasterLogo from "../../../public/images/school-logos/mcmaster.png";
import albertaLogo from "../../../public/images/school-logos/alberta.png";
import montrealLogo from "../../../public/images/school-logos/montreal.png";
import calgaryLogo from "../../../public/images/school-logos/calgary.png";
import quebecAMontrealLogo from "../../../public/images/school-logos/quebec-a-montreal.png";
import memorialLogo from "../../../public/images/school-logos/memorial.png";
import sherbrookeLogo from "../../../public/images/school-logos/sherbrooke.png";
import ryersonLogo from "../../../public/images/school-logos/ryerson.png";
import newBrunswickLogo from "../../../public/images/school-logos/new-brunswick.png";
import reginaLogo from "../../../public/images/school-logos/regina.png";
import ontarioInstituteOfTechnologyLogo from "../../../public/images/school-logos/ontario-institute-of-technology.png";
import windsorLogo from "../../../public/images/school-logos/windsor.png";
import ecoleDeTechnologieSuperieureLogo from "../../../public/images/school-logos/ecole-de-technologie-superieure.png";
import wilfridLaurierLogo from "../../../public/images/school-logos/wilfrid-laurier.png";
import lakeheadLogo from "../../../public/images/school-logos/lakehead.png";
import brockLogo from "../../../public/images/school-logos/brock.png";
import laurentianLogo from "../../../public/images/school-logos/laurentian.png";
import trentLogo from "../../../public/images/school-logos/trent.png";
import quebecTroisRivieresLogo from "../../../public/images/school-logos/quebec-trois-rivieres.png";
import lethbridgeLogo from "../../../public/images/school-logos/lethbridge.png";
import northernOntarioMedicineLogo from "../../../public/images/school-logos/northern-ontario-medicine.png";
import royalMilitaryLogo from "../../../public/images/school-logos/royal-military.png";
import princeEdwardIslandLogo from "../../../public/images/school-logos/prince-edward-island.png";
import ottawaLogo from "../../../public/images/school-logos/ottawa.png";
import waterlooLogo from "../../../public/images/school-logos/waterloo.png";
import carletonLogo from "../../../public/images/school-logos/carleton.png";
import guelphLogo from "../../../public/images/school-logos/guelph.png";
import saskatchewanLogo from "../../../public/images/school-logos/saskatchewan.png";
import concordiaLogo from "../../../public/images/school-logos/concordia.png";
import westernLogo from "../../../public/images/school-logos/western.png";
import simonFraserLogo from "../../../public/images/school-logos/simon-fraser.png";
import dalhousieLogo from "../../../public/images/school-logos/dalhousie.png";
import victoriaLogo from "../../../public/images/school-logos/victoria.png";
import lavalLogo from "../../../public/images/school-logos/laval.png";
import manitobaLogo from "../../../public/images/school-logos/manitoba.png";
import queensLogo from "../../../public/images/school-logos/queens.png";
import yorkLogo from "../../../public/images/school-logos/york.png";
import otherLogo from "../../../public/images/school-logos/other.png";

import { Elements } from ".";

// school details
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

export enum PostFilterOptions {
    Trending = "Trending",
    New = "New",
    Top = "Top",
}

export interface SchoolDetails {
    acronym: SchoolAcronyms;
    fullName: string;
    logo: StaticImageData;
    summary: string;
    moreInformationLink: string;
}

export interface MappablePostFilters {
    name: PostFilterOptions;
    selected: boolean;
    startIcon: Elements.MUIIcon;
}

// comments and replies
export const ROOT_COMMENT_KEY = "root";
export type FormattedReplyStorage = { [ID in number | typeof ROOT_COMMENT_KEY]: Comment[] };
export function parentIdOrRootKey(parentId: number | null): number | typeof ROOT_COMMENT_KEY {
    return parentId ?? ROOT_COMMENT_KEY;
}

export interface NewPost {
    title: string;

    // in html string format
    bodyMetadata: string;
}

export interface Post {
    id: number;
    community: SchoolAcronyms;

    // epoch time
    createdAt: number;
    authorId: number;
    title: string;
    bodyMetadata: string;
    bodyChanged: boolean;

    authorUsername: string;
    totalComments: number;
    totalLikes: number;
    clientLiked: boolean;
}

export interface Comment {
    id: number;
    postId: number;
    authorId: number;
    parentCommentId: number | null;
    createdAt: number;
    bodyMetadata: string;

    authorUsername: string;
    totalLikes: number;
    clientLiked: boolean;
}

// deleted item placeholder text
export const AUTHOR_DELETED_BODY = "█ author deleted █";
export const AUTHOR_DELETED_USERNAME = "[redacted]";

// quantity limits
export const MAX_POST_TITLE_LENGTH = 150;
export const MAX_POST_CONTENT_LENGTH = 15000;
export const MAX_COMMENT_CONTENT_LENGTH = 6000;
export const MAX_REPLY_CONTENT_LENGTH = 4500;

export const SCHOOL_DETAILS: Readonly<SchoolDetails[]> = Object.freeze([
    {
        acronym: SchoolAcronyms.Toronto,
        fullName: "University of Toronto",
        logo: torontoLogo,
        summary:
            "Founded in 1827, the University of Toronto is Canada's top university with a long history of challenging the impossible and transforming society through the ingenuity and resolve of its faculty, students, alumni and supporters.",
        moreInformationLink: "https://www.utoronto.ca/about-u-of-t",
    },
    {
        acronym: SchoolAcronyms.BritishColumbia,
        fullName: "University of British Columbia",
        logo: britishColumbiaLogo,
        summary:
            "A world-leading centre of teaching, learning and research excellence, UBC transforms personal initiative into innovation, and new ideas into impact. Read a welcome from President and Vice-Chancellor Santa J. Ono, explore the strategic plan and learn about UBC’s vision and values.",
        moreInformationLink: "https://www.ubc.ca/about/facts.html",
    },
    {
        acronym: SchoolAcronyms.McGill,
        fullName: "McGill University",
        logo: McGillLogo,
        summary:
            "McGill University is one of Canada's best-known institutions of higher learning and one of the leading universities in the world. International students from more than 150 countries make up nearly 30% of McGill's student body ‒ the highest proportion of any Canadian research university.",
        moreInformationLink: "https://www.mcgill.ca/about/",
    },
    {
        acronym: SchoolAcronyms.McMaster,
        fullName: "McMaster University",
        logo: McMasterLogo,
        summary:
            "A research-intensive, student-centred university dedicated to advancing human and societal health and well-being. Ranked in the world's Top 75 by the Times Higher Education (THE) World University Rankings.",
        moreInformationLink: "https://www.mcmaster.ca/opr/html/opr/fast_facts/main/about.html",
    },
    {
        acronym: SchoolAcronyms.Alberta,
        fullName: "University of Alberta",
        logo: albertaLogo,
        summary:
            "The University of Alberta is one of Canada's leading universities, known for world-class research and innovative discoveries. The university offers top quality undergraduate and graduate programs, including several that are unique in Canada, such as undergraduate paleontology and land reclamation.",
        moreInformationLink:
            "https://study.alberta.ca/plan-your-studies/universities-colleges-technical-institutes/universities/university-of-alberta/",
    },
    {
        acronym: SchoolAcronyms.Montreal,
        fullName: "University of Montreal",
        logo: montrealLogo,
        summary:
            "Canadian public French-language university founded in Montreal, Quebec, in 1878. It provides instruction in the arts and sciences, education, law, medicine, theology, architecture, social work, criminology, and other fields.",
        moreInformationLink: "https://www.britannica.com/topic/University-of-Montreal",
    },
    {
        acronym: SchoolAcronyms.Calgary,
        fullName: "University of Calgary",
        logo: calgaryLogo,
        summary:
            "The University of Calgary is a co-educational, non-denominational government supported institution possessing the right of conferring degrees, other than degrees in Divinity, within the Province of Alberta. It is a member of the Association of Commonwealth Universities and of Universities Canada.",
        moreInformationLink: "https://www.ucalgary.ca/pubs/calendar/current/about-uofc-main.html",
    },
    {
        acronym: SchoolAcronyms.Ottawa,
        fullName: "University of Ottawa",
        summary:
            "The University of Ottawa is a renowned and most prominent public research bilingual university. It provides a study of French and English. It was established in 1848 in Ottawa, Ontario, Canada. Ottawa University offers a broad range of graduate and undergraduate programs in more than 450 subjects.",
        moreInformationLink: "https://leapscholar.com/university/university-of-ottawa",
        logo: ottawaLogo,
    },
    {
        acronym: SchoolAcronyms.Waterloo,
        fullName: "University of Waterloo",
        summary:
            "In 1957, the University of Waterloo opened its doors to 74 engineering students with co-operative education as its cornerstone. Today, with more than 42,000+ students attending annually, Waterloo is #1 in Canada for experiential learning and employer-student connections.",
        moreInformationLink: "https://uwaterloo.ca/about/",
        logo: waterlooLogo,
    },
    {
        acronym: SchoolAcronyms.Western,
        fullName: "Western University",
        summary:
            "Western University delivers an academic experience second to none. Western challenges the best and brightest faculty, staff and students to commit to the highest global standards. Our research excellence expands knowledge and drives discovery with real-world application.",
        moreInformationLink:
            "https://www.psychology.uwo.ca/about_us/limitedterm_faculty_position.html",
        logo: westernLogo,
    },
    {
        acronym: SchoolAcronyms.SimonFraser,
        fullName: "Simon Fraser University",
        summary:
            "SFU is recognized around the world for academic excellence, innovation, and sustainability. We are consistently ranked among the top research universities in Canada and as one of the top 250 universities in the world. And with more than 170,000 alumni spanning the country and globe, SFU’s impact in every facet of life is far-reaching.",
        moreInformationLink: "https://www.sfu.ca/about/whoweare.html",
        logo: simonFraserLogo,
    },
    {
        acronym: SchoolAcronyms.Dalhousie,
        fullName: "Dalhousie University",
        summary:
            "As Atlantic Canada's primary research-intensive university and a member of the U15 Group of Canadian Universities, research and innovation includes world-leading researchers working in labs, studios and in the field. ",
        moreInformationLink: "https://www.dal.ca/about-dal.html",
        logo: dalhousieLogo,
    },
    {
        acronym: SchoolAcronyms.Victoria,
        fullName: "University of Victoria",
        summary:
            "The University of Victoria is one of Canada's top research universities. It's renowned for research impact and dynamic learning opportunities. UVic is located in Victoria, British Columbia, on the edge of Canada's spectacular west coast - a gateway to the Pacific Rim.",
        moreInformationLink:
            "https://www.topuniversities.com/universities/university-victoria-uvic",
        logo: victoriaLogo,
    },
    {
        acronym: SchoolAcronyms.Laval,
        fullName: "Laval University",
        summary:
            "A multifaceted institution, it delivers a vast range of education and training, with 500 programs and 17 different faculties. University life unfolds on a verdant 2 km2 campus that has no equal in all of Québec. A full 64% of the campus is green space, with a wonderful variety of woods and wildlife.",
        moreInformationLink:
            "https://www.timeshighereducation.com/world-university-rankings/laval-university",
        logo: lavalLogo,
    },
    {
        acronym: SchoolAcronyms.Manitoba,
        fullName: "University of Manitoba",
        summary:
            "The University of Manitoba is western Canada’s first university, Manitoba's only research-intensive university, is located on original lands of Anishinaabeg, Cree, Oji-Cree, Dakota, and Dene peoples, and on the homeland of the Métis Nation.",
        moreInformationLink: "https://umanitoba.ca/about-um",
        logo: manitobaLogo,
    },
    {
        acronym: SchoolAcronyms.Queens,
        fullName: "Queen's University",
        summary:
            "Home to more than 24,000 students, Queen's boasts an undergraduate graduation rate of 93%, diverse learning opportunities, a broad range of students services and supports, unmistakable school spirit, and a tight-knit global network of 159,000 alumni in 153 countries. Ultimately, to graduate from Queen’s University is to join an international community of lifelong learners and accomplished leaders.",
        moreInformationLink: "https://www.queensu.ca/about",
        logo: queensLogo,
    },
    {
        acronym: SchoolAcronyms.York,
        fullName: "York University",
        summary:
            "York is a leading international teaching and research university and a driving force for positive change. Empowered by a welcoming and diverse community with a uniquely global perspective, are preparing students for their long-term career and personal success.",
        moreInformationLink: "https://www.yorku.ca/about/",
        logo: yorkLogo,
    },
    {
        acronym: SchoolAcronyms.Carleton,
        fullName: "Carleton University",
        summary:
            "Carleton University is a community of talented, committed and enthusiastic faculty and staff, dedicated to excellence and to supporting the education and research that distinguishes Carleton as Canada’s Capital University.",
        moreInformationLink: "https://carleton.ca/about/",
        logo: carletonLogo,
    },
    {
        acronym: SchoolAcronyms.Guelph,
        fullName: "University of Guelph",
        summary:
            "The University of Guelph is like no other university in Canada. Research-intensive and learner-centred, campuses span urban hubs and rural communities. We are known for excellence in the arts and sciences and for commitment to developing exceptional thinkers and engaged citizens.",
        moreInformationLink: "https://www.uoguelph.ca/about",
        logo: guelphLogo,
    },
    {
        acronym: SchoolAcronyms.Saskatchewan,
        fullName: "University of Saskatchewan",
        summary:
            "The University of Saskatchewan is located in Saskatoon, on Treaty 6 territory and the traditional home of the Métis. Founded in 1907, it is one of Canada's top research-intensive universities and is a member of the U15 Group of Canadian Research Universities.",
        moreInformationLink: "https://www.usask.ca/",
        logo: saskatchewanLogo,
    },
    {
        acronym: SchoolAcronyms.Concordia,
        fullName: "Concordia University",
        summary:
            "Continually reimagining the future of higher education. Located in the vibrant and multicultural city of Montreal, Concordia is the top-ranked university in North America founded within the last 50 years and annually registers some 51,000 students through its innovative approach to experiential learning and cross-functional research.",
        moreInformationLink: "https://www.concordia.ca/about.html",
        logo: concordiaLogo,
    },
    {
        acronym: SchoolAcronyms.QuebecAMontreal,
        fullName: "Université du Québec à Montréal",
        summary:
            "L'Université du Québec à Montréal offre plus de 300 programmes d'études en plein cœur du centre-ville. L'UQAM, qui a célébré ses 50 ans en 2019, connaît un rayonnement international dans de nombreux secteurs de recherche et de création. Dynamique et innovatrice, elle offre de la formation sur son campus principal et ses quatre campus en région métropolitaine.",
        moreInformationLink: "https://uqam.ca/",
        logo: quebecAMontrealLogo,
    },
    {
        acronym: SchoolAcronyms.Memorial,
        fullName: "Memorial University of Newfoundland",
        summary:
            "Memorial University is a research-intensive university with a solid commitment to teaching and learning. Memorial has a global reputation for excellence in teaching and research, and its graduates are highly sought after by employers.",
        moreInformationLink: "https://grantme.ca/memorial-university-overview/",
        logo: memorialLogo,
    },
    {
        acronym: SchoolAcronyms.Sherbrooke,
        fullName: "University of Sherbrooke",
        summary:
            "The University of Sherbrooke is a large public French-speaking university located in Sherbrooke, Quebec. The University of Sherbrooke is home to nearly 31,000 Undergraduate and Graduate students coming from around the globe.",
        moreInformationLink: "https://www.usherbrooke.ca/about/",
        logo: sherbrookeLogo,
    },
    {
        acronym: SchoolAcronyms.Ryerson,
        fullName: "Ryerson University",
        summary:
            "Ryerson University, privately endowed institution of higher learning in Toronto, Ontario, Canada. It was founded in 1948 as the Ryerson Institute of Technology, named after the educator Egerton Ryerson.",
        moreInformationLink: "https://www.torontomu.ca/",
        logo: ryersonLogo,
    },
    {
        acronym: SchoolAcronyms.NewBrunswick,
        fullName: "University of New Brunswick",
        summary:
            "Overview The University of New Brunswick is Canada's oldest English-language university and is located on the beautiful east coast of Canada. UNB is a leader in research and innovation with a focus on entrepreneurial success. Over 75 undergraduate and graduate programs are offered, with a student-to-faculty ratio of 15:1.",
        moreInformationLink: "https://www.unb.ca/",
        logo: newBrunswickLogo,
    },
    {
        acronym: SchoolAcronyms.Regina,
        fullName: "University of Regina",
        summary:
            "The University of Regina is a public university for research, based in Regina, Saskatchewan, Canada. Founded in 1911 as Methodist Church of Canada's private denominational high school, the university opened in 1925 as a junior college with the University of Saskatchewan. In 1974, it became an autonomous university.",
        moreInformationLink: "https://www.gyandhan.com/schools/university-of-regina",
        logo: reginaLogo,
    },
    {
        acronym: SchoolAcronyms.OntarioInstituteOfTechnology,
        fullName: "University of Ontario Institute of Technology",
        summary:
            "A public university emphasizing science and technology, and was a part of the Ontario government's initiative to create more spaces in post-secondary institutions for the flood of post-secondary students in 2003.",
        moreInformationLink: "https://ontariotechu.ca/",
        logo: ontarioInstituteOfTechnologyLogo,
    },
    {
        acronym: SchoolAcronyms.Windsor,
        fullName: "University of Windsor",
        summary:
            "The University of Windsor is a comprehensive, student-focused university with nearly 15,000 students enrolled in a broad range of undergraduate and graduate programs including several professional schools such as: Law, Business, Engineering, Education, Nursing, Human Kinetics and Social Work.",
        moreInformationLink: "https://www.uwindsor.ca/44/why-uwindsor",
        logo: windsorLogo,
    },
    {
        acronym: SchoolAcronyms.EcoleDeTechnologieSuperieure,
        fullName: "Ecole de Technologie Superieure - Canada",
        summary:
            "The École de technologie supérieure is a constituent establishment of the Université du Québec. ÉTS, which specializes in engineering and technological transfer education as well as applied research, trains engineers and researchers who are recognized for their practical and innovative approach.",
        moreInformationLink: "https://www.etsmtl.ca/en/ets/about-ets/overview",
        logo: ecoleDeTechnologieSuperieureLogo,
    },
    {
        acronym: SchoolAcronyms.WilfridLaurier,
        fullName: "Wilfrid Laurier University",
        summary:
            "#1: most sustainable campus in Ontario, #1: national ranking in student career services, the highest score among Canadian postsecondary institutions with most impressive career services models. #1: national ranking in satisfaction with decision to attend Laurier",
        moreInformationLink: "https://www.wlu.ca/about/index.html",
        logo: wilfridLaurierLogo,
    },
    {
        acronym: SchoolAcronyms.Lakehead,
        fullName: "Lakehead University",
        summary:
            "Lakehead University is your place to live and learn. Dynamic, modern, and highly learner-centred, acknowledge all students as valued leaders of tomorrow, whose education and success are most paramount to institution. Both campuses in Thunder Bay and Orillia promise the total university experience, a blend of academic excellence and opportunity with a rich variety of social and recreational activities. We also promise excellence in research: Lakehead is the proud host to 9 Canada Research Chairs and revolutionary facilities such as world-renowned Paleo-DNA Laboratory and Biorefining Research Institute.",
        moreInformationLink: "https://www.lakeheadu.ca/about/overview",
        logo: lakeheadLogo,
    },
    {
        acronym: SchoolAcronyms.Brock,
        fullName: "Brock University",
        summary:
            "With more than 19,000 students in seven diverse Faculties, Brock University offers an academic experience that's second to none. Our degree programs are designed with your future in mind. We focus on your career with co-op and service learning options that provide maximum exposure to your chosen field of study.",
        moreInformationLink: "https://brocku.ca/about/",
        logo: brockLogo,
    },
    {
        acronym: SchoolAcronyms.Laurentian,
        fullName: "Laurentian University",
        summary:
            "Laurentian University is a mid-sized bilingual public university in Greater Sudbury, Ontario, Canada, incorporated on March 28, 1960. Laurentian offers a variety of undergraduate, graduate-level, and doctorate degrees.",
        moreInformationLink: "https://laurentian.ca/",
        logo: laurentianLogo,
    },
    {
        acronym: SchoolAcronyms.Trent,
        fullName: "Trent University",
        summary:
            "One of Canada's top universities, Trent University was founded on the ideal of interactive learning that's personal, purposeful and transformative.",
        moreInformationLink: "https://www.trentu.ca/about/",
        logo: trentLogo,
    },
    {
        acronym: SchoolAcronyms.QuebecTroisRivieres,
        fullName: "University of Quebec Trois Rivieres",
        summary:
            "Located in the heart of the province, the Université du Québec à Trois-Rivières has over 14,000 students and offers some 280 academic programs at the undergraduate, graduate and post-graduate levels. The university also boasts an international French school, friendly campus and stimulating environment!",
        moreInformationLink:
            "https://www.bonjourquebec.com/en-ca/listing/tourist-organizations-and-transportation/tourist-organizations/schools/universite-du-quebec-a-trois-rivieres-4722407",
        logo: quebecTroisRivieresLogo,
    },
    {
        acronym: SchoolAcronyms.Lethbridge,
        fullName: "University of Lethbridge",
        summary:
            "The University of Lethbridge is a publicly funded comprehensive academic and research university. Established in 1967, it was founded in the liberal education tradition, focusing on experiential learning, interdisciplinary research and co-op programmes. There are 150 undergraduate degrees in the faculties of arts and science, management, education, health sciences and fine arts and just under 9,000 undergraduate students and 600 postgraduate students.",
        moreInformationLink:
            "https://www.timeshighereducation.com/world-university-rankings/university-lethbridge",
        logo: lethbridgeLogo,
    },
    {
        acronym: SchoolAcronyms.NorthernOntarioMedicine,
        fullName: "Northern Ontario School of Medicine",
        summary:
            "NOSM U aims to produce physicians who are capable of practising in Northern, rural, and remote areas and are of such high calibre that they will have opportunities to practice anywhere. NOSM U's UME program celebrates generalism as a core value in its curriculum.",
        moreInformationLink: "https://www.nosm.ca/education/md-program/",
        logo: northernOntarioMedicineLogo,
    },
    {
        acronym: SchoolAcronyms.RoyalMilitary,
        fullName: "Royal Military College - Canada",
        summary:
            "Royal Military College (RMC) is a university located in Kingston, Ontario. It was established in 1876 as a military college and is the oldest institution of higher learning in Canada. RMC is a fully bilingual school, offering programs in both English and French.",
        moreInformationLink: "https://www.rmc-cmr.ca/en",
        logo: royalMilitaryLogo,
    },
    {
        acronym: SchoolAcronyms.PrinceEdwardIsland,
        fullName: "University of Prince Edward Island",
        summary:
            "The University of Prince Edward Island is a public university in Charlottetown, Prince Edward Island, Canada, and the only university in the province. Founded in 1969.",
        moreInformationLink: "https://www.upei.ca/",
        logo: princeEdwardIslandLogo,
    },
    {
        acronym: SchoolAcronyms.Other,
        fullName: "Other",
        summary: "Unlisted school.",
        moreInformationLink: "No summary.",
        logo: otherLogo,
    },
]);
if (Object.keys(SchoolAcronyms).length !== SCHOOL_DETAILS.length) throw new Error("ok");

export const DEFAULT_MAPPABLE_POST_FILTERS: Readonly<MappablePostFilters[]> = Object.freeze([
    {
        name: PostFilterOptions.Trending,
        selected: true,
        startIcon: WhatshotIcon,
    },
    {
        name: PostFilterOptions.New,
        selected: false,
        startIcon: HourglassTopIcon,
    },
    {
        name: PostFilterOptions.Top,
        selected: false,
        startIcon: StarIcon,
    },
]);

export const PLACEHOLDER_POSTS: Post[] = [
    {
        bodyMetadata: "content",
        title: "title",
        createdAt: 1,
        bodyChanged: false,
        id: 1,
        authorId: 3,
        community: SchoolAcronyms.Alberta,
        authorUsername: "bruh",
        clientLiked: true,
        totalLikes: -100,
        totalComments: 2,
    },
];

// link route
export function postRouteFormatter({ id, title }: Pick<Post, "id" | "title">) {
    return `/post/${id}/${title.replaceAll(" ", "_").replaceAll("/", "")}`;
}
