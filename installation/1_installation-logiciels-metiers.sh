#!/bin/sh

# variables
filetomcat=https://archive.apache.org/dist/tomcat/tomcat-8/v8.5.20/bin/apache-tomcat-8.5.20.tar.gz
filegeoserver=https://sourceforge.net/projects/geoserver/files/GeoServer/2.15.1/geoserver-2.15.1-war.zip
bdd_add_disk='/mnt/vdb/postgresql'

# Une fois que le système a été redémarré et le disque additionnel monté, lancer l'installation

# MAJ dépôts
echo "---------- MAJ des dépôts ----------"
apt-get update
mkdir /home/tmp

# Postgresql
echo "---------- Installation Postgresql ------------"
cd /mnt/vdb
mkdir postgresql
apt-get install postgresql postgresql-contrib
sudo passwd postgres # mdp du rôle postgres - remplir à l'aide du générateur de mot de passe
sudo chown -R postgres:postgres $bdd_add_disk # affecter le rôle postgres propriétaire du répertoire
su postgres  # connection du rôle postgres
/usr/lib/postgresql/10/bin/initdb -D $bdd_add_disk  # initialiser l'installation au sein du HDD additionnel
sudo service postgresql stop # c'est le root qui stoppe le service
service postgresql status # vérifier si le service est bien stoppé
sudo service postgresql start
sudo apt-get install postgresql-10-postgis-scripts # ajout des scripts extensions
sudo apt-get install postgresql-10-postgis-2.4
echo "---------- Fin installation Postgresql ------------"


# Apache
echo "---------- Installation serveur Apache ------------"
apt-get install apache2
service apache2 status # vérifier si le service est bien activé
echo "---------- Fin installation serveur Apache ------------"


# Tomcat
echo "---------- Installation serveur Tomcat ------------"
sudo apt-get install default-jdk # installation du JDK
sudo groupadd tomcat # création d'un groupe tomcat
sudo useradd -s /bin/false -g tomcat -d /opt/tomcat tomcat # création d'un user tomcat (tomcat ne doit pas être lancé en administrateur)
curl -O $filetomcat
sudo mkdir /opt/tomcat
sudo tar xzvf apache-tomcat-8*tar.gz -C /opt/tomcat --strip-components=1 # décompression
cd /opt/tomcat

sudo chgrp -R tomcat /opt/tomcat # gestion des autorisations
sudo chmod -R g+r conf
sudo chmod g+x conf
sudo chown -R tomcat webapps/ work/ temp/ logs/

sudo update-java-alternatives -l # vérifier la version de Java
sudo nano /etc/systemd/system/tomcat.service # alimenter le fichier créé avec le code précisé en annexe :

sudo systemctl daemon-reload #lancement du service
sudo systemctl start tomcat
sudo systemctl enable tomcat # Si ok, paramétrage du lancement de Tomcat au démarrage
echo "---------- Fin installation serveur Tomcat ------------"


# Geoserver
echo "---------- Installation Geoserveur ------------"
cd /home/tmp
sudo wget $filegeoserver
sudo unzip geoserver-2.15.1-war.zip

echo "---------- Fin de l'installation des logiciels métiers ------------"
