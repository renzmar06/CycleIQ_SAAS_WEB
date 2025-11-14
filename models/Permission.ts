import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  module: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { transform: function(doc, ret) { ret._id = ret._id.toString(); return ret; } },
  toObject: { transform: function(doc, ret) { ret._id = ret._id.toString(); return ret; } }
});

export default mongoose.models.Permission || mongoose.model('Permission', permissionSchema);