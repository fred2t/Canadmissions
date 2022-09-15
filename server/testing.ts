import { dbPool } from "./lib/config/database";

async function f() {
    return dbPool.execute(`
    select posts.*, comments.*
    from posts
    left join comments
        on posts.id = comments.postId
    -- group by posts.id
    `);
}

async function g() {
    const [res] = await f();
    console.log(res);
}
g();
