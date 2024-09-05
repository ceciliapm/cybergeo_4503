# Réinitialiser l’historique utilisateur
L’objectif est ici de vider l’historique des rapports générés de la plateforme tout en les sauvegardant dans une table annexe (prod.resultats_histo_backup) de la BD PAMPAS. 
*1/ Se connecter à la BDD PAMPAS
```
su postgres
psql -d pampas  # -d pour le nom de la BD à connecter)
```

*2/exécuter les requêtes suivantes pour insèrer l’historique des rapports dans la table 'annexe'
```
insert into prod.resultats_histo_backup select * from prod.resultats_histo where nom LIKE '%token%'  ;
```

*3/ Vider l’historique des rapports 
```
delete from prod.resultats_histo ;
```

