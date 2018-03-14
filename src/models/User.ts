import { Schema } from 'mongoose';
import { ExtractMongoose, typeDefinition } from '../lib/mongoose';

// export interface UserModel extends Document {
//   email: string;
//   email_lowered: string;
//   password: string;
//   salt: string;
//   firstName?: string;
//   lastName?: string;
//   googleId?: string;
// }

export interface UserModel extends ExtractMongoose<typeof definition> {}

const o = {} as UserModel;

type B = ExtractMongoose<typeof definition>;

type UserRole = 'admin' | 'user';
const userRoles: UserRole[] = ['admin', 'user'];

const definition = typeDefinition({
  email: { type: String, required: true },
  email_lowered: { type: String, required: true, index: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  googleId: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
  role: {
    type: String,
    // required: true,
    enum: userRoles,
  },
});

export default new Schema(definition);
