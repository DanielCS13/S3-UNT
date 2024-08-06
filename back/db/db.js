import mongoose from 'mongoose';

const connectToDatabase = async () => {
	const URI_WEB='mongodb+srv://daniel13:flyh9I3u8WYm9AoV@s3-uni.3fa6yhl.mongodb.net/?retryWrites=true&w=majority&appName=S3-UNI'
	const URI_LOCAL='mongodb://localhost:27017'
    await mongoose.connect(
		// URI_LOCAL
		URI_WEB
	)
	.then(() => {
		console.log("🟢 MongoDB Connected...");
	})
	.catch((err) => {
		console.log("🔴 Can't connect to MongoDB: " + err);
	});
};

export default connectToDatabase;
