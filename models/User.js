import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { 
        type: String, 
        required: true 
    },
  email: { 
        type: String, 
        required: true, 
        unique: true 
    },
  password: { 
        type: String, 
        required: true 
    },
  createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

// Encrypt password before saving in database it only works if password field is changed
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare input password with the encrypted password in the database with matchPassword. Compare will ecrypt inputed pasword and check with password stored in db
UserSchema.methods.matchPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

export default mongoose.model('User', UserSchema);
