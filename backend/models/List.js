import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  position: { type: Number, default: 0 },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
listSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for cards
listSchema.virtual('cards', {
  ref: 'Card',
  localField: '_id',
  foreignField: 'listId',
  justOne: false,
  options: { sort: { position: 1 } }
});

// Transform _id to id
listSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

const List = mongoose.model('List', listSchema);
export default List;
