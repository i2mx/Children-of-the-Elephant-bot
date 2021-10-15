import { MongoClient } from 'mongodb';
import dotenv from "dotenv"

// * A class to interface with the mongoDB database* 

export default class databaseManager {
  async start() {
    dotenv.config()

    this.uri = process.env.URI;
    this.mongoclient = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true }); // Creates a MongoDB Client to the Message Database

    await this.mongoclient.connect(); // Connects to the database

    this.database = this.mongoclient.db('EOTC'); // Gets the database  
    this.messageCollection = this.database.collection('Messages'); // Gets the collection (of objects i think)
    this.userCollection = this.database.collection('Users');
    this.channelCollection = this.database.collection('Channels');
  }

  async addMessageToDatabase(userid, channel, messageContent) {
    let UCT10MinIncrement = Math.floor(Date.now() / 1000 / 600)
    this.messageCollection.insertOne({
      userid: userid,
      channel: channel,
      time: UCT10MinIncrement,
      content: messageContent
    })
    this.messageCollection.createIndex({userid:1})
    this.messageCollection.createIndex({channel:1})
    this.messageCollection.createIndex({time:1})

    // console.log(await this.messageCollection.distinct("userid"))
    // console.log(await this.messageCollection.distinct("channel"))
    // console.log(await this.messageCollection.distinct("time"))
  }


}




