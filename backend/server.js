const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();

const classTrackerRouter = require('./routes/classTrackerRouter');

app.use(express.json());
app.use(cors());
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use('/classTracker', classTrackerRouter);

// Connexion à la base de données
mongoose.connect('mongodb://127.0.0.1:27017/autismeProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
  console.log("Connexion à la base de données établie");
});

db.on('error', (err) => {
  console.log("Erreur de connexion à la base de données", err);
});

app.listen(8000, () => {
  console.log("Serveur démarré avec succès !");
});