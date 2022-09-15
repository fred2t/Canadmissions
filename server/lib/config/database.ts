import mysql from "mysql2/promise";

import { ENVS } from "../.app/serverEnvVars";
import { getRandomInt } from "../utils/methods/generalHelpers";
import { Cadmiss, Protection } from "../utils/namespaces";

export const dbPool = mysql.createPool({
    ...ENVS.DB_CONFIG,
    namedPlaceholders: true,
});

async function setupDb() {
    // users table
    await dbPool.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT,
            username VARCHAR(${Cadmiss.MAX_USERNAME_LENGTH}) NOT NULL UNIQUE,
            email VARCHAR(${Cadmiss.MAX_EMAIL_LENGTH}) NOT NULL UNIQUE,
            password VARCHAR(64),

            PRIMARY KEY (id)
        );
    `);

    // communities table
    await dbPool.execute(`
        CREATE TABLE IF NOT EXISTS communities (
            community VARCHAR(25) NOT NULL UNIQUE,
            
            PRIMARY KEY (community)
        );
    `);

    // add communities to communities table
    await dbPool.execute(`
        INSERT IGNORE INTO communities VALUES ${Object.values(Cadmiss.SchoolAcronyms)
            .map((name) => `('${name}')`)
            .join(",")}
    `);

    // joined communities table
    await dbPool.execute(`
        CREATE TABLE IF NOT EXISTS joined_communities (
            community VARCHAR(25) NOT NULL,
            userId INT NOT NULL,
            
            FOREIGN KEY (community) REFERENCES communities(community) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // posts table
    await dbPool.execute(`
        CREATE TABLE IF NOT EXISTS posts (
            id INT NOT NULL AUTO_INCREMENT,
            community VARCHAR(25) NOT NULL,
            authorId INT NOT NULL,
            createdAt BIGINT UNSIGNED NOT NULL,
            title VARCHAR(${Cadmiss.MAX_POST_TITLE_LENGTH}) NOT NULL,
            bodyMetadata TEXT(${Cadmiss.MAX_POST_CONTENT_LENGTH}) NOT NULL,
            bodyChanged BOOLEAN NOT NULL DEFAULT FALSE,
            
            PRIMARY KEY (id),
            FOREIGN KEY(community) REFERENCES communities(community) ON DELETE CASCADE,
            FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // post likes table
    await dbPool.execute(`CREATE TABLE IF NOT EXISTS post_likes (
        postId INT NOT NULL,
        userId INT NOT NULL,
        
        FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // comments table
    await dbPool.execute(`
        CREATE TABLE IF NOT EXISTS comments (
            id INT NOT NULL AUTO_INCREMENT,
            postId INT NOT NULL,
            authorId INT NOT NULL,
            parentCommentId INT,
            createdAt BIGINT NOT NULL,
            bodyMetadata VARCHAR(6000) NOT NULL,
            
            PRIMARY KEY (id),
            FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE,
            FOREIGN KEY(authorId) REFERENCES users(id)
        )
    `);

    // comment likes
    await dbPool.execute(`
        CREATE TABLE IF NOT EXISTS comment_likes (
            userId INT NOT NULL,
            commentId INT NOT NULL,
            
            FOREIGN KEY(userId) REFERENCES users(id),
            FOREIGN KEY(commentId) REFERENCES comments(id)
        )`);
}

async function seed() {
    // // users
    // await dbPool.execute(`
    //     insert ignore into users (username,email,password) 
    //         values 
    //         ('a', 'a','${Protection.hashString("a")}'),
    //         ('g','g','${Protection.hashString("g")}'),
    //         ('q','q','${Protection.hashString("q")}')
    // `);
    // // start at 4
    // const massAddUsers = (...usernames: string[]) =>
    //     usernames
    //         .map((username, i) => `('${username}', 'a${i}', '${Protection.hashString("khy")}')`)
    //         .join(",");
    // await dbPool.execute(`
    //     insert ignore into users (username,email,password) 
    //     values 
    //         ${massAddUsers(
    //             "absthorse",
    //             "abacus_dog",
    //             "fax_donater",
    //             "hack-wood-ez",
    //             "omegaOH",
    //             ...[
    //                 "capacityshocked",
    //                 "rafterrails",
    //                 "dislikeyoke",
    //                 "involveduniform",
    //                 "clinicdirt",
    //                 "unwittingexcept",
    //                 "lifestylewavy",
    //                 "nearfestoon",
    //                 "relishfund",
    //                 "countnearly",
    //                 "detectorthing",
    //                 "mercifulparched",
    //                 "stacktannenbaum",
    //                 "paperclipsgun",
    //                 "grinninggrumble",
    //                 "frittatagel",
    //                 "scornfulloganberries",
    //                 "channelingeland",
    //                 "fondmuted",
    //                 "emigratecourier",
    //                 "mediumstarboard",
    //                 "drawingnye",
    //                 "horsemanindelible",
    //                 "cohortcyclone",
    //                 "straymaniacal",
    //                 "pomegranatesquiz",
    //                 "deservetabernacle",
    //                 "arrangejoystick",
    //                 "forurn",
    //                 "dolphinmizzenmast",
    //                 "acquirepromote",
    //                 "curatorviolation",
    //                 "onionsmoreover",
    //                 "flabbyidentity",
    //                 "studioadmonish",
    //                 "luxuriousshaded",
    //                 "winningwhen",
    //                 "scandalpopular",
    //                 "preventbuilding",
    //                 "thenchief",
    //                 "dynamicloincloth",
    //                 "tubesspiritual",
    //                 "tripstammer",
    //                 "barberryincome",
    //                 "chestplatepen",
    //                 "bountifulnike",
    //                 "currentbeyond",
    //                 "softindeed",
    //                 "snappyfee",
    //                 "tacticsquiggly",
    //             ]
    //         )}
    // `);

    // // posts
    // await dbPool.execute(`
    //     insert ignore into posts (id,community, authorId,createdAt,title,bodyMetadata)
    //     values 
    //         (1,'uoft',1,1662211009769,'qweqwe','<p>It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. The report is unfortunately positive. Attached is a copy of my report......It is really sad, you were getting good hold of things. I would send the report by email. Then write what you wrote here.</p><p>I wanted to inform you about a recent issue. I was not feeling well. I thought it was allergy but as a safety precaution took the Covid-19 test. Th'),
    //         (2,'uoft',2,1662212242824,' ww e qw eqweqweq asd w   w q', '<p>qweqweqw eqw eqwe asd asdasd as&nbsp;&nbsp;&nbsp;qwe&nbsp; &nbsp; <span style="color: rgb(156, 220, 254);">overflow-y</span>: <span style="color: rgb(206, 145, 120);">hidden</span>;</p>'),
    //         (3,'uoft',1,1662212292824,'title',"<p><u>asd</u></p><p><u>as</u><em><u>da</u></em></p><p><em>sd</em></p><p><strong><em>as</em></strong></p><p><a href='https://example.com/' rel='noopener noreferrer' target='_blank'>https://example.com/</a></p><p><strong>das</strong></p><p>d</p><p><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJkAAACZCAMAAAALgmiIAAAAYFBMVEX///8yMjL6+vqPj4/T09M+Pj5sbGxPT0/p6ek1NTWvr6+Li4uQkJAxMTG0tLSJiYnl5eVVVVWYmJirq6tZWVlycnKfn5/u7u50dHTU1NTa2tpdXV1BQUFiYmJpaWlHR0fKwQTpAAABsElEQVR4nO3ZjW6CMBSGYQF/gCKoTN3Ubfd/l5OKSNmSWdtmZ/I+wVIaTb4caCwwmQAAAAAAAAAA4Cx2EjJZPneQh0xWRA6SkMkSl2QqZDKnmgVNJrdmTsmCXmfPOQMyuTNA7tmUOwNGejbl1kxusiLTovbT7KK21x43e52jG9IDzc7r2YzLjaHO67zZmuba6w5K3eTdF/rDTW/qNdk8MwRdYlmJ58aVIjdZJDaZ3JqR7A4ks0cye8Nk5V8H6vyfmpHsd/Fme/Gqt239NvXm4PbUavAErJj5c9x7Kp/mtNo2Ldep0GSR32ROd3XDZFLPpuSajeQ6k5uMGWBvFDNA7n+A52RyZ8Bu4eBk1mxx2BvcFkX7dJWeN92kt2bV9lY/DN+aXWZEy9YvPcf3g6fqPaA0kw3MvD5eIxnJSEYykpHs2ZIt+92lpGTmK62TXbI4T0xFYqPo94oPM9hnXRrsFpLD904+ua22AyZzvA+gZiS7M5nTXd0oayZ3BpDskWTMAGtPmyxXVaJUcm6qtlHXphlWlUpUO6yuw99+cvudPlCXZuf1+RkAAAAAAAAAAAJ8AWacMN2Y0in6AAAAAElFTkSuQmCC' alt='After a successful form submission, how do I redirect to another page? -  Coding and Customization - Squarespace Forum' height='153' width='153'></p>"),
    //         (4,'ubc',2,1662212242824,'ok title', '<p>qweqwe uu</p>')     
    // `);
    // // @ts-ignore
    // const sanitizeNFormatBody = (text: string) => `"${text.replaceAll('"', "'")}"`;
    // // start at 5
    // // prettier-ignore
    // await dbPool.execute(`
    //     insert ignore into posts (id,community, authorId,createdAt,title,bodyMetadata)
    //     values 
    //         (5,'other',4,1662826736983,${sanitizeNFormatBody(`Canadian universities compared to US schools`)},${sanitizeNFormatBody(`<p>I see a lot of posts online attempting to identify the 'Canadian Ivy League,' and wanted to set the record straight.</p><p>Most of these comparisons aren't very accurate and overlook the major differences between the 2 country's education systems and societies. While some Canadian schools have a long tradition of attracting 'elite' students, they do not remotely approach the levels of wealth, privilege, and resources that top tier American schools possess. In addition, the best universities in Canada are all funded by the government, which make them more similar to a top state college ('public ivy') like in Texas or California rather than a privately funded Ivy League school.</p><p>Another difference is how much easier it is to get into an 'elite' Canadian university than an elite American university - the admissions rate for U of T and McGill are somewhere in the 40-50% range, while Ivy League admissions rates are solidly below 10% across the board.</p><p>Finally, the tuition cost for Canadian schools is vastly cheaper than any elite American private college. The most expensive undergraduate program in Canada (Smith Business @ Queen's) is $35K CAD a year for tuition and living expenses. In contrast, Harvard's total annual sticker price is $85K USD altogether - this is almost 2.4x the cost of Smith!</p><p>Canada's bastions of elite education are more&nbsp;<em>program</em>&nbsp;based rather than on a school-by-school basis. Certain business and engineering programs are extremely selective and tend to attract the most wealthy and privileged Canadians (eg. Waterloo Software Engineering, Ivey b-school, Smith b-school, etc.). That said, they are still way easier to get into than any Ivy League college, and tend not to have the same levels of global brand-name recognition as any top American school.</p><p>US to Canada elite college comparisons are generally a fool's errand and just a byproduct of insecure students attempting to validate themselves through credential signaling. That said, here is a more accurate comparison of the top Canadian universities to their most similar American college counterparts (note that none of these are Ivy League/ top 20 US colleges):</p><p><strong>U of T = UCLA</strong></p><ul><li>Both are good public colleges</li><li>Both are urban campuses located in a major city</li><li>Both have a large population of Asian and International students</li><li>Both are very large</li><li class='ql-indent-1'>UofT - 43K undergrads</li><li class='ql-indent-1'>UCLA - 31K undergrads</li><li>Both are well regarded in their respective regions and have strong graduate programs in law and business</li></ul><p><strong>Mcgill = NYU</strong></p><ul><li>Both are urban campuses located in a major city with strong nightlife</li><li>Both are known as 'party schools' and attract 'artsy' students who love the city culture</li><li>Both are very large</li><li class='ql-indent-1'>NYU - 26K undergrads</li><li class='ql-indent-1'>Mcgill - 27K undergrads</li><li>Both are well regarded in their respective regions and have strong graduate programs in law and business</li></ul><p><strong>Waterloo = UIUC (University of Illinois at Urbana–Champaign)</strong></p><ul><li>Both are good public colleges</li><li>Both are very large</li><li class='ql-indent-1'>Waterloo - 41K undergrads</li><li class='ql-indent-1'>UIUC - 33K undergrads</li><li>Both send many graduates to prominent Bay Area tech firms and have strong CS/ software engineering programs</li></ul><p><strong>UWO = UVA</strong></p><ul><li>Both are good public colleges</li><li>Both are known for being 'fratty' and having big drinking cultures</li><li>Both attract many Caucasian students from the closest major metro area</li><li>Both are very large</li><li class='ql-indent-1'>UVA - 17K undergrads</li><li class='ql-indent-1'>UWO- 33K undergrads</li><li>Both have a top-ranked undergrad business school and MBA program</li></ul><p><strong>UBC = University of Washington</strong></p><ul><li>Both are good public colleges located in the PNW</li><li>Both are regionally very well regarded but not well known outside of the PNW</li><li>Both are very large</li><li class='ql-indent-1'>UBC - 45K undergrads</li><li class='ql-indent-1'>UW - 31K undergrads</li></ul><p><strong>University of Calgary = UT Austin</strong></p><ul><li>Both are good public colleges</li><li>Both are regionally very well regarded but not well known outside of their respective areas</li><li>Both are very large</li><li class='ql-indent-1'>UT Austin - 44K undergrads</li><li class='ql-indent-1'>UCal - 25K undergrads</li></ul><p><strong>Queens = UNC Chapel Hill</strong></p><ul><li>Both are good public colleges</li><li>Both are known as party schools and attract many Caucasian students from the closest major metro area</li><li>Both have a deep athletic rivalry with another school</li><li class='ql-indent-1'>Queens v. UWO</li><li class='ql-indent-1'>UNC v. Duke</li><li>Both are have smaller student enrollments (but still large)</li><li class='ql-indent-1'>Queen's - 23K undergrads</li><li class='ql-indent-1'>UNC - 19K undergrads</li><li>Both have top ranked undergrad business schools and MBA programs</li></ul><p><br></p>`)})
    //         ,(6,'other',4,1662826736983,${sanitizeNFormatBody(`Queen is not Harvard of Canada.`)},${sanitizeNFormatBody(`<p>I just saw Pamela Anderson's interview with Harvey Levin where she says and I quote 'one of my sons goes to Queens University - which is the Harvard of Canada.' Queens is not even listed among the top 200 in the world. Neither is it listed among the top 10 in Canada. Am I missing something here?</p><p><br></p><p>about @ 27 she talks about her kids and the aforementioned claim about Queens being Harvard of Canada.</p>`)})
    //         ,(7,'uoft',5,1662826736983,${sanitizeNFormatBody(`Choosing between Mcgill, UofT, and UOttawa for poli sci`)},${sanitizeNFormatBody(`<p>Hey everyone.</p><p>I'm having trouble choosing what university I should choose for a Political science undergrad. I am hoping to go to law school after undergrad by the way.</p><p>I got the same amount of scholarship offers from all, (was presidents scholar of excellence at uoft though) but have basically ruled out toronto all together because i just don't think it would be a good fit for me socially or academically.</p><p>I got into the french immersion program at ottawa and thats something thats really pulling me towards it as well as the location as I would love to be able to get experience working in the political sphere. However, I really love McGill and I think that it would be a great fit for me academically and socially.</p><p>So basically, would I be dumb to turn down the french and political exposure of Ottawa to go to mcgill? Will I be able to learn french at McGill (by taking classes, being friends with french people etc.)? Is there anyway to get political internships in Montreal if I am able to improve my french?</p><p><br></p><p>Please help me lol</p>`)})
    //         ,(8,'queens',6,1662826736983,${sanitizeNFormatBody(`Queen's Health Sciences: 3% Acceptance Rate in 2021`)},${sanitizeNFormatBody(`<p>The acceptance rate is 3% this year. Let that sink in.</p><p>As an applicant, I am feeling very doubtful about my chances of getting in. For a fairly new program, Queen's BHSc already has around the same acceptance rate as McMaster Health Sciences. Once we get the stats about the first set of graduates from Queen's BHSc, this program will be even more in demand. Queen's Health Sciences is honestly the perfect program for pre-meds. It has everything, from the flexible schedule, to the high GPA's—the perfect formula for medical school acceptances.</p>`)})
    //         ,(9,'other',7,1662826736983,${sanitizeNFormatBody(`Free University Application and Scholarship Mentorship`)},${sanitizeNFormatBody(`<p>Hey Everyone,</p><p>I am a currently a senior university student and at one point I was just like you on this reddit. Coming from less fortunate economic circumstances, I didn't have the access to mentors and resources that could guide me through the process that some higher up the socioeconomic ladder have. To address this, I created a free, non profit organization to help mentor students through presentations and 1 on 1 support to help with scholarship writing, university applications, and post secondary guidance. Please send me a PM if you are interested in receiving mentorship</p>`)})
    //         ,(10,'other',8,1662826736983,${sanitizeNFormatBody('How Much Does University Matter?')},${sanitizeNFormatBody(`<p>I'm in grade 11 currently and I'm bout to drop my grade 12 physics because of my average of 86%. I would say my overall average is about 87% right now in grade 11, and am not too confident of making it Waterloo, UOFT and the prestigious university's. I plan on majoring in civil engineering and would like to know how much does the name of my university matter when I try to look for a job? I also hope to master in structural engineering if that helps.</p>`)})
    //         ,(11,'ubc',9,1662826736983,${sanitizeNFormatBody(`UBC and McGill decisions`)},${sanitizeNFormatBody(`<p>Hello, international student here! Does anyone know when can I expect a decision for UBC and McGill? I want to prepare myself for the mental breakdowns ik I'm gonna have haha</p><p>Also, I've heard that McGill takes a looong time to send their decisions so there's that</p>`)})
    //         ,(12,'mcgill',10,1662826736983,${sanitizeNFormatBody(`UBC and McGill decisions`)},${sanitizeNFormatBody(`<p>Hello, international student here! Does anyone know when can I expect a decision for UBC and McGill? I want to prepare myself for the mental breakdowns ik I'm gonna have haha</p><p>Also, I've heard that McGill takes a looong time to send their decisions so there's that</p>`)})
    //         ,(13,'ubc',11,1662826736983,${sanitizeNFormatBody(`How does waitlist work for UBC?`)},${sanitizeNFormatBody(`<p>Does ubc rank their waitlisted applicants or do they randomly pick applicants from the list? and about how many do they actually take?(like how many applicants and what percent)</p>`)})
    //         ,(14,'other',12,1662826736983,${sanitizeNFormatBody(`What Canadian Uni has the hottest guys?`)},${sanitizeNFormatBody(`<p>My only type.. is hot. Pls lmk cuz this is obviously the only thing I'm basing my university decision off of at this point.</p>`)})
    //         ,(15,'other',13,1662826736983,${sanitizeNFormatBody(`My friend can't afford university, how can I help?`)},${sanitizeNFormatBody(`<p>Hi, my friend is applying to university for nursing. She has a 95 average in high school which she has kept while maintain a job where she works 30 hours a week. She's really smart and really just an amazing person all around. She wants to go to queens university where the tuition is $25,000 a year and she has no savings other than what she's saved from work, which is no where near enough. Is there anything I can do to help her?</p>`)})
    //         ,(16,'uoft',14,1662826736983,${sanitizeNFormatBody(`Insight in UofT, UBC, Mcgill`)},${sanitizeNFormatBody(`<p>Hey Canada, aussie here! I'm currently thinking about going on exchange in Canada in sem 2 of 2022 (exciting!) As an undergrad student.</p><p>I'm applying for UofT, McGill and University of British Colombia. I was hoping for insight on the universities to help make a decision on the preferential priority.</p><p>I would like to know the general pros and cons of:</p><ol><li>Studying at each</li><li>Student life (social, dormitory life)</li><li>Opportunity to enjoy &amp; experience Canada (sightseeing, enjoying the nature, etc)</li></ol><p>Thanks in advance!</p>`)})
    //         ,(17,'uw',15,1662826736983,${sanitizeNFormatBody(`UBC vs Waterloo Engineering`)},${sanitizeNFormatBody(`<p>Hi! I am debating between UBC (Applied Science) and Waterloo (Computer Engineering) for next year and I was wondering about the pros and cons of each. Currently, the main factors I have are the lower cost of tuition at UBC and the city/environment I find is nicer, but Waterloo has a better co-op program.</p><p>If theres anyone currently attending either, would you mind telling me why you ended up choosing it and if you think it was a good choice?</p>`)})
    //         ,(18,'other',16,1662826736983,${sanitizeNFormatBody(`Canadian Scholarships to Apply to Now! Non-essay, low competition and more`)},${sanitizeNFormatBody(`<p>Hey guys,</p><p>As a uni student, I know how hard it was to find scholarships so I made a video outlining some of them, and i hope it's helpful :) I talk about some major scholarships, non-essay ones, international and more!</p><p><a href="https://youtu.be/J7tcpwMd4uk" rel="noopener noreferrer" target="_blank" style="color: var(--newCommunityTheme-linkText);">https://youtu.be/J7tcpwMd4uk</a></p><p><br></p><p><br></p><p><a href="https://preview.redd.it/8cf5t3wbled91.png?width=1280&amp;format=png&amp;auto=webp&amp;s=f5fd3f18c3d975eecf7ffefa74c88af5fdf1dfe5" rel="noopener noreferrer" target="_blank" style="color: inherit; background-color: var(--newCommunityTheme-post);"><img src="https://preview.redd.it/8cf5t3wbled91.png?width=1280&amp;format=png&amp;auto=webp&amp;s=f5fd3f18c3d975eecf7ffefa74c88af5fdf1dfe5" alt="r/CanadaUniversities - Canadian Scholarships to Apply to Now! Non-essay, low competition and more"></a></p><p><br></p>`)})
    //         ,(19,'other',17,1662826736983,${sanitizeNFormatBody(`Financially stuck`)},${sanitizeNFormatBody(`<p>I kind of am in a pickle and overheard my dad talking about finances to mom when I go to Canada for my higher studies. My sister is already studying in a costly university here in my native country but once I go there to Canada, it probably would be tough for him to sustain family here. So I was looking for alternatives on how to ease the economic pressure, willing to go to cheaper universities. So what cheap universities I can look into(preferably for engineering courses)? If not cheap, can I avail any scholarship which are “less competitive “? (I'm aware as I ask this, scholarships are not non competitive but I sadly don't have a stellar profile either on ecas, anything less competitive which I can shoot for will do)</p>`)})
    //         ,(20,'other',18,1662826736983,${sanitizeNFormatBody(`I made an app to help with scholarships and finding universities`)},${sanitizeNFormatBody(`<p>A couple of years ago I went through the same process a lot of you are going or have gone through and was annoyed at the lack of information about student awards and institutions outside of the province I lived in. Now since then a lot of new websites have popped up doing exactly that but I decided to keep developing my own version anyways.</p><p>So what does it do? There's 3 main features, the first is the Award Finder, which contains both external awards and internal school scholarships.</p><p>Next is the Institution Finder which contains most accredited institutions in Canada, information about their costs and the city they're in.</p><p>Finally, the Finance Calculator which is just a simple budget making tool, exportable into spreadsheet format.</p><p>There's more info on&nbsp;<a href="https://linktr.ee/eduhelper" rel="noopener noreferrer" target="_blank" style="color: var(--newCommunityTheme-linkText);">eduHelper here.</a></p><p>It's still very much in it's early days and I plan on adding a lot more in the future. Things like a PadMapper-type page for student housing. If anyone has any suggestions lmk.</p>`)})
    //         ,(21,'other',19,1662826736983,${sanitizeNFormatBody(`US Student applying to Canadian unis`)},${sanitizeNFormatBody(`<p>Hi, I'm a US student that will most likely apply to some Canadian universities. The main ones I am thinking about at least applying to are UBC and UofT. Can any locals tell me what the schools' are like from a Canadian standpoint.</p><p><br></p><p><br></p><p><br></p><p>I'm thinking about being a marketing/business or econ major with a psych minor.</p><p>I've done as much research as I can and it just seems like UofT is lonely, extremely competitive, and doesn't seem to have a great sense of community though it is the best in the country. As for UBC, it seems great but I have no idea what the campus is like, community, etc. I've done virtual tours but still can't really get a grasp of what these schools have to offer.</p>`)})
    //         ,(22,'uoft',20,1662826736983,${sanitizeNFormatBody(`Help Me Decide: UofT vs UBC`)},${sanitizeNFormatBody(`<p><strong>University of British Columbia (UBC) vs University of Toronto (at St. George and Mississauga)</strong></p><p>Intended Major: Computer Science.</p><p>Note: I plan on graduating in 3 years (not including potential internships/coops) due to my IB credits, so the tuition cost/difference in costs is over 3 academic years. Also, all the costs are in US dollars, not Canadian $.</p><p><strong>UofT Mississauga (second campus):</strong></p><p><em>Pros:</em></p><ul><li>Gave me the most scholarship out of all three – 80k over 4 years (will be 60k if I graduate in 3), making the annual cost of attendance ~33k (tuition, room &amp; board.)</li><li>Will receive a UofT degree (the degrees don't mention the campus) which is very prestigious and recognized worldwide.</li><li>Very beautiful and modern buildings/campus.</li><li>Will have access to resources at the main campus (St. George) and can even take some classes there.</li><li>Smaller student population (not necessarily a pro because I fit in both small and large unis) allowing a better student-to-professor relationship.</li><li>Professional Experience Year (PEY) available* — 12-16 months of paid internship.</li></ul><p><em>Cons:</em></p><ul><li>Due to being the second campus, not as many resources available compared to St. George campus (the main one). Would require more effort from me to seek them.</li><li>Student life lacks compared to the main UofT campus and UBC (partially due to the smaller student population?).</li><li>The campus doesn't have&nbsp;<em>that</em>&nbsp;much to offer and is 30 mins away from downtown Toronto.</li></ul><p>* I am an international student and PEY is usually not available to us at the second campus. However, after talking to the international admissions officer, I was told that they're planning to offer it to intl starting from fall 2020; however, it is not official yet and there is a (small yet exists) chance I might end up with no internships.</p><p><strong>UBC:</strong></p><p><em>Pros:</em></p><ul><li>Vancouver is becoming more and more popular for tech industry.</li><li>An amazingly beautiful campus, just in love with it.</li><li>Milder weather compared to Toronto/west coast-best coast?</li><li>Offers a co-op program — 3-4x 4month paid internships (12-16 months in total). Also, a higher chance of landing a good internship because large companies prefer 4-month interns compared to UofT's PEY where employers are more reluctant to hire interns for a long-term (12-16 months at once).</li><li>Good social life/collaborative and supportive community (mostly)/less cutthroat environment compared to UofT.</li></ul><p><em>Cons:</em></p><ul><li>Not as prestigious as UofT (and prestige kinda matters as I want to stay in North America to start my career before going back to my country).</li></ul><p><em>Cost:</em>&nbsp;Received a one-time scholarship worth $10,500. This makes the average annual cost of attendance ~37k.</p><p><strong>UofT St. George (main campus):</strong></p><p><em>Pros:</em></p><ul><li>Got the name/prestige. Almost guarantees a permanent residence in Canada. Easier to find a job (in and outside of Canada) due to network and opportunities offered.</li><li>Downtown location — a kinda hectic, vibrant, and dynamic location where I usually tend to work better/become motivated to work.</li><li>Beautiful campus (really campus shouldn't make a difference since it's good at all three choices).</li><li>Professional Experience Year available for international students (and it is official, unlike Mississauga campus).</li></ul><p><em>Cons:</em></p><ul><li>Expensive relative to other options and didn't get any scholarships. Average annual cost of attendance would be $53k.</li><li>Known to have a cutthroat/overly competitive environment. (not a huge con because it helps me do better...?)</li></ul><p>Total cost over 3 years of study (i.e to receive a degree/diploma):</p><p>UofT Mississauga = 100k</p><p>UBC = 112k</p><p>UofT St. George = 160k</p><p>Even though my family is okay with me going to any of the aforementioned universities and can afford them, I still consider the cost because I don't want to pay more when the return is not worth it. For that reason, I decided that it is unreasonable to pay 60% more for the main campus UofT than the second campus, especially when the diploma doesn't even mention the campus. However, if you think otherwise and think that UofT St. George is worth the extra bucks, please let me know.</p><p>I have been mostly trying to decide between UofT Mississauga and UBC. I feel like they both would put me at a similar starting point career-wise and at this point, it depends more on how well I take advantage of the opportunities offered. I really like UBC because of its more balanced academics and social life; however, I can also see myself doing really well at UofT Mississauga. The only thing that is making committing to UBC difficult is the thought of whether it's dumb to pass up on an opportunity to get a diploma from UofT for&nbsp;<strong>cheaper</strong>&nbsp;compared to UBC.</p><p>I would really really appreciate any input as we are approaching the May 1st deadline and I am stuck between these options (mainly between UBC and UofT Mississauga). Thank you all and stay safe!</p>`)})
    //         ,(23,'other',21,1662826736983,${sanitizeNFormatBody(`My life has been a mess and I would really like to get back on track. Would love to get some advice on what I can do.`)},${sanitizeNFormatBody(`<p>Hi everyone, I'm a 22 year old who dropped out of university in first year. I went to University for a social sciences bachelor degree. My average in High school was fairly high (besides math/physics, I had a 92% avg), but my math/physics courses were abysmal at 51/53% in grade 12. The last two years of high school were incredibly stressful for me, my dad became really abusive after I didn't get higher than a 80% in math in grade 10 and there was constant fighting going on between my parents/us. It was a literal war zone with bowls breaking, chairs being thrown and myself receiving numerous injuries such as a fractured collarbone from being kicked numerous times. I just blamed myself, and didn't have the strength to leave. Eventually, in grade 11 I just stopped trying in high school, made excuses, fucked up and neglected my studies and just ran away from my problems.</p><p>I was able to get into the general social sciences program at a university in Ontario and later switched to a double major. Things were going okay, I wasn't failing but in second semester of first year I got involved with a really toxic girl. I just fell in the same pattern as highschool and things just got worse and worse. I withdrew from my courses I could and failed a few (this happened winter sem of 2018. Last year I was able to get out of the relationship and finally work on myself again. I rebuilt most of my confidence, but I'm still struggling to find what path to take, I just feel hopeless. I've been living at home lying to my parents saying things are fine, they think I graduate next year.. I can't keep this facade up.</p><p>I'd really love a chance to redo and update my highschool grades if possible and apply again to a program I'm more interested in such as Computer Science or software engineering. I know it's an incredibly difficult task but I want to give this my all. I don't want to believe it's too late or that I don't have the capacity. What should I do? I just feel incredibly lost and feel like I'm sinking again.</p><p>Has anyone been in a similar position? I've been considering applying to a college as I've heard I might be able to upgrade my previous courses in order to meet the future prerequisites for a comp sci program. Maybe in the future I can try transferring from college to university.</p>`)})
    //         ,(24,'western',22,1662826736983,${sanitizeNFormatBody(`UBC WATERLOO or WESTERN`)},${sanitizeNFormatBody(`<p>I already asked in the Ontario uni subreddit. But since UBC isn't an on uni I though it would better to get advice here.</p><p>With the deadline being 5 days away, I still don't know which one to choose.</p><p>I am currently debating between UBC Sauder and sci ( hoping to get into cs), waterloo cs and cs dd , western sci and sosci with aeo.</p><p>I'm not really sure on what exactly I want to do in the future but I'm leaning towards something business technology related. I want to choose a program that is able to keep my options open.</p><p>Some pros and cons (please correct me if wrong):</p><p>UBC</p><p>pros:</p><ul><li>pretty campus</li><li>nice weather</li><li>already paid $500</li><li>good international ranking</li><li>can apply for co-op</li><li>2 options for programs</li><li>good balance of social life and academics</li></ul><p>Cons</p><ul><li>both programs are not as good as the other schools (correct me if I'm wrong) Ivey &gt; Sauder, waterloo cs &gt; ubc cs</li><li>kinda far</li></ul><p>Waterloo</p><p>Pros</p><ul><li>good co-op</li><li>double degree, can do both business and cs</li><li>top cs program</li></ul><p>Cons:</p><ul><li>I've heard the courses are hard, especially for someone who has no knowledge in programming</li><li>many people drop the double degree to just cs because of workload</li><li>lack of social life</li></ul><p>Western</p><p>Pros:</p><ul><li>Ivey is top business program</li><li>more flexibility in first 2 years</li><li>can probably do a major in cs with HBA</li><li>good social life</li><li>nice campus</li></ul><p>Cons:</p><ul><li>Ivey isn't guaranteed (how hard is it maintain aeo status?)</li><li>expensive</li><li>no co-op</li></ul><p>It would be great if anyone can offer any suggestions or advice on which to choose!</p>`)})
    //         ,(25,'uw',23,1662826736983,${sanitizeNFormatBody(`Always help everyone`)},${sanitizeNFormatBody(`<p><a href="https://i.redd.it/deorocvet2b91.jpg" rel="noopener noreferrer" target="_blank" style="color: inherit; background-color: var(--newCommunityTheme-post);"><img src="https://preview.redd.it/deorocvet2b91.jpg?width=960&amp;crop=smart&amp;auto=webp&amp;s=343a818de3a20803ab8e3112707d923654390c63" alt="r/uwaterloo - Always help everyone"></a></p>`)})
    //         ,(26,'uw',24,1662826736983,${sanitizeNFormatBody(`How's life in University of Waterloo?`)},${sanitizeNFormatBody(`<p>.</p>`)})
    // `);
    // await dbPool.execute(
    //     `
    //     insert ignore into posts (id,community, authorId,createdAt,title,bodyMetadata)
    //     values
    //         ${Array.from(
    //             { length: 50 },
    //             (_, i) => `(${i + 6},'uoft',2,${Date.now()},'post #${i + 6}','body')`
    //         ).join(",")}`
    // );

    // // post likes
    // const addLikePost = (post: number, num: number) =>
    //     Array.from({ length: num }, (_, i) => `(${post},${i + 1})`).join(",");
    // await dbPool.execute(
    //     `
    //     INSERT INTO post_likes (postId, userId) 
    //     VALUES
    //         ${addLikePost(4, 1)}
    //         ,${addLikePost(5, 30)}
    //         ,${addLikePost(6, 21)}
    //         ,${addLikePost(7, 14)}
    //         ,${addLikePost(8, getRandomInt(45))}
    //         ,${addLikePost(9, getRandomInt(45))}
    //         ,${addLikePost(10, getRandomInt(45))}
    //         ,${addLikePost(11, getRandomInt(45))}
    //         ,${addLikePost(12, getRandomInt(45))}
    //         ,${addLikePost(13, getRandomInt(45))}
    //         ,${addLikePost(14, getRandomInt(45))}
    //         ,${addLikePost(15, getRandomInt(45))}
    //         ,${addLikePost(16, getRandomInt(45))}
    //         ,${addLikePost(17, getRandomInt(45))}
    //         ,${addLikePost(18, getRandomInt(45))}
    //         ,${addLikePost(19, getRandomInt(45))}
    //         ,${addLikePost(20, getRandomInt(45))}
    //         ,${addLikePost(21, getRandomInt(45))}
    //         ,${addLikePost(22, getRandomInt(45))}
    //         ,${addLikePost(23, getRandomInt(45))}
    //         ,${addLikePost(24, getRandomInt(45))}
    //         ,${addLikePost(25, 55)}
    //         ,${addLikePost(26, 9)}
            
    // `);

    // // comments
    // await dbPool.execute(`
    //     insert ignore into comments (id, postId, authorId, parentCommentId, createdAt, bodyMetadata)
    //     values 
    //         (1,4, 1, null, 1662235073448, '<p>asdasdasd</p>')
    //         ,(2,4, 1, null, 1662235075912, '<p>asdasdaasdasdsd1qweqweioquweqo</p>')
    //         ,(3,4, 1, null, 1662235075912, '<p>ggs</p>')
    //         ,(4,4, 1, 2, 1662235075912, '<p>this is nested in second</p>')
    //         ,(5,4, 2, 4, 1662324786277, '<p>this is nested in nested second zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz</p>')
    //         ,(6,4, 1, 1, 1662338580279, '<p>short nest in first</p>')
    //         ,(7,4, 1, 1, 1662338580279, '<p>bunch small monitor program application keyboard javascript gaming network monitor program application keyboard javascript gaming network</p>')
    //         ,(8,4, 1, 1, 1662339526231, "<p>As an English major, it's always a nice surprise when I make it past the initial resume screenings for these kinds of companies. Two weeks ago, I received an email saying that I had gone through the screening and that I was invited to complete a pre-recorded interview (HireVue). A week later, I get a second email saying I've made it to a final round interview with the manager who would be directly overseeing me. She sent me her calendar and I scheduled my interview. I poured so much time preparing for this interviewing, perfecting my pitch, looking at the website, role responsibilities, etc. On the day of the interview, I log into the Zoom meeting but she never shows up. I email her as I'm still in the meeting to see what happened, and she replies that she mixed up her time zones. She offers me another interview the same day, but at a time when I have an extremely important meeting that I cannot miss. I tell her that I'm open to meeting the next day/same week and she ends up not responding. The next day, I receive an email from HR saying they have decided not to move forward with my application. What upsets me the most is that she never gave me the chance to complete an interview, especially considering it was she who messed up.</p>")
    //         ,(9,4, 1, 5, 1662338580279, '<p>yo major</p>')
    //         ,(10,4, 1, 9, 1662338580279, '<p>yo major</p>')
    //         ,(11,4, 1, 10, 1662338580279, '<p>yo major</p>')
    //         ,(12,4, 1, 11, 1662338580279, '<p>yo major</p>')
    //         ,(13,4, 1, 6, 1662338580279, '<p>hello</p><p><br></p><p>i am formatting so ye</p><p><br></p><p>nice</p><p><br></p><p><br></p><p>paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs paragraphs </p>')
    // `);
    // // start at 14
    // // prettier-ignore
    // await dbPool.execute(`
    //     insert ignore into comments (id, postId, authorId, parentCommentId, createdAt, bodyMetadata)
    //     values 
    //         (14,5,4,null,1662826736983,"<p>This is an excellent write up and some really great comparisons! I work in Canadian post-secondary and am almost done a masters with work focusing on elements of this. The Canadian university system is very different from the US system (and much more equitable). We don't really have the public vs. private dynamic that they do in the US (our private universities are generally small, religious and not well recognized), and the public funding and oversight of our schools keeps the quality high. Most (if not all) of our universities have programs that they're very strong at delivering and programs that aren't their strengths, but the overall quality of our education is high. Any of our U15 schools will give you a degree that will be fairly well regarded at least regionally, but most will still be pretty well recognized nationwide. And, publicly funding our universities keep the costs manageable so an undergrad doesn't graduate with 100k+ in loans.</p>")
    //         ,(15,5,5,null,1662826736983,"<p>Great write up, you put a lot of research into this and it shows! If you're interested in sharing anywhere else the Ontario Universities sub gets quite a bit more traffic than this one does, although it is primarily high school students.</p>")
    //         ,(16,5,5,14,1662826736983,"<p>relatable, coming from someone having experience in this</p>")
    //         ,(17,26,20,null,1662826736983,${sanitizeNFormatBody(`<p><span style="background-color: initial;">I'll provide the graduate student perspective here, and do my best to provide a balanced perspective.</span></p><p><span style="background-color: initial;">On academic levels, the University of Waterloo has a very good research reputation in various fields. A benefit of this is that you will receive some name recognition (especially in Canada, sometimes in U.S.). A downside of this is that there are many other talented students vying for the same funding, and thus the internal research awards are highly competitive. In many disciplines, it is quite normative to work 60 hour weeks (though it is not nearly as bad as the University of Tokyo, which I also worked at).</span></p><p><span style="background-color: initial;">On professional levels, the University of Waterloo probably has some of the best industrial integration among Canadian universities, especially in the technology space. The co-op program is very strong, and many students have the benefit of real work experience and job offers by the time they graduate. Beyond that, it is a very entrepreneurship-oriented institution, which helps build strong networks for individuals interested in that space.</span></p><p><span style="background-color: initial;">On personal levels, the campus is unnecessarily spread out, lacking historic character, and absolutely un-intuitive to navigate. Waterloo as a city is similarly poorly planned, as it was built along old Mennonite horse trails that do not have ideal traits for cars. That said, it has some strong and interesting ethnic communities, as well as technology and board game oriented cafes that give it a very unique character.</span></p><p><span style="background-color: initial;">All in all, the University of Waterloo is just a school; you should go there if you believe it will give you something of value compared to others, and you should avoid it if it won't.</span></p>`)})
    // `);

    // // comment likes
    // await dbPool.execute(`
    //     INSERT INTO comment_likes (commentId, userId)
    //     VALUES
    //         ${addLikePost(15, 5)}
    //         ,${addLikePost(16, 3)}
    //         ,${addLikePost(17, 15)}
    // `);

    
}

async function migration0() {
    // await dbPool.execute;
}

async function runDbScripts() {
    await setupDb();
    await seed();
    await migration0();
}
runDbScripts();
