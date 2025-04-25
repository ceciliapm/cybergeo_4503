const cors = require("cors");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: false,
}))
global.__basedir = __dirname;
const https = require('https');
const fs = require('fs');
const http = require("http");

const api = require ('./api'); // Appel du fichier associé api.syst.js
const apiobj = new api(); // déclaration de l'objet sur lequel va se baser tous les appels
const db = require ('./otherqueries'); // Appel du fichier associé api.syst.js


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

app.use(express.urlencoded({ extended: true }));


const getDurationInMilliseconds  = (start) => {
  const NS_PER_SEC = 1e9
  const NS_TO_MS = 1e6
  const diff = process.hrtime(start)

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} [STARTED]`)
  const start = process.hrtime()

  res.on('finish', () => {            
      const durationInMilliseconds = getDurationInMilliseconds (start)
      console.log(`${req.method} ${req.originalUrl} [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`)
  })

  res.on('close', () => {
      const durationInMilliseconds = getDurationInMilliseconds (start)
      console.log(`${req.method} ${req.originalUrl} [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`)
  })

  next()
})

let port = xxxx;

/*  Si HTTP : */
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});  

// Méthode POST 
 app.post('/init', async (req, res) => {
  // Utilisation de la méthode "add" qui sera exécutée dans api.chantier.js
  await apiobj.add0(req.body.idtoken);
  return res.status(200).json({
    data: "yes"
  })});

// Méthode POST 
 app.post('/sendPanier', async (req, res) => {
  // Utilisation de la méthode "add" qui sera exécutée dans api.chantier.js
  await apiobj.add1(req.body.nom, req.body.idtoken);
  return res.status(200).json({
    data: "yes"
  })
});

app.post('/runScenario', async (req, res) => {
  // Utilisation de la méthode "add2" qui sera exécutée dans api.chantier.js
  await apiobj.add2(req.body.selSite, req.body.nameScenario, req.body.nameLayer);
  //return res.status(200).send();
  return res.status(200).json({
    data: "yes"
  })
});

  app.get('/getGroupes/:layer', db.getGroupesByLayer)

  app.post('/fonction', async(req, res) => {
    await apiobj.postgeos(req.body.layer)
    return res.status(200).json({
      data: "yes"
    })
  });

  app.post('/style', async(req, res) => {
    return res.status(200).json({
      success: true,
      message: await apiobj.postgeos2(req.body.layer),
      data: "some data if there's any"
    });
  });

  // Graphs Ftc patrimoniales
  app.get('/stats/:token', db.getStatsGraph)

  app.get('/stats_g1/:token', db.getStatsGraph1)

  app.get('/stats_g2/:token', db.getStatsGraph2)

  // Graphs Composantes
  app.get('/statscomp/:token', db.getStatsGraphComp)

  app.get('/statscomp_g1/:token', db.getStatsGraphComp1)

  app.get('/statscomp_g2/:token', db.getStatsGraphComp2)

  // Graphs Fts écologiques
  app.get('/statsecol/:token', db.getStatsGraphEcol)

  app.get('/statsecol_g1/:token', db.getStatsGraphEcol1)

  //app.get('/statsecol_g2/:token', db.getStatsGraphComp2)

  app.post('/createpng', async(req, res) => {
    await apiobj.svgtopng1(req.body.base64chart1, req.body.token)
    return res.status(200).json({
      data: "yes"
    })
  });

  app.post('/createpngcomp', async(req, res) => {
    await apiobj.svgtopng2(req.body.base64chart1, req.body.token)
    return res.status(200).json({
      data: "yes"
    })
  });

  app.get('/base64/:token', db.getBase64_2)

// Méthode POST 
app.post('/deleteScenario', async (req, res) => {
  // Utilisation de la méthode "add" qui sera exécutée dans api.chantier.js
  await apiobj.remove1(req.body.selSite, req.body.nameScenario, req.body.nameLayer);
  return res.status(200).json({
    data: "yes"
  })
});

app.get('/attributs/:vue', db.getAttributs)

app.get('/listrapports', db.getRapports)

app.get('/listdatascen/:idrapport', db.getDataScen)

app.get('/downloadGraphs/:idrapport', db.downloadGraphs)

app.get('/countgraphs/:token', db.countGraphs)

app.post('/postConclusion', async (req, res) => {
  // Utilisation de la méthode "add2" qui sera exécutée dans api.chantier.js
  await apiobj.postconcl(req.body.idtoken, req.body.conclusion);
  return res.status(200).json({
    data: "yes"
  })
});


  
