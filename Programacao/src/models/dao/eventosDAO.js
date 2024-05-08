const { MongoClient, ObjectId } = require("mongodb");
const url ="mongodb+srv://juliadantas24:josebaruk@cluster0.5vizxvz.mongodb.net/?retryWrites=true&w=marjority&appName=Cluster0";
let singleton;

async function connect(){
    if(singleton) return singleton;

    const client = new MongoClient(url);
    await client.connect();

    singleton= client.db("doaweb");
    return singleton;
}

async function getEventos() {
    try {
      const db = await connect();
      const resultados = await db.collection("eventos").find({});
      const result = await resultados.toArray(); 
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    } 
  }

  async function findOne(id) {
    try {
      const db = await connect();
      const resultados = await db.collection("eventos").findOne({_id: ObjectId.createFromHexString(id)}); 
      const result = await resultados;
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function findMes(nome) {
        try {
          const db = await connect();
          const resultados = await db.collection("eventos").find({mes: nome.toString()});
          const result = await resultados.toArray(); 
          return result;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }

    async function findLocal(nome) {
        try {
          const db = await connect();
          const resultados = await db.collection("eventos").find({local: nome.toString()}); 
          const result = await resultados.toArray();
          return result;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }


      async function findAcao(nome) {
        try {
          const db = await connect();
          const resultados = await db.collection("eventos").find({acao: nome.toString()}); 
          const result = await resultados.toArray();
          return result;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
module.exports = {getEventos, findOne, findMes, findLocal, findAcao};
