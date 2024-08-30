# Une Plateforme Web d’Identité Patrimoniale : PWIP
Développée dans le cadre du projet [PAMPAS](https://pampas.recherche.univ-lr.fr/), la Plateforme Web d’Identité Patrimoniale ([PWIP](https://data.pampas.univ-lr.fr/pwip/)) est une plateforme cartographique interactive qui vise à mieux comprendre l’évolution du patrimoine des marais charentais face à l’aléa submersion marine. Utilisée dans le cadre d’ateliers, elle est destinée aux scientifiques, élus et gestionnaires des marais littoraux, impliqués dans la gestion du patrimoine. Elle permet, à la fois de s’interroger sur ce qu’est le patrimoine dans les marais littoraux, d’en visualiser les éléments, de tester des scénarios de submersion et des modes de gestion et enfin de comprendre leur degré de sensibilité face à la submersion marine. PWIP s’inscrit comme outil de valorisation scientifique, couplé à un volet pédagogique par son utilisation dans le cadre d’ateliers.


## Getting started

PWIP a été développée par deux partenaires du projet : le laboratoire [LIENSs](https://lienss.univ-larochelle.fr/) et le [Forum des Marais Atlantiques](https://forum-zones-humides.org/). Elle repose sur plusieurs technologies et briques logicielles, pour stocker, requêter, visualiser et diffuser les résultats du projet comprenant : 
- une base de données PostgreSQL/PostGIS
- un serveur web Apache
- un serveur d’application Tomcat 
- un serveur cartographique Geoserver
- une architecture reposant sur le Framework Web opensource Angular. 



## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.univ-lr.fr/cpignonm/pampas.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.univ-lr.fr/cpignonm/pampas/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
PWIP est déployée sur un serveur Linux (Ubuntu - 18.04 Bionic).
Elle repose sur différentes briques logicielles :
- un serveur application Tomcat 8.5.20
- un serveur cartographique Geoserver 2.15.1
- un serveur web Apache HTTPD (2.4.29)
- une base de données PostGreSQL/PostGIS (10.23 / 2.4)
- un développement informatique comprenant :    
    - le Framework de développement Angular (13.3.1)
    - un Back Office JS : Node JS (16.10)
    - le langage PHP (7.2.24) pour l'excution des scripts en interactions avec la base de données.
    - des langages et méthodes de développement de l’application : Typescript, HTML, SCSS, API Rest, API Geoserver, SQL


## Usage
Simuler le devenir du patrimoine des marais face au chagement climatique en testant divers scénarios. L'objectif est de mieux comprendre le fonctionnement des zones humides côtières face à l’aléa de submersion marine, pour questionner l’évolution de leur identité patrimoniale en fonction de leur mode de gestion.
Par exemple, selon le scénario, une espece animale aura une sensibilité plus ou moins grande à la submersion: non impacté, amélioration, adaptation ou disparition. 

## Support
Pour toutes questions : @ ?



## Feuille de route


## Contribuer à PWIP
Nous sommes ouvets à toutes contributions.

## Auteurs et remerciements
  
PWIP a été développée par deux partenaires du projet : le laboratoire [LIENSs](https://forum-zones-humides.org/) et [Forum des Marais Atlantiques](https://forum-zones-humides.org/).
L'équipe de développement est composé de Julien Hubert du [Forum des Marais Atlantiques], Cécilia Pignon-Mussaud du laboratoire [LIENSs](https://lienss.univ-larochelle.fr/) et Fabien Blanchet du [Forum des Marais Atlantiques](https://forum-zones-humides.org/). Elle remercie le groupe de travail qui a permis de co-construire cette plateforme et tout particulièrement l'équipe de coordination de l'ANR Pampas : Thomas Lacoue-Labarthe ([LIENSs](https://lienss.univ-larochelle.fr/)), Nathalie Long ([LIENSs](https://lienss.univ-larochelle.fr/)) et Marie Vagner ([LEMAR](https://www-iuem.univ-brest.fr/lemar/)), ainsi que Nicolas Becu et Benjamin Amann du LIENSs.


## License
L'ensemble de la documentation et des scripts de PWIP sont en licence opensource XXXX.


## Statut du projet
Le développement de PWIP est actuellement arrêté, correspondant au livrable attendu par l'ANR.
Néanmoins, une nouvelle version est à l'étude pour intégrer la salinité des marais dans les simulations. 
