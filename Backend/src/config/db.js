import moongoose from "mongoose"

const connectDB=async ()=>{
    try {
        const connect=await moongoose.connect(
            process.env.MONGO_URL
        );

        console.log(`Mongo DB is connected `);
        
        
    } catch (error) {
        console.error(`MongoDB Error: ${error.message}`);
        process.exit(1);
    }

    
}

export default connectDB