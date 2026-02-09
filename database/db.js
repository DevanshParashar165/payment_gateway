import mongoose from "mongoose";

const MAX_RETRIES = 3
const RETRY_INTERVAL = 5000

class DatabaseConnection{
    constructor(){
        this.retryCount = 0;
        this.isConnected = false

       //configure mongoose settings
        mongoose.set('strictQuery',true)

        mongoose.connection.on('connected',()=>{
            console.log("MongoDB connected sucessfully")
            this.isConnected = true
        })

        mongoose.connection.on('error',()=>{
            console.log("MongoDB connection  error")
            this.isConnected = false
        })

        mongoose.connection.on('disconnected',()=>{
            console.log("MongoDB disconneted")
            this.isConnected = false
            this.handleDisconnection()
        })

        process.on('SIGTERM',this.handleAppTermination.bind(this))
    }

    async connect(){
        try {
            if(!process.env.MONGO_URI){
                throw new Error("MongoDB URI not available")
            }
            
            const connectionOptions = {
                useNewUrlParser : true,
                useUnifiedTopology : true,
                maxPoolSize : 10,
                serverSelectionTimeoutMS : 45000,
                family : 4, //use IPv4
            };
    
            if(process.env.NODE_ENV === "development"){
                mongoose.set('debug',true)
            }
    
            await mongoose.connect(process.env.MONGO_URI,connectionOptions)
            this.retryCount = 0 // reset retry count on success
        } catch (error) {
            console.error(error.message)
            await this.handleConnectionError();
        }
    }

    async handleConnectionError(){
        if(this.retryCount<MAX_RETRIES){
            this.retryCount++;
            console.log(`Retrying conection... Attempt ${this.retryCount} of ${MAX_RETRIES}`)
            await new Promise(resolve => setTimeout(()=>{
                resolve
            }),RETRY_INTERVAL)
            return this.connect()
        }else{
            console.error(`Failed to connect to mongoDB after ${MAX_RETRIES}`)
            process.exit(1)
        }
    }

    async handleDisconnection(){
        if(!this.isConnected){
            console.log("Attempting to recconect mongoDB");
            this.connect();
        }
    }

    async handleAppTermination(){
        try {
            await mongoose.connection.close()
            console.log("MongoDB connection closed through app")
            process.exit(0)
        } catch (error) {
            console.log("Error during database disconnection : ",error)
            process.exit(1)
        }
    }

    getConnectionStatus(){
        return{
          isConnected : this.isConnected,
          readyState : mongoose.connection.readyState,
          host : mongoose.connection.host,
          name : mongoose.connection.name
        }
    }
}

// create a singleton instance

const dbConnection = new DatabaseConnection()

export default dbConnection.connect.bind(dbConnection)
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection)