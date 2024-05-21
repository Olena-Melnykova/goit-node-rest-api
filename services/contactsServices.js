import fs from "node:fs/promises";
import path from "path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

export async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error(e.message);
    return null;
  }
}

export async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(contact => contact.id === contactId);
    return contact || null;
  } catch (e) {
    console.error(e.message);
    return null;
  }
}

export async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) return null;

    const [removedContact] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf-8');
    return removedContact;
  } catch (e) {
    console.error(e.message);
    return null;
  }
}

export async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: crypto.randomUUID(),
      name,
      email,
      phone
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf-8');
    return newContact;
  } catch (e) {
    console.error(e.message);
    return null;
  }
}

export async function updateContact(contactId, updateData) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) return null;

    contacts[index] = { ...contacts[index], ...updateData };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf-8');
    return contacts[index];
  } catch (e) {
    console.error(e.message);
    return null;
  }
}