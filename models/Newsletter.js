import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

const Newsletter = mongoose.models.newsletter || mongoose.model('newsletter', newsletterSchema);

export default Newsletter;

