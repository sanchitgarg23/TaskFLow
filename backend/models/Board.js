import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, default: "Kanban" },
  color: { type: String, default: "#3B82F6" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
boardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for lists (to behave like include: { lists: ... })
boardSchema.virtual('lists', {
  ref: 'List',
  localField: '_id',
  foreignField: 'boardId',
  justOne: false,
  options: { sort: { position: 1 } } // Sort by position ascending
});

// Transform _id to id
boardSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

const Board = mongoose.model('Board', boardSchema);
export default Board;
