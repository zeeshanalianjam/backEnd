import mongoose from "mongoose";
import { DB_NAME } from '../constants.js'

const DBConnect =  async () => {
    try {
      const ConnectionInstance =   await mongoose.connect(`${process.env.MONOGODB_URL}/${DB_NAME}`);
      console.log(`\n CONGRATULATIONS MONGODB is SUCCESSFULLY CONNECTED || CONNECTION HOST: ${ConnectionInstance.connection.host}`);

    } catch (error) {
        console.log(`MONGODB CONNECTION FAILD: ${error}`);
        process.exit(1);
    }
}

export default DBConnect;