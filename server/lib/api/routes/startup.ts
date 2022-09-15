import express from "express";
import { API } from "../../utils/namespaces";
import { confirmLoginCredentials } from "../controllers/startup";
import { validateToken } from "../middlewares/generalMiddlewares";

const router = express.Router();

router.route(API.Routes.InitialLoginIn).get(validateToken, confirmLoginCredentials);

export default router;
