import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  position: { type: Number, default: 0 },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
cardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Transform _id to id
cardSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

const Card = mongoose.model('Card', cardSchema);
export default Card;
