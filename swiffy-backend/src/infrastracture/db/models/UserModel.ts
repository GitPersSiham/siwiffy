import { Document, model, Schema } from "mongoose";

export interface UserDocument extends Document {
  id:string
  name: string;
  email: string;
  password: string;
  googleAccessToken: String, 
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps:true});

export const UserModel = model<UserDocument>("User", UserSchema);