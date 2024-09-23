# Mise à jour de la table des scénarios
La table des scénarios (« scenarios.base_scenarios ») permet d’associer l’ensemble des objets patrimoniaux aux indices de sensibilités calculés, pour chacun des scénarios identifiés, pour chaque site d’étude.

Supposant que les indices de sensibilité ont auparavant été associés aux objets patrimoniaux, le processus à suivre est le suivant :

1/ Se connecter à la base de données PAMPAS et supprimer le contenu de la table des scénarios :
```\q
su postgres
psql -d pampas
delete from scenarios.base_scenarios
```

2/ Sortir de la base de données et exécuter le script PHP de remplissage de la table des scénarios :
```\q
exit
cd /home/admpampas/scripts
php fillScenario.php
```

3/ Se connecter de nouveau à la base de données et exécuter successivement le contenu des scripts SQL suivants :

```\q
1_correction_basescenarios.sql
```
intégration des objets non spatiaux 
```\q
2_sensibilite_non_spatial.sql ()
```
intégration des objets non concernés par la submersion
```\q
3_ajout_objets_non_impactes.sql
```
mise à jour finale
```\q
4_maj.sql (mise à jour finale)
```
Note : à des fins de vérification, les requêtes suivantes peuvent également être lancées. Ces requêtes ne doivent retourner aucun résultat.
```
\q
select distinct nom_vue  from scenarios.base_scenarios bs where objet is null ;
select distinct nom_vue  from scenarios.base_scenarios bs where id_fiche is null ;
select distinct nom_vue  from scenarios.base_scenarios bs where fonction is null ;
select distinct nom_vue  from scenarios.base_scenarios bs where groupe is null ;
```