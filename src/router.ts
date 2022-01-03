import express from "express";

import generalController from "./controllers/general";
import clientController from "./controllers/clients.controller";
import clinicController from "./controllers/clinics.controller";

const router = express.Router();

router.get("/", generalController.home);
router.get("/client/survey/:id", generalController.survey.getSurveyById);
router.get("/clients", clientController.list);
router.post("/client/login", clientController.login);
router.post("/client/register", clientController.register);
router.get("/test", clinicController.getAllProtocols);

export default router;
