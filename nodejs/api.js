const fs = require("fs");
const { Client} = require('pg');
const https = require("https");
const svg2png = require("svg2png");

const docx = require("docx");
const { AlignmentType, Document, Packer, Paragraph } = docx;

// Create a connection to the database
const client = new Client({
    user: '***',
    host: 'localhost',
    database: 'pampas',
    password: '***',
    port: 5432
});


// La classe fma correspond au require (api.chantier) de index.js
class api {
      constructor() {
	client.connect()
      }

      async add0 (a){

        var token = a;
        console.log(token)
        await client.query("DROP TABLE IF EXISTS prod.temptable_" + token + ";");
        await client.query("CREATE TABLE prod.temptable_" + token + " (id integer, nom text)");
        console.log("CREATE TABLE prod.temptable_" + token + " (id integer, nom text)");
      } 

      async add1 (a, b){
        console.log("test")
        var a2 = a.split(';')[1];
        console.log("$1", [a2])
        var token = b
        await client.query('insert into prod.temptable_' + token + ' (nom) VALUES ($1)', [a2]);
        await client.query('insert into prod.temptable_' + token + ' (nom) \
        select b.nom_vue from prod.temptable_' + token + ' a, prod.transpo_groupes b \
        where a.nom = b.nom_grp;');
      } 

      async add2 (a, b, c){

        //console.log([a], [b], [c])
        var c2 = c.split('.')[1];
        var d = c2.split('_')[1];
        // var cs = c.split('.')[0] + '_s_' + d;
        var cs = 'prod.resultats_s_' + d;
        console.log("c : ", c);
        console.log("c2 : ", c2);
        console.log("d : ", d);
        console.log("cs : ", cs);

        await client.query ("drop table if exists "+ c + ";");
        await client.query ("drop table if exists "+ cs + ";");

        await client.query ("create table "+ c + " (groupe text, geom geometry, indice integer)");

        await client.query ("create table "+ cs +" as \
            select id_fiche, id_objet, objet, indice, groupe, geom, surface, composante, fct, id_scenario \
            from scenarios.base_scenarios \
            where id_scenario = $2 and id_site = $1 \
            and nom_vue in (select nom from prod.temptable_" + d + ")", [a, b]);

        // Insertion dans la table resultats_histo 
        await client.query (" \
          with t1 as ( \
            select groupe, id_scenario, \
            string_agg(distinct objet, ', ') as objet from " + cs + " group by groupe, id_scenario) \
            insert into prod.resultats_histo (nom, date1, groupe, objet, idscenario) select '" + c2 + "', NOW(), groupe, objet, id_scenario from t1");             

        // Suppression des doublons
        await client.query (" \
        WITH cte0 AS (SELECT groupe, geom ,indice  FROM " + cs + " where groupe = 'ecluses_ouvrages_hydrauliques'), \
        cte1 AS (  \
            SELECT min(groupe) as groupe, min(geom)::geometry as geom, min(indice) as indice  FROM " + cs + " \
            GROUP BY concat(surface, groupe)  \
            having min(groupe) != 'ecluses_ouvrages_hydrauliques' \
        )  \
        insert into " + c + " (groupe, geom, indice) select groupe, geom, indice from cte0 union select groupe, geom, indice from cte1 \
        ");

        // Création de n vues correspondant aux n groupes de la table des résultats (n vues pour n groupes)
        await client.query ("DO $$ \
          DECLARE \
          row record; \
            BEGIN \
            FOR row IN SELECT DISTINCT groupe FROM " + c + " \
            LOOP \
            EXECUTE FORMAT('CREATE OR REPLACE VIEW " + c + "_%s AS SELECT * FROM " + c + " WHERE groupe = %L',row.groupe,row.groupe); \
            END LOOP; \
            END $$; \
        ");

        // Création de la table des stats_1 (fonctions patrimoniales)
        await client.query (" Create table prod.resultats_stats1_" + d + " AS \
           with t0 as (select objet, UNNEST(STRING_TO_ARRAY(fct, ';')) AS fct, indice, groupe, surface from " + cs + " ), \
           t1 as (select * from t0), \
           t3 as (select objet, fct, sum(indice * surface) / sum(surface) as avgMilage, initcap(split_part(fct, ' ', 3)) as fct2 from t1 group by (objet, fct)) \
           select * from t3 order by fct2"); 

        // Création de la table des stats_2 (composantes patrimoniales)
        await client.query (" Create table prod.resultats_stats2_" + d + " AS \
           with t0 as (select objet, UNNEST(STRING_TO_ARRAY(composante, ';')) AS composante, indice, groupe, surface from " + cs + " ), \
           t1 as (select * from t0), \
           t3 as (select objet, composante, sum(indice * surface) / sum(surface) as avgMilage, composante as comp2 from t1 group by (objet, composante)) \
           select * from t3 order by comp2"); 

        // Fct écologiques
        await client.query ("Create table prod.resultats_stats3_" + d + " AS \
        with t1 as (select * from idpatrimoniale.fct_ecologiques), \
        t2 as  (select id_fiche, objet, indice, groupe, surface from " + cs + "), \
        t3 as (select t2.objet, t2.indice, t2.groupe, t2.surface, t1.fct_ecol from t1, t2 where t1.id_fiche = t2.id_fiche), \
        t4 as (select objet, fct_ecol, sum(indice * surface) / sum(surface) as avgMilage from t3 group by (objet, fct_ecol)) \
        select * from t4 order by fct_ecol");

           const token = d;
           const folder = '/home/webservices/png/' + token;
           if (!fs.existsSync(folder)){
           fs.mkdirSync(folder);
           fs.mkdirSync(folder + '/1');
           fs.mkdirSync(folder + '/2');
           }
           else {
            fs.rmSync(folder, { recursive: true, force: true });
            fs.mkdirSync(folder);
            fs.mkdirSync(folder + '/1');
            fs.mkdirSync(folder + '/2');
           }
      };


      async postgeos(a){
            const request = require('request');
    
            const name = a;
            const type1 = a.split('_')[2]
            console.log("res " + name);
            
             const options = {
              method: 'POST',
              url: 'data.pampas.univ-lr.fr/geoserver/rest/workspaces/pampas/datastores/prod/featuretypes',
              headers: {'Content-Type': 'application/xml', Authorization: 'Basic xxxx'},
              body: '<featureType><name>' + name + '</name></featureType>'
            };
        
            //console.log(options);
        
            request(options, function (error, response, body) {
              if (error) throw new Error(error);
              console.log("errPOST", body);
            });
         
      }

      async postgeos2(a){
        const request = require('request');

        const name = a;
        const type1 = a.split('_')[2]
        console.log("res " + name);

      const options2 = {
        method: 'PUT',
        url: 'https://data.pampas.univ-lr.fr/geoserver/rest/layers/pampas:' + name,
        headers: {'Content-Type': 'application/xml', Authorization: 'Basic xxxx'},
        body: '<layer><defaultStyle><name>indices1</name></defaultStyle></layer>'
      }; 
      
     // console.log(options2);
    
      request(options2, function (error, response, body2) {
        if (error) throw new Error(error);
        console.log("errPUT", body2);
      }); 

      }

      async svgtopng1(a, b){
        console.log("a : " + a)
        console.log("b : " + b)
        const folder = '/home/webservices/png/' + b + '/1';

        fs.rmSync(folder, { recursive: true, force: true });
        fs.mkdirSync(folder);

        var chars = 'abcdefghijklmnopqrstuvwxyz';
        var charLength = chars.length;
        var result = '';
        for ( var i = 0; i < 6; i++ ) {
            result += chars.charAt(Math.floor(Math.random() * charLength));
        }
        const buffer = Buffer.from (a);
       // const buffer = a;
       svg2png(buffer, { width: 500, height: 333 })
       .then (buffer => fs.writeFile(folder + '/' + result + ".png", buffer, function (err) {
          if (err) throw err;
          console.log('File is created successfully.');
        }));
      }


      async svgtopng2(a, b){
        const folder = '/home/webservices/png/' + b + '/2';

        fs.rmSync(folder, { recursive: true, force: true });
        fs.mkdirSync(folder);

        var chars = 'abcdefghijklmnopqrstuvwxyz';
        var charLength = chars.length;
        var result = '';
        for ( var i = 0; i < 6; i++ ) {
            result += chars.charAt(Math.floor(Math.random() * charLength));
        }
        const buffer = Buffer.from (a);
        svg2png(buffer, { width: 500, height: 333 })
        .then (buffer => fs.writeFile(folder + '/' + result + ".png", buffer, function (err) {
          if (err) throw err;
          console.log('File is created successfully.');
        }));
      }


      async remove1 (a, b, c){

        var c2 = c.split('.')[1];
        var d = c2.split('_')[1];
        var cs = 'prod.resultats_s_' + d;
        console.log("c : ", c);
        console.log("d : ", d);
        console.log("cs : ", cs);

         await client.query("\DO $$ DECLARE \
         tabname RECORD; \
         BEGIN \
         FOR tabname IN (select table_name \
           from information_schema.tables \
           where table_name like '%resultats_" + d + "%' and table_schema ='prod' and table_type = 'VIEW') \
         LOOP \
           EXECUTE 'DROP VIEW IF EXISTS prod.' || quote_ident(tabname.table_name) || ';' ;\
         END LOOP; \
         END $$;");
        await client.query ("drop table if exists "+ c + "CASCADE");
        await client.query ("drop table if exists "+ cs + "CASCADE");
        await client.query ("drop table if exists "+ c);
        await client.query ("drop table if exists "+ cs);
        await client.query ("drop table if exists prod.resultats_stats1_" + d);
        await client.query ("drop table if exists prod.resultats_stats2_" + d);
      }

      async postconcl (a, b){
        console.log(a)
        console.log(b)
	      b = b.replaceAll("'", "''");
        console.log(b)

        await client.query("update prod.resultats_histo \
        set conclusion = '" + b + "' where nom like '%" + a + "%';");
      }
}


// expose la classe éq des packages en Java = classe citeos
module.exports = api;


