import { Router } from "express";
import { createTicket, getTickets, getTicketById } from "../controllers/ticketController.js";
import auth from "../middleware/auth.js";

const router = Router();

// Routes
router.post("/", auth, createTicket);
router.get("/", auth, getTickets);
router.get("/:id", auth, getTicketById);

export default router;
