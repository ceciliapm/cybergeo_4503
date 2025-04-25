-- Jardins familiaux
insert into scenarios.base_scenarios (id_scenario, objet, nom_vue, indice, id_fiche, composante, fct, id_site) 
VALUES ('2_1', 'Jardins familiaux', 'vue_cp_jardins_familiaux_ta', 1, 3226, '', '', '2');
insert into scenarios.base_scenarios (id_scenario, objet, nom_vue, indice, id_fiche, composante, fct, id_site) 
VALUES ('2_2', 'Jardins familiaux', 'vue_cp_jardins_familiaux_ta', 1, 3226, '', '', '2');
UPDATE scenarios.base_scenarios a SET geom = b.geom FROM idpatrimoniale.spatial_poly b WHERE b.fk_saisie_kid = a.id_fiche and a.id_fiche = 3226;
UPDATE scenarios.base_scenarios a SET surface = ST_area(geom) WHERE a.id_fiche = 3226;

-- Clocher Ars 
insert into scenarios.base_scenarios (id_scenario, objet, nom_vue, indice, id_fiche, composante, fct, id_site) 
VALUES ('1_1', 'Clocher Ars-en-Ré', 'vue_cp_clocher_ars', 1, 3255, '', '', '1');
insert into scenarios.base_scenarios (id_scenario, objet, nom_vue, indice, id_fiche, composante, fct, id_site) 
VALUES ('1_2', 'Clocher Ars-en-Ré', 'vue_cp_clocher_ars', 1, 3255, '', '', '1');
UPDATE scenarios.base_scenarios a SET geom = b.geom FROM idpatrimoniale.spatial_point b WHERE b.fk_saisie_kid = a.id_fiche and a.id_fiche = 3255;
UPDATE scenarios.base_scenarios a SET surface = null WHERE a.id_fiche = 3255;

-- Relais Moulinette
insert into scenarios.base_scenarios (id_scenario, objet, nom_vue, indice, id_fiche, composante, fct, id_site) 
VALUES ('2_1', 'Relais Nature de la Moulinette', 'vue_csc_relais_moulinette_ta', 1, 3281, '', '', '2');
insert into scenarios.base_scenarios (id_scenario, objet, nom_vue, indice, id_fiche, composante, fct, id_site) 
VALUES ('2_2', 'Relais Nature de la Moulinette', 'vue_csc_relais_moulinette_ta', 1, 3281, '', '', '2');
UPDATE scenarios.base_scenarios a SET geom = b.geom FROM idpatrimoniale.spatial_point b WHERE b.fk_saisie_kid = a.id_fiche and a.id_fiche = 3281;
UPDATE scenarios.base_scenarios a SET surface = null WHERE a.id_fiche = 3281;

-- Tour Broue
insert into scenarios.base_scenarios (id_scenario, objet, nom_vue, indice, id_fiche, composante, fct, id_site) 
VALUES ('3_1', 'Tour de Broue et la Maison de Broue', 'vue_cp_tour_broue', 1, 3517, '', '', '3');
insert into scenarios.base_scenarios (id_scenario, objet, nom_vue, indice, id_fiche, composante, fct, id_site) 
VALUES ('3_2', 'Tour de Broue et la Maison de Broue', 'vue_cp_tour_broue', 1, 3517, '', '', '3');
UPDATE scenarios.base_scenarios a SET geom = b.geom FROM idpatrimoniale.spatial_poly b WHERE b.fk_saisie_kid = a.id_fiche and a.id_fiche = 3517;
UPDATE scenarios.base_scenarios a SET surface = ST_area(geom) WHERE a.id_fiche = 3517;



