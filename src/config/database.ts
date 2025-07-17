import mongoose, { mongo } from "mongoose"

export const connectDb =  async(uri:string)=>{
    try {
        await mongoose.connect(uri)
        console.log('connected to db')
    } catch (error) {   
        console.log('failed to establish a db connection',error)
    }
}