import express from "express";

import { API } from "../../utils/namespaces";
import {
    changePassword,
    changeUsername,
    deleteAccount,
    getHomepage,
    getProfile,
    googleSignOn,
    logInUser,
    logOutUser,
    signUpUser,
} from "../controllers/users";
import {
    moveNextJSCookiesToReq,
    validateHuman,
    validateToken,
    validateTokenAlwaysContinue,
} from "../middlewares/generalMiddlewares";
import {
    appendUsername,
    capUsernameLength,
    removeSpacesFromUsername,
    validateParamsUserId,
} from "../middlewares/usersMiddlewares";

const router = express.Router();

router.get("/xd", (req, res) => {
    res.cookie("impor", "CHANGED");
    res.json({ f: "xd" });
});

router
    .route(API.Routes.SignUp)
    .post(/* validateHuman, */ removeSpacesFromUsername, capUsernameLength, signUpUser);
router.route(API.Routes.LogIn).post(removeSpacesFromUsername, logInUser);

// google sso
// router
//     .route(API.Routes.GoogleSignOn)
//     .post(removeSpacesFromUsername, appendUsername, capUsernameLength, googleSignOn);
router.route(API.Routes.ChangeUsername).put(validateToken, changeUsername);

// unnecessary to authenticate them for logout
router.route(API.Routes.LogOut).post(logOutUser);
router.route(API.Routes.ChangePassword).put(removeSpacesFromUsername, changePassword);
router.route(API.Routes.DeleteAccount).delete(validateToken, deleteAccount);
router
    .route(API.Routes.GetHomepage)
    .get(moveNextJSCookiesToReq, validateTokenAlwaysContinue, getHomepage);

// testing
router.route("/profile").get(validateToken, getProfile);

export default router;
