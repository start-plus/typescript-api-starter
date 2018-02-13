import * as mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

export type BearerTokenModel = mongoose.Document & {
  _id: string;
  userId: typeof ObjectId;
};

export default new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: ObjectId, required: true },
});
