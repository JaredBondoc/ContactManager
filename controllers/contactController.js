const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel")
//@description Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id })
    res.status(200).json(contacts);
});

//@description Create new contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async(req, res) => {
    console.log("The request body is :", req.body);
    const {name, email, phone} = req.body;
    if(!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    });

    res.status(201).json({contact});
});

//@description Get contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
    }    
    res.status(200).json(contact);
});

//@description Update contacts
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
    }   

    if(contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User does not have permission to update other user contacts");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedContact);
});

//@description Delete contact
//@route DELETE /api/contacts/:id
//@access priavet
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
    }

    if(contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User does not have permission to update other user contacts");
    }

    await contact.deleteOne({ _id: req.params.id }); // Remove the specific contact document
    res.status(200).json({ message: "Contact deleted" });
});


module.exports = { 
    getContacts, 
    getContact, 
    createContact, 
    updateContact, 
    deleteContact 
};