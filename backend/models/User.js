import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: { type: String, default: "" },
  subscribeNewsletter: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Transform _id to id
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

const User = mongoose.model('User', userSchema);
export default User;
