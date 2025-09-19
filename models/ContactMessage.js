import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
});

const ContactMessage = mongoose.models.contactmessage || mongoose.model('contactmessage', contactMessageSchema);

export default ContactMessage;

