import Contact from "../models/contactModel.js";
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      populate: 'owner', 
    };

    const contacts = await Contact.paginate({ owner: req.user.id }, options);

    res.status(200).json({
      contacts: contacts.docs,
      total: contacts.totalDocs,
      limit: contacts.limit,
      page: contacts.page,
      pages: contacts.totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params; 
    const contactById = await Contact.findOne({ _id: id, owner: req.user.id });
    if (!contactById) {
      return res.status(404).send({ message: "Not found" });
    }
    res.status(200).json(contactById);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const removedContact = await Contact.findOneAndDelete({ _id: id, owner: req.user.id });
    if (!removedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(removedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createContact = async (req, res) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite,
      owner: req.user.id,
    };
    const newContact = await Contact.create(contact);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Body must have at least one field" });
    }

    const { id } = req.params;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStatusContact = async (req, res) => {
  try {
    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { id } = req.params;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      { favorite: req.body.favorite },
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
