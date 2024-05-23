import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import auth from "../middleware/auth.js";

const contactsRouter = express.Router();

contactsRouter.use(auth);

contactsRouter.get("/", getAllContacts);
contactsRouter.get("/:id", getOneContact);
contactsRouter.delete("/:id", deleteContact);
contactsRouter.post("/", createContact);
contactsRouter.put("/:id", updateContact);
contactsRouter.patch('/:id/favorite', updateStatusContact);

export default contactsRouter;
