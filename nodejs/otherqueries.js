const Pool = require('pg').Pool
const fs = require("fs");
const { readdirSync } = require('fs');
const AdmZip = require('adm-zip');

// Create a connection to the database
const pool = new Pool({
    user: '***',
    host: 'localhost',
    database: 'pampas',
    password: '***',
    port: 5432
});



const getGroupesByLayer = (request, response) => {

    const test = request.params.layer;
    console.log("reqeuete sur " + test);

    pool.query('SELECT groupe, objet FROM prod.resultats_histo WHERE nom = $1 order by date1 desc', [test], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(results.rows);
      });
    
}


// Graphs Fcts Patrimoniales //
const getStatsGraph = (request, response) => {

  const token = request.params.token;

  // Graphs 2 et 3
  pool.query("select * from prod.resultats_stats1_" + token + ";", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows);
  });
  
}

// Graph 1
const getStatsGraph1 = (request, response) => {

  const token = request.params.token;
 

  pool.query("with t0 as (select distinct objet from prod.resultats_stats1_" + token + "), \
  t1 as (select objet, avgmilage, fct from prod.resultats_stats1_" + token + "), \
  t2 as ( \
      select t0.objet, max(t1.avgmilage) as avgmilage, max(t1.fct) as fct from t0 left outer join t1 on t0.objet = t1.objet \
      group by t0.objet), \
  t3 as ( \
      select objet, avgmilage, fct, \
      CASE \
            WHEN avgmilage < 0.5 THEN 'amélioré'  \
            WHEN avgmilage > 2.5 then 'disparition'  \
          END type_evol  \
      from t2), \
  t4 as ( \
      select fct, COUNT(*) FILTER(where type_evol ='disparition') AS nb_disparition, \
      COUNT(*) FILTER(where type_evol ='amélioré') AS nb_ameliore \
      from t3 group by fct), \
  t5 as (select objet, fct, avgmilage from prod.resultats_stats1_" + token + "), \
  t6 as ( \
  SELECT fct, round(avg(avgmilage)::decimal, 2) as avg, count(avgmilage) FROM t5 GROUP BY t5.fct), \
  t7 as (select t6.fct, t6.avg, t6.count, t4.nb_disparition, t4.nb_ameliore from t6 left outer join t4 on t6.fct = t4.fct) \
  select t7.fct, t7.avg, t7.count, \
  CASE WHEN t7.nb_disparition is NULL THEN 0  ELSE t7.nb_disparition END AS nb_disparition, \
  CASE WHEN t7.nb_ameliore is NULL THEN 0  ELSE t7.nb_ameliore END AS nb_ameliore \
  from t7;",
  (error, results) => { 
    if (error) { 
      throw error
    }
    response.status(200).send(results.rows);
  });

}

// Graph 4
const getStatsGraph2 = (request, response) => {

  const token = request.params.token;

  pool.query("with t0 as ( \
    select objet, fct, avgmilage, \
    1::integer as etat_initial, \
           CASE \
               WHEN avgmilage <= 0.5 THEN 1.5 \
               WHEN avgmilage > 0.5 and avgmilage <= 1.5 THEN 1 \
               WHEN avgmilage > 1.5 and avgmilage <= 2.5 THEN 0.5 \
               WHEN avgmilage > 2.5 THEN 0 \
           END ponderation \
    from prod.resultats_stats1_" + token + "),  \
    t1 as (select objet, fct, etat_initial, ponderation * etat_initial as etat_final from t0) \
    select fct, sum(etat_initial) as etat_initial, sum(etat_final) as etat_final \
    from t1 \
    group by fct;", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows);
  });
  
}

// Graphs Composantes Patrimoniales //
const getStatsGraphComp = (request, response) => {

  const token = request.params.token;

  // Graphs 2 et 3
  pool.query("select * from prod.resultats_stats2_" + token + ";", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows);
  });
  
}

// Graph 1
const getStatsGraphComp1 = (request, response) => {

  const token = request.params.token;

   pool.query("with t0 as (select distinct objet from prod.resultats_stats2_" + token + "), \
   t1 as (select objet, avgmilage, composante from prod.resultats_stats2_" + token + "), \
   t2 as ( \
       select t0.objet, max(t1.avgmilage) as avgmilage, max(t1.composante) as composante from t0 left outer join t1 on t0.objet = t1.objet \
       group by t0.objet), \
   t3 as ( \
       select objet, avgmilage, composante, \
       CASE \
             WHEN avgmilage < 0.5 THEN 'amélioré'  \
             WHEN avgmilage > 2.5 then 'disparition'  \
           END type_evol  \
       from t2), \
   t4 as ( \
       select composante, COUNT(*) FILTER(where type_evol ='disparition') AS nb_disparition, \
       COUNT(*) FILTER(where type_evol ='amélioré') AS nb_ameliore \
       from t3 group by composante), \
   t5 as (select objet, composante, avgmilage from prod.resultats_stats2_" + token + "), \
   t6 as ( \
   SELECT composante, round(avg(avgmilage)::decimal, 2) as avg, count(avgmilage) FROM t5 GROUP BY t5.composante), \
   t7 as (select t6.composante, t6.avg, t6.count, t4.nb_disparition, t4.nb_ameliore from t6 left outer join t4 on t6.composante = t4.composante) \
   select t7.composante, t7.avg, t7.count, \
   CASE WHEN t7.nb_disparition is NULL THEN 0  ELSE t7.nb_disparition END AS nb_disparition, \
   CASE WHEN t7.nb_ameliore is NULL THEN 0  ELSE t7.nb_ameliore END AS nb_ameliore \
   from t7;", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows);
  }); 

}

// Graph 4
const getStatsGraphComp2 = (request, response) => {

  const token = request.params.token;

  pool.query("with t0 as ( \
    select objet, composante, avgmilage, \
    1::integer as etat_initial, \
           CASE \
               WHEN avgmilage <= 0.5 THEN 1.5 \
               WHEN avgmilage > 0.5 and avgmilage <= 1.5 THEN 1 \
               WHEN avgmilage > 1.5 and avgmilage <= 2.5 THEN 0.5 \
               WHEN avgmilage > 2.5 THEN 0 \
           END ponderation \
    from prod.resultats_stats2_" + token + "),  \
    t1 as (select objet, composante, etat_initial, ponderation * etat_initial as etat_final from t0) \
    select composante, sum(etat_initial) as etat_initial, sum(etat_final) as etat_final \
    from t1 \
    group by composante;", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows);
  });
  
}


// Graphs Fcts écologoques //
const getStatsGraphEcol = (request, response) => {

  const token = request.params.token;

  // Graphs 2 et 3
  pool.query("select * from prod.resultats_stats3_" + token + ";", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows);
  });
  
}

// Graph 1
const getStatsGraphEcol1 = (request, response) => {

  const token = request.params.token;

   pool.query("with t0 as (select distinct objet from prod.resultats_stats3_" + token + "), \
   t1 as (select objet, avgmilage, fct_ecol from prod.resultats_stats3_" + token + "), \
   t2 as ( \
       select t0.objet, max(t1.avgmilage) as avgmilage, max(t1.fct_ecol) as fct_ecol from t0 left outer join t1 on t0.objet = t1.objet \
       group by t0.objet), \
   t3 as ( \
       select objet, avgmilage, fct_ecol, \
       CASE \
             WHEN avgmilage < 0.5 THEN 'amélioré'  \
             WHEN avgmilage > 2.5 then 'disparition'  \
           END type_evol  \
       from t2), \
   t4 as ( \
       select fct_ecol, COUNT(*) FILTER(where type_evol ='disparition') AS nb_disparition, \
       COUNT(*) FILTER(where type_evol ='amélioré') AS nb_ameliore \
       from t3 group by fct_ecol), \
   t5 as (select objet, fct_ecol, avgmilage from prod.resultats_stats3_" + token + "), \
   t6 as ( \
   SELECT fct_ecol, round(avg(avgmilage)::decimal, 2) as avg, count(avgmilage) FROM t5 GROUP BY t5.fct_ecol), \
   t7 as (select t6.fct_ecol, t6.avg, t6.count, t4.nb_disparition, t4.nb_ameliore from t6 left outer join t4 on t6.fct_ecol = t4.fct_ecol) \
   select t7.fct_ecol, t7.avg, t7.count, \
   CASE WHEN t7.nb_disparition is NULL THEN 0  ELSE t7.nb_disparition END AS nb_disparition, \
   CASE WHEN t7.nb_ameliore is NULL THEN 0  ELSE t7.nb_ameliore END AS nb_ameliore \
   from t7;", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows);
  }); 

 
  
}


const getBase64_2 = (req, res) => {

  const token = req.params.token;
  console.log(token);
  const folder = '/home/webservices/png/' + token
  const directoryPath = folder;

  const getFileList = (dirName) => {
    let files = [];
    const items = readdirSync(dirName, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory()) {
            files = [...files, ...getFileList(`${dirName}/${item.name}`)];
        } else {
          files.push({
            name:  fs.readFileSync(`${dirName}/${item.name}`, {encoding: 'base64'}),
          });
        }
    }

    return files;
};

const files = getFileList(directoryPath);
res.status(200).send(files);



};


const getAttributs = (request, response) => {

  const vue = request.params.vue;

  pool.query("select * from idpatrimoniale.attributs where vue = '" + vue + "';", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows);
  });

}


const getRapports = (request, response) => {

  pool.query("select distinct(split_part(nom, '_', 2)) as nom, left(date1, 10) as date1 from prod.resultats_histo order by date1 desc limit 10", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows);
  });

}


const getDataScen = (request, response) => {

  const idrapport = request.params.idrapport;

  pool.query("with t0 as (select objet, idscenario, nom, conclusion, \
  CASE \
    WHEN left(idscenario, 1) = '1' THEN 'Fier d''Ars' \
    WHEN left(idscenario, 1) = '2' THEN 'Tasdon' \
    WHEN left(idscenario, 1) = '3' THEN 'Moëze/Brouage' \
    ELSE '' \
end as site_scenario \
  from prod.resultats_histo where nom like '%" + idrapport + "%') \
  select string_agg(objet::text, ', ') as objet, \
  max(idscenario) as idscenario, \
  max(split_part(nom, '_', 2)) as nom, \
  max(conclusion) as conclusion, \
  max(site_scenario) as site, \
  CASE \
    WHEN max(idscenario) = '1_1' THEN 'Xynthia + 60 cm / Niveau de gestion classique hivernale' \
    WHEN max(idscenario) = '1_2' THEN 'Xynthia + 60 cm / Niveau type marais à blanc' \
    WHEN max(idscenario) = '2_1' THEN 'Xynthia + 60 cm / Niveau d’eau classique hivernal dans les marais' \
    WHEN max(idscenario) = '2_2' THEN 'Xynthia + 60 cm / Niveau type marais à blanc (très haut)' \
    WHEN max(idscenario) = '3_1' THEN 'Xynthia + 60 cm / Niveau d’eau très bas dans les marais' \
    WHEN max(idscenario) = '3_2' THEN 'Xynthia + 60 cm / Niveau type marais à blanc (très haut)' \
    ELSE '' \
end as desc_scenario \
from t0", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows);
  });

}



const downloadGraphs = (req, res) => {
 
  const idrapport = req.params.idrapport;

  const zip = new AdmZip();
  const readFolderPath = fs.readdirSync("/home/webservices/png/" + idrapport + '/1');
  const folderPath = "/home/webservices/png/" + idrapport + '/1';
  const readFolderPath2 = fs.readdirSync("/home/webservices/png/" + idrapport + '/2');
  const folderPath2 = "/home/webservices/png/" + idrapport + '/2';
  const folderZip = "/home/webservices/exports/";

  for(var i = 0; i < readFolderPath.length;i++){
    zip.addLocalFile(folderPath+"/"+readFolderPath[i]);
  }
  for(var i = 0; i < readFolderPath2.length;i++){
    zip.addLocalFile(folderPath2+"/"+readFolderPath2[i]);
  }

  // Define zip file name
  const downloadName = 'exportGraphs_' + idrapport + '.zip';

  const data = zip.toBuffer();

  // save file zip in root directory
  zip.writeZip(folderZip + "/"+downloadName);
  
  // code to download zip file

  res.set('Content-Type','application/octet-stream');
  res.set('Content-Disposition',`attachment; filename=${downloadName}`);
  res.set('Content-Length',data.length);
  res.send(data);

}; 


const countGraphs = (req, res) => {

  function genRandonString(length) {
    var chars = 'abcdefghijklmnopqrstuvwxyz';
    var charLength = chars.length;
    var result = '';
    for ( var i = 0; i < length; i++ ) {
       result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
 }
  
  const token = req.params.token;
  console.log(token);
  const folder1 = '/home/webservices/png/' + token + '/1/'
  const folder2 = '/home/webservices/png/' + token + '/2/'
  
  function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        console.log(name)
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_.length;
}

function getFiles2 (dir, files_){
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files){
      var name = dir + '/' + files[i];
      console.log(name)
      if (fs.statSync(name).isDirectory()){
          getFiles2(name, files_);
      } else {
          files_.push(name);
      }
  }
  return files_.length;
}

a = getFiles(folder1)
b = getFiles2(folder2)

if (a < 4){
  r = 4 - a
  for (let i = 0; i < r; i++) {
  fs.appendFile(folder1 + 'noimage_' + genRandonString(3) + '.png', 'Hello content!', function (err) {
    if (err) throw err;
    console.log('Saved!');
  }); 
 }
}

if (b < 3){
  r = 3 - b
  for (let i = 0; i < r; i++) {
  fs.appendFile(folder2 + 'noimage_' + genRandonString(3) + '.png', 'Hello content!', function (err) {
    if (err) throw err;
    console.log('Saved!');
  }); 
 }
}

res.status(200).send({
  message:  "ok",                      
  error:0
})



};


module.exports = {
  getGroupesByLayer,
  getStatsGraph,
  getStatsGraph1,
  getStatsGraph2,
  getStatsGraphComp,
  getStatsGraphComp1,
  getStatsGraphComp2,
  getStatsGraphEcol,
  getStatsGraphEcol1,
  getBase64_2,
  getAttributs,
  getRapports,
  getDataScen,
  downloadGraphs,
  countGraphs
}

