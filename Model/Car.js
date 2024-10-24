import mongoose from "mongoose";
const car_Schema= new  mongoose.Schema({
   carBrand:{type:String,required:true},
   rentRate:{type:Number,required:true},
   make:{type:String,required:true},
   carModel:{type:String,required:true},
   year:{type:Number,required:true},
   images:{type:String},
   engineType:{type:String,required:true},
   availability: {
      type: String,
      enum: ["Available", "Rented Out"], // availability status
      default: "Available", // default when car is added
    },
   userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Users_data',
      required: true 
   }
},{timestamps:true})
const car_Model=mongoose.model('cars',car_Schema);
export default car_Model