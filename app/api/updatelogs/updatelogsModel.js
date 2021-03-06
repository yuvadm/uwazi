import mongoose from 'mongoose';

const updateLogSchema = new mongoose.Schema({
  timestamp: Number,
  namespace: String,
  mongoId: { type: mongoose.Schema.Types.ObjectId, index: true },
  deleted: Boolean,
});

const Model = mongoose.model('updatelogs', updateLogSchema);
export default Model;
