UPDATE scenarios.base_scenarios a SET fct = b.fonction FROM idpatrimoniale.saisie_objet b WHERE b.kid = a.id_fiche;

UPDATE scenarios.base_scenarios a SET composante = b.composante FROM idpatrimoniale.groupes b WHERE b.id = a.id_fiche;

UPDATE scenarios.base_scenarios a SET groupe = b.nom_grp FROM idpatrimoniale.groupes b WHERE b.id = a.id_fiche;

update scenarios.base_scenarios set groupe = 'ecluses_ouvrages_hydrauliques' where nom_vue = 'vue_cp_ouvrages_hydrau_ta';
update scenarios.base_scenarios set groupe = 'poisson_epi_mul_ath_gobi_ang' where nom_vue = 'vue_cn_gobie_fa';
update scenarios.base_scenarios set groupe = 'vegetation_dominante_marais_sales' where nom_vue = 'vue_cn_vegetation_dom_fa';
update scenarios.base_scenarios set groupe = 'sel' where nom_vue = 'vue_sel_fa';

UPDATE scenarios.base_scenarios a SET surface = 1 WHERE surface is null or surface = 0;

UPDATE scenarios.base_scenarios a SET geom = ST_Buffer(geom, 50)  WHERE groupe IN ('ecomusee_marais', 'citadelle_brouage', 'edifices_archi', 'relais_nature');
UPDATE scenarios.base_scenarios a SET geom = ST_Buffer(geom, 10)  WHERE groupe IN ('cabanes', 'ecluses_ouvrages_hydrauliques');