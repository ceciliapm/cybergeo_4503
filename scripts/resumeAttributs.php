<?php
/**
* Ce script permet de mettre à jour les fiches attributaires des objets patrimoniaux en alimentant la table attributs
* du schema idpatrimoniale et qui alimente le webservice d affichage des fiches attributaires.
* @ Julien Hubert - FMA
* version 1.0
* @ since 2023
*/

/**
 * Connexion à la base de données PostgreSQL
 */
$connect = pg_connect("host=localhost port=5432 dbname=pampas user=xxxxx password=xxxxx");

/**
 * Création de la table attributs dans le schéma idpatrimoniale (à n'executer qu'une seule fois).
 */
create table idpatrimoniale.attributs (
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
);
*/

/**
 * Sélection des noms de tables (vues) dans le schéma idpatrimoniale
 */
$sql1 = "SELECT table_name FROM information_schema.tables
         WHERE table_schema = 'idpatrimoniale'
         AND table_type = 'VIEW'
         AND table_name LIKE '%vue%'";
$resultb = pg_query($sql1);

/**
 * Insertion des données de chaque vue dans la table attributs
 */
while ($row = pg_fetch_array($resultb)) {
    $nomvue = $row['table_name'];

    /**
     * Cas 1 : Vues commençant par 'vue_cn'
     */
    if (strpos($nomvue, 'vue_cn') !== false) {
        /**
         * Cas 1a : Vues spécifiques de poissons
         */
        if (preg_match("/vue_cn_(anguille_|bar_|epinoche_|atherine_|brochet_|carassin_|carpe_|dorade_|epinoche_|gardon_|gobie_|poisson_anguille_|vieille_|hybridegb_)/", $nomvue)) {
            echo "Insertion de " . $nomvue . "\n";
            $cas1 = "INSERT INTO idpatrimoniale.attributs (idfiche, vue, nom, typedata, fonction, photo, information, nom_valide, url_taxref, url_fishbase, maturite)
                     SELECT fk_saisie_kid, '" . $nomvue . "', nom, 'poissons', fonction, photo_copyright, information, nom_valide, url, url_fishbase, maturite
                     FROM idpatrimoniale." . $row['table_name'] . " ORDER BY nom LIMIT 1;";
            $resultcas1 = pg_query($cas1) or die("Pb requete 1");
        }
        /**
         * Cas 1b : Vues spécifiques de mulets
         */
        else if (preg_match("/vue_cn_(mulet_)/", $nomvue)) {
            echo "Insertion de " . $nomvue . "\n";
            $cas1b = "INSERT INTO idpatrimoniale.attributs (idfiche, vue, nom, typedata, fonction, photo, information, url_fishbase, maturite)
                      SELECT fk_saisie_kid, '" . $nomvue . "', nom, 'poissons', fonction, photo_copyright, information, url_fishbase, maturite
                      FROM idpatrimoniale." . $row['table_name'] . " ORDER BY nom LIMIT 1;";
            $resultcas1b = pg_query($cas1b) or die("Pb requete 1b");
        }
        /**
         * Cas 2 : Vues spécifiques de carbone
         */
        else if (strpos($nomvue, 'carbone') !== false) {
            $cas2 = "INSERT INTO idpatrimoniale.attributs (idfiche, vue, nom, typedata, fonction, photo, information)
                     SELECT fk_saisie_kid, '" . $nomvue . "', nom, 'autre', fonction, photo_copyright, information
                     FROM idpatrimoniale." . $row['table_name'] . " ORDER BY nom LIMIT 1;";
            $resultcas2 = pg_query($cas2) or die("Pb requete 2");
            echo "Insertion de " . $nomvue . "\n";
        }
        /**
         * Cas 3 : Vues spécifiques de nature
         */
        else if (strpos($nomvue, 'carbone') !== false || strpos($nomvue, 'vegetation_dom') !== false || strpos($nomvue, 'macrofaune') !== false || strpos($nomvue, 'roseau') !== false || strpos($nomvue, 'bacteries') !== false || strpos($nomvue, 'roseliere') !== false || strpos($nomvue, 'planctoniques') !== false || strpos($nomvue, 'phyto') !== false) {
            $cas3 = "INSERT INTO idpatrimoniale.attributs (idfiche, vue, nom, typedata, fonction, photo, information)
                     SELECT fk_saisie_kid, '" . $nomvue . "', nom, 'nature', fonction, photo_copyright, information
                     FROM idpatrimoniale." . $row['table_name'] . " ORDER BY nom LIMIT 1;";
            $resultcas3 = pg_query($cas3) or die("Pb requete 3");
            echo "Insertion de " . $nomvue . "\n";
        }
        /**
         * Cas 4 : Vues spécifiques de nature avec nom_valide et url_taxref
         */
        else {
            echo "Insertion de " . $nomvue . "\n";
            $cas4 = "INSERT INTO idpatrimoniale.attributs (idfiche, vue, nom, typedata, fonction, photo, information, nom_valide, url_taxref)
                     SELECT fk_saisie_kid, '" . $nomvue . "', nom, 'nature', fonction, photo_copyright, information, nom_valide, url
                     FROM idpatrimoniale." . $row['table_name'] . " ORDER BY nom LIMIT 1;";
            $resultcas4 = pg_query($cas4) or die("Pb requete 4");
        }
    }
    /**
     * Cas 5 : Vues autres
     */
    else {
        $cas5 = "INSERT INTO idpatrimoniale.attributs (idfiche, vue, nom, typedata, fonction, photo, information)
                 SELECT fk_saisie_kid, '" . $nomvue . "', nom, 'autre', fonction, photo_copyright, information
                 FROM idpatrimoniale." . $row['table_name'] . " ORDER BY nom LIMIT 1;";
        $resultcas5 = pg_query($cas5) or die("Pb requete 5");
        echo "Insertion de " . $nomvue . "\n";
    }
} // Fin While
?>
```