import express from "express";
import { getMessage, sendMessage } from "../controllers/messageConntroller.js";
import isAuthenticated from "../middleware/isAuthanticated.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/:id").get(isAuthenticated, getMessage);

export default router;
