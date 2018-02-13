import * as mongoose from 'mongoose';

export type UserModel = mongoose.Document & {
  email: string;
  email_lowered: string;
  password: string;
  salt: string;
  googleId?: string;
};

export default new mongoose.Schema({
  email: { type: String, required: true },
  email_lowered: { type: String, required: true, index: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  googleId: { type: String },
});
