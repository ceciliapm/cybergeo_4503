<?php

$connect = pg_connect("host=localhost port=5432 dbname=pampas user=postpas password=MU03Emt#A#v_e&W#O_");

// Creation de la table

/* create table idpatrimoniale.attributs (
kid serial,
idfiche integer,
vue text,
typedata text,
nom text,
fonction text,
photo text,
information text,
nom_valide text,
url_taxref text,
url_fishbase text,
maturite text
) */

// Insertion de chaque table produite avec le modèle QGIS dans la table base_scenarios //

$sql1="SELECT table_name FROM information_schema.tables
where table_schema = 'idpatrimoniale'
AND table_type = 'VIEW'
and table_name  like '%vue%'";   
$resultb = pg_query($sql1);

while ($row = pg_fetch_array($resultb)) {

    $nomvue = $row['table_name'];
    // Cas 1

    if (strpos($nomvue, 'vue_cn') !== false) {

        if (preg_match("/vue_cn_(anguille_|bar_|epinoche_|atherine_|brochet_|carassin_|carpe_|dorade_|epinoche_|gardon_|gobie_|poisson_anguille_|vieille_|hybridegb_)/", $nomvue)) {
            echo "Insertion de ". $nomvue. "\n";

            $cas1="INSERT INTO idpatrimoniale.attributs (idfiche, vue, nom, typedata, fonction, photo, information, nom_valide, url_taxref, url_fishbase, maturite)
            select fk_saisie_kid, '". $nomvue. "', nom, 'poissons', fonction, photo_copyright, information, nom_valide, url, url_fishbase, maturite from idpatrimoniale." . $row['table_name']. " order by nom limit 1;";
            $resultcas1 = pg_query($cas1) or die("Pb requete 1");

        }
        else if (preg_match("/vue_cn_(mulet_)/", $nomvue)) {
            echo "Insertion de ". $nomvue. "\n";

            $cas1b="INSERT INTO idpatrimoniale.attributs (idfiche, vue, nom, typedata, fonction, photo, information, url_fishbase, maturite)
            select fk_saisie_kid, '". $nomvue. "', nom, 'poissons', fonction, photo_copyright, information, url_fishbase, maturite from idpatrimoniale." . $row['table_name']. " order by nom limit 1;";
            $resultcas1b = pg_query($cas1b) or die("Pb requete 1b");

        }
        else {

            if (strpos($nomvue, 'carbone') !== false) {
                $cas2="INSERT INTO idpatrimoniale.attributs (idfiche, vue, nom, typedata, fonction, photo, information)
                select fk_saisie_kid, '". $nomvue. "', nom, 'autre', fonction, photo_copyright, information from idpatrimoniale." . $row['table_name']. " order by nom limit 1;";
                $resultcas2 = pg_query($cas2) or die("Pb requete 2");
                echo "Insertion de ". $nomvue. "\n";
            }
            else if (strpos($nomvue, 'carbone') !== false || strpos($nomvue, 'vegetation_dom') !== false || strpos($nomvue, 'macrofaune') !== false || strpos($nomvue, 'roseau') !== false || strpos($nomvue, 'bacteries') !== false || strpos($nomvue, 'roseliere') !== false || strpos($nomvue, 'planctoniques') !== false || strpos($nomvue, 'phyto') !== false){
                $cas3="INSERT INTO idpatrimoniale.attributs (idfiche, vue, nom, typedata, fonction, photo, information)
                select fk_saisie_kid, '". $nomvue. "', nom, 'nature', fonction, photo_copyright, information from idpatrimoniale." . $row['table_name']. " order by nom limit 1;";
                $resultcas3 = pg_query($cas3) or die("Pb requete 3");
                echo "Insertion de ". $nomvue. "\n";
            }
            else {
                echo "Insertion de ". $nomvue. "\n";

            $cas4="INSERT INTO idpatrimoniale.attributs (idfiche, vue, nom, typedata, fonction, photo, information, nom_valide, url_taxref)
            select fk_saisie_kid, '". $nomvue. "', nom, 'nature', fonction, photo_copyright, information, nom_valide, url from idpatrimoniale." . $row['table_name']. " order by nom limit 1;";
            $resultcas4 = pg_query($cas4) or die("Pb requete 4");
            }

        }

    }

    // Cas 2

    else {

        $cas5="INSERT INTO idpatrimoniale.attributs (idfiche, vue, nom, typedata, fonction, photo, information)
        select fk_saisie_kid, '". $nomvue. "', nom, 'autre', fonction, photo_copyright, information from idpatrimoniale." . $row['table_name']. " order by nom limit 1;";
        $resultcas5 = pg_query($cas5) or die("Pb requete 5");
        echo "Insertion de ". $nomvue. "\n";

    }


} // Fin While



?>
