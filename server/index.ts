import { ENVS } from "./lib/.app/serverEnvVars";
import { application, server } from "./lib/.app/serverRoom";
import { moveNextJSCookiesToReq } from "./lib/api/middlewares/generalMiddlewares";

application.post("/a", (req, res) => {
    console.log("a", req.body);
    console.log(req.cookies);

    res.status(200).send({ msg: "Hello World!" });
});

application.post("/asd", moveNextJSCookiesToReq, (req, res) => {
    // console.log(req.headers[HeaderKeys.SSRCookieString]);
    console.log(req.cookies);

    res.json({ ms: "asd" });
});

application.route("/cook").get((req, res) => {
    res.cookie("name", "asdasda");
    res.cookie("impor", "tant", {
        httpOnly: true,
    });

    res.json({ o: "Cookie has been send with the response" });
});

server.listen(ENVS.PORT, () => {
    console.log(`Server started on port ${ENVS.PORT}`);
});
