import mongoose from "mongoose";

console.log(process.env.MONGO_URI);
function connect(){
    mongoose.connect(process.env.MONGO_URI, )
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
}
export default connect;