<?php

$connect = pg_connect("host=localhost port=5432 dbname=xxxxx user=xxxx password=xxxx");

// Suppression du contenu de la table
$sql0="DELETE from scenarios.base_scenarios";
$result0 = pg_query($sql0);

// Insertion de chaque table produite avec le modèle QGIS dans la table base_scenarios //

$sql1="SELECT table_name FROM information_schema.tables
where table_schema = 'resultats_sensibilite'
AND table_type = 'BASE TABLE'
and table_name not like '%stats%'";   
$resultb = pg_query($sql1);

while ($row = pg_fetch_array($resultb)) { 
    $sql1b="INSERT INTO scenarios.base_scenarios
    (id_scenario, objet, id_objet, nom_vue, groupe, indice, id_fiche, id_site, geom, surface)
    select id_scenario, objet, id_objet, nom_vue, groupe, indice, id_fiche, id_site, geom, surface
    from resultats_sensibilite." . $row['table_name'];
    $result1b = pg_query($sql1b) or die("Pb requete 1b");
    echo "Insertion de ". $row['table_name']. "\n";
}

// Update du nom des scénarios //

echo "Insertion des noms de scenarios\n";
$sql3a="update scenarios.base_scenarios set nom_scenario = 'Xynthia + 60 cm, où les niveaux d’eau initiaux dans les marais correspondent à des niveaux classiques en période hivernale et les ouvrages hydrauliques sont ouverts dès le début de la simulation' where id_scenario = '1_1'";
$result3a = pg_query($sql3a) or die("Pb requete 3a");
$sql3b="update scenarios.base_scenarios set nom_scenario = 'Xynthia + 60 cm, où les marais sont à blancs avant la submersion marine et les ouvrages hydrauliques sont fermés, puis ouverts à mi-marée descendante 48h après la submersion' where id_scenario = '1_2'";
$result3b = pg_query($sql3b) or die("Pb requete 3b");
$sql3c="update scenarios.base_scenarios set nom_scenario = 'Xynthia +60 cm avec le bassin de chasse initialement rempli à 0.75m NGF, avec le même niveau d’eau que dans le marais de Tasdon et la vanne de Maubec fonctionnelle' where id_scenario = '2_1'";
$result3c = pg_query($sql3c) or die("Pb requete 3c");
$sql3d="update scenarios.base_scenarios set nom_scenario = 'Xynthia +60 cm avec le bassin de chasse plein, avec le même niveau d’eau que dans le marais de Tasdon et la vanne de Maubec défaillante' where id_scenario = '2_2'";
$result3d = pg_query($sql3d) or die("Pb requete 3d");
$sql3e="update scenarios.base_scenarios set nom_scenario = 'Xynthia+60 marais vide + ouvrages ouverts (état actuel) mais brécher les digues lorsqu’on est au niveau extrême' where id_scenario = '3_1'";
$result3e = pg_query($sql3e) or die("Pb requete 3e");
$sql3f="update scenarios.base_scenarios set nom_scenario = 'Xynthia +60 marais blanc + ouvrages fermés (état actuel) mais brecher les digues lorsqu’on est au niveau extrême' where id_scenario = '3_2'";
$result3f = pg_query($sql3f) or die("Pb requete 3f");

// Update des fonctions patrimoniales //

echo "Insertion des fonctions\n";
$sql4 = "UPDATE scenarios.base_scenarios a SET fct = b.fonction FROM idpatrimoniale.saisie_objet b WHERE b.kid = a.id_fiche";
$result4 = pg_query($sql4) or die("Pb requete 4");

// Update des composantes //

echo "Insertion des composantes\n";
$sql5 = "UPDATE scenarios.base_scenarios a SET composante = b.composante FROM idpatrimoniale.groupes b WHERE b.id = a.id_fiche";
$result5 = pg_query($sql5) or die("Pb requete 5");

// Update des groupes //

echo "Insertion des noms de groupe\n";
$sql6 = "UPDATE scenarios.base_scenarios a SET groupe = b.nom_grp FROM idpatrimoniale.groupes b WHERE b.id = a.id_fiche";
$result6 = pg_query($sql6) or die("Pb requete 6");

?>
