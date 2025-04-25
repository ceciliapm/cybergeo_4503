import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import 'leaflet';
import {latLng, MapOptions, tileLayer, Map, Marker, icon} from 'leaflet';
declare const L: any; 
//import * as L from 'leaflet';
import 'leaflet-sidebar-v2';
import 'leaflet-dialog';
import 'leaflet-modal';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api/api.service';
// Cf https://www.npmjs.com/package/ngx-toastr/v/14.3.0
import { NotificationService } from '../notification/notification.service'
import { FormBuilder } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider';
// cf https://angular-slider.github.io/ngx-slider/demos
import { NgxSpinnerService } from 'ngx-spinner';
import 'leaflet-measure-v2'; // cf. https://www.npmjs.com/package/leaflet-measure-v2
import 'leaflet-control-boxzoom' // cf. https://www.npmjs.com/package/leaflet-control-boxzoom
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import HC_exporting from "highcharts/modules/exporting";
HC_exporting(Highcharts);
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);
declare var require: any;
const heatmap = require("highcharts/modules/heatmap.js");
heatmap(Highcharts);
import HC_sankey from 'highcharts/modules/sankey';
HC_sankey(Highcharts);
import { SpeedTestService } from 'ng-speed-test';  
import 'leaflet-control-geocoder'; // npm i leaflet-control-geocoder

// npm install file-saver @types/file-saver
import { saveAs } from 'file-saver';
// npm install --save docx
import { Document, Packer, Paragraph, TextRun, Footer, Header, Table, TableCell, TableRow, VerticalAlign, WidthType, AlignmentType, ImageRun, Media, PageNumber} from 'docx';
import 'leaflet-easyprint'
import 'leaflet.browser.print/dist/leaflet.browser.print.min.js';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from "rxjs/operators";
import { Buffer } from 'buffer'; // npm install buffer
import 'leaflet.control.opacity'; // cf https://www.npmjs.com/package/leaflet.control.opacity

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.scss'],
})
export class InterfaceComponent implements OnInit {
 
    // Carto
  mymap :any;
  // Variables pour plier/déplier les données filtrées par composante
  isNavbarCollapsed=true;
  isCollapsedComposanteTest = false;
  isCollapsedComposante_Test = false;
  isCollapsedComposante = false;
  isCollapsedComposante_SC = false;
  isCollapsedComposante_N = false;
  isCollapsedComposante_P = false;
  // Variables pour plier/déplier les données filtrées par fonction patrimoniale7
  isCollapsedFctPatrimoniale = false;
  isCollapsedFctPatrimoniale_C = false;
  isCollapsedFctPatrimoniale_P = false;  
  isCollapsedFctPatrimoniale_E = false;  
  isCollapsedFctPatrimoniale_Pa = false;
  // Localisation des sites
  lat:any;
  lon:any;
  selSite = '0';
  // Légende
  contentLegend: any[] = [];
  content2: any[] = [];
  options: any;
  contents: any;
  legende: any;
  // Gestion de l'affichage
  myarray: any[] = []; // array des WMS ajoutées à la carte
  myarray2: any[] = []; // array du libellé des couches WMS ajoutées à la carte
  array3: any[] = [];
  array4: any[] = [];
  myarray_name: any[] = []; // equivalent de myarray2 mais utilisé pour selectData() ; à voir si intéressant de le garder ou pas
  myarray_groupname: any[] = []; // equivalent de myarray_name mais pour les groupes
  arrayTemp: any[] = []; // array créé pour supprimer les layers affichés correspondant au groupe venant d'être sélectionné par l'utilisateur
  nomGroup :any;
  // Scénarios
  scenarioDone: any;
  geoserverDone: any;
  arrayScenario: any[] = []; // array du scénario choisi
  nameScenario: any; // nom du scénario
  array_emp_sub: any[] = []; // array des couches (emprise ou animation) affichées sur la carte en fct. du scénario sélectionné
  // Fenêtre initialisation
  closeResult: any;
  // Contrà´les boutons de validation
  activeButtonRunScenario: any;
  activeButtonSelectData: any;
  // Panier
  arrayPanier: any[] = [];
  integrPanier: any;
  etatIconPanier = 'inactif';
  displayStyle : any;
  displayStyle2 : any;
  displayStyle2b : any;
  displayStyle2c : any;
  displayStyle2d : any;
  displayStyle2e : any;
  displayStyle2f : any
  displayStyle3 : any;
  checkboxes_sel: any;
  countVidePanier = 0;
  counter = 0;
  testCompteurArray: any[] = [];
  // Pop-ups
  urlLayers: any;
  listData: any;
  e: any;
  nom: any;
  contentPopUp: any;

  // Amélioration de la légende et affectation d'icà´nes spécifiques pour les poissons et la flore
  listDataFishLegend : Array<String> = ['Anguille europénne au stade jaune','Athérine','Bar commun','Brème Commune','Brochet','Carassin','Carpe commune','Dorade grise','Dorade royale','Epinoche à trois épines','Gardon','Gobie','Hybride gardon brème','Mulet','Mulet juvénile','Syngnate (Poisson aiguille)','Vieille commune', 'Perche Commune'];
  listDataFloreLegend : Array<String> = ['Lavande de mer (statice)','Moutarde sauvage','Obione','Pré-salés','Roseau','Roselière','Salicorne','Salicorne sauvage','Végétation dominante de marais salés'];
  listDataAmphibiensLegend : Array<String> = ['Crapaud calamite','Crapaud epineux','Grenouille verte','Pélobate cultripède','Pélodyte ponctué','Rainette méridionale','Triton marbré','Triton palmé']
  listDataArthropodesLegend : Array<String> = ['Araignée rare','Araignée-loup']
  listDataBenthosLegend : Array<String> = ['Coque glauque','Diptère','Gasteropode','Macrofaune benthique (marais doux)','Oligochètes (vers de vase)','Telline']
  listDataOiseauxLegend : Array<String> = ['Avocette élégante','Barge à queue noire','Barge rousse','Bécassine des marais','Cigogne blanche','Courlis cendré','Echasse blanche','Gorgebleue','Martin-pêcheur','Tourterelle des bois']
  listDataReptilesLegend : Array<String> = ['Couleuvre helvétique','Couleuvre verte et jaune','Couleuvre vipérine','Lézard des murailles','Lézard vert','Vipère aspic']
  listDataVivantLegend : Array<String> = ['Archées', 'Bactéries', 'Phytoplancton et zooplancton', 'Espèces planctoniques tropicales et subtropicales non indigènes']
  listDataNonVivantLegend : Array<String> = ['Argile (bri)', 'Carbone']
  listNoLegend : Array<String> = ['Zones humides du marais de Tasdon', 'Pêche de loisir', 'Relais Nature de la Moulinette', 'Outils traditionnels de la saliculture', 'Huîtres ostréicoles', 'Ecomusée du marais salant rétais', 'Savoir-faire ostréicole', 'Savoir faire des sauniers', 'La pointe de La Lasse', 'Vasière', 'Réserve naturelle nationale de Lilleau des Niges', 'Structure traditionnelles des marais salants', "Les claires d'affinage ostréicoles", 'Vasais du marais salant', 'Digues à la mer de la RNN de Lilleau des Niges', 'Digue du Boutillon', 'Moulin à marée de Loix', 'Ouvrages hydrauliques et écluses', 'Pelles crémaillères (écluses)', 'Cabanes des sauniers', 'Cabanes ostréicoles', 'Clocher Ars-en-Ré', 'Anciens marais salants', 'Jardins familiaux', "Marais d'eau douce", "Marais d'eau saumâtre", 'Lacs de Villeneuve-les-Salines', 'Canal de la Moulinette', 'Ouvrages hydrauliques et écluses', 'Pastoralisme', "Histoire de l'ancien Golfe de Saintonge", 'Patois saintongeais', 'Savoir-faire de la chasse', 'Savoir-faire ostréicole', 'Savoir-faire de la pêche fluviale', 'Bosses et jas', 'Ressource en eau douces', 'Anciens marais salant / marais gâts', 'Prairies naturelles et Troupeaux', 'Réseau de fossés tertiaires', "Les claires d'affinage ostréicoles", 'Ouvrages hydrauliques et écluses', 'Cabanes traditionnelles ostréicoles', 'Cabanes pastorales', 'Tonnes de chasse', 'Citadelle de Brouage', 'Tour de Broue et la Maison de Broue' ]


  // Arborescence 
  masterSelected: any; // Gestion du décochage des layers
  test_auto: any[] = []; // JSON layers
  test_group: any; // JSON Group layers
  event_name: any; // libellé de la vue du layer à afficher
  event_id: any; // libellé de l'id du layer à afficher
  myarrayid: any[] = []; // array du libellé des couches WMS ajoutées à la carte
  event_groupname: any; // libellé de la vue du layergroup à afficher
  value22:any; // utilisé pour la gestion de la légende dans displayGroupData()
  value222:any; // utilisé pour la gestion de la légende dans videPanier()
  // Jeton token
  token: any;
  nbgroupes: any;
  arrayDataIndices: any[] = [];

  chaineCaractScenario: any;

  arrayResultScenario: any[] = [];
  geoserverButton:any ;
  endTraitements: any;

  // Récupération ngSubmit Form pour MAJ du filtrage
  searchText:any;
  LayerHasBeenRemoved: any;
  displayStyleData1:any;
  titreDataNotMappable: any;
  fonctionsDataNotMappable: any;
  descFonctionsDataNotMappable: any;
  objetDataNotMappaple: any;
  patriObjetDataNotMappaple: any;

  // Graph
  stock: any;
  stock_2:any;
  isShowDiv0 = false;  
  isShowDiv = false; 
  isShowDiv1 = false;
  resgraph: any;
  arrayLib: any[] = []
  arrayMoyIndices : any[] = []
  arrayLib_C: any[] = []
  arrayMoyIndices_C : any[] = []
  arrayLib_E: any[] = []
  arrayMoyIndices_E : any[] = []
  displayStyleGraph1: any;
  displayStyleGraph2: any;
  displayStyleGraph3: any;
  displayStyleGraph4: any;
  displayStyleGraph1_2: any;
  displayStyleGraph2_2: any;
  displayStyleGraph3_2: any;
  displayStyleGraph1_3: any;
  displayStyleGraph2_3: any;
  displayStyleGraph3_3: any;
  r: any;
  bar: any;
  bar_2: any;
  selGraph:any;

  myarray0 :any[] = []
  myarray1 : any[] = []
  dataseries : any[] = []
  objetArr: any[] = []
  fctArr: any[] = []
  moyindiceArr: any[] = []
  datadrill_data: any[] = []
  datadrill: any[] = []
  myarray0_C :any[] = []
  myarray1_C : any[] = []
  dataseries_C : any[] = []
  objetArr_C: any[] = []
  fctArr_C: any[] = []
  moyindiceArr_C: any[] = []
  datadrill_data_C: any[] = []
  datadrill_C: any[] = []
  myarray0_E :any[] = []
  myarray1_E : any[] = []
  dataseries_E : any[] = []
  objetArr_E: any[] = []
  fctArr_E: any[] = []
  moyindiceArr_E: any[] = []
  datadrill_data_E: any[] = []
  datadrill_E: any[] = []

  output: any[] = []
  heatmap:any;
  heatmap2:any;
  heatmap_2:any;
  heatmap2_2:any;
  sankey: any;
  etatGraph1:any;
  arraymeasureControl: any[] = []
  arraybrowserPrint: any[] = []
  arrayboxZoom: any[] = []
  arrayOpacityBaseLayers: any[] = []

  // Rapport
  nomSite: any;
  rows: any;
  nomScenario:any;
  defScenario: any;
  objetsIpDisp: any;
  partObjetsIpDisp: any;
  displayStyleWriteConclusion: any;
  userConclusion = '';
  arrayBuffer: any;

  myarrayG:any;
  myarray2G:any;
  arrCountz: any[] = [];
  arrCountz2: any[] = [];
  countz2: any;

  // Refonte partie scénarios
  isCollapsedSc1_1 = false;
  isCollapsedSc1_2 = false;
  arrayScenarioLayers: any[] = []
  baseLayers: any;
  displayMNT: any;
  scenariolance: any;

  imgBase64 = '';
  @ViewChild('screen', { static: true }) 
  screen: any;

  fini : any;

  svgGraphs: any[] = [];
  svgGraphsComp: any[] = [];
  creaGraphsDone: any;
  creaGraphsCompDone: any;
  base64Done: any[] = [];
  recupBase64: any;
  nbObjetsSite: any;

  endPhase3:any;

  filtreObjets: any[] = [];
  filtreObjetsMessage: any;

  speed: any
  speedComment = '';

  listrapports: any;
  detailrapports: any;
  
  page = 1;
  pageSize = 10;
  collectionSize: any;
  count0: any;
 
  verif0: any;

  counter2 = 0;

  @ViewChild('modalInit') content: any; // cf. https://stackblitz.com/edit/angular-rd8tny?file=main.ts

  // Récupération des valeurs du ngSubmit Form
  checkoutForm = this.formBuilder.group({
    nom: '',
  });

  checkoutForm2 = this.formBuilder.group({
    concl: '',
  });

  // Mise en place d'un slider pour régler la transparence des données
  value: number = 10;
  options2: Options = {
    floor: 0,
    ceil: 10,
    showTicks: true,
    tickStep: 1
  };

  value2: number = 10;
  options22: Options = {
    floor: 0,
    ceil: 10,
    showTicks: true,
    tickStep: 1
  };

  displayStyleNotesGroupes: any;
  displayFicheAttributs: any;
  data_hauteur_eau: any;
 
  // Attributs
  attType: any;
  attNom: any;
  attFct : any;
    attInfo : any;
    attPhoto : any;
    attMat : any;
    attNomSci : any;
    attInpn : any;
    attFishbase : any;
    especeType: any;
    arrayEtape3: any[] = [];
    reinitEtape3: any;
    reinitScenarioMsg: any;
    headerRapport: any;

    displayHistoRapport: any;
    genereGraph: any;

    //Speed Test
    public hasTracked:boolean = false;
    public isTracking:boolean = false;
    public iterations:number = 1;
    public speeds:number[] = [];
    public speeds2:number[] = [];
    actualSpeed: any;

    dataCountGraphs: any[] = [];

    finGraphs: any

    titreLegendeScenarios: any;
    objetsIpDisp_2:any

  constructor(
   private router: Router,
   private activatedRoute: ActivatedRoute,
   private http: HttpClient,
   private modalService: NgbModal,
   private _apiService: ApiService,
   private notifyService : NotificationService,
   private formBuilder: FormBuilder,
   private spinner: NgxSpinnerService,
   private captureService: NgxCaptureService,
   private speedTestService:SpeedTestService
  ) {


    this.speedTestService.getMbps().subscribe(
        (speed) => {
          this.speed = speed.toFixed(1);
          if (this.speed > 0 && this.speed < 10){
            this.speedComment = 'A votre entrée dans la plate-forme, votre connexion est lente (bas débit). La consultation de la plate-forme devrait donc en être impactée (cartographie de la sensibilité et génération du rapport notamment)'
            this.notifyService.showWarning("Votre connexion semble faible ou instable, veuillez consulter le menu paramètres ⚙ de la barre latérale", "Connexion Internet")
          }
          else if (this.speed >= 10 && this.speed < 20){
            this.speedComment = 'A votre entrée dans la plate-forme, la connexion est de type moyen débit. Il est possible que le comportement de la plate-forme soit altéré (cartographie de la sensibilité et génération du rapport notamment)'
            this.notifyService.showWarning("Votre connexion semble faible ou instable, veuillez consulter le menu paramètres ⚙ de la barre latérale", "Connexion Internet")
          }
          else if (this.speed >= 20 && this.speed < 100){
            this.speedComment = 'A votre entrée dans la plate-forme, votre débit est satisfaisant. Votre connexion devrait être suffisante pour utiliser la plate-forme'
          }
          else if (this.speed >= 100){
            this.speedComment = 'A votre entrée dans la plate-forme, votre connexion est considérée comme de type haut debit ou très haut débit. Votre connexion est de très bonne qualité et sera  suffisante pour utiliser la plate-forme'
          }
          else {}
        }
      );

 

    /* ---------- JSON DES DATA LAYERS ---------- */
      this.masterSelected = false;

      this.test_auto = [

        /* ---------- Filtre par composante patrimoniale ---------- */
    
        /* ---------- Groupe de test ---------- */
        {id: 'model1', type: 'data_test', site: '1', name: 'Clocher Ars en Ré', vue: 'vuetestdev_clocher_ars', value2: false},
        {id: 'model2', type: 'data_test', site: '1', name: 'Moulin de Loix-en-Ré', vue: 'vuetestdev_moulin_loix', value2: false},
        {id: 'model3', type: 'data_test', site: '1', name: 'Epinoche', vue: 'vuetestdev_epinoche', value2: false},
        {id: 'model4', type: 'data_test', site: '2', name: 'Lacs de Villeneuve-les-Salines', vue: 'vuetestdev_lacs_villeneuve_les_salines', value2: false},
        {id: 'model5', type: 'data_test', site: '2', name: 'Relais Nature de la Moulinette', vue: 'vuetestdev_relais_moulinette', value2: false},
        {id: 'model6', type: 'data_test', site: '3', name: 'Citadelle de Brouage', vue: 'vuetestdev_citadelle_brouage', value2: false},
        {id:'model66 ', type : 'data_test', site : '1', name : 'Ecomusée du marais salant rétais', vue : 'vue_csc_ecomusee', value2 : false},
        {id:'model666 ', type : 'data_test', site : '1', name : 'Digues à la mer de la RNN de Lilleau des Niges', vue : 'vue_cp_digues_rnn_lilleau_fa', value2 : false},
        {id:'model6666 ', type : 'data_test', site : '1', name : 'Athérine', vue : 'vue_cn_atherine_fa', value2 : false},
        {id:'model6667 ', type : 'data_test', site : '1', name : 'Savoir faire des sauniers', vue : 'vue_sel', value2 : false, etat:'disabled'},
    
        /* ---------- CP Socio-culturelle ---------- */
        {id:'huitresfa001', type : 'csc_pat_mat_prod', site : '1', name : 'Huîtres ostréicoles', vue : 'vue_csc_huitres_ostr_fa', value2 : false},
        {id:'huitresbr001', type : 'csc_pat_mat_prod', site : '3', name : 'Huîtres ostréicoles', vue : 'vue_csc_huitres_ostr_mo', value2 : false},
        {id:'selfa001', type : 'csc_pat_mat_prod', site : '1', name : 'Fleur de sel-Gros Sel-Sel', vue : 'vue_csc_sel_fa', value2 : false},
        {id:'outilsselfa001', type : 'csc_pat_mat_out', site : '1', name : 'Outils traditionnels de la saliculture', vue : 'vue_csc_sel_fa', value2 : false},
    
        {id:'ecomuseefa001', type : 'csc_pat_immat_sav', site : '1', name : 'Ecomusée du marais salant rétais', vue : 'vue_csc_ecomusee', value2 : false},
        {id:'saliculturefa001', type : 'csc_pat_immat_act', site : '1', name : 'Saliculture', vue : 'vue_csc_sel_fa', value2 : false},
        // {id:'model11 ', type : 'csc_pat_immat', site : '1', name : 'Marais en tant que propriété foncière', vue : 'vue_marais_propriete_fonciere', value2 : false},
        {id:'relaismoulinetteta001', type : 'csc_pat_immat_sav', site : '2', name : 'Relais Nature de la Moulinette', vue : 'vue_csc_relais_moulinette_ta', value2 : false},
        {id:'histoiregolfebr001', type : 'csc_pat_immat_sav', site : '3', name : 'Histoire de l\'ancien Golfe de Saintonge', vue : 'vue_dis_histoire_golfe_saintonge', value2 : false, etat:'disabled'},
        {id:'ostreiculturefa001', type : 'csc_pat_immat_act', site : '1', name : 'Ostréiculture', vue : 'vue_csc_huitres_ostr_fa', value2 : false},
        {id:'pastobr001', type : 'csc_pat_immat_act', site : '3', name : 'Pastoralisme', vue : 'vue_csc_pastoralisme_mo', value2 : false},
        {id:'pecheta001', type : 'csc_pat_immat_act', site : '2', name : 'Pêche de loisir', vue : 'vue_csc_peche_loisir_ta', value2 : false},
        {id:'sfchasse001', type : 'csc_pat_immat_savf', site : '3', name : 'Savoir-faire de la chasse', vue : 'vue_dis_savoirfaire_chasse', value2 : false, etat:'disabled'},  
        {id:'sfostreicolebr001', type : 'csc_pat_immat_savf', site : '3', name : 'Savoir-faire ostréicole', vue : 'vue_dis_savoirfaire_ostreicole', value2 : false, etat:'disabled'},
        {id:'sfpeche001', type : 'csc_pat_immat_savf', site : '3', name : 'Savoir-faire de la pêche fluviale', vue : 'vue_savoir_faire_pechefluviale', value2 : false, etat:'disabled'},
        {id:'sfostreicolefa001', type : 'csc_pat_immat_savf', site : '1', name : 'Savoir-faire ostréicole', vue : 'vue_dis_savoirfaire_ostreicole', value2 : false, etat:'disabled'},
        {id:'sfsauniers001', type : 'csc_pat_immat_savf', site : '1', name : 'Savoir faire des sauniers', vue : 'vue_dis_savoirfaire_sauniers', value2 : false, etat:'disabled'},
        {id:'sfpatois001', type : 'csc_pat_immat_sav', site : '3', name : 'Patois saintongeais', vue : 'vue_dis_patois_saintongeais', value2 : false, etat:'disabled'},

         /* ---------- CP Naturelle ---------- */
        {id:'lavandefa001', type : 'cna_flore_herb', site : '1', name : 'Lavande de mer (statice)', vue : 'vue_cn_lavande_fa', value2 : false},
        {id:'moutardefa001 ', type : 'cna_flore_herb', site : '1', name : 'Moutarde sauvage', vue : 'vue_cn_moutarde_fa', value2 : false},
        {id:'obionefa001', type : 'cna_flore_herb', site : '1', name : 'Obione', vue : 'vue_cn_obione_fa', value2 : false},
        {id:'salicornefa001 ', type : 'cna_flore_herb', site : '1', name : 'Salicorne', vue : 'vue_cn_salicorne_fa', value2 : false},
        {id:'vegetsalesfa001 ', type : 'cna_flore_unit', site : '1', name : 'Végétation dominante de marais salés', vue : 'vue_cn_vegetation_dom_fa', value2 : false},
        {id:'vegetsalesbr001 ', type : 'cna_flore_unit', site : '3', name : 'Végétation dominante de marais salés', vue : 'vue_cn_vegetation_dom_mo', value2 : false},
        {id:'roseauta001', type : 'cna_flore_herb', site : '2', name : 'Roseau', vue : 'vue_cn_roseau_ta', value2 : false},
        {id:'roselierebr001 ', type : 'cna_flore_unit', site : '3', name : 'Roselière', vue : 'vue_cna_flore_roseliere_mo', value2 : false},
    
        {id:'crapauxcalafa001 ', type : 'cna_fau_amp', site : '1', name : 'Crapaud calamite', vue : 'vue_cn_crapaud_calamite_fa', value2 : false},
        {id:'crapauxepita001', type : 'cna_fau_amp', site : '2', name : 'Crapaud epineux', vue : 'vue_cn_crapaud_epi_ta', value2 : false},
        {id:'grenouillefa001', type : 'cna_fau_amp', site : '1', name : 'Grenouille verte', vue : 'vue_cn_grenouille_verte_fa', value2 : false},
        {id:'grenouillebr001', type : 'cna_fau_amp', site : '3', name : 'Grenouille verte', vue : 'vue_cn_grenouille_verte_mo', value2 : false},
        {id:'grenouilleta001', type : 'cna_fau_amp', site : '2', name : 'Grenouille verte', vue : 'vue_cn_grenouille_verte_ta', value2 : false},
        {id:'pelobatefa001', type : 'cna_fau_amp', site : '1', name : 'Pélobate cultripède', vue : 'vue_cn_pelobate_fa', value2 : false},
        {id:'pelobatebr001', type : 'cna_fau_amp', site : '3', name : 'Pélobate cultripède', vue : 'vue_cn_pelobate_mo', value2 : false},
        {id:'polodytefa001', type : 'cna_fau_amp', site : '1', name : 'Pélodyte ponctué', vue : 'vue_cn_pelodyte_ponc_fa', value2 : false},
        {id:'polodyteta001', type : 'cna_fau_amp', site : '2', name : 'Pélodyte ponctué', vue : 'vue_cn_pelodyte_ponc_ta', value2 : false},
        {id:'polodytebr001', type : 'cna_fau_amp', site : '3', name : 'Pélodyte ponctué', vue : 'vue_cn_pelodyte_ponc_mo', value2 : false},
        {id:'rainettefa001', type : 'cna_fau_amp', site : '1', name : 'Rainette méridionale', vue : 'vue_cn_rainette_m_fa', value2 : false},
        {id:'rainetteta001', type : 'cna_fau_amp', site : '2', name : 'Rainette méridionale', vue : 'vue_cn_rainette_m_ta', value2 : false},
        {id:'rainettebr001', type : 'cna_fau_amp', site : '3', name : 'Rainette méridionale', vue : 'vue_cn_rainette_m_mo', value2 : false},
        {id:'tritonmfa001', type : 'cna_fau_amp', site : '3', name : 'Triton marbré', vue : 'vue_cn_triton_marbre_mo', value2 : false},
        {id:'tritonmta001', type : 'cna_fau_amp', site : '2', name : 'Triton marbré', vue : 'vue_cn_triton_marbre_ta', value2 : false},
        {id:'tritonpta001', type : 'cna_fau_amp', site : '2', name : 'Triton palmé', vue : 'vue_cn_triton_palme_ta', value2 : false},
        {id:'tritonpbr001', type : 'cna_fau_amp', site : '3', name : 'Triton palmé', vue : 'vue_cn_triton_palme_mo', value2 : false},
    
        {id:'agrion001', type : 'cna_fau_art', site : '2', name : 'Agrion de Mercure (libellule)', vue : 'vue_dis_agrion_mercure', value2 : false, etat:'disabled'},
        {id:'araigneelfa001', type : 'cna_fau_art', site : '1', name : 'Araignée-loup', vue : 'vue_cn_araigneeloup_fa', value2 : false},
        {id:'araigneelbr001', type : 'cna_fau_art', site : '3', name : 'Araignée-loup', vue : 'vue_cn_araigneeloup_mo', value2 : false},
        {id:'araigneerbr001', type : 'cna_fau_art', site : '3', name : 'Araignée rare', vue : 'vue_cn_araigneerare_mo', value2 : false},
        {id:'carabiquefa001', type : 'cna_fau_art', site : '1', name : 'Carabique (Pogonus chalceus)', vue : 'vue_cn_pogonus_fa', value2 : false},
        {id:'carabiquebr001', type : 'cna_fau_art', site : '3', name : 'Carabique (Pogonus chalceus)', vue : 'vue_cn_pogonus_mo', value2 : false},
    
        {id:'coquefa001', type : 'cna_fau_mac', site : '1', name : 'Coque glauque', vue : 'vue_cn_cerastoderma_fa', value2 : false},
        {id:'coquebr001', type : 'cna_fau_mac', site : '3', name : 'Coque glauque', vue : 'vue_cn_cerastoderma_mo', value2 : false},
        {id:'dyphterefa001', type : 'cna_fau_art', site : '1', name : 'Diptère', vue : 'vue_cn_chironomidae_fa', value2 : false},
        {id:'dyphtereta001', type : 'cna_fau_art', site : '2', name : 'Diptère', vue : 'vue_cn_chironomidae_ta', value2 : false},
        {id:'dyphterebr001', type : 'cna_fau_art', site : '3', name : 'Diptère', vue : 'vue_cn_chironomidae_mo', value2 : false},
        {id:'gasterofa001', type : 'cna_fau_mac', site : '1', name : 'Gasteropode', vue : 'vue_cn_ecrobia_fa', value2 : false},
        {id:'gasterobr001', type : 'cna_fau_mac', site : '3', name : 'Gasteropode', vue : 'vue_cn_ecrobia_mo', value2 : false},
        {id:'macrofauneta001', type : 'cna_fau_mac', site : '2', name : 'Macrofaune benthique (marais doux)', vue :'vue_cn_macrofaune_bent_ta', value2 : false},	  
        {id:'oligota001', type : 'cna_fau_mac', site : '2', name : 'Oligochètes (vers de vase)', vue :'vue_cn_oligochete_ta', value2 : false},
        {id:'tellinefa001', type : 'cna_fau_mac', site : '1', name : 'Telline', vue : 'vue_cn_abra_telline_fa', value2 : false}, 
        {id:'tellinebr001', type : 'cna_fau_mac', site : '3', name : 'Telline', vue : 'vue_cn_abra_telline_mo', value2 : false}, 
    
        {id:'avocettefa001', type : 'cna_fau_ois', site : '1', name : 'Avocette élégante', vue : 'vue_cn_avocette_elegante_fa', value2 : false},
        {id:'avocetteta001', type : 'cna_fau_ois', site : '2', name : 'Avocette élégante', vue : 'vue_cn_avocette_elegante_ta', value2 : false},
        {id:'avocettebr001', type : 'cna_fau_ois', site : '3', name : 'Avocette élégante', vue : 'vue_cn_avocette_elegante_mo', value2 : false},
        {id:'bargefa001', type : 'cna_fau_ois', site : '1', name : 'Barge à queue noire', vue : 'vue_cn_barge_queue_fa', value2 : false},
        {id:'bargerfa001', type : 'cna_fau_ois', site : '1', name : 'Barge rousse', vue : 'vue_cn_barge_rousse_fa', value2 : false},
        {id:'becata001', type : 'cna_fau_ois', site : '2', name : 'Bécassine des marais', vue : 'vue_cn_becassine_ta', value2 : false},
        {id:'cigognebr001', type : 'cna_fau_ois', site : '3', name : 'Cigogne blanche', vue : 'vue_cn_cigogne_blanche_mo', value2 : false},
        {id:'courlisfa001', type : 'cna_fau_ois', site : '1', name : 'Courlis cendré', vue : 'vue_cn_courlis_cendre_fa', value2 : false},
        {id:'courlisbr001', type : 'cna_fau_ois', site : '3', name : 'Courlis cendré', vue : 'vue_cn_courlis_cendre_mo', value2 : false},
        {id:'echassefa001', type : 'cna_fau_ois', site : '1', name : 'Echasse blanche', vue : 'vue_cn_echasse_blanche_fa', value2 : false},
        {id:'echasseta001', type : 'cna_fau_ois', site : '2', name : 'Echasse blanche', vue : 'vue_cn_echasse_blanche_ta', value2 : false},
        {id:'echassebr001', type : 'cna_fau_ois', site : '3', name : 'Echasse blanche', vue : 'vue_cn_echasse_blanche_mo', value2 : false},
        {id:'gorgebfa001', type : 'cna_fau_ois', site : '1', name : 'Gorgebleue', vue : 'vue_cn_gorgebleue_fa', value2 : false},
        {id:'martinpta001', type : 'cna_fau_ois', site : '2', name : 'Martin-pêcheur', vue : 'vue_cn_martin_pecheur_ta', value2 : false},
        {id:'tourterelleta001', type : 'cna_fau_ois', site : '2', name : 'Tourterelle des bois', vue : 'vue_cn_tourterelle_bois_ta', value2 : false},
    
        {id:'anguillefa001', type : 'cna_fau_poi', site : '1', name : 'Anguille europénne au stade jaune', vue : 'vue_cn_anguille_fa', value2 : false},
        {id:'anguilleta001', type : 'cna_fau_poi', site : '2', name : 'Anguille europénne au stade jaune', vue : 'vue_cn_anguille_ta', value2 : false},
        {id:'anguillebr001', type : 'cna_fau_poi', site : '3', name : 'Anguille europénne au stade jaune', vue : 'vue_cn_anguille_mo', value2 : false},
        {id:'atherinefa001', type : 'cna_fau_poi', site : '1', name : 'Athérine', vue : 'vue_cn_atherine_fa', value2 : false},
        {id:'atherineta001', type : 'cna_fau_poi', site : '2', name : 'Athérine', vue : 'vue_cn_atherine_ta', value2 : false},
        {id:'barfa001', type : 'cna_fau_poi', site : '1', name : 'Bar commun', vue : 'vue_cn_bar_fa', value2 : false},
        {id:'bremeta001', type : 'cna_fau_poi', site : '2', name : 'Brème Commune', vue : 'vue_cn_breme_commune_ta', value2 : false},
        {id:'brochetta001', type : 'cna_fau_poi', site : '2', name : 'Brochet', vue : 'vue_cn_brochet_ta', value2 : false},
        {id:'carassinta001', type : 'cna_fau_poi', site : '2', name : 'Carassin', vue : 'vue_cn_carassin_ta', value2 : false},
        {id:'carpeta001', type : 'cna_fau_poi', site : '2', name : 'Carpe commune', vue : 'vue_cn_carpe_ta', value2 : false},
        {id:'doradefa001', type : 'cna_fau_poi', site : '1', name : 'Dorade grise', vue : 'vue_cn_dorade_fa', value2 : false},
        {id:'epinochefa001', type : 'cna_fau_poi', site : '1', name : 'Epinoche à trois épines', vue : 'vue_cn_epinoche_fa', value2 : false},
        {id:'epinocheta001', type : 'cna_fau_poi', site : '2', name : 'Epinoche à trois épines', vue : 'vue_cn_epinoche_ta', value2 : false},
        {id:'epinochebr001', type : 'cna_fau_poi', site : '3', name : 'Epinoche à trois épines', vue : 'vue_cn_epinoche_mo', value2 : false},
        {id:'gardonta001', type : 'cna_fau_poi', site : '2', name : 'Gardon', vue : 'vue_cn_gardon_ta', value2 : false},
        {id:'gobiefa001', type : 'cna_fau_poi', site : '1', name : 'Gobie', vue : 'vue_cn_gobie_fa', value2 : false},
        {id:'gobieta001', type : 'cna_fau_poi', site : '2', name : 'Gobie', vue : 'vue_cn_gobie_ta', value2 : false},
        {id:'gobiebr001', type : 'cna_fau_poi', site : '3', name : 'Gobie', vue : 'vue_cn_gobie_mo', value2 : false},
        {id:'hybrideta001', type : 'cna_fau_poi', site : '2', name : 'Hybride gardon brème', vue : 'vue_cn_hydridegb_ta', value2 : false},
        {id:'muletfa001', type : 'cna_fau_poi', site : '1', name : 'Mulet', vue : 'vue_cn_mulet_fa', value2 : false},
        {id:'muletta001', type : 'cna_fau_poi', site : '2', name : 'Mulet', vue : 'vue_cn_mulet_ta', value2 : false},
        {id:'percheta001', type : 'cna_fau_poi', site : '2', name : 'Perche Commune', vue : 'vue_cn_perche_ta', value2 : false},
        {id:'syngnatefa001', type : 'cna_fau_poi', site : '1', name : 'Syngnate (Poisson aiguille)', vue : 'vue_cn_poisson_anguille_fa', value2 : false},
        {id:'vieillefa001', type : 'cna_fau_poi', site : '1', name : 'Vieille commune', vue : 'vue_cn_vieille_fa', value2 : false},
    
        {id:'couleuvrehta001', type : 'cna_fau_rep', site : '2', name : 'Couleuvre helvétique', vue : 'vue_cn_couleuvre_hel_ta', value2 : false},
        {id:'couleuvrehbr001', type : 'cna_fau_rep', site : '3', name : 'Couleuvre helvétique', vue : 'vue_cn_couleuvre_hel_mo', value2 : false},
        {id:'couleuvrejbr001', type : 'cna_fau_rep', site : '3', name : 'Couleuvre verte et jaune', vue : 'vue_cn_couleuvre_vj_mo', value2 : false},
        {id:'couleuvrejta001', type : 'cna_fau_rep', site : '2', name : 'Couleuvre verte et jaune', vue : 'vue_cn_couleuvre_vj_ta', value2 : false},
        {id:'couleuvrevta001', type : 'cna_fau_rep', site : '2', name : 'Couleuvre vipérine', vue : 'vue_cn_couleuvre_vip_ta', value2 : false},
        {id:'couleuvrevbr001', type : 'cna_fau_rep', site : '3', name : 'Couleuvre vipérine', vue : 'vue_cn_couleuvre_vip_mo', value2 : false},
        {id:'lezardta001', type : 'cna_fau_rep', site : '2', name : 'Lézard des murailles', vue : 'vue_cn_lezard_muraille_ta', value2 : false},
        {id:'lezardbr001', type : 'cna_fau_rep', site : '3', name : 'Lézard des murailles', vue : 'vue_cn_lezard_muraille_mo', value2 : false},
        {id:'lezardvta001', type : 'cna_fau_rep', site : '2', name : 'Lézard vert', vue : 'vue_cn_lezard_vert_ta', value2 : false},
        {id:'lezardvbr001', type : 'cna_fau_rep', site : '3', name : 'Lézard vert', vue : 'vue_cn_lezard_vert_mo', value2 : false},
        {id:'viperebr001', type : 'cna_fau_rep', site : '3', name : 'Vipère aspic', vue : 'vue_cn_vipere_aspic_mo', value2 : false},
    
        {id:'archeesfa001', type : 'cna_aut', site : '1', name : 'Archées', vue : 'vue_cn_archees_fa', value2 : false},
        {id:'archeesta001', type : 'cna_aut', site : '2', name : 'Archées', vue : 'vue_cn_archees_ta', value2 : false},
        {id:'archeesbr001', type : 'cna_aut', site : '3', name : 'Archées', vue : 'vue_cn_archees_mo', value2 : false},
        {id:'bacteriesfa001', type : 'cna_aut', site : '1', name : 'Bactéries', vue : 'vue_cn_bacteries_fa', value2 : false},
        {id:'bacteriesta001', type : 'cna_aut', site : '2', name : 'Bactéries', vue : 'vue_cn_bacteries_ta', value2 : false},
        {id:'bacteriesbr001', type : 'cna_aut', site : '3', name : 'Bactéries', vue : 'vue_cn_bacteries_mo', value2 : false},
        {id:'argilefa001', type : 'cna_aut_nv', site : '1', name : 'Argile (bri)', vue : 'vue_cn_argile_fa', value2 : false},
        {id:'carbonefa001', type : 'cna_aut_nv', site : '1', name : 'Carbone', vue : 'vue_cn_carbone_fa', value2 : false},
        {id:'carboneta001', type : 'cna_aut_nv', site : '2', name : 'Carbone', vue : 'vue_cn_carbone_ta', value2 : false},
		{id:'carbonebr001', type : 'cna_aut_nv', site : '3', name : 'Carbone', vue : 'vue_cn_carbone_mo', value2 : false},
        {id:'esptropta001', type : 'cna_aut', site : '2', name : 'Espèces planctoniques tropicales et subtropicales non indigènes', vue : 'vue_cn_especes_planctoniques_ta', value2 : false},
        {id:'phytofa001', type : 'cna_aut', site : '1', name : 'Phytoplancton et zooplancton', vue : 'vue_cn_phyto_zoo_fa', value2 : false},
        {id:'phytota001', type : 'cna_aut', site : '2', name : 'Phytoplancton et zooplancton', vue : 'vue_cn_phyto_zoo_ta', value2 : false},
        {id:'phytobr001', type : 'cna_aut', site : '3', name : 'Phytoplancton et zooplancton', vue : 'vue_cn_phyto_zoo_mo', value2 : false},
    
         /* ---------- CP Paysagère ---------- */
		{id:'lassefa001', type : 'cpa_habn_ge', site : '1', name : 'La pointe de La Lasse', vue : 'vue_cp_pointe_lasse_fa', value2 : false},
		{id:'zhtasdonta001 ', type : 'cpa_habn_ge', site : '2', name : 'Zones humides du marais de Tasdon', vue : 'vue_cp_zone_humide_ta', value2 : false},
		{id:'bossesbr001', type : 'cpa_habn_el', site : '3', name : 'Bosses et jas', vue : 'vue_cp_jas_bosses_mo', value2 : false},
		{id:'presalesfa001', type : 'cpa_habn_el', site : '1', name : 'Pré-salés', vue : 'vue_cp_presale_fa', value2 : false},
        {id:'presalesbr001', type : 'cpa_habn_el', site : '3', name : 'Pré-salés', vue : 'vue_cp_presale_mo', value2 : false},
		{id:'resseaubr001', type : 'cpa_habn_el', site : '3', name : 'Ressource en eau douces', vue : 'vue_cp_ress_eau_douce_mo', value2 : false},
		{id:'vasierefa001', type : 'cpa_habn_el', site : '1', name : 'Vasière', vue : 'vue_cp_vasiere_fa', value2 : false},

        {id:'ancmaraista001', type : 'cpa_habg_ge', site : '2', name : 'Anciens marais salants', vue : 'vue_cp_anciens_marais_salants_ta', value2 : false},
		{id:'ancmaraisbr001 ', type : 'cpa_habg_ge', site : '3', name : 'Anciens marais salant / marais gâts', vue : 'vue_cp_anciens_marais_salants_mo', value2 : false},
        {id:'jardinsta001', type : 'cpa_habg_ge', site : '2', name : 'Jardins familiaux', vue : 'vue_cp_jardins_familiaux_ta', value2 : false},
        {id:'maraisdouxta001', type : 'cpa_habg_ge', site : '2', name : 'Marais d\'eau douce', vue : 'vue_cp_marais_eau_douce_ta', value2 : false},
        {id:'prairiesbr001', type : 'cpa_habg_ge', site : '3', name : 'Prairies naturelles et Troupeaux ', vue : 'vue_cp_prairie_naturelle_mo', value2 : false},
        {id:'fossesbr001', type : 'cpa_habg_ge', site : '3', name : 'Réseau de fossés tertiaires', vue : 'vue_cp_fosses_tertiaires_mo', value2 : false},
        {id:'maraissaumta001', type : 'cpa_habg_ge', site : '2', name : 'Marais d\'eau saumâtre', vue : 'vue_cp_marais_eau_saumatre_ta', value2 : false},
        {id:'lilleaufa001', type : 'cpa_habg_ge', site : '1', name : 'Réserve naturelle nationale de Lilleau des Niges', vue : 'vue_cp_reserve_lilleau_fa', value2 : false},
        {id:'strmaraisfa001', type : 'cpa_habg_ge', site : '1', name : 'Structure traditionnelles des marais salants', vue : 'vue_cp_str_trad_fa', value2 : false},
		
        {id:'clairesfa001', type : 'cpa_habg_el', site : '1', name : 'Les claires d\'affinage ostréicoles', vue : 'vue_cp_claires_ostr_fa', value2 : false},
        {id:'clairesbr001', type : 'cpa_habg_el', site : '3', name : 'Les claires d\'affinage ostréicoles', vue : 'vue_cp_claires_affinages_mo', value2 : false},
        {id:'vasaisfa001', type : 'cpa_habg_el', site : '1', name : 'Vasais du marais salant', vue : 'vue_cp_vasais_fa', value2 : false},
        {id:'lacsvilleneuveta001', type : 'cpa_habg_el', site : '2', name : 'Lacs de Villeneuve-les-Salines', vue : 'vue_cp_lacs_villeneuve_ta', value2 : false},
		
        {id:'canalmoulinetteta001', type : 'cpa_cons_ge', site : '2', name : 'Canal de la Moulinette', vue : 'vue_cp_canal_moulinette_ta', value2 : false},
        {id:'diguesrnnfa001', type : 'cpa_cons_ge', site : '1', name : 'Digues à la mer de la RNN de Lilleau des Niges', vue : 'vue_cp_digues_rnn_lilleau_fa', value2 : false},
        {id:'boutillonfa001', type : 'cpa_cons_ge', site : '1', name : 'Digue du Boutillon', vue : 'vue_cp_digues_boutillon_fa', value2 : false},
        {id:'moulinfa001', type : 'cpa_cons_ge', site : '1', name : 'Moulin à marée de Loix', vue : 'vue_cp_moulin_maree', value2 : false},
        {id:'ouvhydraufa001', type : 'cpa_cons_ge', site : '1', name : 'Ouvrages hydrauliques et écluses', vue : 'vue_cp_ouvrages_hydrau_fa', value2 : false},
        {id:'ouvhydrauta001', type : 'cpa_cons_ge', site : '2', name : 'Ouvrages hydrauliques et écluses', vue : 'vue_cp_ouvrages_hydrau_ta', value2 : false},
        {id:'ouvhydraubr001', type : 'cpa_cons_ge', site : '3', name : 'Ouvrages hydrauliques et écluses', vue : 'vue_cp_ouvrages_hydrau_mo', value2 : false},
        {id:'pellesfa001', type : 'cpa_cons_ge', site : '1', name : 'Pelles crémaillères (écluses)', vue : 'vue_cp_pelles_fa', value2 : false},

        {id:'cabsauniersfa001', type : 'cpa_cons_act', site : '1', name : 'Cabanes des sauniers', vue : 'vue_cp_cabanes_sauniers_fa', value2 : false},
        {id:'cabostrfa001', type : 'cpa_cons_act', site : '1', name : 'Cabanes ostréicoles', vue : 'vue_cp_cabanes_ostr_fa', value2 : false},
        {id:'cabostrbr001', type : 'cpa_cons_act', site : '3', name : 'Cabanes traditionnelles ostréicoles', vue : 'vue_cp_cabanes_tradi_mo', value2 : false},
        {id:'cabpastobr001', type : 'cpa_cons_act', site : '3', name : 'Cabanes pastorales', vue : 'vue_cp_cabanes_pastorales_mo', value2 : false},
        {id:'tonnesbr001', type : 'cpa_cons_act', site : '3', name : 'Tonnes de chasse', vue : 'vue_cp_tonnes_chasse_mo', value2 : false},

        {id:'clocherfa001', type : 'cpa_cons_edi', site : '1', name : 'Clocher Ars-en-Ré', vue : 'vue_cp_clocher_ars', value2 : false},
        {id:'citadellebr001', type : 'cpa_cons_edi', site : '3', name : 'Citadelle de Brouage', vue : 'vue_cp_citadelle_brouage_mo', value2 : false},
        {id:'brouebr001', type : 'cpa_cons_edi', site : '3', name : 'Tour de Broue et la Maison de Broue', vue : 'vue_cp_tour_broue', value2 : false},

    
        /* ---------- Filtre par fonction patrimoniale ---------- */

        /* ---------- FP Culturelle ---------- */
        {id:'ancmaraista002', type : 'fpa_cul', site : '2', name : 'Anciens marais salants', vue : 'vue_cp_anciens_marais_salants_ta', value2 : false},
        {id:'ancmaraisbr002', type : 'fpa_cul', site : '3', name : 'Anciens marais salant / marais gâts', vue : 'vue_cp_anciens_marais_salants_mo', value2 : false},
        {id:'anguillefa002', type : 'fpa_cul', site : '1', name : 'Anguille europénne au stade jaune', vue : 'vue_cn_anguille_fa', value2 : false},
        {id:'anguilleta002', type : 'fpa_cul', site : '2', name : 'Anguille europénne au stade jaune', vue : 'vue_cn_anguille_ta', value2 : false},
        {id:'anguillebr002', type : 'fpa_cul', site : '3', name : 'Anguille europénne au stade jaune', vue : 'vue_cn_anguille_mo', value2 : false},
        {id:'argilefa004', type : 'fpa_cul', site : '1', name : 'Argile (bri)', vue : 'vue_cn_argile_fa', value2 : false},
        {id:'atherinefa002', type : 'fpa_cul', site : '1', name : 'Athérine', vue : 'vue_cn_atherine_fa', value2 : false},
        {id:'atherineta002', type : 'fpa_cul', site : '2', name : 'Athérine', vue : 'vue_cn_atherine_ta', value2 : false},
        {id:'avocettefa002', type : 'fpa_cul', site : '1', name : 'Avocette élégante', vue : 'vue_cn_avocette_elegante_fa', value2 : false},
        {id:'avocetteta002', type : 'fpa_cul', site : '2', name : 'Avocette élégante', vue : 'vue_cn_avocette_elegante_ta', value2 : false},
        {id:'avocettebr002', type : 'fpa_cul', site : '3', name : 'Avocette élégante', vue : 'vue_cn_avocette_elegante_mo', value2 : false},
        {id:'barfa002', type : 'fpa_cul', site : '1', name : 'Bar commun', vue : 'vue_cn_bar_fa', value2 : false},
        {id:'bargerfa002', type : 'fpa_cul', site : '1', name : 'Barge rousse', vue : 'vue_cn_barge_rousse_fa', value2 : false},
        {id:'bossesbr002', type : 'fpa_cul', site : '3', name : 'Bosses et jas', vue : 'vue_cp_jas_bosses_mo', value2 : false},
        {id:'bremeta002', type : 'fpa_cul', site : '2', name : 'Brème Commune', vue : 'vue_cn_breme_commune_ta', value2 : false},
        {id:'brochetta002', type : 'fpa_cul', site : '2', name : 'Brochet', vue : 'vue_cn_brochet_ta', value2 : false},
        {id:'cabsauniersfa002', type : 'fpa_cul', site : '1', name : 'Cabanes des sauniers', vue : 'vue_cp_cabanes_sauniers_fa', value2 : false},
        {id:'cabostrfa002', type : 'fpa_cul', site : '1', name : 'Cabanes ostréicoles', vue : 'vue_cp_cabanes_ostr_fa', value2 : false},
        {id:'cabpastobr002', type : 'fpa_cul', site : '3', name : 'Cabanes pastorales', vue : 'vue_cp_cabanes_pastorales_mo', value2 : false},
        {id:'cabostrbr002', type : 'fpa_cul', site : '3', name : 'Les cabanes traditionnelles ostréicoles', vue : 'vue_cp_cabanes_tradi_mo', value2 : false},
        {id:'citadellebr002', type : 'fpa_cul', site : '3', name : 'Citadelle de Brouage', vue : 'vue_cp_citadelle_brouage_mo', value2 : false},
        {id:'canalmoulinetteta002', type : 'fpa_cul', site : '2', name : 'Canal de la Moulinette', vue : 'vue_cp_canal_moulinette_ta', value2 : false},
        {id:'carassinta002', type : 'fpa_cul', site : '2', name : 'Carassin', vue : 'vue_cn_carassin_ta', value2 : false},
        {id:'carpeta002', type : 'fpa_cul', site : '2', name : 'Carpe commune', vue : 'vue_cn_carpe_ta', value2 : false},
        {id:'cigognebr002', type : 'fpa_cul', site : '3', name : 'Cigogne blanche', vue : 'vue_cn_cigogne_blanche_mo', value2 : false},
        {id:'clairesfa002', type : 'fpa_cul', site : '1', name : 'Claires d\'affinage ostréicoles', vue : 'vue_cp_claires_ostr_fa', value2 : false},
        {id:'clairesbr002', type : 'fpa_cul', site : '3', name : 'Claires d\'affinage ostréicoles', vue : 'vue_cp_claires_affinages_mo', value2 : false},
        {id:'clocherfa002', type : 'fpa_cul', site : '1', name : 'Clocher Ars-en-Ré', vue : 'vue_cp_clocher_ars', value2 : false},
        {id:'couleuvrehta002', type : 'fpa_cul', site : '2', name : 'Couleuvre helvétique', vue : 'vue_cn_couleuvre_hel_ta', value2 : false},
        {id:'couleuvrehbr002', type : 'fpa_cul', site : '3', name : 'Couleuvre helvétique', vue : 'vue_cn_couleuvre_hel_mo', value2 : false},
        {id:'couleuvrejta002', type : 'fpa_cul', site : '2', name : 'Couleuvre verte et jaune', vue : 'vue_cn_couleuvre_vj_ta', value2 : false},
        {id:'couleuvrejbr002', type : 'fpa_cul', site : '3', name : 'Couleuvre verte et jaune', vue : 'vue_cn_couleuvre_vj_mo', value2 : false},
        {id:'couleuvrevta002', type : 'fpa_cul', site : '2', name : 'Couleuvre vipérine', vue : 'vue_cn_couleuvre_vip_ta', value2 : false},
        {id:'couleuvrevbr002', type : 'fpa_cul', site : '3', name : 'Couleuvre vipérine', vue : 'vue_cn_couleuvre_vip_mo', value2 : false},
        {id:'courlisbr002', type : 'fpa_cul', site : '3', name : 'Courlis cendré', vue : 'vue_cn_courlis_cendre_mo', value2 : false},
        {id:'crapauxcalafa002', type : 'fpa_cul', site : '1', name : 'Crapaud calamite', vue : 'vue_cn_crapaud_calamite_fa', value2 : false},
        {id:'crapauxepita002', type : 'fpa_cul', site : '2', name : 'Crapaud epineux', vue : 'vue_cn_crapaud_epi_ta', value2 : false},
        {id:'diguesrnnfa002', type : 'fpa_cul', site : '1', name : 'Digues à la mer de la RNN Lilleau des Niges', vue : 'vue_cp_digues_rnn_lilleau_fa', value2 : false},
        {id:'boutillonfa002', type : 'fpa_cul', site : '1', name : 'Digues du Boutillon', vue : 'vue_cp_digues_boutillon_fa', value2 : false},
        {id:'doradefa002', type : 'fpa_cul', site : '1', name : 'Dorade royale', vue : 'vue_cn_dorade_fa', value2 : false},
        {id:'echassefa002', type : 'fpa_cul', site : '1', name : 'Echasse blanche', vue : 'vue_cn_echasse_blanche_fa', value2 : false},
        {id:'ecomuseefa002', type : 'fpa_cul', site : '1', name : 'Ecomusée du marais salant rétais', vue : 'vue_csc_ecomusee', value2 : false},
        {id:'selfa002', type : 'fpa_cul', site : '1', name : 'Fleur de sel-Gros Sel-Sel', vue : 'vue_csc_sel_fa', value2 : false},
        {id:'gardonta002', type : 'fpa_cul', site : '2', name : 'Gardon', vue : 'vue_cn_gardon_ta', value2 : false},
        {id:'histoiregolfebr002', type : 'fpa_cul', site : '3', name : 'Histoire de l\'ancien Golfe de Saintonge', vue : 'vue_histoire_golfe_Saintonge', value2 : false, etat:'disabled'},
        {id:'huitresfa002', type : 'fpa_cul', site : '1', name : 'Huîtres ostréicoles', vue : 'vue_csc_huitres_ostr_fa', value2 : false},
        {id:'huitresbr002', type : 'fpa_cul', site : '3', name : 'Huîtres ostréicoles', vue : 'vue_csc_huitres_ostr_mo', value2 : false},
        {id:'jardinsta002', type : 'fpa_cul', site : '2', name : 'Jardins familiaux', vue : 'vue_cp_jardins_familiaux_ta', value2 : false},
        {id:'lavandefa002', type : 'fpa_cul', site : '1', name : 'Lavande de mer (statice)', vue : 'vue_cn_lavande_fa', value2 : false},
        {id:'lezardta002', type : 'fpa_cul', site : '2', name : 'Lézard des murailles', vue : 'vue_cn_lezard_muraille_ta', value2 : false},
        {id:'lezardbr002', type : 'fpa_cul', site : '3', name : 'Lézard des murailles', vue : 'vue_cn_lezard_muraille_mo', value2 : false},
        {id:'lezardvta002', type : 'fpa_cul', site : '2', name : 'Lézard vert', vue : 'vue_cn_lezard_vert_ta', value2 : false},
        {id:'lezardvbr002', type : 'fpa_cul', site : '3', name : 'Lézard vert', vue : 'vue_cn_lezard_vert_mo', value2 : false},
        {id:'maraisfoncbr001', type : 'fpa_cul', site : '3', name : 'Marais en tant que propriété foncière', vue : 'vue_dis_marais_propriete_fonciere', value2 : false, etat:'disabled'},
        {id:'martinpta002', type : 'fpa_cul', site : '2', name : 'Martin-pêcheur', vue : 'vue_cn_martin_pecheur_ta', value2 : false},
        {id:'moulinfa002', type : 'fpa_cul', site : '1', name : 'Moulin à marée de Loix', vue : 'vue_cp_moulin_maree', value2 : false},
        {id:'moutardefa002', type : 'fpa_cul', site : '1', name : 'Moutarde sauvage', vue : 'vue_cn_moutarde_fa', value2 : false},
/*         {id:'muletfa', type : 'fpa_cul', site : '1', name : 'Mulet juvénile', vue : 'vue_cn_mulet_fa', value2 : false},
        {id:'muletta', type : 'fpa_cul', site : '2', name : 'Mulet juvénile', vue : 'vue_cn_mulet_ta', value2 : false}, */
        {id:'ostreiculturefa002', type : 'fpa_cul', site : '1', name : 'Ostréiculture', vue : 'vue_csc_huitres_ostr_fa', value2 : false},
        {id:'ouvhydraufa002', type : 'fpa_cul', site : '1', name : 'Ouvrages hydrauliques et écluses', vue : 'vue_cp_ouvrages_hydrau_fa', value2 : false},
        {id:'ouvhydrauta002', type : 'fpa_cul', site : '2', name : 'Ouvrages hydrauliques et écluses', vue : 'vue_cp_ouvrages_hydrau_ta', value2 : false},
        {id:'ouvhydraubr002', type : 'fpa_cul', site : '3', name : 'Ouvrages hydrauliques et écluses', vue : 'vue_cp_ouvrages_hydrau_mo', value2 : false},
        {id:'outilsselfa002', type : 'fpa_cul', site : '1', name : 'Outils traditionnels de la saliculture', vue : 'vue_csc_sel_fa', value2 : false},
        {id:'pastobr002', type : 'fpa_cul', site : '3', name : 'Pastoralisme', vue : 'vue_csc_pastoralisme_mo', value2 : false},
        {id:'sfpatois002', type : 'fpa_cul', site : '3', name : 'Patois saintongeais', vue : 'vue_dis_patois_saintongeais', value2 : false, etat:'disabled'},
	    // {id:'model0 ', type : 'fpa_cul', site : '3', name : 'Paysage des marais (propriété foncière)', vue : 'vue_dis_paysage_marais', value2 : false, etat:'disabled'},
        {id:'pecheta002', type : 'fpa_cul', site : '2', name : 'Pêche de loisir', vue : 'vue_csc_peche_loisir_ta', value2 : false},
        {id:'percheta002', type : 'fpa_cul', site : '2', name : 'Perche Commune', vue : 'vue_cn_perche_ta', value2 : false},
        {id:'prairiesbr002', type : 'fpa_cul', site : '3', name : 'Prairies naturelles et Troupeaux', vue : 'vue_cp_prairie_naturelle_mo', value2 : false},
        {id:'relaismoulinetteta002', type : 'fpa_cul', site : '2', name : 'Relais Nature de la Moulinette', vue : 'vue_csc_relais_moulinette_ta', value2 : false},
        {id:'fossesbr002', type : 'fpa_cul', site : '3', name : 'Réseau de fossés tertiaires', vue : 'vue_cp_fosses_tertiaires_mo', value2 : false},
        {id:'lilleaufa002', type : 'fpa_cul', site : '1', name : 'Réserve naturelle nationale de Lilleau des Niges', vue : 'vue_cp_reserve_lilleau_fa', value2 : false},
        {id:'resseaubr002', type : 'fpa_cul', site : '3', name : 'Ressource en eau douce', vue : 'vue_cp_ress_eau_douce_mo', value2 : false},
        {id:'salicornefa002', type : 'fpa_cul', site : '1', name : 'Salicorne sauvage', vue : 'vue_cn_salicorne_fa', value2 : false},
        {id:'saliculturefa002', type : 'fpa_cul', site : '1', name : 'Saliculture', vue : 'vue_csc_sel_fa', value2 : false},
        {id:'sfostreicolefa002', type : 'fpa_cul', site : '1', name : 'Savoir-faire ostréicole', vue : 'vue_dis_savoirfaire_ostreicole', value2 : false, etat:'disabled'},
        {id:'sfostreicolebr002', type : 'fpa_cul',site : '3', name : 'Savoir-faire ostréicole', vue : 'vue_dis_savoirfaire_ostreicole', value2 : false, etat:'disabled'},
        {id:'sfchasse002', type : 'fpa_cul', site : '3', name : 'Savoir-faire de la chasse', vue : 'vue_dis_savoirfaire_chasse', value2 : false, etat:'disabled'},  
        {id:'sfpeche002', type : 'fpa_cul', site : '3', name : 'Savoir-faire de la pêche fluviale', vue : 'vue_savoir_faire_pechefluviale', value2 : false, etat:'disabled'},
        {id:'sfsauniers002', type : 'fpa_cul', site : '1', name : 'Savoir faire des sauniers', vue : 'vue_dis_savoirfaire_sauniers', value2 : false, etat:'disabled'},
        {id:'tonnesbr002', type : 'fpa_cul', site : '3', name : 'Tonnes de chasse', vue : 'vue_cp_tonnes_chasse_mo', value2 : false},
        {id:'brouebr002', type : 'fpa_cul', site : '3', name : 'Tour de Broue et la Maison de Broue', vue : 'vue_cp_tour_broue', value2 : false},
        {id:'tourterelleta002', type : 'fpa_cul', site : '2', name : 'Tourterelle des bois', vue : 'vue_cn_tourterelle_bois_ta', value2 : false},
	    {id:'vasaisfa002', type : 'fpa_cul', site : '1', name : 'Vasais du marais salant', vue : 'vue_cp_vasais_fa', value2 : false},
        {id:'viperebr002', type : 'fpa_cul', site : '3', name : 'Vipère aspic', vue : 'vue_cn_vipere_aspic_mo', value2 : false},
        {id:'vasierefa002', type : 'fpa_cul', site : '1', name : 'Vasière', vue : 'vue_cp_vasiere_fa', value2 : false},

        {id:'bossesbr003', type : 'fpa_pro', site : '3', name : 'Bosses et jas', vue : 'vue_cp_jas_bosses_mo', value2 : false},
        {id:'brochetta003', type : 'fpa_pro', site : '2', name : 'Brochet', vue : 'vue_cn_brochet_ta', value2 : false},
        {id:'cabsauniersfa003', type : 'fpa_pro', site : '1', name : 'Cabanes des sauniers', vue : 'vue_cp_cabanes_sauniers_fa', value2 : false},  
        {id:'cabostrfa003', type : 'fpa_pro', site : '1', name : 'Cabanes ostréicoles', vue : 'vue_cp_cabanes_ostr_fa', value2 : false},
        {id:'cabostrbr003', type : 'fpa_pro', site : '3', name : 'Cabanes traditionnelles ostréicoles', vue : 'vue_cp_cabanes_tradi_mo', value2 : false},
        {id:'cabpastobr003', type : 'fpa_pro', site : '3', name : 'Cabanes pastorales', vue : 'vue_cp_cabanes_pastorales_mo', value2 : false},
        {id:'carassinta003', type : 'fpa_pro', site : '2', name : 'Carassin', vue : 'vue_cn_carassin_ta', value2 : false},
        {id:'carpeta003', type : 'fpa_pro', site : '2', name : 'Carpe commune', vue : 'vue_cn_carpe_ta', value2 : false},
        {id:'clairesfa003', type : 'fpa_pro', site : '1', name : 'Claires d\'affinage ostréicoles', vue : 'vue_cp_claires_ostr_fa', value2 : false},
	    {id:'clairesbr003', type : 'fpa_pro', site : '3', name : 'Claires d\'affinage ostréicoles', vue : 'vue_cp_claires_affinages_mo', value2 : false},
		{id:'clocherfa003', type : 'fpa_pro', site : '1', name : 'Clocher Ars-en-Ré', vue : 'vue_cp_clocher_ars', value2 : false},
		{id:'ecomuseefa003', type : 'fpa_pro', site : '1', name : 'Ecomusée du marais salant rétais', vue : 'vue_csc_ecomusee', value2 : false},
		{id:'selfa003', type : 'fpa_pro', site : '1', name : 'Fleur de sel-Gros Sel-Sel', vue : 'vue_csc_sel_fa', value2 : false},
		{id:'huitresfa003', type : 'fpa_pro', site : '1', name : 'Huîtres ostréicoles', vue : 'vue_csc_huitres_ostr_fa', value2 : false},
		{id:'huitresbr003', type : 'fpa_pro', site : '3', name : 'Huîtres ostréicoles', vue : 'vue_csc_huitres_ostr_mo', value2 : false},
  		{id:'jardinsta003', type : 'fpa_pro', site : '2', name : 'Jardins familiaux', vue : 'vue_cp_jardins_familiaux_ta', value2 : false},
	    {id:'lavandefa003', type : 'fpa_pro', site : '1', name : 'Lavande de mer (statice)', vue : 'vue_cn_lavande_fa', value2 : false},
		{id:'moutardefa003', type : 'fpa_pro', site : '1', name : 'Moutarde sauvage', vue : 'vue_cn_moutarde_fa', value2 : false},
		{id:'ostreiculturefa003', type : 'fpa_pro', site : '1', name : 'Ostréiculture', vue : 'vue_csc_huitres_ostr_fa', value2 : false},
		{id:'pastobr003', type : 'fpa_pro', site : '3', name : 'Pastoralisme', vue : 'vue_csc_pastoralisme_mo', value2 : false},
        {id:'pecheta003', type : 'fpa_pro', site : '2', name : 'Pêche de loisir', vue : 'vue_csc_peche_loisir_ta', value2 : false},
        {id:'percheta003', type : 'fpa_pro', site : '2', name : 'Perche Commune', vue : 'vue_cn_perche_ta', value2 : false},
        {id:'prairiesbr003', type : 'fpa_pro', site : '3', name : 'Prairies naturelles et Troupeaux', vue : 'vue_cp_prairie_naturelle_mo', value2 : false},
        {id:'fossesbr003', type : 'fpa_pro', site : '3', name : 'Réseau de fossés tertiaires', vue : 'vue_cp_fosses_tertiaires_mo', value2 : false},
        {id:'lilleaufa003', type : 'fpa_pro', site : '1', name : 'Réserve naturelle nationale de Lilleau des Niges', vue : 'vue_cp_reserve_lilleau_fa', value2 : false},
        {id:'resseaubr003', type : 'fpa_pro', site : '3', name : 'Ressource en eau douce', vue : 'ue_cp_ress_eau_douce_mo', value2 : false},
        {id:'salicornefa003', type : 'fpa_pro', site : '1', name : 'Salicorne sauvage', vue : 'vue_cn_salicorne_fa', value2 : false},
        {id:'saliculturefa002', type : 'fpa_pro', site : '1', name : 'Saliculture', vue : 'vue_csc_sel_fa', value2 : false},
        {id:'sfostreicolefa003', type : 'fpa_pro', site : '1', name : 'Savoir-faire ostréicole', vue : 'vue_dis_savoirfaire_ostreicole', value2 : false, etat:'disabled'},
        {id:'sfostreicolebr003', type : 'fpa_pro',site : '3', name : 'Savoir-faire ostréicole', vue : 'vue_dis_savoirfaire_ostreicole', value2 : false, etat:'disabled'},
        {id:'sfpeche003', type : 'fpa_pro', site : '3', name : 'Savoir-faire de la pêche fluviale', vue : 'vue_savoir_faire_pechefluviale', value2 : false, etat:'disabled'},	  
        {id:'sfsauniers003', type : 'fpa_pro', site : '1', name : 'Savoir faire des sauniers', vue : 'vue_dis_savoirfaire_sauniers', value2 : false, etat:'disabled'},
        {id:'tourterelleta004', type : 'fpa_pro', site : '2', name : 'Tourterelle des bois', vue : 'vue_cn_tourterelle_bois_ta', value2 : false},
        {id:'viperebr003', type : 'fpa_pro', site : '1', name : 'Vasière', vue : 'vue_cp_vasiere_fa', value2 : false},
        {id:'vieillefa002', type : 'fpa_pro', site : '2', name : 'Vieille commune', vue : 'vue_cn_vieille_fa', value2 : false},
    
        /* ---------- FP Environnementale ---------- */
        {id:'agrion002', type : 'fpa_env', site : '2', name :'Agrion de Mercure (libellule)', vue : 'vue_dis_agrion_mercure', value2 : false, etat:'disabled'},
        {id:'anguillefa003', type : 'fpa_env', site : '1', name : 'Anguille europénne au stade jaune', vue : 'vue_cn_anguille_fa', value2 : false},
        {id:'anguilleta003', type : 'fpa_env', site : '2', name : 'Anguille europénne au stade jaune', vue : 'vue_cn_anguille_ta', value2 : false},
        {id:'anguillebr003', type : 'fpa_env', site : '3', name : 'Anguille europénne au stade jaune', vue : 'vue_cn_anguille_mo', value2 : false},
        {id:'araigneelfa002', type : 'fpa_env', site : '1', name : 'Araignée-loup', vue : 'vue_cn_araigneeloup_fa', value2 : false},
        {id:'araigneelbr002', type : 'fpa_env', site : '3', name : 'Araignée-loup', vue : 'vue_cn_araigneeloup_mo', value2 : false},
        {id:'araigneerbr002', type : 'fpa_env', site : '3', name : 'Araignée rare', vue : 'vue_cn_araigneerare_mo', value2 : false},
        {id:'archeesfa002', type : 'fpa_env', site : '1', name : 'Archées', vue : 'vue_cn_archees_fa', value2 : false},
        {id:'archeesta002', type : 'fpa_env', site : '2', name : 'Archées', vue : 'vue_cn_archees_ta', value2 : false},
        {id:'archeesbr002', type : 'fpa_env', site : '3', name : 'Archées', vue : 'vue_cn_archees_mo', value2 : false},
        {id:'argilefa002', type : 'fpa_env', site : '1', name : 'Argile (bri)', vue : 'vue_cn_argile_fa', value2 : false},
        {id:'atherinefa003', type : 'fpa_env', site : '1', name : 'Athérine', vue : 'vue_cn_atherine_fa', value2 : false},
        {id:'atherineta003', type : 'fpa_env', site : '2', name : 'Athérine', vue : 'vue_cn_atherine_ta', value2 : false},
        {id:'avocettefa003', type : 'fpa_env', site : '1', name : 'Avocette élégante', vue : 'vue_cn_avocette_elegante_fa', value2 : false},
        {id:'avocetteta003', type : 'fpa_env', site : '2', name : 'Avocette élégante', vue : 'vue_cn_avocette_elegante_ta', value2 : false},
        {id:'avocettebr003', type : 'fpa_env', site : '3', name : 'Avocette élégante', vue : 'vue_cn_avocette_elegante_mo', value2 : false},
        {id:'bacteriesfa002', type : 'fpa_env', site : '1', name : 'Bactéries', vue : 'vue_cn_bacteries_fa', value2 : false},
        {id:'bacteriesta002', type : 'fpa_env', site : '2', name : 'Bactéries', vue : 'vue_cn_bacteries_ta', value2 : false},
        {id:'bacteriesbr002', type : 'fpa_env', site : '3', name : 'Bactéries', vue : 'vue_cn_bacteries_mo', value2 : false},
        {id:'barfa003', type : 'fpa_env', site : '1', name : 'Bar commun', vue : 'vue_cn_bar_fa', value2 : false},
        {id:'bargefa002', type : 'fpa_env', site : '1', name : 'Barge à queue noire', vue : 'vue_cn_barge_queue_fa', value2 : false},
        {id:'bargerfa003', type : 'fpa_env', site : '1', name : 'Barge rousse', vue : 'vue_cn_barge_rousse_fa', value2 : false},
        {id:'becata002', type : 'fpa_env', site : '2', name : 'Bécassine des marais', vue : 'vue_cn_becassine_ta', value2 : false},
        {id:'bossesbr004', type : 'fpa_env', site : '3', name : 'Bosses et jas', vue : 'vue_cp_jas_bosses_mo', value2 : false},		
        {id:'bremeta003', type : 'fpa_env', site : '2', name : 'Brème Commune', vue : 'vue_cn_breme_commune_ta', value2 : false},
        {id:'brochetta004', type : 'fpa_env', site : '2', name : 'Brochet', vue : 'vue_cn_brochet_ta', value2 : false},
        {id:'carabiquefa002', type : 'fpa_env', site : '1', name : 'Carabique (Pogonus chalceus)', vue : 'vue_cn_pogonus_fa', value2 : false},
        {id:'carabiquebr002', type : 'fpa_env', site : '3', name : 'Carabique (Pogonus chalceus)', vue : 'vue_cn_pogonus_mo', value2 : false},
        {id:'carassinta004', type : 'fpa_env', site : '2', name : 'Carassin', vue : 'vue_cn_carassin_ta', value2 : false},
        {id:'carbonefa002', type : 'fpa_env', site : '1', name : 'Carbone', vue : 'vue_cn_carbone_fa', value2 : false},
        {id:'carboneta002', type : 'fpa_env', site : '2', name : 'Carbone', vue : 'vue_cn_carbone_ta', value2 : false},
        {id:'carpeta004', type : 'fpa_env', site : '2', name : 'Carpe commune', vue : 'vue_cn_carpe_ta', value2 : false},
        {id:'cigognebr003', type : 'fpa_env', site : '3', name : 'Cigogne blanche', vue : 'vue_cn_cigogne_blanche_mo', value2 : false},
        {id:'clairesbr004', type : 'fpa_env', site : '3', name : 'Claires d\'affinage ostréicoles', vue : 'vue_cp_claires_affinages_mo', value2 : false},
        {id:'coquefa002', type : 'fpa_env', site : '1', name : 'Coque glauque', vue : 'vue_cn_cerastoderma_fa', value2 : false},
        {id:'coquebr002', type : 'fpa_env', site : '3', name : 'Coque glauque', vue : 'vue_cn_cerastoderma_mo', value2 : false},
        {id:'couleuvrehta003', type : 'fpa_env', site : '2', name : 'Couleuvre helvétique', vue : 'vue_cn_couleuvre_hel_ta', value2 : false},
        {id:'couleuvrehbr003', type : 'fpa_env', site : '3', name : 'Couleuvre helvétique', vue : 'vue_cn_couleuvre_hel_mo', value2 : false},
        {id:'couleuvrejta003', type : 'fpa_env', site : '2', name : 'Couleuvre verte et jaune', vue : 'vue_cn_couleuvre_vj_ta', value2 : false},
        {id:'couleuvrejbr003', type : 'fpa_env', site : '3', name : 'Couleuvre verte et jaune', vue : 'vue_cn_couleuvre_vj_mo', value2 : false},
        {id:'couleuvrevta003', type : 'fpa_env', site : '2', name : 'Couleuvre vipérine', vue : 'vue_cn_couleuvre_vip_ta', value2 : false},
        {id:'couleuvrevbr003', type : 'fpa_env', site : '3', name : 'Couleuvre vipérine', vue : 'vue_cn_couleuvre_vip_mo', value2 : false},
        {id:'courlisfa002', type : 'fpa_env', site : '1', name : 'Courlis cendré', vue : 'vue_cn_courlis_cendre_fa', value2 : false},
        {id:'courlisbr003', type : 'fpa_env', site : '3', name : 'Courlis cendré', vue : 'vue_cn_courlis_cendre_mo', value2 : false},
        {id:'crapauxcalafa003', type : 'fpa_env', site : '1', name : 'Crapaud calamite', vue : 'vue_cn_crapaud_calamite_fa', value2 : false},
        {id:'crapauxepita003', type : 'fpa_env', site : '2', name :'Crapaud epineux', vue : 'vue_cn_crapaud_epi_ta', value2 : false},
        {id:'diguesrnnfa004', type : 'fpa_env', site : '1', name : 'Digues à la mer de la RNN Lilleau des Niges', vue : 'vue_cp_digues_rnn_lilleau_fa', value2 : false},
        {id:'dyphterefa002', type : 'fpa_env', site : '1', name : 'Diptère', vue : 'vue_cn_chironomidae_fa', value2 : false},
        {id:'dyphtereta002', type : 'fpa_env', site : '2', name : 'Diptère', vue : 'vue_cn_chironomidae_ta', value2 : false},
        {id:'dyphterebr002', type : 'fpa_env', site : '3', name : 'Diptère', vue : 'vue_cn_chironomidae_mo', value2 : false},
        {id:'doradefa003', type : 'fpa_env', site : '1', name : 'Dorade royale', vue : 'vue_cn_dorade_fa', value2 : false},
        {id:'echassefa003', type : 'fpa_env', site : '1', name : 'Echasse blanche', vue : 'vue_cn_echasse_blanche_fa', value2 : false},	  
        {id:'echasseta003', type : 'fpa_env', site : '2', name : 'Echasse blanche', vue : 'vue_cn_echasse_blanche_ta', value2 : false},
        {id:'echassebr003', type : 'fpa_env', site : '3', name : 'Echasse blanche', vue : 'vue_cn_echasse_blanche_mo', value2 : false},
        {id:'epinochefa002', type : 'fpa_env', site : '1', name : 'Epinoche à trois épines', vue : 'vue_cn_epinoche_fa', value2 : false},
        {id:'epinocheta002', type : 'fpa_env', site : '2', name : 'Epinoche à trois épines', vue : 'vue_cn_epinoche_ta', value2 : false},
        {id:'epinochebr002', type : 'fpa_env', site : '3', name : 'Epinoche à trois épines', vue : 'vue_cn_epinoche_mo', value2 : false},
        {id:'esptropta002', type : 'fpa_env', site : '2', name : 'Espèces planctoniques tropicales et subtropicales non indigènes', vue : 'vue_cn_especes_planctoniques_ta', value2 : false},
        {id:'gardonta003', type : 'fpa_env', site : '2', name : 'Gardon', vue : 'vue_cn_gardon_ta', value2 : false},
        {id:'gasterofa002', type : 'fpa_env', site : '1', name : 'Gasteropode', vue : 'vue_cn_ecrobia_fa', value2 : false},
        {id:'gasterobr002', type : 'fpa_env', site : '3', name : 'Gasteropode', vue : 'vue_cn_ecrobia_mo', value2 : false},
        {id:'gobiefa002', type : 'fpa_env', site : '1', name : 'Gobie', vue : 'vue_cn_gobie_fa', value2 : false},
        {id:'gobieta002', type : 'fpa_env', site : '2', name : 'Gobie', vue : 'vue_cn_gobie_ta', value2 : false},
        {id:'gobiebr002', type : 'fpa_env', site : '3', name : 'Gobie', vue : 'vue_cn_gobie_mo', value2 : false},
        {id:'gorgebfa002', type : 'fpa_env', site : '1', name : 'Gorgebleue', vue : 'vue_cn_gorgebleue_fa', value2 : false},
        {id:'grenouillefa002', type : 'fpa_env', site : '1', name : 'Grenouille verte', vue : 'vue_cn_grenouille_verte_fa', value2 : false},
        {id:'grenouilleta002', type : 'fpa_env', site : '2', name : 'Grenouille verte', vue : 'vue_cn_grenouille_verte_ta', value2 : false},
        {id:'grenouillemo002', type : 'fpa_env', site : '3', name : 'Grenouille verte', vue : 'vue_cn_grenouille_verte_mo', value2 : false},
        {id:'huitresfa004', type : 'fpa_env', site : '1', name : 'Huîtres ostréicoles', vue : 'vue_csc_huitres_ostr_fa', value2 : false},
        {id:'huitresbr004', type : 'fpa_env', site : '3', name : 'Huîtres ostréicoles', vue : 'vue_csc_huitres_ostr_mo', value2 : false},
        {id:'hybrideta002', type : 'fpa_env', site : '2', name : 'Hybride gardon brème', vue : 'vue_cn_hydridegb_ta', value2 : false},
        {id:'lacsvilleneuveta002', type : 'fpa_env', site : '2', name : 'Lacs de Villeneuve-les-Salines', vue : 'vue_cp_lacs_villeneuve_ta', value2 : false},
        {id:'lavandefa004', type : 'fpa_env', site : '1', name : 'Lavande de mer (statice)', vue : 'vue_cn_lavande_fa', value2 : false},
        {id:'lezardta003', type : 'fpa_env', site : '2', name : 'Lézard des murailles', vue : 'vue_cn_lezard_muraille_ta', value2 : false},
        {id:'lezardbr003', type : 'fpa_env', site : '3', name : 'Lézard des murailles', vue : 'vue_cn_lezard_muraille_mo', value2 : false},
        {id:'lezardvta003', type : 'fpa_env', site : '2', name : 'Lézard vert', vue : 'vue_cn_lezard_vert_ta', value2 : false},
        {id:'lezardvbr003', type : 'fpa_env', site : '3', name : 'Lézard vert', vue : 'vue_cn_lezard_vert_mo', value2 : false},
        {id:'macrofauneta002', type : 'fpa_env', site : '2', name : 'Macrofaune benthique (marais doux)', vue :'vue_cn_macrofaune_bent_ta', value2 : false},	  
        {id:'maraisdouxta002', type : 'fpa_env', site : '2', name : 'Marais d\'eau douce', vue : 'vue_cp_marais_eau_douce_ta', value2 : false},
        {id:'maraissaumta002', type : 'fpa_env', site : '2', name : 'Marais d\'eau saumâtre', vue : 'vue_cp_marais_eau_saumatre_ta', value2 : false},
        {id:'martinpta003', type : 'fpa_env', site : '2', name : 'Martin-pêcheur', vue : 'vue_cn_martin_pecheur_ta', value2 : false},
        {id:'moutardefa003', type : 'fpa_env', site : '1', name : 'Moutarde sauvage', vue : 'vue_cn_moutarde_fa', value2 : false},
        {id:'muletfa002', type : 'fpa_env', site : '1', name : 'Mulet juvénile', vue : 'vue_cn_mulet_fa', value2 : false},
        {id:'muletta002', type : 'fpa_env', site : '2', name : 'Mulet juvénile', vue : 'vue_cn_mulet_ta', value2 : false},
        {id:'oligota002', type : 'fpa_env', site : '2', name : 'Oligochètes (vers de vase)', vue :'vue_cn_oligochete_ta', value2 : false},
        {id:'obionefa002', type : 'fpa_env', site : '1', name : 'Obione', vue : 'vue_cn_obione_fa', value2 : false},
        {id:'ostreiculturefa004 ', type : 'fpa_env', site : '1', name : 'Ostréiculture', vue : 'vue_csc_huitres_ostr_fa', value2 : false},
        {id:'ouvhydraufa003', type : 'fpa_env', site : '1', name : 'Ouvrages hydrauliques et écluses', vue : 'vue_cp_ouvrages_hydrau_fa', value2 : false},
        {id:'pastobr004', type : 'fpa_env', site : '3', name : 'Pastoralisme', vue : 'vue_csc_pastoralisme_mo', value2 : false},
        {id:'pecheta004', type : 'fpa_env', site : '2', name : 'Pêche de loisir', vue : 'vue_csc_peche_loisir_ta', value2 : false},
        {id:'pelobatefa002', type : 'fpa_env', site : '1', name : 'Pélobate cultripède', vue : 'vue_cn_pelobate_fa', value2 : false},
        {id:'pelobatebr002 ', type : 'fpa_env', site : '3', name : 'Pélobate cultripède', vue : 'vue_cn_pelobate_mo', value2 : false},		  
        {id:'polodytefa002', type : 'fpa_env', site : '1', name : 'Pélodyte ponctué', vue : 'vue_cn_pelodyte_ponc_fa', value2 : false},
        {id:'polodyteta002', type : 'fpa_env', site : '2', name : 'Pélodyte ponctué', vue : 'vue_cn_pelodyte_ponc_ta', value2 : false},
        {id:'polodytebr002', type : 'fpa_env', site : '3', name : 'Pélodyte ponctué', vue : 'vue_cn_pelodyte_ponc_mo', value2 : false},
        {id:'percheta004', type : 'fpa_env', site : '2', name : 'Perche Commune', vue : 'vue_cn_perche_ta', value2 : false},
        {id:'phytofa002', type : 'fpa_env', site : '1', name : 'Phytoplancton et zooplancton', vue : 'vue_cn_phyto_zoo_fa', value2 : false},
        {id:'phytota002', type : 'fpa_env', site : '2', name : 'Phytoplancton et zooplancton', vue : 'vue_cn_phyto_zoo_ta', value2 : false},
        {id:'phytobr002', type : 'fpa_env', site : '3', name : 'Phytoplancton et zooplancton', vue : 'vue_cn_phyto_zoo_mo', value2 : false},
        {id:'lassefa002', type : 'fpa_env', site : '1', name : 'Pointe de la Lasse', vue : 'vue_cp_pointe_lasse_fa', value2 : false},
        {id:'presalesfa002', type : 'fpa_env', site : '1', name : 'Pré-salés', vue : 'vue_cp_presale_fa', value2 : false},
	    {id:'presalesbr002 ', type : 'fpa_env', site : '3', name : 'Pré-salés', vue : 'vue_cp_presale_mo', value2 : false},
        {id:'rainettefa002', type : 'fpa_env', site : '1', name : 'Rainette méridionale', vue : 'vue_cn_rainette_m_fa', value2 : false},
        {id:'rainetteta002', type : 'fpa_env', site : '2', name : 'Rainette méridionale', vue : 'vue_cn_rainette_m_ta', value2 : false},
        {id:'rainettebr002', type : 'fpa_env', site : '3', name : 'Rainette méridionale', vue : 'vue_cn_rainette_m_mo', value2 : false},
         {id:'relaismoulinetteta003', type : 'fpa_env', site : '2', name : 'Relais Nature de la Moulinette', vue : 'vue_csc_relais_moulinette_ta', value2 : false},
        {id:'fossesbr004', type : 'fpa_env', site : '3', name : 'Réseau de fossés tertiaires', vue : 'vue_cp_fosses_tertiaires_mo', value2 : false},
        {id:'lilleaufa004', type : 'fpa_env', site : '1', name : 'Réserve naturelle nationale de Lilleau des Niges', vue : 'vue_cp_reserve_lilleau_fa', value2 : false},
        {id:'resseaubr004', type : 'fpa_env', site : '3', name : 'Ressource en eau douce', vue : 'vue_cp_ress_eau_douce_mo', value2 : false},
        {id:'roseauta002', type : 'fpa_env', site : '2', name : 'Roseau', vue : 'vue_cn_roseau_ta', value2 : false},
        {id:'roselierebr002', type : 'fpa_env', site : '3', name : 'Roselière', vue : 'vue_cna_flore_roseliere_mo', value2 : false},
        {id:'salicornefa004', type : 'fpa_env', site : '1', name : 'Salicorne sauvage', vue : 'vue_cn_salicorne_fa', value2 : false},
        {id:'saliculturefa003', type : 'fpa_env', site : '1', name : 'Saliculture', vue : 'vue_sel_fa', value2 : false},
        {id:'sfostreicolefa004 ', type : 'fpa_env', site : '1', name : 'Savoir-faire ostréicole', vue : 'vue_csc_huitres_ostr_fa', value2 : false, etat:'disabled'},
        {id:'sfostreicolebr004', type : 'fpa_env', site : '3', name : 'Savoir-faire ostréicole', vue : 'vue_csc_huitres_ostr_mo', value2 : false, etat:'disabled'},
        {id:'sfpeche004', type : 'fpa_env', site : '3', name : 'Savoir-faire de la pêche fluviale', vue : 'vue_savoir_faire_pechefluviale', value2 : false, etat:'disabled'},	  
        {id:'sfsauniers004', type : 'fpa_env', site : '1', name : 'Savoir faire des sauniers', vue : 'vue_dis_savoirfaire_sauniers', value2 : false, etat:'disabled'},
        {id:'selfa004', type : 'fpa_env', site : '1', name : 'Fleur de sel-Gros Sel-Sel', vue : 'vue_csc_sel_fa', value2 : false},
        {id:'syngnatefa002', type : 'fpa_env', site : '1', name : 'Syngnate (Poisson aiguille)', vue : 'vue_cn_poisson_anguille_fa', value2 : false},
        {id:'tellinefa002', type : 'fpa_env', site : '1', name : 'Telline', vue : 'vue_cn_abra_telline_fa', value2 : false}, 
        {id:'tellinebr002', type : 'fpa_env', site : '3', name : 'Telline', vue : 'vue_cn_abra_telline_mo', value2 : false},
        {id:'tourterelleta003', type : 'fpa_env', site : '2', name : 'Tourterelle des bois', vue : 'vue_cn_tourterelle_bois_ta', value2 : false},
        {id:'tritonmta002', type : 'fpa_env', site : '2', name : 'Triton marbré', vue : 'vue_cn_triton_marbre_ta', value2 : false},
        {id:'tritonmbr002', type : 'fpa_env', site : '3', name : 'Triton marbré', vue : 'vue_cn_triton_marbre_mo', value2 : false},
        {id:'tritonpta002', type : 'fpa_env', site : '2', name : 'Triton palmé', vue : 'vue_cn_triton_palme_ta', value2 : false},
        {id:'tritonpbr002', type : 'fpa_env', site : '3', name : 'Triton palmé', vue : 'vue_cn_triton_palme_mo', value2 : false},
	    {id:'vasaisfa003', type : 'fpa_env', site : '1', name : 'Vasais du marais salant', vue : 'vue_cp_vasais_fa', value2 : false},
        {id:'vasierefa004', type : 'fpa_env', site : '1', name : 'Vasière', vue : 'vue_cp_vasiere_fa', value2 : false},
        {id:'vegetsalesfa002', type : 'fpa_env', site : '1', name : 'Végétation dominante de marais salés', vue : 'vue_cn_vegetation_dom_fa', value2 : false},
        {id:'vegetsalesbr002', type : 'fpa_env', site : '3', name : 'Végétation dominante de marais salés', vue : 'vue_cn_vegetation_dom_mo', value2 : false},
        {id:'vieillefa003', type : 'fpa_env', site : '2', name : 'Vieille commune', vue : 'vue_cn_vieille_fa', value2 : false},
        {id:'viperebr003', type : 'fpa_env', site : '3', name : 'Vipère aspic', vue : 'vue_cn_vipere_aspic_mo', value2 : false},
        {id:'zhtasdonta002', type : 'fpa_env', site : '2', name : 'Zone humide du marais de Tasdon', vue : 'vue_cp_zone_humide_ta', value2 : false},
    
        /* ---------- FP Paysagère ---------- */
        {id:'ancmaraista003', type : 'fpa_pay', site : '2', name : 'Anciens marais salants', vue : 'vue_cp_anciens_marais_salants_ta', value2 : false},
        {id:'ancmaraisbr003', type : 'fpa_pay', site : '3', name : 'Anciens marais salant / marais gâts', vue : 'vue_cp_anciens_marais_salants_mo', value2 : false},
        {id:'argilefa003', type : 'fpa_pay', site : '1', name : 'Argile (bri)', vue : 'vue_cn_argile_fa', value2 : false},
        {id:'avocettefa004', type : 'fpa_pay', site : '1', name : 'Avocette élégante', vue : 'vue_cn_avocette_elegante_fa', value2 : false},
        {id:'avocetteta004', type : 'fpa_pay', site : '2', name : 'Avocette élégante', vue : 'vue_cn_avocette_elegante_ta', value2 : false},
        {id:'avocettebr004', type : 'fpa_pay', site : '3', name : 'Avocette élégante', vue : 'vue_cn_avocette_elegante_mo', value2 : false},
        {id:'barfa004', type : 'fpa_pay', site : '1', name : 'Bar commun', vue : 'vue_cn_bar_fa', value2 : false},
        {id:'bossesbr005', type : 'fpa_pay', site : '3', name : 'Bosses et jas', vue : 'vue_cp_jas_bosses_mo', value2 : false},
        {id:'cabostrfa004', type : 'fpa_pay', site : '1', name : 'Cabanes ostréicoles', vue : 'vue_cp_cabanes_ostr_fa', value2 : false},
        {id:'cabostrbr004', type : 'fpa_pay', site : '3', name : 'Cabanes traditionnelles ostréicoles', vue : 'vue_cp_cabanes_tradi_mo', value2 : false},
        {id:'cabpastobr004', type : 'fpa_pay', site : '3', name : 'Cabanes pastorales', vue : 'vue_cp_cabanes_pastorales_mo', value2 : false},
        {id:'cabsauniersfa004', type : 'fpa_pay', site : '1', name : 'Cabanes des sauniers', vue : 'vue_cp_cabanes_sauniers_fa', value2 : false},  
        {id:'canalmoulinetteta003', type : 'fpa_pay', site : '2', name : 'Canal de la Moulinette', vue : 'vue_cp_canal_moulinette_ta', value2 : false},
        {id:'cigognebr004', type : 'fpa_pay', site : '3', name : 'Cigogne blanche', vue : 'vue_cn_cigogne_blanche_mo', value2 : false},
        {id:'citadellebr003', type : 'fpa_pay', site : '3', name : 'Citadelle de Brouage', vue : 'vue_cp_citadelle_brouage_mo', value2 : false},
        {id:'clairesbr005', type : 'fpa_pay', site : '3', name : 'Claires d\'affinage ostréicoles', vue : 'vue_cp_claires_affinages_mo', value2 : false},
        {id:'clocherfa004', type : 'fpa_pay', site : '1', name : 'Clocher Ars-en-Ré', vue : 'vue_cp_clocher_ars', value2 : false},
        {id:'courlisfa003', type : 'fpa_pay', site : '1', name : 'Courlis cendré', vue : 'vue_cn_courlis_cendre_fa', value2 : false},
        {id:'crapauxepita004', type : 'fpa_pay', site : '2', name :'Crapaud epineux', vue : 'vue_cn_crapaud_epi_ta', value2 : false},
        {id:'diguesrnnfa003', type : 'fpa_pay', site : '1', name : 'Digues à la mer de la RNN Lilleau des Niges', vue : 'vue_cp_digues_rnn_lilleau_fa', value2 : false},
        {id:'boutillonfa003', type : 'fpa_pay', site : '1', name : 'Digues du Boutillon', vue : 'vue_cp_digues_boutillon_fa', value2 : false},
        {id:'echassefa004', type : 'fpa_pay', site : '1', name : 'Echasse blanche', vue : 'vue_cn_echasse_blanche_fa', value2 : false},	  
        {id:'selfa005 ', type : 'fpa_pay', site : '1', name : 'Fleur de sel-Gros Sel-Sel', vue : 'vue_csc_sel_fa', value2 : false},
        {id:'gorgebfa003', type : 'fpa_pay', site : '1', name : 'Gorgebleue', vue : 'vue_cn_gorgebleue_fa', value2 : false},
        {id:'huitresfa005', type : 'fpa_pay', site : '3', name : 'Huîtres ostréicoles', vue : 'vue_csc_huitres_ostr_mo', value2 : false},
        {id:'jardinsta004', type : 'fpa_pay', site : '2', name : 'Jardins familiaux', vue : 'vue_cp_jardins_familiaux_ta', value2 : false},
        {id:'lacsvilleneuveta003', type : 'fpa_pay', site : '2', name : 'Lacs de Villeneuve-les-Salines', vue : 'vue_cp_lacs_villeneuve_ta', value2 : false},
        {id:'lavandefa005', type : 'fpa_pay', site : '1', name : 'Lavande de mer (statice)', vue : 'vue_cn_lavande_fa', value2 : false},
        {id:'maraisdouxta003', type : 'fpa_pay', site : '2', name : 'Marais d\'eau douce', vue : 'vue_cp_marais_eau_douce_ta', value2 : false},
        {id:'maraissaumta003', type : 'fpa_pay', site : '2', name : 'Marais d\'eau saumâtre', vue : 'vue_cp_marais_eau_saumatre_ta', value2 : false},
        {id:'moulinfa003', type : 'fpa_pay', site : '1', name : 'Moulin à marée de Loix', vue : 'vue_cp_moulin_maree', value2 : false},
        {id:'moutardefa005', type : 'fpa_pay', site : '1', name : 'Moutarde sauvage', vue : 'vue_cn_moutarde_fa', value2 : false},
        {id:'obionefa003', type : 'fpa_pay', site : '1', name : 'Obione', vue : 'vue_cn_obione_fa', value2 : false},
        {id:'ostreiculturefa005', type : 'fpa_pay', site : '1', name : 'Ostréiculture', vue : 'vue_csc_huitres_ostr_fa', value2 : false},
        {id:'outilsselfa003', type : 'fpa_pay', site : '1', name : 'Outils traditionnels de la saliculture', vue : 'vue_sel_fa', value2 : false},
        {id:'ouvhydraufa004', type : 'fpa_pay', site : '1', name : 'Ouvrages hydrauliques et écluses', vue : 'vue_cp_ouvrages_hydrau_fa', value2 : false},
		{id:'ouvhydrauta003', type : 'fpa_pay', site : '2', name : 'Ouvrages hydrauliques et écluses', vue : 'vue_cp_ouvrages_hydrau_ta', value2 : false},
        {id:'ouvhydraubr003', type : 'fpa_pay', site : '3', name : 'Ouvrages hydrauliques et écluses', vue : 'vue_cp_ouvrages_hydrau_mo', value2 : false},
        {id:'pastobr005', type : 'fpa_pay', site : '3', name : 'Pastoralisme', vue : 'vue_csc_pastoralisme_mo', value2 : false},
        {id:'lassefa003', type : 'fpa_pay', site : '1', name : 'Pointe de la Lasse', vue : 'vue_cp_pointe_lasse_fa', value2 : false},
        {id:'prairiesbr004', type : 'fpa_pay', site : '3', name : 'Prairies naturelles et Troupeaux', vue : 'vue_cp_prairie_naturelle_mo', value2 : false},
        {id:'presalesfa003', type : 'fpa_pay', site : '1', name : 'Pré-salés', vue : 'vue_cp_presale_fa', value2 : false},
        {id:'relaismoulinetteta004', type : 'fpa_pay', site : '2', name : 'Relais Nature de la Moulinette', vue : 'vue_csc_relais_moulinette_ta', value2 : false},
        {id:'fossesbr005', type : 'fpa_pay', site : '3', name : 'Réseau de fossés tertiaires', vue : 'vue_cp_fosses_tertiaires_mo', value2 : false},
        {id:'lilleaufa006', type : 'fpa_pay', site : '1', name : 'Réserve naturelle nationale de Lilleau des Niges', vue : 'vue_cp_reserve_lilleau_fa', value2 : false},
        {id:'resseaubr005 ', type : 'fpa_pay', site : '3', name : 'Ressource en eau douce', vue : 'vue_cp_ress_eau_douce_mo', value2 : false},
        {id:'roselierebr003', type : 'fpa_pay', site : '3', name : 'Roselière', vue : 'vue_cna_flore_roseliere_mo', value2 : false},
        {id:'salicornefa005', type : 'fpa_pay', site : '1', name : 'Salicorne sauvage', vue : 'vue_cn_salicorne_fa', value2 : false},
        {id:'saliculturefa004 ', type : 'fpa_pay', site : '1', name : 'Saliculture', vue : 'vue_sel_fa', value2 : false},
        {id:'sfchasse003', type : 'fpa_pay', site : '3', name : 'Savoir-faire de la chasse', vue : 'vue_dis_savoirfaire_chasse', value2 : false, etat:'disabled'},  
        {id:'tonnesbr003', type : 'fpa_pay', site : '3', name : 'Tonnes de chasse', vue : 'vue_cp_tonnes_chasse_mo', value2 : false},
        {id:'brouebr003', type : 'fpa_pay', site : '3', name : 'Tour de Broue et la Maison de Broue', vue : 'vue_cp_tour_broue', value2 : false}, 
	    {id:'vasaisfa004', type : 'fpa_pay', site : '1', name : 'Vasais du marais salant', vue : 'vue_cp_vasais_fa', value2 : false},
        {id:'vasierefa005', type : 'fpa_pay', site : '1', name : 'Vasière', vue : 'vue_cp_vasiere_fa', value2 : false},
        {id:'vegetsalesfa003', type : 'fpa_pay', site : '1', name : 'Végétation dominante de marais salés', vue : 'vue_cn_vegetation_dom_fa', value2 : false},
        {id:'vegetsalesbr003', type : 'fpa_pay', site : '3', name : 'Végétation dominante de marais salés', vue : 'vue_cn_vegetation_dom_mo', value2 : false},
        {id:'vieillefa004', type : 'fpa_pay', site : '1', name : 'Vieille commune', vue : 'vue_cn_vieille_fa', value2 : false}      
    ]

    console.log(this.test_auto);


        /* ---------- JSON DES DATA GROUP LAYERS ---------- */
      this.test_group = [
        {id: 'modelgrp1', type: 'data_test2', site: '1', name: 'Données de test', vue: 'group1_fa', value2: false},
        {id: 'modelgrp2', type: 'data_test2', site: '2', name: 'Données de test', vue: 'group1_tas', value2: false},
        {id: 'modelgrp3', type: 'data_test2', site: '3', name: 'Données de test', vue: 'group1_moe', value2: false},
        {id: 'modelgrp4', type: 'data_test_csc', site: '1', name: 'Données composante socio-culturelle (toutes)', vue: 'groupcsc_fa', value2: false},
        {id: 'modelgrp4', type: 'data_test_csc', site: '2', name: 'Données composante socio-culturelle (toutes)', vue: 'groupcsc_tas', value2: false},
        {id: 'modelgrp4', type: 'data_test_csc', site: '3', name: 'Données composante socio-culturelle (toutes)', vue: 'groupcsc_moe', value2: false},
        {id: 'modelgrp4', type: 'data_test_cn', site: '1', name: 'Données composante naturelle (toutes)', vue: 'groupcn_fa', value2: false},
        {id: 'modelgrp4', type: 'data_test_cn', site: '2', name: 'Données composante naturelle (toutes)', vue: 'groupcn_tas', value2: false},
        {id: 'modelgrp4', type: 'data_test_cn', site: '3', name: 'Données composante naturelle (toutes)', vue: 'groupcn_moe', value2: false},
        {id: 'modelgrp4', type: 'data_test_cp', site: '1', name: 'Données composante paysagère (toutes)', vue: 'groupcp_fa', value2: false},
        {id: 'modelgrp4', type: 'data_test_cp', site: '2', name: 'Données composante paysagère (toutes)', vue: 'groupcp_tas', value2: false},
        {id: 'modelgrp4', type: 'data_test_cp', site: '3', name: 'Données composante paysagère (toutes)', vue: 'groupcp_moe', value2: false},
        {id: 'modelgrp4', type: 'data_test_fc', site: '1', name: 'Données fonction patrimoniale culturelle (toutes)', vue: 'groupfc_fa', value2: false},
        {id: 'modelgrp4', type: 'data_test_fc', site: '2', name: 'Données fonction patrimoniale culturelle (toutes)', vue: 'groupfc_tas', value2: false},
        {id: 'modelgrp4', type: 'data_test_fc', site: '3', name: 'Données fonction patrimoniale culturelle (toutes)', vue: 'groupfc_moe', value2: false},
        {id: 'modelgrp4', type: 'data_test_fe', site: '1', name: 'Données fonction patrimoniale environnementale (toutes)', vue: 'groupfe_fa', value2: false},
        {id: 'modelgrp4', type: 'data_test_fe', site: '2', name: 'Données fonction patrimoniale environnementale (toutes)', vue: 'groupfe_tas', value2: false},
        {id: 'modelgrp4', type: 'data_test_fe', site: '3', name: 'Données fonction patrimoniale environnementale (toutes)', vue: 'groupfe_moe', value2: false},
        {id: 'modelgrp4', type: 'data_test_fp', site: '1', name: 'Données fonction patrimoniale paysagère (toutes)', vue: 'groupfp_fa', value2: false},
        {id: 'modelgrp4', type: 'data_test_fp', site: '2', name: 'Données fonction patrimoniale paysagère (toutes)', vue: 'groupfp_tas', value2: false},
        {id: 'modelgrp4', type: 'data_test_fp', site: '3', name: 'Données fonction patrimoniale paysagère (toutes)', vue: 'groupfp_moe', value2: false},
        {id: 'modelgrp4', type: 'data_test_fpr', site: '1', name: 'Données fonction patrimoniale productive (toutes)', vue: 'groupfpr_fa', value2: false},
        {id: 'modelgrp4', type: 'data_test_fpr', site: '2', name: 'Données fonction patrimoniale productive (toutes)', vue: 'groupfpr_tas', value2: false},
        {id: 'modelgrp4', type: 'data_test_fpr', site: '3', name: 'Données fonction patrimoniale productive (toutes)', vue: 'groupfpr_moe', value2: false}
    ]
   }
    

  /* ---------- INITIALISATION AU CHARGEMENT DE LA PAGE ---------- */

  ngOnInit() {
    L.Icon.Default.imagePath = "assets/"
      this.initialize(); // déclenchement de la méthode initialize()
      this.nomGroup = 'aucun';
      this.speeds2 = [10, 50, 30, 10, 5]
      //this.testGraph();
  }



/* ---------- MODAL ---------- */

  ngAfterViewInit() {
      this.launchModalInit();
  }



  trackSpeed() {
    if (this.hasTracked) {
      this.speeds = [];
     

      this.hasTracked = false;
    }

    if (this.iterations > 100) {
      this.iterations = 100;
    }

    this.isTracking = true;

    this.speedTestService.getMbps({ iterations: 1, retryDelay: 1500 }).subscribe(
      (speed:any) => {
        this.speeds.unshift(
            Number(speed.toFixed(1))
          //speed.toFixed(2)
        );

        if (this.speeds.length < this.iterations) {
          this.trackSpeed();
        } else {
          this.isTracking = false;
          this.hasTracked = true;
        }
        console.log(this.speeds)
      }
    )
  }

  // Mise en place du filtrage


/* ---------- EXECUTION DE METHODES EN FONCTION DU SITE CHOISI ---------- */

    async createNewChantier() { // ou createNewChantier(): void {
        // Process checkout data here
        console.log(this.checkoutForm.value);
        var nom = JSON.stringify(this.checkoutForm.value["nom"]).replace(/\"/g, "");
        if (nom == 'fier'){
            this.ZoomFierArs()
            this.nomSite = 'Fier d\'Ars';
        }
        else if (nom == 'tasdon'){
            this.ZoomTasdon()
            this.nomSite = 'Tasdon';

        }
        else if (nom == 'moeze'){
            this.ZoomBrouage()
            this.nomSite = 'Brouage';
        }
        else {}
   }


/* ---------- AFFICHAGE DE l'INTERFACE CARTOGRAPHIQUE ---------- */


  private initialize() {
    

      // Creation du Token 
      function genRandomString(length: any) {
        var chars = 'abcdefghijklmnopqrstuvwxyz';
        var charLength = chars.length;
        var result = '';
        for ( var i = 0; i < length; i++ ) {
            result += chars.charAt(Math.floor(Math.random() * charLength));
        }
        return result;
     }
     this.token = genRandomString(6);
    
      // Déclaration de la carte
      this.mymap = L.map('mapId',{ zoomControl: false, scrollWheelZoom: false }).setView([46.003182992430055, -1.1911365396338522], 10);

      // Affichage de la sidebar
      var sidebar = L.control.sidebar({
          autopan: false,       // whether to maintain the centered map point when opening the sidebar
          closeButton: true,    // whether t add a close button to the panes
          container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
          position: 'left',     // left or right
      }).addTo(this.mymap);

      // Paramétrage du bloc de données mis à jour par les filtres
      this.options ={
        size: [ 300, 300 ],
        minSize: [ 100, 100 ],
        maxSize: [ 350, 350 ],
        anchor: [ 350, 20 ],
        position: "topright",
        initOpen: true
      };

      // Affichage par défaut du bloc légende
      this.contents = ['<center><p style="text-transform : uppercase; font-size: 1.4em">Légende</p></center>'].join('');
      this.legende = L.control.dialog(this.options).setContent(this.contents).addTo(this.mymap);

      // Chargements des fonds de carte
      var osm = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
          }).addTo(this.mymap);
			
      var ortho2021 = L.tileLayer('https://wxs.ign.fr/ortho/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/jpeg&LAYER=HR.ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
            maxZoom: 18,
            attribution: 'CD17; <a href="https://geoservices.ign.fr/documentation/donnees/ortho/bdortho">Orthophoto 2021 -© CD17 – MNT - 2021</a> contributors'
            });			
			
      var mnt2021 = L.tileLayer.wms('https://data.pampas.univ-lr.fr/geoserver/pampas/wms', {layers: 'mnt2021_pampas_ZE_5m',format: 'image/png',transparent:true, zIndex: 1000,
            maxZoom: 18,
            attribution: '© CD17 – MNT - 2021; <a href="https://geoservices.ign.fr/documentation/donnees/ortho/bdortho">Modèle Numérique de Terrain 2021 -© CD17 – MNT - 2021</a> contributors'
            });		

      var etat_major = L.tileLayer('https://wxs.ign.fr/cartes/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/jpeg&LAYER=GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
            maxZoom: 18,
            attribution: 'IGN; <a href="https://www.geoportail.gouv.fr/depot/layers/GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40/legendes/GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40-legend.pdf">Carte de l état-major</a> contributors'
            });	

       var cassini = L.tileLayer('https://wxs.ign.fr/cartes/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/jpeg&LAYER=GEOGRAPHICALGRIDSYSTEMS.CASSINI&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
                maxZoom: 18,
                attribution: 'IGN; <a href="https://www.geoportail.gouv.fr/depot/layers/GEOGRAPHICALGRIDSYSTEMS.CASSINI/legendes/GEOGRAPHICALGRIDSYSTEMS.CASSINI-legend.pdf">Carte de Cassini</a> contributors'
            });	
    
      this.baseLayers = {
          "OSM (© Contributeurs d’OpenStreetMap)": osm, 
          "Orthophoto 2021 (©CD17-ORTHO HR-2021)" : ortho2021,
		  "Modèle Numérique de Terrain 2021 (© CD17 – MNT - 2021)" : mnt2021,
		  "Carte de l'état major (©IGN - 1820-1866)" : etat_major,
          //"Carte de Cassini (©IGN - XVIIIéme siècle)" : cassini
      };
      
      L.control.layers(null, this.baseLayers, {collapsed:false}).addTo(this.mymap);

       // Affichage bouton de zoom
       new L.Control.Zoom({ position: 'topleft' }).addTo(this.mymap);

       
    // Geocodeur
     L.Control.geocoder({collapsed:true, placeholder: ' Chercher une adresse', position: 'topleft'}).addTo(this.mymap);

      this.mymap.on('layeradd', (e:any)=>{this.onBaseLayerAdd(e)});
      this.mymap.on('layerremove', (e:any)=>{this.onBaseLayerRemove(e)});
      
      // Ajouter les emprises dans la carte
      var emprises = L.tileLayer.wms('https://data.pampas.univ-lr.fr/geoserver/pampas/wms', {layers: 'emprise_pampas',format: 'image/png',transparent:true, zIndex: 1000}).addTo(this.mymap); 

      // Echelle de la carte
      L.control.scale({position: 'bottomright'}).addTo(this.mymap);

 

/*       L.easyPrint({
        title: 'My awesome print button',
        position: 'bottomright',
        sizeModes: ['A4Portrait', 'A4Landscape']
    }).addTo(this.mymap); */


/*                 // print
                var printer = L.easyPrint({
                    title: 'Print map',
                    position: 'bottomright',
                    exportOnly: true,
                    //hideControlContainer: true,
                    tiles: osm,
                    tileWait: 4000,
                   // hidden:true
              }).addTo(this.mymap);


              printer.printMap('CurrentSize', 'Filename'); */
  }

  displayOtherTools(event: any){
    var measureControl = L.control.measure({ position: 'topleft', primaryLengthUnit: 'kilometers', primaryAreaUnit: 'hectares' });
    var browserPrint =  L.control.browserPrint({
        title: 'Imprimer la carte',
        position : 'topleft',
        printModesNames: {
          Portrait: 'Portrait',
          Landscape: 'Paysage',
          Auto: 'Auto',
          Custom: 'Séléctionnez la zone'
        }
      }); 
    //var boxzoom = L.Control.boxzoom({ position:'topleft' });
    var opacityBaseLayers = L.control.opacity(this.baseLayers, {label: 'Gestion de la transparence des fonds de plan :', position : 'topright'});

   if (event.target.checked === true){ 
         measureControl.addTo(this.mymap);
         this.arraymeasureControl.push(measureControl);
         browserPrint.addTo(this.mymap);
         this.arraybrowserPrint.push(browserPrint);
         //boxzoom.addTo(this.mymap);
         //this.arrayboxZoom.push(boxzoom);
         opacityBaseLayers.addTo(this.mymap);
         this.arrayOpacityBaseLayers.push(opacityBaseLayers);
    }
    else {
        for (let z in this.arraymeasureControl) {
            this.arraymeasureControl[z].remove();
        }
        for (let z in this.arraybrowserPrint) {
            this.arraybrowserPrint[z].remove();
        }
        //for (let z in this.arrayboxZoom) {
        //    this.arrayboxZoom[z].remove();
        //}
        for (let z in this.arrayOpacityBaseLayers) {
            this.arrayOpacityBaseLayers[z].remove();
        }
    }
  }


    onBaseLayerAdd(e:any){
        if (e.layer.options.attribution !== null){
            var a = e.layer.options.attribution
            var b = a.split('>')[1];
            if(b.includes("Modèle Numérique de Terrain") && this.displayMNT != '1'){
                this.legende.remove(this.mymap);
                this.contentLegend.push ("<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>MNT</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER=mnt2021_pampas_ZE_5m"></p>');
                let contents = [this.contents, this.contentLegend.join(" ")].join('');
                this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
                this.displayMNT = '1';
            }
        }
    }

    onBaseLayerRemove(e:any){
        if (e.layer.options.attribution !== null){
            var a = e.layer.options.attribution
            var b = a.split('>')[1];
            if(b.includes("Modèle Numérique de Terrain") && this.displayMNT == '1'){
                this.legende.remove(this.mymap);
                let suppitemlegende = "<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>MNT</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER=mnt2021_pampas_ZE_5m"></p>';
                this.contentLegend = this.contentLegend.filter(function(g) { return g !== suppitemlegende }) // Et on supprime l'élément de l'array
                let contents = [this.contents, this.contentLegend.join(" ")].join('');
                this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
                this.displayMNT = '0';
            }
        }
    }

    

 /* ---------- ZOOM ILE DE RE ---------- */
  ZoomFierArs(){
    this.lat = 46.215;
    this.lon = -1.465; 
      //this.router.navigate(['map', this.lat, this.lon]);
      this.mymap.setView([this.lat, this.lon ], 13);   
      this.selSite = '1'; 
      this.nameScenario = '';
      this.nomSite = 'Fier d\'Ars';
  }
 /* ---------- ZOOM TASDON ---------- */
  ZoomTasdon(){
    this.lat = 46.14118;
    this.lon = -1.11168;   
    //this.router.navigate(['map', this.lat, this.lon]);
    this.mymap.setView([this.lat, this.lon ], 14);    
    this.selSite = '2'; 
    this.nameScenario = '';
    this.nomSite = 'Tasdon';
}
 /* ---------- ZOOM MOEZE-BROUAGE ---------- */
  ZoomBrouage(){
    this.lat = 45.83770;
    this.lon = -0.97604;   
    //this.router.navigate(['map', this.lat, this.lon]);
    this.mymap.setView([this.lat, this.lon ], 12);    
    this.selSite = '3'; 
    this.nameScenario = '';
    this.nomSite = 'Brouage';
}


/* ---------- FENETRE DE SELECTION DU SITE A l'INITIALISATION ---------- */

launchModalInit() {
    // cf. https://stackoverflow.com/questions/53178873/ngbmodal-custom-class-styling
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false, centered: true, windowClass: 'my-class'}).result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openInit() {
    this.displayStyle3 = "block";
  }
  closePopup3() {
    this.displayStyle3 = "none";
  } 


  displayNotMappableData(event_all:any){
  }


/* ---------- GESTION DE l'AFFICHAGE D'UN LAYER  ---------- */

    displayData(event_all: any){
        console.log(event_all);

        if (event_all !== null){    
            let event = event_all.split('/')[0];
            this.event_name = event_all.split('/')[1];
            // Test gestion des doublons
            this.event_id = event_all.split('/')[2];  

            // Initialisation //
            this.testCompteurArray.push("init");
            this.testCompteurArray = [...new Set(this.testCompteurArray)];
            // console.log(this.testCompteurArray);

            for (let i in this.testCompteurArray) {
                var key = this.testCompteurArray[i];
                    console.log("key : " + key);

                    // Suppression du layer //
                    if (key == event && key != 'init' && this.array3.includes(this.event_name) && this.array4.includes(this.event_id)){

                        // Suppression des items filtres
                        for (const j of this.filtreObjets) {
                            if (j.includes(event)){
                                this.filtreObjets =  this.filtreObjets.filter(function(f) { return f !== j })
                            }
                         }
                        console.log(this.filtreObjets.length)

                        // Suppression des datas
                        for(const j of this.myarray){
                            if (event == j.options.layers){
                                //console.log("trouvé " + j.options.layers)
                                if (this.mymap.hasLayer(j)) { // Si le WMS est bien sur la carte ...
                                    console.log ("map a bien " + j.options.layers);
                                    //console.log(this.myarray_name);
                                    //console.log(j.options.layers);
                                    this.mymap.removeLayer(j);  // ... on le supprime
                                    this.myarray = this.myarray.filter(function(f) { return f !== j }) // Et on supprime l'élément de l'array
                                    this.myarray2 =  this.myarray2.filter(function(f) { return f !== j.options.layers })
                                    delete this.myarray_name[j.options.layers];
                                    //console.log(this.myarray_name);
                                    //console.log(this.myarray2);
                                    // Ajout d'une variable indiquant que la suppression a été faite et que le processus peut alors s'arreter
                                    this.LayerHasBeenRemoved = 'yes';
                                } 
                            }
                        }           
                        this.testCompteurArray = this.testCompteurArray.filter(function(f) { return f !== event }) // Et on supprime l'élément de l'array    
                        
                        // Check si l'array contient au moins une donnée
                        let countArrayIfRemoveElements = this.myarray.length;
                        if (countArrayIfRemoveElements < 1){
                            this.activeButtonSelectData = 'no';
                        }   

                        // Suppression dans le bloc de la légende
                        this.legende.remove(this.mymap);

                        for(const i of this.listDataFishLegend){
                            if (this.event_name == i){
                                this.event_name = '<img src="../../assets/poissons.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                            }
                        }
                        for(const i of this.listDataFloreLegend){
                            if (this.event_name == i){
                                this.event_name = '<img src="../../assets/herbacees.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                            }
                        } 
                        for(const i of this.listDataAmphibiensLegend){
                            if (this.event_name == i){
                                this.event_name = '<img src="../../assets/amphibiens.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                            }
                        } 
                        for(const i of this.listDataArthropodesLegend){
                            if (this.event_name == i){
                                this.event_name = '<img src="../../assets/arthropodes.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                            }
                        } 
                        for(const i of this.listDataBenthosLegend){
                            if (this.event_name == i){
                                this.event_name = '<img src="../../assets/benthos.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                            }
                        } 
                        for(const i of this.listDataOiseauxLegend){
                            if (this.event_name == i){
                                this.event_name = '<img src="../../assets/oiseaux.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                            }
                        } 
                        for(const i of this.listDataReptilesLegend){
                            if (this.event_name == i){
                                this.event_name = '<img src="../../assets/reptiles.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                            }
                        } 
                        for(const i of this.listDataVivantLegend){
                            if (this.event_name == i){
                                this.event_name = '<img src="../../assets/autres-vivant.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                            }
                        }
                        for(const i of this.listDataNonVivantLegend){
                            if (this.event_name == i){
                                this.event_name = '<img src="../../assets/autres-non-vivant.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                            }
                        }

                        let suppitemlegende = "<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + this.event_name + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ event + '"></p>';
                        console.log(suppitemlegende)
                        this.contentLegend = this.contentLegend.filter(function(g) { return g !== suppitemlegende }) // Et on supprime l'élément de l'array
                        let contents = [this.contents, this.contentLegend.join(" ")].join('');
                        this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);

                        // Suppression de l'affichage des pop-ups lorsque la couche est désactivée
                        this.listData = [];
                        this.array3 =  this.array3.filter(function(f) { return f !== event_all.split('/')[1] })
                        this.array4 =  this.array4.filter(function(f) { return f !== event_all.split('/')[2] })
                        
                    }

                    
                    else if (key == event && key != 'init' && this.array3.includes(this.event_name) && !this.array4.includes(this.event_id)){
                        this.notifyService.showError("Vous avez déjà sélectionné cet objet patrimonial", "Sélection")
                        this.test_auto = this.test_auto.filter((item: { id: string; }) => item.id !== this.event_id);
                    }

                    else if (key == event && key != 'init' && !this.array3.includes(this.event_name)){
                        this.notifyService.showError("Vous avez déjà sélectionné cet objet patrimonial", "Sélection")
                        this.test_auto = this.test_auto.filter((item: { id: string; }) => item.id !== this.event_id);
                    }

                    // Si le layer a été supprimé, on ne continue pas la boucle
                    else if (key != event && this.LayerHasBeenRemoved == 'yes'){
                        // Do nothing
                    }

                    // S'il n'y a pas de layers à supprimer on peut continuer la boucle et s'intéresser aux ajouts de layers  //
                    else {  
                        
                        // Affichage des données
                        this.testCompteurArray.push(event);
                        this.testCompteurArray = [...new Set(this.testCompteurArray)];
                        //console.log(this.testCompteurArray);

                        if (this.myarray2.includes(event) === false){
                            
                            console.log("ajout error ???");
                            var layer = L.tileLayer.wms('https://data.pampas.univ-lr.fr/geoserver/pampas/wms', {layers: event ,format: 'image/png',transparent:true});
                            layer.addTo(this.mymap).bringToFront().setOpacity((this.value/10));
                            this.myarray.push(layer);
                            this.myarray2.push(layer.options.layers)
                            //this.myarray_name.push(layer.options.layers + ':' + this.event_name);
                            this.myarray_name[layer.options.layers] = this.event_name
                            //console.log(this.myarray_name);
                            this.activeButtonSelectData = 'yes';
                            this.array3.push(this.event_name)
                            this.array4.push(this.event_id)
                            console.log(this.array3);
                            console.log(this.array4);

                            // Affichage dans le bloc de la légende
                            this.legende.remove(this.mymap);

                            for(const i of this.listDataFishLegend){
                                if (this.event_name == i){
                                    this.event_name = '<img src="../../assets/poissons.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                                }
                            }
                            for(const i of this.listDataFloreLegend){
                                if (this.event_name == i){
                                    this.event_name = '<img src="../../assets/herbacees.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                                }
                            } 
                            for(const i of this.listDataAmphibiensLegend){
                                if (this.event_name == i){
                                    this.event_name = '<img src="../../assets/amphibiens.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                                }
                            } 
                            for(const i of this.listDataArthropodesLegend){
                                if (this.event_name == i){
                                    this.event_name = '<img src="../../assets/arthropodes.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                                }
                            } 
                            for(const i of this.listDataBenthosLegend){
                                if (this.event_name == i){
                                    this.event_name = '<img src="../../assets/benthos.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                                }
                            } 
                            for(const i of this.listDataOiseauxLegend){
                                if (this.event_name == i){
                                    this.event_name = '<img src="../../assets/oiseaux.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                                }
                            } 
                            for(const i of this.listDataReptilesLegend){
                                if (this.event_name == i){
                                    this.event_name = '<img src="../../assets/reptiles.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                                }
                            } 
                            for(const i of this.listDataVivantLegend){
                                if (this.event_name == i){
                                    this.event_name = '<img src="../../assets/autres-vivant.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                                }
                            }
                            for(const i of this.listDataNonVivantLegend){
                                if (this.event_name == i){
                                    this.event_name = '<img src="../../assets/autres-non-vivant.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.event_name;
                                }
                            }

                            this.contentLegend.push ("<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + this.event_name + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ event + '"></p>');
                            console.log("<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + this.event_name + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ event + '"></p>');
                            let contents = [this.contents, this.contentLegend.join(" ")].join('');
                            this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);


                        // Vérif filtres
                        var idfiltre = event_all.split('/')[3]; 
                        this.filtreObjets.push(event + ':' + idfiltre); 
                        console.log(this.filtreObjets)

                        } // fin  if (this.myarray2.includes(event) === false){

                        //// SUPP TEMPORAIRE ////

                    }
                }
            // Réinitialisation de la variable à la fin de le boucle
            this.LayerHasBeenRemoved = '';
        
        } 

    } // Fin de la méthode //


/* ---------- GESTION DE l'AFFICHAGE D'UN GROUPE DE LAYER  ---------- */

displayGroupData(event_all: any){

    // A COMPLETER
    let groupDataMultiArray = [
        ["group1_fa", ["vuetestdev_clocher_ars", "vuetestdev_moulin_loix", "vuetestdev_epinoche", "vuetestdev_lacs_villeneuve_les_salines", "vuetestdev_relais_moulinette", "vuetestdev_citadelle_brouage"]],
        
        ["groupcsc_fa", ["vue_csc_huitres_ostr_fa",  "vue_csc_sel_fa",  "vue_csc_sel_fa",  "vue_csc_ecomusee",  "vue_csc_sel_fa",  "vue_csc_huitres_ostr_fa",  "vue_dis_savoirfaire_ostreicole",  "vue_dis_savoirfaire_sauniers"]],
        ["groupcsc_ta", ["vue_csc_relais_moulinette_ta",  "vue_csc_peche_loisir_ta"]],
        ["groupcsc_mo", ["vue_csc_huitres_ostr_mo",  "vue_dis_histoire_golfe_saintonge",  "vue_csc_pastoralisme_mo",  "vue_dis_savoirfaire_chasse",  "vue_dis_savoirfaire_ostreicole",  "vue_savoir_faire_pechefluviale",  "vue_dis_patois_saintongeais"]],
        ["groupcn_fa", ["vue_cn_lavande_fa",  "vue_cn_moutarde_fa",  "vue_cn_obione_fa",  "vue_cn_salicorne_fa",  "vue_cn_vegetation_dom_fa",  "vue_cn_crapaud_calamite_fa",  "vue_cn_grenouille_verte_fa",  "vue_cn_pelobate_fa",  "vue_cn_pelodyte_ponc_fa",  "vue_cn_rainette_m_fa",  "vue_cn_araigneeloup_fa",  "vue_cn_pogonus_fa",  "vue_cn_cerastoderma_fa",  "vue_cn_chironomidae_fa",  "vue_cn_ecrobia_fa",  "vue_cn_abra_telline_fa",  "vue_cn_avocette_elegante_fa",  "vue_cn_barge_queue_fa",  "vue_cn_barge_rousse_fa",  "vue_cn_courlis_cendre_fa",  "vue_cn_echasse_blanche_fa",  "vue_cn_gorgebleue_fa",  "vue_cn_anguille_fa",  "vue_cn_atherine_fa",  "vue_cn_bar_fa",  "vue_cn_dorade_fa",  "vue_cn_epinoche_fa",  "vue_cn_gobie_fa",  "vue_cn_mulet_fa",  "vue_cn_poisson_anguille_fa",  "vue_cn_vieille_fa",  "vue_cn_archees_fa",  "vue_cn_bacteries_fa",  "vue_cn_argile_fa",  "vue_cn_carbone_fa",  "vue_cn_phyto_zoo_fa"]],
        ["groupcn_ta", ["vue_cn_roseau_ta",  "vue_cn_crapaud_epi_ta",  "vue_cn_grenouille_verte_ta",  "vue_cn_pelodyte_ponc_ta",  "vue_cn_rainette_m_ta",  "vue_cn_triton_marbre_ta",  "vue_cn_triton_palme_ta",  "vue_dis_agrion_mercure",  "vue_cn_chironomidae_ta",  "vue_cn_macrofaune_bent_ta",  "vue_cn_oligochete_ta",  "vue_cn_avocette_elegante_ta",  "vue_cn_becassine_ta",  "vue_cn_echasse_blanche_ta",  "vue_cn_martin_pecheur_ta",  "vue_cn_tourterelle_bois_ta",  "vue_cn_anguille_ta",  "vue_cn_atherine_ta",  "vue_cn_breme_commune_ta",  "vue_cn_brochet_ta",  "vue_cn_carassin_ta",  "vue_cn_carpe_ta",  "vue_cn_epinoche_ta",  "vue_cn_gardon_ta",  "vue_cn_gobie_ta",  "vue_cn_hydridegb_ta",  "vue_cn_mulet_ta",  "vue_cn_perche_ta",  "vue_cn_couleuvre_hel_ta",  "vue_cn_couleuvre_vj_ta",  "vue_cn_couleuvre_vip_ta",  "vue_cn_lezard_muraille_ta",  "vue_cn_lezard_vert_ta",  "vue_cn_archees_ta",  "vue_cn_bacteries_ta",  "vue_cn_carbone_ta",  "vue_cn_especes_planctoniques_ta",  "vue_cn_phyto_zoo_ta"]],
        ["groupcn_mo", ["vue_cn_vegetation_dom_mo",  "vue_cna_flore_roseliere_mo",  "vue_cn_grenouille_verte_mo",  "vue_cn_pelobate_mo",  "vue_cn_pelodyte_ponc_mo",  "vue_cn_rainette_m_mo",  "vue_cn_triton_marbre_mo",  "vue_cn_triton_palme_mo",  "vue_cn_araigneeloup_mo",  "vue_cn_araigneerare_mo",  "vue_cn_pogonus_mo",  "vue_cn_cerastoderma_mo",  "vue_cn_chironomidae_mo",  "vue_cn_ecrobia_mo",  "vue_cn_abra_telline_mo",  "vue_cn_avocette_elegante_mo",  "vue_cn_cigogne_blanche_mo",  "vue_cn_courlis_cendre_mo",  "vue_cn_echasse_blanche_mo",  "vue_cn_anguille_mo",  "vue_cn_epinoche_mo",  "vue_cn_gobie_mo",  "vue_cn_couleuvre_hel_mo",  "vue_cn_couleuvre_vj_mo",  "vue_cn_couleuvre_vip_mo",  "vue_cn_lezard_muraille_mo",  "vue_cn_lezard_vert_mo",  "vue_cn_vipere_aspic_mo",  "vue_cn_archees_mo",  "vue_cn_bacteries_mo",  "vue_cn_phyto_zoo_mo"]],
        ["groupcp_fa", ["vue_cp_claires_ostr_fa",  "vue_cp_pointe_lasse_fa",  "vue_cp_presale_fa",  "vue_cp_reserve_lilleau_fa",  "vue_cp_vasiere_fa",  "vue_cp_str_trad_fa",  "vue_cp_vasais_fa",  "vue_cp_cabanes_sauniers_fa",  "vue_cp_cabanes_ostr_fa",  "vue_cp_clocher_ars",  "vue_cp_digues_rnn_lilleau_fa",  "vue_cp_digues_boutillon_fa",  "vue_cp_moulin_maree",  "vue_cp_ouvrages_hydrau_fa",  "vue_cp_pelles_fa"]],
        ["groupcp_ta", ["vue_cp_anciens_marais_salants_ta",  "vue_cp_jardins_familiaux_ta",  "vue_cp_lacs_villeneuve_ta",  "vue_cp_marais_eau_douce_ta",  "vue_cp_marais_eau_saumatre_ta",  "vue_cp_zone_humide_ta",  "vue_cp_canal_moulinette_ta"]],
        ["groupcp_mo", ["vue_cp_prairie_naturelle_mo",  "vue_cp_ress_eau_douce_mo",  "vue_cp_jas_bosses_mo",  "vue_cp_presale_mo",  "vue_cp_claires_affinages_mo",  "vue_cp_fosses_tertiaires_mo",  "vue_cp_anciens_marais_salants_mo",  "vue_cabanes_trad_ostreicoles",  "vue_cabapastoral_mo",  "vue_cp_tonnes_chasse_mo",  "vue_cp_citadelle_brouage_mo",  "vue_cp_tour_broue",  "vue_cp_ouvrages_hydrau_mo"]],

        ["groupfc_fa", ["vue_cn_anguille_fa",  "vue_cn_argile_fa",  "vue_cn_atherine_fa",  "vue_cn_avocette_elegante_fa",  "vue_cn_bar_fa",  "vue_cn_barge_rousse_fa",  "vue_cp_cabanes_sauniers_fa",  "vue_cp_cabanes_ostr_fa",  "vue_cp_claires_ostr_fa",  "vue_cp_clocher_ars",  "vue_cn_crapaud_calamite_fa",  "vue_cp_digues_rnn_lilleau_fa",  "vue_cp_digues_boutillon_fa",  "vue_cn_dorade_fa",  "vue_cn_echasse_blanche_fa",  "vue_csc_ecomusee",  "vue_sel_fa",  "vue_csc_huitres_ostr_fa",  "vue_cn_lavande_fa",  "vue_cp_moulin_maree",  "vue_cn_moutarde_fa",  "vue_cn_mulet_fa",  "vue_csc_huitres_ostr_fa",  "vue_cp_ouvrages_hydrau_fa",  "vue_sel_fa",  "vue_cp_reserve_lilleau_fa",  "vue_cn_salicorne_fa",  "vue_sel_fa",  "vue_dis_savoirfaire_ostreicole",  "vue_dis_savoirfaire_sauniers",  "vue_cp_vasiere_fa"]],
        ["groupfc_ta", ["vue_cp_anciens_marais_salants_ta",  "vue_cn_anguille_ta",  "vue_cn_atherine_ta",  "vue_cn_avocette_elegante_ta",  "vue_cn_breme_commune_ta",  "vue_cn_brochet_ta",  "vue_cp_canal_moulinette_ta",  "vue_cn_carassin_ta",  "vue_cn_carpe_ta",  "vue_cn_couleuvre_hel_ta",  "vue_cn_couleuvre_vj_ta",  "vue_cn_couleuvre_vip_ta",  "vue_cn_crapaud_epi_ta",  "vue_cn_gardon_ta",  "vue_cp_jardins_familiaux_ta",  "vue_cn_lezard_muraille_ta",  "vue_cn_lezard_vert_ta",  "vue_cn_martin_pecheur_ta",  "vue_cn_mulet_ta",  "vue_csc_peche_loisir_ta",  "vue_cn_perche_ta",  "vue_csc_relais_moulinette_ta",  "vue_cn_tourterelle_bois_ta"]],
        ["groupfc_mo", ["vue_cn_anguille_mo",  "vue_cn_avocette_elegante_mo",  "vue_cn_cigogne_blanche_mo",  "vue_cn_couleuvre_hel_mo",  "vue_cn_couleuvre_vj_mo",  "vue_cn_couleuvre_vip_mo",  "vue_cn_courlis_cendre_mo",  "vue_histoire_golfe_Saintonge",  "vue_csc_huitres_ostr_mo",  "vue_cn_lezard_muraille_mo",  "vue_cn_lezard_vert_mo",  "vue_dis_marais_propriete_fonciere",  "vue_csc_pastoralisme_mo",  "vue_dis_patois_saintongeais",  "vue_dis_savoirfaire_chasse",  "vue_savoir_faire_pechefluviale",  "vue_cn_vipere_aspic_mo",  "vue_cp_tour_broue",  "vue_cp_tonnes_chasse_mo",  "vue_cp_citadelle_brouage_mo",  "vue_cabapastoral_mo",  "vue_cabanes_trad_ostreicoles",  "vue_cp_ouvrages_hydrau_mo",  "vue_cp_ress_eau_douce_mo",  "vue_cp_prairie_naturelle_mo",  "vue_cp_jas_bosses_mo",  "vue_cp_fosses_tertiaires_mo",  "vue_cp_anciens_marais_salants_mo",  "vue_cp_claires_affinages_mo",  "vue_dis_savoirfaire_ostreicole"]],
        ["groupfp_fa", ["vue_cp_cabanes_sauniers_fa",  "vue_cp_cabanes_ostr_fa",  "vue_cp_claires_ostr_fa",  "vue_cp_clocher_ars",  "vue_csc_ecomusee",  "vue_sel_fa",  "vue_csc_huitres_ostr_fa",  "vue_cn_moutarde_fa",  "vue_csc_huitres_ostr_fa",  "vue_cp_reserve_lilleau_fa",  "vue_cn_salicorne_fa",  "vue_sel_fa",  "vue_dis_savoirfaire_ostreicole",  "vue_dis_savoirfaire_sauniers",  "vue_cp_vasiere_fa"]],
        ["groupfp_ta", ["vue_cn_brochet_ta",  "vue_cn_carassin_ta",  "vue_cn_carpe_ta",  "vue_cp_jardins_familiaux_ta",  "vue_csc_peche_loisir_ta",  "vue_cn_perche_ta",  "vue_cn_tourterelle_bois_ta",  "vue_cn_vieille_fa"]],
        ["groupfp_mo", ["vue_cabapastoral_mo",  "vue_csc_huitres_ostr_mo",  "vue_csc_pastoralisme_mo",  "vue_savoir_faire_pechefluviale",  "vue_cp_claires_affinages_mo",  "vue_cp_prairie_naturelle_mo",  "vue_cp_ress_eau_douce_mo",  "vue_cp_fosses_tertiaires_mo",  "vue_cp_jas_bosses_mo",  "vue_cabanes_trad_ostreicoles",  "vue_dis_savoirfaire_ostreicole"]],
        ["groupfe_fa", ["vue_cn_anguille_fa",  "vue_cn_araigneeloup_fa",  "vue_cn_archees_fa",  "vue_cn_argile_fa",  "vue_cn_atherine_fa",  "vue_cn_avocette_elegante_fa",  "vue_cn_bacteries_fa",  "vue_cn_bar_fa",  "vue_cn_barge_queue_fa",  "vue_cn_barge_rousse_fa",  "vue_cn_pogonus_fa",  "vue_cn_carbone_fa",  "vue_cn_cerastoderma_fa",  "vue_cn_courlis_cendre_fa",  "vue_cn_crapaud_calamite_fa",  "vue_cp_digues_rnn_lilleau_fa",  "vue_cn_chironomidae_fa",  "vue_cn_dorade_fa",  "vue_cn_echasse_blanche_fa",  "vue_cn_epinoche_fa",  "vue_cn_ecrobia_fa",  "vue_cn_gobie_fa",  "vue_cn_gorgebleue_fa",  "vue_cn_grenouille_verte_fa",  "vue_csc_huitres_ostr_fa",  "vue_cn_lavande_fa",  "vue_cn_moutarde_fa",  "vue_cn_mulet_fa",  "vue_cn_obione_fa",  "vue_csc_huitres_ostr_fa",  "vue_cp_ouvrages_hydrau_fa",  "vue_cn_pelobate_fa",  "vue_cn_pelodyte_ponc_fa",  "vue_cn_phyto_zoo_fa",  "vue_cp_pointe_lasse_fa",  "vue_cp_presale_fa",  "vue_cn_rainette_m_fa",  "vue_cp_reserve_lilleau_fa",  "vue_cn_salicorne_fa",  "vue_sel_fa",  "vue_csc_huitres_ostr_fa",  "vue_dis_savoirfaire_sauniers",  "vue_sel_fa",  "vue_cn_poisson_anguille_fa",  "vue_cn_abra_telline_fa",  "vue_cp_vasiere_fa",  "vue_cn_vegetation_dom_fa"]],
        ["groupfe_ta", ["vue_dis_agrion_mercure",  "vue_cn_anguille_ta",  "vue_cn_archees_ta",  "vue_cn_atherine_ta",  "vue_cn_avocette_elegante_ta",  "vue_cn_bacteries_ta",  "vue_cn_becassine_ta",  "vue_cn_breme_commune_ta",  "vue_cn_brochet_ta",  "vue_cn_carassin_ta",  "vue_cn_carbone_ta",  "vue_cn_carpe_ta",  "vue_cn_couleuvre_hel_ta",  "vue_cn_couleuvre_vj_ta",  "vue_cn_couleuvre_vip_ta",  "vue_cn_crapaud_epi_ta",  "vue_cn_chironomidae_ta",  "vue_cn_echasse_blanche_ta",  "vue_cn_epinoche_ta",  "vue_cn_especes_planctoniques_ta",  "vue_cn_gardon_ta",  "vue_cn_gobie_ta",  "vue_cn_grenouille_verte_ta",  "vue_cn_hydridegb_ta",  "vue_cp_lacs_villeneuve_ta",  "vue_cn_lezard_muraille_ta",  "vue_cn_lezard_vert_ta",  "vue_cn_macrofaune_bent_ta",  "vue_cp_marais_eau_douce_ta",  "vue_cp_marais_eau_saumatre_ta",  "vue_cp_marais_tasdon_ta",  "vue_cn_martin_pecheur_ta",  "vue_cn_mulet_ta",  "vue_cn_oligochete_ta",  "vue_csc_peche_loisir_ta",  "vue_cn_pelodyte_ponc_ta",  "vue_cn_perche_ta",  "vue_cn_phyto_zoo_ta",  "vue_cn_rainette_m_ta",  "vue_csc_relais_moulinette_ta",  "vue_cn_roseau_ta",  "vue_cn_tourterelle_bois_ta",  "vue_cn_triton_marbre_ta",  "vue_cn_triton_palme_ta",  "vue_cn_vieille_fa",  "vue_cp_zone_humide_ta"]],
        ["groupfe_mo", ["vue_cn_anguille_mo",  "vue_cn_araigneeloup_mo",  "vue_cn_araigneerare_mo",  "vue_cn_archees_mo",  "vue_cn_avocette_elegante_mo",  "vue_cn_bacteries_mo",  "vue_cn_pogonus_mo",  "vue_cn_cigogne_blanche_mo",  "vue_cn_cerastoderma_mo",  "vue_cn_couleuvre_hel_mo",  "vue_cn_couleuvre_vj_mo",  "vue_cn_couleuvre_vip_mo",  "vue_cn_courlis_cendre_mo",  "vue_cn_chironomidae_mo",  "vue_cn_echasse_blanche_mo",  "vue_cn_epinoche_mo",  "vue_cn_ecrobia_mo",  "vue_cn_gobie_mo",  "vue_cn_grenouille_verte_mo",  "vue_csc_huitres_ostr_mo",  "vue_cn_lezard_muraille_mo",  "vue_cn_lezard_vert_mo",  "vue_csc_pastoralisme_mo",  "vue_cn_pelobate_mo",  "vue_cn_pelodyte_ponc_mo",  "vue_cn_phyto_zoo_mo",  "vue_cn_rainette_m_mo",  "vue_cna_flore_roseliere_mo",  "vue_csc_huitres_ostr_mo",  "vue_savoir_faire_pechefluviale",  "vue_cn_abra_telline_mo",  "vue_cn_triton_marbre_mo",  "vue_cn_triton_palme_mo",  "vue_cn_vegetation_dom_mo",  "vue_cn_vipere_aspic_mo",  "vue_cp_claires_affinages_mo",  "vue_cp_ress_eau_douce_mo",  "vue_cp_jas_bosses_mo",  "vue_cp_fosses_tertiaires_mo"]],
        ["groupfpa_fa", ["vue_cn_argile_fa",  "vue_cn_avocette_elegante_fa",  "vue_cn_bar_fa",  "vue_cp_cabanes_ostr_fa",  "vue_cp_cabanes_sauniers_fa",  "vue_cp_clocher_ars",  "vue_cn_courlis_cendre_fa",  "vue_cp_digues_rnn_lilleau_fa",  "vue_cp_digues_boutillon_fa",  "vue_cn_echasse_blanche_fa",  "vue_sel_fa",  "vue_cn_gorgebleue_fa",  "vue_cn_lavande_fa",  "vue_cp_moulin_maree",  "vue_cn_moutarde_fa",  "vue_cn_obione_fa",  "vue_csc_huitres_ostr_fa",  "vue_sel_fa",  "vue_cp_ouvrages_hydrau_fa",  "vue_cp_pointe_lasse_fa",  "vue_cp_presale_fa",  "vue_cp_reserve_lilleau_fa",  "vue_cn_salicorne_fa",  "vue_sel_fa",  "vue_cp_vasiere_fa",  "vue_cn_vegetation_dom_fa",  "vue_cn_vieille_fa"]],
        ["groupfpa_ta", ["vue_cp_anciens_marais_salants_ta",  "vue_cn_avocette_elegante_ta",  "vue_cp_canal_moulinette_ta",  "vue_cn_crapaud_epi_ta",  "vue_cp_jardins_familiaux_ta",  "vue_cp_lacs_villeneuve_ta",  "vue_cp_marais_eau_douce_ta",  "vue_cp_marais_eau_saumatre_ta",  "vue_csc_relais_moulinette_ta",  "vue_cp_zone_humide_ta"]],
        ["groupfpa_mo", ["vue_cn_avocette_elegante_mo",  "vue_cn_cigogne_blanche_mo",  "vue_cp_citadelle_brouage_mo",  "vue_csc_huitres_ostr_mo",  "vue_csc_pastoralisme_mo",  "vue_cna_flore_roseliere_mo",  "vue_dis_savoirfaire_chasse",  "vue_cn_vegetation_dom_mo",  "vue_cp_tour_broue",  "vue_cabanes_trad_ostreicoles",  "vue_cabapastoral_mo",  "vue_cp_tonnes_chasse_mo",  "vue_cp_ouvrages_hydrau_mo",  "vue_cp_claires_affinages_mo",  "vue_cp_anciens_marais_salants_mo",  "vue_cp_prairie_naturelle_mo",  "vue_cp_ress_eau_douce_mo",  "vue_cp_fosses_tertiaires_mo",  "vue_cp_jas_bosses_mo",  "vue_cp_presale_mo",  "vue_cp_citadelle_brouage_mo"]]

    ]
    
    if (event_all !== null){    
        // console.log(event_all)
        let event = event_all.split('/')[0];
        this.event_name = event_all.split('/')[1];

        // Initialisation //
        this.testCompteurArray.push("init");
        this.testCompteurArray = [...new Set(this.testCompteurArray)];

        for (let i in this.testCompteurArray) {
            var key = this.testCompteurArray[i];
                console.log("key : " + key);

                // Suppression du layer //
                if (key == event && key != 'init'){
                    //alert(event);
                    
                    //this.nomGroup = 'aucun';
                    this.nomGroup = this.nomGroup.replace(event,'');
                    console.log(this.nomGroup);

                    // Suppression des datas
                    for(const j of this.myarray){
                        if (event == j.options.layers){
                            if (this.mymap.hasLayer(j)) { // Si le WMS est bien sur la carte ...
                                this.mymap.removeLayer(j);  // ... on le supprime
                                this.myarray = this.myarray.filter(function(f) { return f !== j }) // Et on supprime l'élément de l'array
                                this.myarray2 =  this.myarray2.filter(function(f) { return f !== j.options.layers })
                                delete this.myarray_groupname[j.options.layers];
                                this.LayerHasBeenRemoved = 'yes';
                            } 
                        }
                    }           
                    this.testCompteurArray = this.testCompteurArray.filter(function(f) { return f !== event }) // Et on supprime l'élément de l'array    
                    
                    // Check si l'array contient au moins une donnée
                    // let countArrayIfRemoveElements = this.myarray.length;
                    // if (countArrayIfRemoveElements < 1){
                    //     this.activeButtonSelectData = 'no';
                    // }   
                    // Suppression dans le bloc de la légende
                    this.legende.remove(this.mymap);

                    // SI LE GROUPE EST DEJA AFFICHE...
                    let suppitemlegende = "<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + this.event_name + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ event + '"></p>';
                    console.log(suppitemlegende)
                    this.contentLegend = this.contentLegend.filter(function(g) { return g !== suppitemlegende }) // Et on supprime l'élément de l'array
                    let contents = [this.contents, this.contentLegend.join(" ")].join('');
                    this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);

                    // Suppression de l'affichage des pop-ups lorsque la couche est désactivée
                    this.listData = [];
                    
                }

                // Si le layer a été supprimé, on ne continue pas la boucle
                else if (key != event && this.LayerHasBeenRemoved == 'yes'){
                    // Do nothing
                }

                // S'il n'y a pas de layers à supprimer on peut continuer la boucle et s'intéresser aux ajouts de layers  //
                else {               
                    
                    console.log(this.myarray);

                    // Affichage des données
                    this.testCompteurArray.push(event);
                    this.testCompteurArray = [...new Set(this.testCompteurArray)];
                    
                   // console.log(this.nomGroup);
                    // SPECIFIC //
                    
                    for (let [d1, d2] of groupDataMultiArray) {
                        console.log(this.nomGroup, '/', d1, '/', d2);
                        if (this.nomGroup.includes(d1)){
                            //console.log("vrai");
                            for (let k in Array.from(d2)){
                                //console.log ("donnée " + d2[k])
                                this.arrayTemp.push(d2[k])
                            }
                        }
                    }
                    this.arrayTemp = [...new Set(this.arrayTemp)];
                    console.log(this.arrayTemp);
                    // On parse ensuite dans l'array des layers. Si un layer est compris dans l'array des couches concernées, on le supprime de la carte et de la légende.
                    // ICI ON S'INTERESSE AUX LAYERS AFFICHES SUR LA CARTE ET ASSOCIES AU GROUPE SELECTIONNE 
                    for(const i of this.myarray){
                        console.log(i)

                        for (const [key, value] of Object.entries(this.myarray_name)) {
                            if (i.options.layers == key){
                                console.log(i.options.layers + '/' + key);
                                this.legende.remove(this.mymap);
                                this.value22 = value;
                                console.log(this.value22)
                                for(const i of this.listDataFishLegend){
                                    if (this.value22 == i){
                                        this.value22 = '<img src="../../assets/poissons.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.value22;
                                    }
                                }
                                for(const i of this.listDataFloreLegend){
                                    if (this.value22 == i){
                                        this.value22 = '<img src="../../assets/herbacees.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.value22;
                                    }
                                } 
                                for(const i of this.listDataAmphibiensLegend){
                                    if (this.value22 == i){
                                        this.value22 = '<img src="../../assets/amphibiens.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.value22;
                                    }
                                } 
                                for(const i of this.listDataArthropodesLegend){
                                    if (this.value22 == i){
                                        this.value22 = '<img src="../../assets/arthropodes.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.value22;
                                    }
                                } 
                                for(const i of this.listDataBenthosLegend){
                                    if (this.value22 == i){
                                        this.value22 = '<img src="../../assets/benthos.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.value22;
                                    }
                                } 
                                for(const i of this.listDataOiseauxLegend){
                                    if (this.value22 == i){
                                        this.value22 = '<img src="../../assets/oiseaux.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.value22;
                                    }
                                } 
                                for(const i of this.listDataReptilesLegend){
                                    if (this.value22 == i){
                                        this.value22 = '<img src="../../assets/reptiles.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.value22;
                                    }
                                } 
                                for(const i of this.listDataVivantLegend){
                                    if (this.value22 == i){
                                        this.value22 = '<img src="../../assets/autres-vivant.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.value22;
                                    }
                                }
                                for(const i of this.listDataNonVivantLegend){
                                    if (this.value22 == i){
                                        this.value22 = '<img src="../../assets/autres-non-vivant.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ this.value22;
                                    }
                                }
                                console.log(this.value22);
                                // modif julien
                                let suppitemlegende = "<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + this.value22 + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ key + '"></p>';
                                console.log(suppitemlegende)
                                this.contentLegend = this.contentLegend.filter(function(f) { return f !== suppitemlegende }) // Et on supprime l'élément de l'array                                    
                                let contents = [this.contents, this.contentLegend].join('');
                                this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
                            }
                        }

                        // ON GERE ICI LE FAIT DE NE PAS AVOIR UNE ESPECE ET UN GROUPE CONTENANT L'ESPECE DANS LE MEME ARRAY
                        for (const j of this.arrayTemp){
                            console.log(j + '/' + i.options.layers)
                            if(i.options.layers == j){
                                console.log("layer " + i.options.layers)
                                if (this.mymap.hasLayer(i)) { 
                                    this.mymap.removeLayer(i);  
                                    // On réinitialise l'array testCompteurArray pour ne pas avoir des noms de layers simples dedans
                                    this.testCompteurArray = this.testCompteurArray.filter(function(f) { return f !== i.options.layers }) // 
                                    this.myarray = this.myarray.filter(function(f) { return f !== i }) // Et on supprime l'élément de l'array
                                    this.myarray2 =  this.myarray2.filter(function(f) { return f !== i.options.layers })

                                }
                               // console.log(this.myarray2)     
               
                            }
                        }


                        for (var k = 0; k < this.test_auto.length; k++) {
                            if (this.test_auto[k].vue == i.options.layers)
                                this.test_auto[k].value2 = this.masterSelected;
                        }
                    } // FIN for(const i of this.myarray){
                    

                    
                    // FIN SPECIFIC //

                    // AJOUT DANS LA CARTE ET LA LEGENDE //
                    

                    if (this.myarray2.includes(event) === false){

                        this.notifyService.showSuccess("Votre groupe d'objets a bien été pris en compte par l'outil", "Ajout de votre groupe")

                        this.nomGroup = this.nomGroup.replace('aucun','') + ';' + event;
                        console.log(this.nomGroup);

                        console.log("ajout error ???");
                        var layer = L.tileLayer.wms('https://data.pampas.univ-lr.fr/geoserver/pampas/wms', {layers: event ,format: 'image/png',transparent:true});
                        //layer.addTo(this.mymap).bringToFront().setOpacity((this.value/10));
                        this.myarray.push(layer);
                        this.myarray2.push(layer.options.layers)
                        //this.myarray_name.push(layer.options.layers + ':' + this.event_name);
                        this.myarray_groupname[layer.options.layers] = this.event_name
                        //console.log(this.myarray_name);
                        this.activeButtonSelectData = 'yes';

                        console.log(this.myarray) // renvoie l'array qui va être pris en compte dans le panier

                        // Affichage dans le bloc de la légende
/*                          this.legende.remove(this.mymap);

                        this.contentLegend.push ("<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + this.event_name + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ event + '"></p>');
                        console.log("<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + this.event_name + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ event + '"></p>');
                        let contents = [this.contents, this.contentLegend.join(" ")].join('');
                        this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);  */

                    }

                     ////////////////////////////////////////////////////////////////////////////////////////////////

                }

        }
        // Réinitialisation de la variable à la fin de le boucle
        this.LayerHasBeenRemoved = '';
    
    } 

} // Fin de la méthode //



/* ---------- GENERATION ET ALIMENTATION DU PANIER  ---------- */

      selectData(){

        console.log(this.myarray2)

        this.counter = 0;

        var filtreObjetsReformat : any[] = []
        for (const j of this.filtreObjets) {
            filtreObjetsReformat.push(j.split(':')[1])
        }

        const itemCounter = (value: any[], index: string) => {
            return value.filter((x: any) => x == index).length;
        };
        
        var countItemsComp = itemCounter(filtreObjetsReformat, '1');
        var countItemsFP = itemCounter(filtreObjetsReformat, '2');
        if (countItemsComp > 1000){
            // this.notifyService.showError("Vos objets patrimoniaux doivent tous être issus d'un seul filtre", "Panier invalide")
            // this.etatIconPanier = 'inactif';
        }
        else {

           console.log(this.myarray_groupname)

           for (const i of this.myarray){

                for (const [key, value] of Object.entries(this.myarray_name)) {
                    if (i.options.layers == key){
                        console.log ("trouvé ! " + value)
                        this.arrayPanier.push(value + ';' + i.options.layers)
                    }
                }

                for (const [key, value] of Object.entries(this.myarray_groupname)) {
                    if (i.options.layers == key){
                        console.log ("trouvé ! " + value)
                        this.arrayPanier.push(value + ';' + i.options.layers)
                    }
                }
                /* 
                if (i.options.layers.includes('group')){
                        i.options.layers = i.options.layers;
                        this.arrayPanier.push(i.options.layers)
                } */

                // Remove duplicates...
                this.arrayPanier = [...new Set(this.arrayPanier)];
                console.log(this.arrayPanier)
        
        }
       
        // Gestion des groupes de données
        let groupPanierMultiArray = [
            ["group1_fa", 3,], ["group1_tas", 2], ["group1_moe", 1],
            ["groupcsc_fa", 8], ["groupcn_fa", 36], ["groupcp_fa", 15], 
            ["groupfc_fa", 31], ["groupfp_fa", 47], ["groupfe_fa", 27], ["groupfpr_fa", 15],
            ["groupcsc_tas", 2], ["groupcn_tas", 38], ["groupcp_tas", 7], 
            ["groupfc_tas", 23], ["groupfp_tas", 47], ["groupfe_tas", 10], ["groupfpr_tas", 8],
            ["groupcsc_moe", 7], ["groupcn_moe", 31], ["groupcp_moe", 14], 
            ["groupfc_moe", 31], ["groupfp_moe", 39], ["groupfe_moe", 21], ["groupfpr_moe", 11]
        ];

        // Comptage des données du panier
        for(const i of this.arrayPanier){
            console.log(i.split(';')[1])
            for (let [d1, d2] of groupPanierMultiArray) {
                if (i.split(';')[1]  == d1){
                    this.counter = this.counter + Number(d2)
                    console.log(this.counter);
                }
            }
            if (!i.includes("group")){
                    let array2 = new Array();
                    array2.push(i.split(';')[1])       
                    console.log(array2)
                    //this.counter = this.counter + (array2.length)
                    this.counter = this.counter + array2.length;
                    console.log(this.counter);
            }
        }

        
        // Affectation de l'état actif à l'icà´ne du panier
        this.etatIconPanier = 'actif';

        // Notification MAJ panier
        this.notifyService.showSuccess("Vous pouvez choisir votre scénario", "Vos objets patrimoniaux sont validés")

        // Envoi webservice
        this.http.post('https://data.pampas.univ-lr.fr/node/init', {idtoken:this.token})
        .toPromise()
        .then(
          response => {     
            var messageInit : any;
            messageInit = response;
            messageInit = messageInit["data"];
            if (messageInit == 'yes'){
                for(const i of this.arrayPanier){
                    this.integrPanier = '';
                    //let nom = i.options.layers;
                    //alert(nom)
                    this._apiService.postObjets(i, this.token);
                    console.log(i);
                    this.integrPanier = 'yes';
                    
                } 
            }            
          },
          error => {            
            console.log(error);
          });
        }
        
    } // fin de selectData() ..


    /* ---------- PARAMETRAGE DE L'AFFICHAGE DES POP-UPS VIA L'ACTION MAPCLICK ---------- */

    openFicheAttributs(event_all: any){
        var vue = event_all
        this._apiService.getAttributs(vue).then(data => 
            {
            this.resgraph = data;
            let limit = this.resgraph.length;
            for (var i = 0; i < limit; i++){
                // Champs communs
                this.attType = this.resgraph[i].typedata;
                this.attNom = this.resgraph[i].nom;
                this.attFct = this.resgraph[i].fonction;
                this.attInfo = this.resgraph[i].information;
                this.attPhoto = this.resgraph[i].photo;
                this.attMat = this.resgraph[i].maturite;
                this.attNomSci = this.resgraph[i].nom_valide;
                this.attInpn = this.resgraph[i].url_taxref;
                this.attFishbase = this.resgraph[i].url_fishbase;
                }
        });
        this.displayFicheAttributs = "block";
    }
    closeFicheAttributs() {
        this.displayFicheAttributs = "none";
      } 

    /* ---------- COMPOSANT MODAL "+ D'INFOS" DU SCENARIO NÂ°1 ---------- */

    openFocusData(event_all: any) { 
        let event = event_all.split('/')[0];
        //alert(event);
        this.event_name = event_all.split('/')[1];
        if (event == 'vue_dis_savoirfaire_sauniers'){
            this.titreDataNotMappable = this.event_name;
            this.fonctionsDataNotMappable = 'Fonctions patrimoniales culturelle, productive et environnementale';
            this.descFonctionsDataNotMappable = 'Diffuser les traditions orales locales, la mémoire des activités de production passées \
            , emploi local, filières économiques locales, transmission / éducation des enjeux environnementaux, préservation de la biodiversité.';
            this.objetDataNotMappaple = 'Objet à Â vocation patrimoniale';
            this.patriObjetDataNotMappaple = "Reconnaissance de ce savoir faire faisant partie intégrante de la culture salicole et de la culture de l'île de Ré (et du Fier d'Ars)";
        }
        else if (event == 'vue_dis_savoirfaire_ostreicole'){
            this.titreDataNotMappable = this.event_name;
            this.fonctionsDataNotMappable = 'Fonctions patrimoniales culturelle, productive et environnementale';
            this.descFonctionsDataNotMappable = 'Diffuser les traditions orales locales, la mémoire des activités de production passées \
            , emploi local, filières économiques locales, transmission / éducation des enjeux environnementaux.';
            this.objetDataNotMappaple = 'Objet à Â vocation patrimoniale';
            this.patriObjetDataNotMappaple = "Mettre en place un musée de la même manière que cela a été fait pour la saliculture. Donc un musée valorisant le savoir-faire de l'ostréiculture, afin de montrer la place qu'elle occupe au sein du marais et dans le développement économique et territorial de l'île de Ré. ";
        }        
        else if (event == 'vue_dis_histoire_golfe_saintonge'){
            this.titreDataNotMappable = this.event_name;
            this.fonctionsDataNotMappable = 'Fonction culturelle';
            this.descFonctionsDataNotMappable = 'Diffuser les traditions orales locales, la mémoire des activités de production passées';
            this.objetDataNotMappaple = 'Objet à Â vocation patrimoniale';
            this.patriObjetDataNotMappaple = "Donner à Â voir au public l'histoire de la genèse du marais de Brouage à Â travers des actions de valorisation, de communication";
        }
        else if (event == 'vue_dis_savoirfaire_pechefluviale'){
            this.titreDataNotMappable = this.event_name;
            this.fonctionsDataNotMappable = 'Fonctions patrimoniales culturelle, productive et environnementale';
            this.descFonctionsDataNotMappable = 'Diffuser les traditions orales locales, la mémoire des activités de production passées';
            this.objetDataNotMappaple = 'Objet patrimonial';
            this.patriObjetDataNotMappaple = "Porte-voix existants : chercheurs et société civile. Usages : récréatif & enrichissement culturel. Indicateurs de reconnaissance sociétale : associations";
        }
        else if (event == 'vue_dis_savoirfaire_chasse'){
            this.titreDataNotMappable = this.event_name;
            this.fonctionsDataNotMappable = 'Fonctions patrimoniales culturelle et paysagères';
            this.descFonctionsDataNotMappable = 'Diffuser les traditions orales locales';
            this.objetDataNotMappaple = 'Objet à vocation patrimoniale';
            this.patriObjetDataNotMappaple = "non précisé";
        }
        else if (event == 'vue_dis_patois_saintongeais'){
            this.titreDataNotMappable = this.event_name;
            this.fonctionsDataNotMappable = 'Fonction patrimoniale culturelle';
            this.descFonctionsDataNotMappable = 'Diffuser les traditions orales locales, la mémoire des activités de production passées';
            this.objetDataNotMappaple = 'Objet à vocation patrimoniale';
            this.patriObjetDataNotMappaple = "Valorisation à travers des panneaux ou des illustrations au sein du marais permettant ainsi de montrer aux visiteurs mais aussi habitants lÂ’existence dÂ’un langage vernaculaire spécifique au territoire.";
        }
        else if (event == 'vue_dis_agrion_mercure'){
            this.titreDataNotMappable = this.event_name;
            this.fonctionsDataNotMappable = 'Fonction patrimoniale environnementale ';
            this.descFonctionsDataNotMappable = "Préserver un socio-écosystème local, développer la transmission / l'éducation des enjeux environnementaux";
            this.objetDataNotMappaple = 'Objet patrimonial';
            this.patriObjetDataNotMappaple = "Porte-voix existants : chercheurs, acteurs publics et société civile. Indicateurs de reconnaissance sociétale : articles de presse";
        }
        else if (event == 'vue_dis_marais_propriete_fonciere'){
            this.titreDataNotMappable = this.event_name;
            this.fonctionsDataNotMappable = 'Fonction patrimoniale culturelle';
            this.descFonctionsDataNotMappable = 'non précisé';
            this.objetDataNotMappaple = 'Objet patrimonial';
            this.patriObjetDataNotMappaple = "non précisé";
        }
        else {}

        this.displayStyleData1 = "block";
      }

      closePopupData() {
        this.displayStyleData1 = "none";
      } 

    /* ---------- COMPOSANT MODAL "+ D'INFOS" DU SCENARIO N°1 ---------- */
      openScenario1_1() {
        this.displayStyle2 = "block";
      }
      openScenario1_2() {
        this.displayStyle2b = "block";
      }
      openScenario2_1() {
        this.displayStyle2c = "block";
      }
      openScenario2_2() {
        this.displayStyle2d = "block";
      }
      openScenario3_1() {
        this.displayStyle2e = "block";
      }
      openScenario3_2() {
        this.displayStyle2f = "block";
      }

      closePopup2_1_1() {
        this.displayStyle2 = "none";
      } 
      closePopup2_1_2() {
        this.displayStyle2b = "none";
      } 
      closePopup2_2_1() {
        this.displayStyle2c = "none";
      } 
      closePopup2_2_2() {
        this.displayStyle2d = "none";
      } 
      closePopup2_3_1() {
        this.displayStyle2e = "none";
      } 
      closePopup2_3_2() {
        this.displayStyle2f = "none";
      } 

      openModalGraph1(value : string) {
        this.selGraph=value;
        this.displayStyleGraph1 = "block";
      }
      closeModalGraph1() {
        this.displayStyleGraph1 = "none";
      }
      openModalGraph2(value : string) {
        this.selGraph=value;
        this.displayStyleGraph2 = "block";
      }
      closeModalGraph2() {
        this.displayStyleGraph2 = "none";
      }
      openModalGraph3(value : string) {
        this.selGraph=value;
        this.displayStyleGraph3 = "block";
      }
      closeModalGraph3() {
        this.displayStyleGraph3 = "none";
      }
      openModalGraph4(value : string) {
        this.selGraph=value;
        this.displayStyleGraph4 = "block";
      }
      closeModalGraph4() {
        this.displayStyleGraph4 = "none";
      }

      openModalGraph1_2(value : string) {
        this.selGraph=value;
        this.displayStyleGraph1_2 = "block";
      }
      closeModalGraph1_2() {
        this.displayStyleGraph1_2 = "none";
      }
      openModalGraph2_2(value : string) {
        this.selGraph=value;
        this.displayStyleGraph2_2 = "block";
      }
      closeModalGraph2_2() {
        this.displayStyleGraph2_2 = "none";
      }
      openModalGraph3_2(value : string) {
        this.selGraph=value;
        this.displayStyleGraph3_2 = "block";
      }
      closeModalGraph3_2() {
        this.displayStyleGraph3_2 = "none";
      }

      openModalGraph1_3(value : string) {
        this.selGraph=value;
        this.displayStyleGraph1_3 = "block";
      }
      closeModalGraph1_3() {
        this.displayStyleGraph1_3 = "none";
      }
      openModalGraph2_3(value : string) {
        this.selGraph=value;
        this.displayStyleGraph2_3 = "block";
      }
      closeModalGraph2_3() {
        this.displayStyleGraph2_3 = "none";
      }
      openModalGraph3_3(value : string) {
        this.selGraph=value;
        this.displayStyleGraph3_3 = "block";
      }
      closeModalGraph3_3() {
        this.displayStyleGraph3_3 = "none";
      }

      writeConclusion() {
        this.displayStyleWriteConclusion = "block";
      }
      closeWriteConclusion() {
        this.displayStyleWriteConclusion = "none";
      }

      /* ---------- LANCE LE MODAL DU PANIER ---------- */
      openPanier() {
        this.displayStyle = "block";
      }
      /* ---------- FERME LE MODAL DU PANIER ---------- */
      closePopup() {
        this.displayStyle = "none";
      } 

      openNotesGroupes() {
        this.displayStyleNotesGroupes = "block";
      }
      closeNotesGroupes() {
        this.displayStyleNotesGroupes = "none";
      }

      openHistoRapport(value:any) {
        this.displayHistoRapport = "block";
        console.log (value);
        this._apiService.getHistoDetails(value).then((data: any) =>
        {
            this.detailrapports = data;
        })
      }
      closeHistoRapport() {
        this.displayHistoRapport = "none";
      }

      /* ---------- VIDAGE INTEGRAL DU PANIER ---------- */

      videPanier(){

        console.log(this.arrayPanier)

        // légende
        for(const i of this.arrayPanier){
            if (i.split(";")[1].includes("group")){
                this.legende.remove(this.mymap);
                let suppitemlegende = '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + i.split(";")[1] + '&LEGEND_OPTIONS=forceLabels:on">';
                this.contentLegend = this.contentLegend.filter(function(f) { return f !== suppitemlegende }) // Et on supprime l'élément de l'array                                    
                let contents = [this.contents, this.contentLegend].join('');
                this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
                this.nomGroup = 'aucun';
            }
            else {
                for(const j of this.listDataFishLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/poissons.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                }
                for(const j of this.listDataFloreLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/herbacees.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                }
                for(const j of this.listDataAmphibiensLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/amphibiens.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataArthropodesLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/arthropodes.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataBenthosLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/benthos.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataOiseauxLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/oiseaux.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataReptilesLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/reptiles.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataVivantLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/autres-vivant.png" class="img-fluid" alt="" width="30" height="30">&nbsp; ' + i.split(";")[0];
                    }
                }
                for(const j of this.listDataNonVivantLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/autres-non-vivant.png" class="img-fluid" alt="" width="30" height="30">&nbsp; ' + i.split(";")[0];
                    }
                }
                for(const j of this.listNoLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = i.split(";")[0];
                    }
                }
                this.legende.remove(this.mymap);
                let suppitemlegende = "<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + this.value222 + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ i.split(";")[1] + '"></p>';
                console.log(suppitemlegende)
                this.contentLegend = this.contentLegend.filter(function(g) { return g !== suppitemlegende }) // Et on supprime l'élément de l'array
                let contents = [this.contents, this.contentLegend.join(" ")].join('');
                this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
            }
        }

            // empty map
            for(const i of this.myarray){
                    if (this.mymap.hasLayer(i)) { // Si le WMS est bien sur la carte ...
                        this.mymap.removeLayer(i);  // ... on le supprime
                        this.myarray = this.myarray.filter(function(f) { return f !== i }) // Et on supprime l'élément de l'array
                    } 
            }
            this.myarray = [];
            this.myarray2 = [];
            this.myarray_name = [];
            this.myarray_groupname = [];

            // empty arborescence      
            this.activeButtonSelectData = 'no';
            this.nomGroup = 'aucun';

            // empty comptage
            this.counter = 0

            this.etatIconPanier = 'inactif';

            for (var i = 0; i < this.test_auto.length; i++) {
                this.test_auto[i].value2 = this.masterSelected;
            }
            for (var i = 0; i < this.test_group.length; i++) {
                this.test_group[i].value2 = this.masterSelected;
            }

            // empty array
            this.arrayPanier = [];

            for (var i = 0; i < this.testCompteurArray.length; i++) {
                this.testCompteurArray.splice(1); // on supprime de l'array tout ce qui est après init
            }
            console.log(this.testCompteurArray)

            //location.reload();
            //this.router.navigate(['/map/']);     
    }


    /* ---------- VIDE UN ELEMENT DU PANIER ---------- */

    videItemPanier(data:any){
            // cf. https://www.freakyjolly.com/check-uncheck-all-checkbox-list-in-angular/
            let data1 = data.split(';')[0];
            let data2 = data.split(';')[1];
           // alert(data2)

            // supp légende
            if (data2.includes("group")){
                this.legende.remove(this.mymap);
                let suppitemlegende = "<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + data1 + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ data2 + '"></p>';                
                console.log(suppitemlegende);
                this.contentLegend = this.contentLegend.filter(function(f) { return f !== suppitemlegende }) // Et on supprime l'élément de l'array                                    
                let contents = [this.contents, this.contentLegend].join('');
                this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);

                this.nomGroup = 'aucun';
            }
            else {
                    // suppression dans la légende
                    for(const i of this.listDataFishLegend){
                        if (data1 == i){
                            data1 = '<img src="../../assets/poissons.png" class="img-fluid" alt="" width="30" height="30">&nbsp; ' + data1;
                        }
                    }
                    for(const i of this.listDataFloreLegend){
                        if (data1 == i){
                            data1 = '<img src="../../assets/herbacees.png" class="img-fluid" alt="" width="30" height="30">&nbsp; ' + data1;
                        }
                    }
                    for(const i of this.listDataAmphibiensLegend){
                        if (data1 == i){
                            data1 = '<img src="../../assets/amphibiens.png" class="img-fluid" alt="" width="30" height="30">&nbsp; ' + data1;
                        }
                    } 
                    for(const i of this.listDataArthropodesLegend){
                        if (data1 == i){
                            data1 = '<img src="../../assets/arthropodes.png" class="img-fluid" alt="" width="30" height="30">&nbsp; ' + data1;
                        }
                    } 
                    for(const i of this.listDataBenthosLegend){
                        if (data1 == i){
                            data1 = '<img src="../../assets/benthos.png" class="img-fluid" alt="" width="30" height="30">&nbsp; ' + data1;
                        }
                    } 
                    for(const i of this.listDataOiseauxLegend){
                        if (data1 == i){
                            data1 = '<img src="../../assets/oiseaux.png" class="img-fluid" alt="" width="30" height="30">&nbsp; ' + data1;
                        }
                    } 
                    for(const i of this.listDataReptilesLegend){
                        if (data1 == i){
                            data1 = '<img src="../../assets/reptiles.png" class="img-fluid" alt="" width="30" height="30">&nbsp; ' + data1;
                        }
                    } 
                    for(const i of this.listDataVivantLegend){
                        if (data1 == i){
                            data1 = '<img src="../../assets/autres-vivant.png" class="img-fluid" alt="" width="30" height="30">&nbsp; ' + data1;
                        }
                    }
                    for(const i of this.listDataNonVivantLegend){
                        if (data1 == i){
                            data1 = '<img src="../../assets/autres-non-vivant.png" class="img-fluid" alt="" width="30" height="30">&nbsp; ' + data1;
                        }
                    }
                    this.legende.remove(this.mymap);
                    let suppitemlegende = "<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + data1 + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ data2 + '"></p>';
                    console.log(suppitemlegende)
                    this.contentLegend = this.contentLegend.filter(function(g) { return g !== suppitemlegende }) // Et on supprime l'élément de l'array
                    let contents = [this.contents, this.contentLegend.join(" ")].join('');
                    this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
            }

            // suppression du panier
            this.arrayPanier = this.arrayPanier.filter(function(f) { return f !== data }) // Et on supprime l'élément de l'array
            //this.counter = this.counter - 1;
            this.counter = this.arrayPanier.length;
            for(const i of this.myarray){
                console.log(i.options.layers)
                if (data2 == i.options.layers){
                   // if (this.mymap.hasLayer(i)) {
                        this.mymap.removeLayer(i);
                        this.myarray = this.myarray.filter(function(f) { return f !== i })
                        console.log(this.myarray)
                        this.myarray2 =  this.myarray2.filter(function(f) { return f !== i.options.layers })
                   // }
                }  
            }
            this.testCompteurArray = this.testCompteurArray.filter(function(f) { return f !== data2 }) // Et on supprime l'élément de l'array

            // suppression de l'arborescence des données
            for (var i = 0; i < this.test_auto.length; i++) {
                if (this.test_auto[i].vue == data2)
                    this.test_auto[i].value2 = this.masterSelected;
            }
            for (var i = 0; i < this.test_group.length; i++) {
                if (this.test_group[i].vue == data2)
                    this.test_group[i].value2 = this.masterSelected;
            }


            // Check si l'array contient au moins une donnée
            let countArrayIfRemoveElements = this.myarray.length;
            if (countArrayIfRemoveElements < 1){
                this.activeButtonSelectData = 'no';
                this.etatIconPanier = 'inactif';
            } 
            
    }


    /* ---------- SELECTION D'UN SCENARIO ET CREATION DE L'ARRAY CORRESPONDANT ---------- */

    selectScenario(event: any){
        if (event.target.checked === true){ 
                this.nameScenario = event.target.value;
                // Créé l'array des différentes infos du scénario
                this.arrayScenario.push(this.nameScenario);
                this.activeButtonRunScenario = 'yes';

                // Reinitialise à zéro l'affichage des différentes couches scénarios
                for(const i of this.array_emp_sub){
                    this.mymap.removeLayer(i);  // ... on le supprime
                } 
        }
        else if (event.target.checked === false){ 
                this.activeButtonRunScenario = 'no';

        }
    }


  /* ---------- AFFICHAGE DES DONNEES RELATIVES AUX MODELES DE SUBMERSION  ---------- */


  selectSubmersion(event: any){

    // Test

        // légende
        for(const i of this.arrayPanier){
            if (i.split(";")[1].includes("group")){
                this.legende.remove(this.mymap);
                let suppitemlegende = '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + i.split(";")[1] + '&LEGEND_OPTIONS=forceLabels:on">';
                this.contentLegend = this.contentLegend.filter(function(f) { return f !== suppitemlegende }) // Et on supprime l'élément de l'array                                    
                let contents = [this.contents, this.contentLegend].join('');
                this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
                this.nomGroup = 'aucun';
            }
            else {
                for(const j of this.listDataFishLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/poissons.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                }
                for(const j of this.listDataFloreLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/herbacees.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                }
                for(const j of this.listDataAmphibiensLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/amphibiens.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataArthropodesLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/arthropodes.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataBenthosLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/benthos.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataOiseauxLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/oiseaux.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataReptilesLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/reptiles.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataVivantLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/autres-vivant.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataNonVivantLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/autres-non-vivant.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listNoLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = i.split(";")[0];
                    }
                } 

                this.legende.remove(this.mymap);
                let suppitemlegende = "<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + this.value222 + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ i.split(";")[1] + '"></p>';
                console.log(suppitemlegende)
                this.contentLegend = this.contentLegend.filter(function(g) { return g !== suppitemlegende }) // Et on supprime l'élément de l'array
                let contents = [this.contents, this.contentLegend.join(" ")].join('');
                this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
            }
        }

            // empty map
            for(const i of this.myarray){
                    if (this.mymap.hasLayer(i)) { // Si le WMS est bien sur la carte ...
                        this.mymap.removeLayer(i);  // ... on le supprime
                        this.myarray = this.myarray.filter(function(f) { return f !== i }) // Et on supprime l'élément de l'array
                    } 
            }

    if (event.target.checked === true){ 
        var data = event.target.name;

        if (data == 'fa_sc1_wet_areas_hiver' || data == 'fa_sc2_wet_areas_mblancs' || data == 'ta_sc1_wet_areas_mclassic' || data == 'ta_sc2_wet_areas_mfull' || data == 'mo_sc1_wet_areas_mvides' || data == 'mo_sc2_wet_areas_mblancs'){
            this.titreLegendeScenarios = 'Surfaces maximales en eau'
        }
        else if (data == 'fa_sc1_ouv_hiver' || data == 'fa_sc2_ouv_mblancs' || data == 'ta_sc_ouv' || data == 'mo_sc1_ouv_mvides' || data == 'mo_sc2_ouv_mblancs'){
            this.titreLegendeScenarios = 'Ouvrages hydrauliques'
        }
        else if (data == 'fa_sc1_subm_hiver' || data == 'fa_sc2_subm_mblancs' || data == 'ta_sc1_subm_mclassic' || data == 'ta_sc2_subm_mfull' || data == 'mo_sc1_subm_mvides' || data == 'mo_sc2_subm_mblancs'){
            this.titreLegendeScenarios = "Hauteurs d'eau maximales de submersion"
        }
        else if (data == 'fa_sc1_ressuyage_hiver' || data == 'fa_sc2_ressuyage_mblancs' || data == 'ta_sc1_ressuyage_mclassic' || data == 'ta_sc2_ressuyage_mfull' || data == 'mo_sc1_ressuyage_mvides' || data == 'mo_sc2_ressuyage_mblancs'){
            this.titreLegendeScenarios = "Temps de ressuyage"
        }
        else {}
        
        var layer = L.tileLayer.wms('https://data.pampas.univ-lr.fr/geoserver/pampas/wms', {layers: data ,format: 'image/png',transparent:true, zIndex: 1000});
        layer.addTo(this.mymap).bringToFront();
        this.arrayScenarioLayers.push(layer);
        this.legende.remove(this.mymap);
        this.contentLegend.push ("<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + this.titreLegendeScenarios + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ data + '"></p>');
        let contents = [this.contents, this.contentLegend.join(" ")].join('');
        this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
    }

    else if (event.target.checked === false){
        var data = event.target.name;
            for(const j of this.arrayScenarioLayers){
                if (data == j.options.layers){
                    if (this.mymap.hasLayer(j)) { // Si le WMS est bien sur la carte ...
                        this.mymap.removeLayer(j);
                    }
                }
            }
            this.legende.remove(this.mymap);
            let suppitemlegende = "<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + this.titreLegendeScenarios + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ data + '"></p>';
            this.contentLegend = this.contentLegend.filter(function(g) { return g !== suppitemlegende }) // Et on supprime l'élément de l'array
            let contents = [this.contents, this.contentLegend.join(" ")].join('');
            this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
        }

    else {}
  }

    /* ---------- LANCEMENT DES TRAITEMENTS RELATIFS AU CHOIX DU SCENARIO ---------- */

    
    runScenario(){

        this.scenariolance = 'yes';
        
        this.notifyService.showInfo("", "Paramétrage du scénario en cours")

        // Mise en place de la chaîne de caractères pour les méthodes postObjets2() & testPost()
        var selSite = this.selSite;
        var nameScenario = this.nameScenario.split('_')[1] + '_' + this.nameScenario.split('_')[2];
        var nameLayer = 'prod.resultats_' + this.token;
        var nameLayer2 = 'resultats_' + this.token;
        //alert (nameLayer2);

        // 1) Insertion libellés du panier dans une table temporaire
        // 2) Création des table via l'API de Geoserver
        // On fait un appel à l'API Post permettant de créer l'ensemble des tables.
        // Une fois le retour de l'API, si le contenu est yes, alors le bouton de lancement des traitements Geoserver apparaît.
         if (this.integrPanier == 'yes'){
          //  this._apiService.postObjets2(selSite, nameScenario, nameLayer)
            this.http.post('https://data.pampas.univ-lr.fr/node/runScenario', {selSite:selSite, nameScenario:nameScenario, nameLayer:nameLayer})
            .toPromise()
            .then(
              response => {     
                this.scenarioDone = response;
                this.scenarioDone = this.scenarioDone["data"];
                console.log(this.scenarioDone);    
                if (this.scenarioDone == 'yes'){
                    // Notification MAJ panier
                    this.notifyService.showSuccess("Vous pouvez lancer les traitements", "Paramétrage du scénario OK")
                    this.geoserverButton = 'yes';
                }            
              },
              error => {            
                console.log(error);
              });
            }
      } // fin de la méthode


      lancementGeos(){

        this.spinner.show();
        var nameLayer2 = 'resultats_' + this.token;
        // 3) Récupération du nombre de groupes distincts (= vues crées)
        // Une fois que c'est fait on boucle et on crée dans Geoserver autant de layers qu'il y a de vues
        // IL faudrait ici distinguer la création des layers (POST) du stylage (PUT) car les deux se confondent parfois...
        this._apiService.getGroupes(nameLayer2).then((data: any) =>
        {
          this.nbgroupes = data;       
          console.log(this.nbgroupes);  
          for (const i of this.nbgroupes) {
              //this.arrayResultScenario.push(i.groupe);
              console.log(i.groupe);
              // Envoi POST Geoserver 
              this.http.post('https://data.pampas.univ-lr.fr/node/fonction', {layer:nameLayer2 + '_' + i.groupe})
              .toPromise()
              .then(
                response => {           
                    this.geoserverDone = response;
                    this.geoserverDone = this.geoserverDone["data"];
                    if (this.geoserverDone == 'yes'){
                        this._apiService.stylePost(nameLayer2 + '_' + i.groupe);
                    }
                    else {
                        this.notifyService.showError("", "Erreurs dans la mise en place des traitements.")
                    }
                },
                error => {            
                console.log(error);
            });

              //this._apiService.testPost(nameLayer2 + '_' + i.groupe);
              //this._apiService.stylePost(nameLayer2 + '_' + i.groupe);
          } 
          
        //   for (const i of this.arrayResultScenario) {
        //     console.log(i)
        //     // 4) Création des vues sous Geoserver
        //     this._apiService.testPost(nameLayer2 + '_' + i);
        //     this._apiService.stylePost(nameLayer2 + '_' + i);
        //   }
           setTimeout(() => {
                /** spinner ends after 5 seconds */
                this.spinner.hide();
                // 5) 
                this.testGraph();
                this.testGraph2();
                this.testGraph3();
                this.testGraph4();
                this.testGraph5();
                this.testGraph6();
                this.endTraitements = 'yes'
                this.notifyService.showSuccess("Vos traitements ont bien été finalisés", "Fin des traitements")
                //
            }, 5000); 
        } // fin data
        ); // GET
          

      } // fin méthode


      majInterfaceResultats(){

        this.trackSpeed();


        if (this.geoserverButton == 'yes'){
      // Test Préalable
        for(const i of this.arrayPanier){
            if (i.split(";")[1].includes("group")){
                this.legende.remove(this.mymap);
                let suppitemlegende = '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + i.split(";")[1] + '&LEGEND_OPTIONS=forceLabels:on">';
                this.contentLegend = this.contentLegend.filter(function(f) { return f !== suppitemlegende }) // Et on supprime l'élément de l'array                                    
                let contents = [this.contents, this.contentLegend].join('');
                this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
                this.nomGroup = 'aucun';
            }
            else {
                for(const j of this.listDataFishLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/poissons.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                }
                for(const j of this.listDataFloreLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/herbacees.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                }
                for(const j of this.listDataAmphibiensLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/amphibiens.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataArthropodesLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/arthropodes.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataBenthosLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/benthos.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataOiseauxLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/oiseaux.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataReptilesLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/reptiles.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataVivantLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/autres-vivant.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listDataNonVivantLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = '<img src="../../assets/autres-non-vivant.png" class="img-fluid" alt="" width="30" height="30">&nbsp; '+ i.split(";")[0];
                    }
                } 
                for(const j of this.listNoLegend){
                    if (i.split(";")[0] == j){
                        this.value222 = i.split(";")[0];
                    }
                }
                this.legende.remove(this.mymap);
                let suppitemlegende = "<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + this.value222 + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ i.split(";")[1] + '"></p>';
                console.log(suppitemlegende)
                this.contentLegend = this.contentLegend.filter(function(g) { return g !== suppitemlegende }) // Et on supprime l'élément de l'array
                let contents = [this.contents, this.contentLegend.join(" ")].join('');
                this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
            }
        }

        // empty map
        for(const i of this.myarray){
            if (this.mymap.hasLayer(i)) { // Si le WMS est bien sur la carte ...
                this.mymap.removeLayer(i);  // ... on le supprime
                this.myarray = this.myarray.filter(function(f) { return f !== i }) // Et on supprime l'élément de l'array
            } 
        }

        for(const j of this.arrayScenarioLayers){
            let suppitemlegende = "<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + this.titreLegendeScenarios + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ j.options.layers + '"></p>';
            this.contentLegend = this.contentLegend.filter(function(g) { return g !== suppitemlegende }) // Et on supprime l'élément de l'array
            let contents2 = [this.contents, this.contentLegend.join(" ")].join('');
            this.legende = L.control.dialog(this.options).setContent(contents2).addTo(this.mymap);
            if (this.mymap.hasLayer(j)) { // Si le WMS est bien sur la carte ...
                this.mymap.removeLayer(j);
            }
        }

        
        // Affichage des hauteurs d'eau par défaut
        if (this.selSite == '1'){
            if (this.nameScenario == 'scenario_1_1'){
                this.data_hauteur_eau = 'fa_sc1_subm_hiver'
            }
            else if (this.nameScenario == 'scenario_1_2'){
                this.data_hauteur_eau = 'fa_sc2_subm_mblancs'
            }
            else {}
        }
        else if (this.selSite == '2'){
            if (this.nameScenario == 'scenario_2_1'){
                this.data_hauteur_eau = 'ta_sc1_subm_mclassic'
            }
            else if (this.nameScenario == 'scenario_2_2'){
                this.data_hauteur_eau = 'ta_sc2_subm_mfull'
            }
            else {}        
        }
        else if (this.selSite == '3'){
            if (this.nameScenario == 'scenario_3_1'){
                this.data_hauteur_eau = 'mo_sc1_subm_mvides'
            }
            else if (this.nameScenario == 'scenario_3_2'){
                this.data_hauteur_eau = 'mo_sc2_subm_mblancs'
            }
            else {}        
        }
        else {}
        
        if(this.arrayEtape3.length < 1){
            //var dataheau = L.tileLayer.wms('https://data.pampas.univ-lr.fr/geoserver/pampas/wms', {layers: this.data_hauteur_eau ,format: 'image/png',transparent:true}).addTo(this.mymap);
        
            // this.legende.remove(this.mymap);
            // this.contentLegend.push ("<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>Hauteurs d'eau</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ this.data_hauteur_eau + '"></p>');
            // let contents = [this.contents, this.contentLegend.join(" ")].join('');
            // this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
            //this.arrayEtape3.push (dataheau);
        }
        else {}
    }
    }

      selectResultGroup(event: any){

          var nameLayer2 = 'resultats_' + this.token + '_';
        // Affichage sur l'intyerface carto
        // si on coche...
        if (event.target.checked === true){ 
            var layerresultat = nameLayer2 + event.target.name;
            //alert (layerresultat);
            var layerresultat2 = L.tileLayer.wms('https://data.pampas.univ-lr.fr/geoserver/pampas/wms', {layers: layerresultat ,format: 'image/png',transparent:true});
            layerresultat2.addTo(this.mymap).addTo(this.mymap).bringToFront();
            this.arrayDataIndices.push(layerresultat2);
            this.arrayDataIndices = [...new Set(this.arrayDataIndices)];

            // Ajout du style dans la légende
            this.legende.remove(this.mymap);
            this.contentLegend.push ("<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>Indices de sensibilité</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ layerresultat + '"></p>');
            let contents = [this.contents, this.contentLegend.join(" ")].join('');
            this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
        }

        else if (event.target.checked === false){ 
            // si on décoche...
            var supp = nameLayer2 + event.target.name;
            for(const i of this.arrayDataIndices){
                if (supp == i.options.layers){
                    if (this.mymap.hasLayer(i)) { // Si le WMS est bien sur la carte ...
                        this.mymap.removeLayer(i);  // ... on le supprime
                        this.arrayDataIndices = this.arrayDataIndices.filter(function(f) { return f !== i }) // Et on supprime l'àƒÂ©làƒÂ©ment de l'array
                    } 
                }  
            }

            // Suppression du style dans la légende
            this.legende.remove(this.mymap);
            let suppitemlegende = "<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>Indices de sensibilité</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ supp + '"></p>';
            this.contentLegend = this.contentLegend.filter(function(g) { return g !== suppitemlegende }) // Et on supprime l'àƒÂ©làƒÂ©ment de l'array
            let contents = [this.contents, this.contentLegend.join(" ")].join('');
            this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
        }

    }


    reinitScenario(){
        this.scenarioDone = 'no';
        this.geoserverButton = 'no';
        this.endTraitements = 'no';
        this.reinitEtape3 = 'yes';
        this.endPhase3 = 'no';
        //this.activeButtonSelectData = 'no';
        this.reinitScenarioMsg = 'yes';
        this.userConclusion = '';
        this.integrPanier = 'no';

        for(const i of this.arrayDataIndices){
                if (this.mymap.hasLayer(i)) { // Si le WMS est bien sur la carte ...
                    this.mymap.removeLayer(i);  // ... on le supprime
                    this.arrayDataIndices = this.arrayDataIndices.filter(function(f) { return f !== i }) // Et on supprime l'àƒÂ©làƒÂ©ment de l'array
                } 
        
        // Suppression du style dans la légende
        this.legende.remove(this.mymap);
        let suppitemlegende = "<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>Indices de sensibilité</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ i.options.layers + '"></p>';
        this.contentLegend = this.contentLegend.filter(function(g) { return g !== suppitemlegende }) // Et on supprime l'àƒÂ©làƒÂ©ment de l'array
        let contents = [this.contents, this.contentLegend.join(" ")].join('');
        this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);
    }

    var selSite = this.selSite;
    var nameScenario = this.nameScenario.split('_')[1] + '_' + this.nameScenario.split('_')[2];
    var nameLayer = 'prod.resultats_' + this.token;
    this._apiService.deleteResultatsScenario(selSite, nameScenario, nameLayer);
    this.nbgroupes = []

    // Suppression affichage layer hauteur eau & légende associée 
    for(const i of this.arrayEtape3){

        this.legende.remove(this.mymap);
        let suppitemlegende = "<p style='font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif'><font size='3'>" + this.titreLegendeScenarios + "</font><br>" + '<img src="https://data.pampas.univ-lr.fr/geoserver/pampas/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER='+ i.options.layers + '"></p>';
        this.contentLegend = this.contentLegend.filter(function(g) { return g !== suppitemlegende }) // Et on supprime l'élément de l'array
        let contents = [this.contents, this.contentLegend.join(" ")].join('');
        this.legende = L.control.dialog(this.options).setContent(contents).addTo(this.mymap);

        if (this.mymap.hasLayer(i)) { // Si le WMS est bien sur la carte ...
            this.mymap.removeLayer(i);  // ... on le supprime
            this.arrayEtape3 = this.arrayEtape3.filter(function(f) { return f !== i }) // Et on supprime l'àƒÂ©làƒÂ©ment de l'array
        } 
    }

    this.isShowDiv0 = this.isShowDiv0;  
    for(const i of this.svgGraphs){
            this.svgGraphs = this.svgGraphs.filter(function(f) { return f !== i }) 
    }

    this.notifyService.showInfo("Vous pouvez lancer un second scénario sur votre site d'étude", "Vos résultats ont bien été effacés.")

}

    reinitAll(){
        // Réinitialisation complète //
        this.notifyService.showInfo("La réinitialisation de la plate-forme est en cours.", "Réinitialisation")
        this.scenarioDone = 'no';
        this.geoserverButton = 'no';
        this.endTraitements = 'no';
        this.videPanier();
        location.reload();
    }

    displayChartsAll(){
        console.log(this.speeds.toString())
        console.log(Number(this.speeds.toString()))
        this.actualSpeed = Number(this.speeds.toString())
        this.count0 = '';
        this.genereGraph = 'yes';
        this.finGraphs = 'en cours';

        // this.isShowDiv0 = !this.isShowDiv0;  
        console.log(this.svgGraphs)
        var arrayVerifGraph : any[] = [];
        var arrayVerifGraph2 : any[] = [];
        for (let i = 0; i < this.svgGraphs.length; i++) {
            //this._apiService.createPngs(this.svgGraphs[i]);
            this.http.post('https://data.pampas.univ-lr.fr/node/createpng', {base64chart1:this.svgGraphs[i], token:this.token})
            .toPromise()
            .then(
              response => {     
                this.creaGraphsDone = response;
                this.creaGraphsDone = this.creaGraphsDone["data"];
                arrayVerifGraph.push(this.creaGraphsDone)   
                console.log(arrayVerifGraph) 
                    if(arrayVerifGraph.length >3){
                        console.log("yes 4")
                        for (let i = 0; i < this.svgGraphsComp.length; i++) {
                            this.http.post('https://data.pampas.univ-lr.fr/node/createpngcomp', {base64chart1:this.svgGraphsComp[i], token:this.token})
                            .toPromise()
                            .then(
                            response => {     
                                this.creaGraphsCompDone = response;
                                this.creaGraphsCompDone = this.creaGraphsCompDone["data"];   
                                arrayVerifGraph2.push(this.creaGraphsCompDone)
                                console.log(arrayVerifGraph2.length) 
                                if((arrayVerifGraph2.length >2) && (arrayVerifGraph.length >3)){
                                    console.log("yes 3")
                                    this.finGraphs = 'yes';
                                        // this._apiService.getCountGraphs(this.token).then(data => 
                                        //     {
                                        //         this.count0 = JSON.stringify(data);
                                        //         this.count0 = Number(this.count0.split(':')[1].split(',')[0])
                                        //         console.log(this.count0)
                                        // });
                                    }
                            },
                            error => {            
                                console.log(error);
                            });
                            }
                        }         
              },
              error => {            
                console.log(error);
              });
            }
    }



///////////   GRAPHS FONCTIONS PATRIMONIALES  ////////
    async testGraph() {

        function getFields(input:any, val:any) {
             var output :any [] = [];
              for (var i=0; i < input.length ; ++i)
                if(input[i]['city'] == val){
                var testa = input[i]['name'];
                var testb = parseFloat(input[i]['y']);
                output.push ({
                name: testa,	
                y: testb
                });
              }        
              return output;
            }

            this._apiService.getStatsGraph(this.token).then(data => 
        {

        // Traitements //
        this.resgraph = data;
        console.log(this.resgraph);
        
        let limit = this.resgraph.length;

        // reinitialisation
        this.objetArr = [];
        this.arrayLib = [];
        this.arrayMoyIndices = [];

        for (var i = 0; i < limit; i++){
            console.log(i);
            let objet = this.resgraph[i].objet;
            this.objetArr.push(objet);
            let fct = this.resgraph[i].fct2;
            this.fctArr.push(fct);
            this.arrayLib.push('<b>' + fct +'</b><br>' + objet);
            let moyindice = this.resgraph[i].avgmilage;
            this.moyindiceArr.push(moyindice);
            this.arrayMoyIndices.push(parseFloat(moyindice));
        };    

        console.log (this.arrayLib);
        console.log (this.arrayMoyIndices);
        console.log(this.fctArr);

        type GroupedData = {
            [key: string]: {
            total: number;
            count: number;          
            };
          }
        const data1 = this.resgraph;
        const grouped: GroupedData = data1.reduce((r:any, { fct2, avgmilage }: { fct2: string; avgmilage: number }) => {
        r[fct2] ??= { total: 0, count: 0 };
        r[fct2].total += +avgmilage;
        r[fct2].count++;
        return r;
        }, {} as GroupedData);
              
        const result = Object.fromEntries(Object
                .entries(grouped)
                .map(([key, { total, count }]) => [key, total / count])
        );

        for (const [a, b] of Object.entries(result)) {
            this.myarray1.push(b)
            this.myarray0.push(a)
        }
        
        console.log(this.myarray0);
       
        var ctr = 0;
        // DEBUT DE LA BOUCLE
          for(var i = 0; i < this.myarray0.length; i++){
        console.log(this.myarray0[i] + "/" + this.myarray1[i] + "/" + this.myarray0[i]);
         // Dataseries OK
          this.dataseries.push({
            name: this.myarray0[i],		
            y: this.myarray1[i],				
            drilldown: this.myarray0[i]	
          });

          var counts : any[] = []
          for (var x = 0; x < this.resgraph.length; x++) {
            counts[this.resgraph[x].fct2] = 1 + (counts[this.resgraph[x].fct2] || 0);
          }

          // console.log(this.myarray0[i]); gives environnementale puis culturelle puis productive

          // datadrill_data
          for(var ctr = 0; ctr < this.fctArr.length; ctr++){
            console.log(this.myarray0[i] + "/" + this.fctArr[ctr]);
            if(this.myarray0[i] == this.fctArr[ctr]){
              console.log(this.fctArr[ctr] + "/" + this.objetArr[ctr] + "/" + this.moyindiceArr[ctr]);
              this.datadrill_data.push({
                city: this.fctArr[ctr],		
                name: this.objetArr[ctr],		
                y: this.moyindiceArr[ctr]		
              });
            }
          }         

          this.datadrill.push({
            name: this.myarray0[i],			
            id: this.myarray0[i],			
            type: 'column',
            data: getFields(this.datadrill_data, this.myarray0[i])
          });


        } // FIN DE LA BOUCLE

        console.log(this.datadrill);

      
        ///////////////////////////////////////////////
        const origChartWidth = 700, origChartHeight = 500;
        
        // Graph nÂ°2 //
        // let stock = new Chart({
        const chart2 =  Highcharts.chart('stock',{
            chart: {
                width: origChartWidth,
                height: origChartHeight,
                polar: true,
                type: 'line'
            },
        
            title: {
                text: 'Indices de sensibilité par objet patrimonial'
            },
            credits: {
                enabled: false
              },
            subtitle: {
                text: 'selon les fonctions patrimoniales<br>&nbsp;'
            },
        
            pane: {
                size: '90%',
            },
        
            xAxis: {
                labels: {
                    reserveSpace: true,
                        style: {
                            fontSize:'12px'
                        }
                    },
                    categories: this.arrayLib,
                    tickmarkPlacement: 'on',
                    lineWidth: 0
            },
        
            yAxis: {
                gridLineInterpolation: 'polygon',
                min: 0,
                max: 3,
                tickInterval: 1,
                labels: {
                    style: {
                      color: '#000000',
                      fontSize: '12px'
                    }
                },
                plotBands: [{
                    color: 'rgba(25, 243, 50 ,0.5)', // Color value
                    from: 0, // Start of the plot band
                    to: 0.5 // End of the plot band
                  }, {
                    color: 'rgba(206, 203, 188,0.5)',
                    from: 0.5,
                    to: 1.5
                  }, {
                    color: 'rgba(255, 147, 32,0.5)',
                    from: 1.5,
                    to: 2.5
                  },
                    {   color: 'rgba(243,20,87,0.5)',
                    from: 2.5,
                    to: 3
                  }       
                ]
            },
        
            series: [{
                type: 'line',
                //name: 'Line',
                color: '#ff0000',
                data: this.arrayMoyIndices,
                marker: {
                    radius: 3
                  },
            }]
          });

          // Graph nÂ°3 //
          //let bar = new Chart({
          const chart3 =  Highcharts.chart('bar',{
            chart: {
                type: 'column'
              },
              title: {
                text: 'Indices de sensibilité par fonction patrimoniale et objet patrimonial'
             },
             credits: {
                enabled: false
              },
              xAxis: {
                type: 'category'
              },
              series: [{
                name: 'Retour aux fonctions',
                type: 'column',
                colorByPoint: true,
                data: this.dataseries
              }],
              drilldown: {
                series: this.datadrill
              }
            })
 
        // Déclaration des graphiques en lien avec traitements.html

       // this.stock = stock; // Indices de sensibilité par objet patrimonial //   
       // this.bar = bar; // Indices de sensibilité par fonction et objet //

      var svg2 = chart2.getSVG()
      console.log(svg2)    
      this.svgGraphs.push(svg2)

      var svg3 = chart3.getSVG()
      this.svgGraphs.push(svg3)
    
    }); 


    this.etatGraph1 = 'yes';
    }


    async testGraph2() {
        
        if (this.etatGraph1 = 'yes'){
        this._apiService.getStatsGraph1(this.token).then(data => 
            {
            // Traitements //
            this.resgraph = data;
            //this.resgraph = this.resgraph["message"];
            
            let limit = this.resgraph.length;

            var fctArr :any [] = [];
            for (var i = 0; i < limit; i++){
                let fct = this.resgraph[i].fct;
                fctArr.push(fct);
            }

            var countArr :any [] = [];
            var avgArr :any [] = [];
            var dispArr :any [] = [];
            var amelArr :any [] = [];
            var zero = 0;
            var un = 1;
            for (var i = 0; i < limit; i++){
                let count = this.resgraph[i].count;
                let avg = this.resgraph[i].avg;
                let disp = this.resgraph[i].nb_disparition;
                this.objetsIpDisp = this.resgraph[i].nb_disparition;
                let amel = this.resgraph[i].nb_ameliore;
                countArr.push([i, zero, parseFloat(count)]);
                avgArr.push([i, un, parseFloat(avg)]);
                dispArr.push(parseFloat(disp));
                amelArr.push(parseFloat(amel));
            }

            var dispArrTotal = dispArr.reduce((a, b) => a + b, 0)
            this.objetsIpDisp_2 = dispArrTotal
            console.log(dispArr)
            var amelArrTotal = amelArr.reduce((a, b) => a + b, 0)

        // Graph nÂ°1a //
        function getPointCategoryName(point:any, dimension:any) {
            var series = point.series,
                isY = dimension === 'y',
                axis = series[isY ? 'yAxis' : 'xAxis'];
            return axis.categories[point[isY ? 'y' : 'x']];
        }

        //let heatmap = new Chart({
        const chart1a =  Highcharts.chart('heatmap',{    
            chart: {
                type: 'heatmap',
                marginTop: 80,
                marginBottom: 10,
                plotBorderWidth: 1,
                width: 700,
                height: 300,
            },
        
            credits: {
                enabled: false
            },

            title: {
                text: 'Synthèse de votre analyse'
            },
        
            xAxis: {
                categories: fctArr,
                opposite:true,
            },
        
            yAxis: {
                categories: ['Nb objets IP', 'Moyenne indice <br>de sensibilité'],
                reversed: true,

            },
        
            accessibility: {
                point: {
                    descriptionFormatter: function (point) {
                        var ix = point.index + 1,
                            xName = getPointCategoryName(point, 'x'),
                            yName = getPointCategoryName(point, 'y'),
                            val = point.value;
                        return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
                    }
                }
            },
        
            colorAxis: [{
                minColor: '#ffffff',
                maxColor: '#ffffff'
              },
              {
                minColor: '#ffffff',
                maxColor: '#ffffff'
              }
            ],
        
            legend: {
                enabled: false
               },
        
            tooltip: {
                formatter: function () {
                    return '<b>' + getPointCategoryName(this.point, 'x') + '</b> sold <br><b>' +
                        this.point.value + '</b> items on <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
                }
            },
        
            series: [{
                type: 'heatmap',
                name: 'Sales per employee',
                borderWidth: 1,
                borderColor: 'grey',
                data : countArr,
                dataLabels: {
                    enabled: true,
                    style : {fontSize: 16+'px', textOutline: 'none' },
                    color: '#000000',
                }
            },
            {
            colorAxis: 1,
            data : avgArr,
            type: 'heatmap',
            borderWidth: 1,
            borderColor: 'grey',            
            dataLabels: {
                enabled: true,
                style : {fontSize: 16+'px', textOutline: 'none' },
                color: '#000000'
            }
            }      
        
        ],
        });

          // Graph nÂ°1b //
       // let heatmap2 = new Chart({
        const chart1b =  Highcharts.chart('heatmap2',{    
            chart: {
                type: 'heatmap',
                marginTop: 80,
                marginBottom: 10,
                plotBorderWidth: 1,
                width: 400,
                height: 200,
            },
        
        
            title: {
                text: ''
            },

            credits: {
                enabled: false
            },

            xAxis: {
                categories: ['Disparition', 'Amélioration'],
                opposite:true
            },
        
            yAxis: {
                categories: ['Nb objets IP'],
                reversed: true,
            },
        
            accessibility: {
                point: {
                    descriptionFormatter: function (point) {
                        var ix = point.index + 1,
                            xName = getPointCategoryName(point, 'x'),
                            yName = getPointCategoryName(point, 'y'),
                            val = point.value;
                        return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
                    }
                }
            },
        
            colorAxis: [{
                minColor: '#f31457',
                maxColor: '#f31457'
              },
              {
                minColor: '#47f78a',
                maxColor: '#47f78a'
              }
            ],
        
            legend: {
                enabled: false
               },
        
            tooltip: {
                formatter: function () {
                    return '<b>' + getPointCategoryName(this.point, 'x') + '</b> sold <br><b>' +
                        this.point.value + '</b> items on <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
                }
            },
        
            series: [{
                type: 'heatmap',
                name: 'Sales per employee',
                borderWidth: 1,
                borderColor: 'grey',   
                data : [[0,0, dispArrTotal]],
                dataLabels: {
                    enabled: true,
                    style : {fontSize: 16+'px', textOutline: 'none'},
                    color: '#000000'
                }
            },
            {
            colorAxis: 1,
            type: 'heatmap',
            name: 'Sales per employee',
            borderWidth: 1,
            borderColor: 'grey',   
            data : [[1,0,amelArrTotal]],
            dataLabels: {
                enabled: true,
                style : {fontSize: 16+'px', textOutline: 'none'},
                color: '#000000'
            }
        }        
        ],
        });
        // Tableau de bord de votre sélection //
       // this.heatmap = heatmap;
       // this.heatmap2 = heatmap2;

       var svg1a = chart1a.getSVG()
       this.svgGraphs.push(svg1a)


    });

    this._apiService.getStatsGraph2(this.token).then(data => 
        {
        // Traitements //
        this.resgraph = data;
        //this.resgraph = this.resgraph["message"];
            
        let limit = this.resgraph.length;

        var etatArr :any [] = [];
        var fctArr :any [] = [];
        for (var i = 0; i < limit; i++){
            let fct = this.resgraph[i].fct;
            let etat_init = parseFloat(this.resgraph[i].etat_initial);
            let etat_fin = parseFloat(this.resgraph[i].etat_final);
            etatArr.push([etat_init, etat_fin]);
            fctArr.push(fct);
        }
        var sankeyArr :any [] = [];
        for (var j = 0; j < etatArr.length; j++){
            sankeyArr.push({
                type: 'area',
                name: fctArr[j],
                data: etatArr[j]
              });
        }
        console.log(sankeyArr)

        // Graph 4
        //let sankey = new Chart({
        const chart4 =  Highcharts.chart('sankey',{    
            chart: {
                type: 'area'
            },
            tooltip: {
                enabled: false
            },
            title: {
                useHTML: true,
                text: 'Evolution état initial/état final des fonctions patrimoniales',
                align: 'left'
            },
            credits: {
                enabled: false
              },
            subtitle: {
                text: ''
            },
            xAxis: {
        
                labels: {
                    enabled: false
                },
                tickLength: 0
            },
            yAxis: {
                title: {
                    text : ''
                }
            },
            // tooltip: {
            //     pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.value:.1f}</b> ({point.y:,.1f})<br/>',
            //     split: true
            // },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    marker: {
                        enabled: false
                    }
                }
            },
            series : sankeyArr
    });

    var svg4 = chart4.getSVG()
    this.svgGraphs.push(svg4)

        // Evolution avant/après de l'état des fonctions //
        //this.sankey = sankey;
});

}
}


///////////   GRAPHS COMPOSANTES  ////////

async testGraph3() {

    function getFields(input:any, val:any) {
         var output :any [] = [];
          for (var i=0; i < input.length ; ++i)
            if(input[i]['city'] == val){
            var testa = input[i]['name'];
            var testb = parseFloat(input[i]['y']);
            output.push ({
            name: testa,	
            y: testb
            });
          }        
          return output;
        }

        this._apiService.getStatsGraphComp(this.token).then(data => 
    {

    // Traitements //
    this.resgraph = data;
    console.log(this.resgraph);
    
    let limit = this.resgraph.length;

    for (var i = 0; i < limit; i++){
        let objet = this.resgraph[i].objet;
        this.objetArr_C.push(objet);
        let comp2 = this.resgraph[i].comp2;
        this.fctArr_C.push(comp2);
        this.arrayLib_C.push('<b>' + comp2 +'</b><br>' + objet);
        let moyindice = this.resgraph[i].avgmilage;
        this.moyindiceArr_C.push(moyindice);
        this.arrayMoyIndices_C.push(parseFloat(moyindice));
    };    

    type GroupedData = {
        [key: string]: {
        total: number;
        count: number;          
        };
      }
    const data1 = this.resgraph;
    const grouped: GroupedData = data1.reduce((r:any, { comp2, avgmilage }: { comp2: string; avgmilage: number }) => {
    r[comp2] ??= { total: 0, count: 0 };
    r[comp2].total += +avgmilage;
    r[comp2].count++;
    return r;
    }, {} as GroupedData);
          
    const result = Object.fromEntries(Object
            .entries(grouped)
            .map(([key, { total, count }]) => [key, total / count])
    );

    for (const [a, b] of Object.entries(result)) {
        this.myarray1_C.push(b)
        this.myarray0_C.push(a)
    }
    
    var ctr = 0;
    for(var i = 0; i < this.myarray0_C.length; i++){
      this.dataseries_C.push({
        name: this.myarray0_C[i],		
        y: this.myarray1_C[i],				
        drilldown: this.myarray0_C[i]	
      });

      var counts : any[] = []
      for (var x = 0; x < this.resgraph.length; x++) {
        counts[this.resgraph[x].comp2] = 1 + (counts[this.resgraph[x].comp2] || 0);
      }

      for(var ctr = 0; ctr < this.fctArr_C.length; ctr++){
        if(this.myarray0_C[i] == this.fctArr_C[ctr]){
          this.datadrill_data_C.push({
            city: this.fctArr_C[ctr],		
            name: this.objetArr_C[ctr],		
            y: this.moyindiceArr_C[ctr]		
          });
        }
      }         

      this.datadrill_C.push({
        name: this.myarray0_C[i],			
        id: this.myarray0_C[i],			
        type: 'column',
        data: getFields(this.datadrill_data_C, this.myarray0_C[i])
      });


    }

    console.log(this.datadrill_C);

  
    ///////////////////////////////////////////////
    const origChartWidth = 700, origChartHeight = 500;
    
    // Graph nÂ°2 //
    //let stock_2 = new Chart({
    const chart2_2 =  Highcharts.chart('stock_2',{

        chart: {
            width: origChartWidth,
            height: origChartHeight,
            polar: true,
            type: 'line'
        },
    
        title: {
            text: 'Indices de sensibilité par objet patrimonial'
        },
        credits: {
            enabled: false
          },
        subtitle: {
            text: 'selon les composantes patrimoniales<br>&nbsp;'
        },
    
        pane: {
            size: '90%',
        },
    
        xAxis: {
            labels: {
                reserveSpace: true,
                    style: {
                        fontSize:'12px'
                    }
                },
                categories: this.arrayLib_C,
                tickmarkPlacement: 'on',
                lineWidth: 0
        },
    
        yAxis: {
            gridLineInterpolation: 'polygon',
            min: 0,
            max: 3,
            tickInterval: 1,
            labels: {
                style: {
                  color: '#000000',
                  fontSize: '12px'
                }
            },
            plotBands: [{
                color: 'rgba(25, 243, 50 ,0.5)', // Color value
                from: 0, // Start of the plot band
                to: 0.5 // End of the plot band
              }, {
                color: 'rgba(206, 203, 188,0.5)',
                from: 0.5,
                to: 1.5
              }, {
                color: 'rgba(255, 147, 32,0.5)',
                from: 1.5,
                to: 2.5
              },
                {   color: 'rgba(243,20,87,0.5)',
                from: 2.5,
                to: 3
              }       
            ]
        },
    
        series: [{
            type: 'line',
            name: 'Line',
            color: '#ff0000',
            data: this.arrayMoyIndices_C,
            marker: {
                radius: 3
              },
        }]
      });

      // Graph nÂ°3 //
      // let bar_2 = new Chart({
       const chart3_2 =  Highcharts.chart('bar_2',{

        chart: {
            type: 'column'
          },
          title: {
            text: 'Indices de sensibilité par composante patrimoniale et objet patrimonial'
         },
         credits: {
            enabled: false
          },
          xAxis: {
            type: 'category'
          },
          series: [{
            name: 'Retour aux composantes',
            type: 'column',
            colorByPoint: true,
            data: this.dataseries_C
          }],
          drilldown: {
            series: this.datadrill_C
          }
        })

    // Déclaration des graphiques en lien avec traitements.html
    // this.stock_2 = stock_2;
    // this.bar_2 = bar_2;

    var svg2_2 = chart2_2.getSVG()
    this.svgGraphsComp.push(svg2_2)
    var svg3_2 = chart3_2.getSVG()
    this.svgGraphsComp.push(svg3_2)
    
    }); 
this.etatGraph1 = 'yes';
}


async testGraph4() {
        
    if (this.etatGraph1 = 'yes'){
    this._apiService.getStatsGraphComp1(this.token).then(data => 
        {
        // Traitements //
        this.resgraph = data;
        //this.resgraph = this.resgraph["message"];
        
        let limit = this.resgraph.length;

        var fctArr :any [] = [];
        for (var i = 0; i < limit; i++){
            let composante = this.resgraph[i].composante;
            fctArr.push(composante);
        }

        var countArr :any [] = [];
        var avgArr :any [] = [];
        var dispArr :any [] = [];
        var amelArr :any [] = [];
        var zero = 0;
        var un = 1;
        for (var i = 0; i < limit; i++){
            let count = this.resgraph[i].count;
            let avg = this.resgraph[i].avg;
            let disp = this.resgraph[i].nb_disparition;
            this.objetsIpDisp = this.resgraph[i].nb_disparition;
            let amel = this.resgraph[i].nb_ameliore;
            countArr.push([i, zero, parseFloat(count)]);
            avgArr.push([i, un, parseFloat(avg)]);
            dispArr.push(parseFloat(disp));
            amelArr.push(parseFloat(amel));
        }

        var dispArrTotal = dispArr.reduce((a, b) => a + b, 0)
        var amelArrTotal = amelArr.reduce((a, b) => a + b, 0)

    // Graph nÂ°1a //
    function getPointCategoryName(point:any, dimension:any) {
        var series = point.series,
            isY = dimension === 'y',
            axis = series[isY ? 'yAxis' : 'xAxis'];
        return axis.categories[point[isY ? 'y' : 'x']];
    }

    //let heatmap_2 = new Chart({
    const chart1_2a =  Highcharts.chart('heatmap_2',{

        chart: {
            type: 'heatmap',
            marginTop: 80,
            marginBottom: 10,
            plotBorderWidth: 1,
            width: 700,
            height: 300,
        },
    
        credits: {
            enabled: false
        },

        title: {
            text: 'Synthèse de votre analyse'
        },
    
        xAxis: {
            categories: fctArr,
            opposite:true,
        },
    
        yAxis: {
            categories: ['Nb objets IP', 'Moyenne indice <br>de sensibilité'],
            reversed: true,

        },
    
        accessibility: {
            point: {
                descriptionFormatter: function (point) {
                    var ix = point.index + 1,
                        xName = getPointCategoryName(point, 'x'),
                        yName = getPointCategoryName(point, 'y'),
                        val = point.value;
                    return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
                }
            }
        },
    
        colorAxis: [{
            minColor: '#ffffff',
            maxColor: '#ffffff'
          },
          {
            minColor: '#ffffff',
            maxColor: '#ffffff'
          }
        ],
    
        legend: {
            enabled: false
           },
    
        tooltip: {
            formatter: function () {
                return '<b>' + getPointCategoryName(this.point, 'x') + '</b> sold <br><b>' +
                    this.point.value + '</b> items on <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
            }
        },
    
        series: [{
            type: 'heatmap',
            name: 'Sales per employee',
            borderWidth: 1,
            borderColor: 'grey',
            data : countArr,
            dataLabels: {
                enabled: true,
                style : {fontSize: 16+'px', textOutline: 'none' },
                color: '#000000',
            }
        },
        {
        colorAxis: 1,
        data : avgArr,
        type: 'heatmap',
        borderWidth: 1,
        borderColor: 'grey',            
        dataLabels: {
            enabled: true,
            style : {fontSize: 16+'px', textOutline: 'none' },
            color: '#000000'
        }
        }      
    
    ],
    });

      // Graph nÂ°1b //
    // let heatmap2_2 = new Chart({
    const chart1_2b =  Highcharts.chart('heatmap_2_2',{

        chart: {
            type: 'heatmap',
            marginTop: 80,
            marginBottom: 10,
            plotBorderWidth: 1,
            width: 400,
            height: 200,
        },
    
    
        title: {
            text: ''
        },

        credits: {
            enabled: false
        },

        xAxis: {
            categories: ['Disparition', 'Amélioration'],
            opposite:true
        },
    
        yAxis: {
            categories: ['Nb objets IP'],
            reversed: true,
        },
    
        accessibility: {
            point: {
                descriptionFormatter: function (point) {
                    var ix = point.index + 1,
                        xName = getPointCategoryName(point, 'x'),
                        yName = getPointCategoryName(point, 'y'),
                        val = point.value;
                    return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
                }
            }
        },
    
        colorAxis: [{
            minColor: '#f31457',
            maxColor: '#f31457'
          },
          {
            minColor: '#47f78a',
            maxColor: '#47f78a'
          }
        ],
    
        legend: {
            enabled: false
           },
    
        tooltip: {
            formatter: function () {
                return '<b>' + getPointCategoryName(this.point, 'x') + '</b> sold <br><b>' +
                    this.point.value + '</b> items on <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
            }
        },
    
        series: [{
            type: 'heatmap',
            name: 'Sales per employee',
            borderWidth: 1,
            borderColor: 'grey',   
            data : [[0,0, dispArrTotal]],
            dataLabels: {
                enabled: true,
                style : {fontSize: 16+'px', textOutline: 'none'},
                color: '#000000'
            }
        },
        {
            colorAxis : 1,
            type: 'heatmap',
            name: 'Sales per employee',
            borderWidth: 1,
            borderColor: 'grey',   
            data : [[1,0,amelArrTotal]],
            dataLabels: {
                enabled: true,
                style : {fontSize: 16+'px', textOutline: 'none'},
                color: '#000000'
            }
        }    
    ],
    });
    //this.heatmap_2 = heatmap_2;
    // this.heatmap2_2 = heatmap_2;
    var svg1_2a = chart1_2a.getSVG()
    this.svgGraphsComp.push(svg1_2a)
});

}
}


///////////   GRAPHS FCTS ECOLOGIQUES  ////////

async testGraph5() {

    function getFields(input:any, val:any) {
         var output :any [] = [];
          for (var i=0; i < input.length ; ++i)
            if(input[i]['city'] == val){
            var testa = input[i]['name'];
            var testb = parseFloat(input[i]['y']);
            output.push ({
            name: testa,	
            y: testb
            });
          }        
          return output;
        }

        this._apiService.getStatsGraphEcol(this.token).then(data => 
    {

    // Traitements //
    this.resgraph = data;
    console.log(this.resgraph);
    
    let limit = this.resgraph.length;

    for (var i = 0; i < limit; i++){
        let objet = this.resgraph[i].objet;
        this.objetArr_E.push(objet);
        let fct_ecol = this.resgraph[i].fct_ecol;
        this.fctArr_E.push(fct_ecol);
        this.arrayLib_E.push('<b>' + fct_ecol +'</b><br>' + objet);
        let moyindice = this.resgraph[i].avgmilage;
        this.moyindiceArr_E.push(moyindice);
        this.arrayMoyIndices_E.push(parseFloat(moyindice));
    };    

    type GroupedData = {
        [key: string]: {
        total: number;
        count: number;          
        };
      }
    const data1 = this.resgraph;
    const grouped: GroupedData = data1.reduce((r:any, { fct_ecol, avgmilage }: { fct_ecol: string; avgmilage: number }) => {
    r[fct_ecol] ??= { total: 0, count: 0 };
    r[fct_ecol].total += +avgmilage;
    r[fct_ecol].count++;
    return r;
    }, {} as GroupedData);
          
    const result = Object.fromEntries(Object
            .entries(grouped)
            .map(([key, { total, count }]) => [key, total / count])
    );

    for (const [a, b] of Object.entries(result)) {
        this.myarray1_E.push(b)
        this.myarray0_E.push(a)
    }
    
    var ctr = 0;
    for(var i = 0; i < this.myarray0_E.length; i++){
      this.dataseries_E.push({
        name: this.myarray0_E[i],		
        y: this.myarray1_E[i],				
        drilldown: this.myarray0_E[i]	
      });

      var counts : any[] = []
      for (var x = 0; x < this.resgraph.length; x++) {
        counts[this.resgraph[x].fct_ecol] = 1 + (counts[this.resgraph[x].fct_ecol] || 0);
      }

      for(var ctr = 0; ctr < this.fctArr_E.length; ctr++){
        if(this.myarray0_E[i] == this.fctArr_E[ctr]){
          this.datadrill_data_E.push({
            city: this.fctArr_E[ctr],		
            name: this.objetArr_E[ctr],		
            y: this.moyindiceArr_E[ctr]		
          });
        }
      }         

      this.datadrill_E.push({
        name: this.myarray0_E[i],			
        id: this.myarray0_E[i],			
        type: 'column',
        data: getFields(this.datadrill_data_E, this.myarray0_E[i])
      });


    }

    console.log(this.datadrill_E);

  
    ///////////////////////////////////////////////
    const origChartWidth = 700, origChartHeight = 500;
    
    // Graph nÂ°2 //
    //let stock_2 = new Chart({
    const chart2_3 =  Highcharts.chart('stock_3',{

        chart: {
            width: origChartWidth,
            height: origChartHeight,
            polar: true,
            type: 'line'
        },
    
        title: {
            text: 'Indices de sensibilité par objet patrimonial'
        },
        credits: {
            enabled: false
          },
        subtitle: {
            text: 'selon les fonctions écologiques<br>&nbsp;'
        },
    
        pane: {
            size: '90%',
        },
    
        xAxis: {
            labels: {
                reserveSpace: true,
                    style: {
                        fontSize:'12px'
                    }
                },
                categories: this.arrayLib_E,
                tickmarkPlacement: 'on',
                lineWidth: 0
        },
    
        yAxis: {
            gridLineInterpolation: 'polygon',
            min: 0,
            max: 3,
            tickInterval: 1,
            labels: {
                style: {
                  color: '#000000',
                  fontSize: '12px'
                }
            },
            plotBands: [{
                color: 'rgba(25, 243, 50 ,0.5)', // Color value
                from: 0, // Start of the plot band
                to: 0.5 // End of the plot band
              }, {
                color: 'rgba(206, 203, 188,0.5)',
                from: 0.5,
                to: 1.5
              }, {
                color: 'rgba(255, 147, 32,0.5)',
                from: 1.5,
                to: 2.5
              },
                {   color: 'rgba(243,20,87,0.5)',
                from: 2.5,
                to: 3
              }       
            ]
        },
    
        series: [{
            type: 'line',
            name: 'Line',
            color: '#ff0000',
            data: this.arrayMoyIndices_E,
            marker: {
                radius: 3
              },
        }]
      });

      // Graph nÂ°3 //
      // let bar_2 = new Chart({
       const chart3_3 =  Highcharts.chart('bar_3',{

        chart: {
            type: 'column'
          },
          title: {
            text: 'Indices de sensibilité par fonction écologique et objet patrimonial'
         },
         credits: {
            enabled: false
          },
          xAxis: {
            type: 'category'
          },
          series: [{
            name: 'Retour aux fonctions écologiques',
            type: 'column',
            colorByPoint: true,
            data: this.dataseries_E
          }],
          drilldown: {
            series: this.datadrill_E
          }
        })

    // Déclaration des graphiques en lien avec traitements.html
    // this.stock_2 = stock_2;
    // this.bar_2 = bar_2;

    
    }); 
this.etatGraph1 = 'yes';
}


async testGraph6() {
        
    if (this.etatGraph1 = 'yes'){
    this._apiService.getStatsGraphEcol1(this.token).then(data => 
        {
        // Traitements //
        this.resgraph = data;
        //this.resgraph = this.resgraph["message"];
        
        let limit = this.resgraph.length;

        var fctArr :any [] = [];
        for (var i = 0; i < limit; i++){
            let fct_ecol = this.resgraph[i].fct_ecol;
            fctArr.push(fct_ecol);
        }

        console.log(fctArr)

        var countArr :any [] = [];
        var avgArr :any [] = [];
        var dispArr :any [] = [];
        var amelArr :any [] = [];
        var zero = 0;
        var un = 1;
        for (var i = 0; i < limit; i++){
            let count = this.resgraph[i].count;
            let avg = this.resgraph[i].avg;
            let disp = this.resgraph[i].nb_disparition;
            this.objetsIpDisp = this.resgraph[i].nb_disparition;
            let amel = this.resgraph[i].nb_ameliore;
            countArr.push([i, zero, parseFloat(count)]);
            avgArr.push([i, un, parseFloat(avg)]);
            dispArr.push(parseFloat(disp));
            amelArr.push(parseFloat(amel));
        }

        var dispArrTotal = dispArr.reduce((a, b) => a + b, 0)
        var amelArrTotal = amelArr.reduce((a, b) => a + b, 0)

    // Graph nÂ°1a //
    function getPointCategoryName(point:any, dimension:any) {
        var series = point.series,
            isY = dimension === 'y',
            axis = series[isY ? 'yAxis' : 'xAxis'];
        return axis.categories[point[isY ? 'y' : 'x']];
    }

    //let heatmap_2 = new Chart({
    const chart1_3a =  Highcharts.chart('heatmap_3',{

        chart: {
            type: 'heatmap',
            marginTop: 80,
            marginBottom: 10,
            plotBorderWidth: 1,
            width: 700,
            height: 300,
        },
    
        credits: {
            enabled: false
        },

        title: {
            text: 'Synthèse de votre analyse'
        },
    
        xAxis: {
            categories: fctArr,
            opposite:true,
        },
    
        yAxis: {
            categories: ['Nb objets IP', 'Moyenne indice <br>de sensibilité'],
            reversed: true,

        },
    
        accessibility: {
            point: {
                descriptionFormatter: function (point) {
                    var ix = point.index + 1,
                        xName = getPointCategoryName(point, 'x'),
                        yName = getPointCategoryName(point, 'y'),
                        val = point.value;
                    return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
                }
            }
        },
    
        colorAxis: [{
            minColor: '#ffffff',
            maxColor: '#ffffff'
          },
          {
            minColor: '#ffffff',
            maxColor: '#ffffff'
          }
        ],
    
        legend: {
            enabled: false
           },
    
        tooltip: {
            formatter: function () {
                return '<b>' + getPointCategoryName(this.point, 'x') + '</b> sold <br><b>' +
                    this.point.value + '</b> items on <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
            }
        },
    
        series: [{
            type: 'heatmap',
            name: 'Sales per employee',
            borderWidth: 1,
            borderColor: 'grey',
            data : countArr,
            dataLabels: {
                enabled: true,
                style : {fontSize: 16+'px', textOutline: 'none' },
                color: '#000000',
            }
        },
        {
        colorAxis: 1,
        data : avgArr,
        type: 'heatmap',
        borderWidth: 1,
        borderColor: 'grey',            
        dataLabels: {
            enabled: true,
            style : {fontSize: 16+'px', textOutline: 'none' },
            color: '#000000'
        }
        }      
    
    ],
    });

      // Graph nÂ°1b //
    // let heatmap2_2 = new Chart({
    const chart1_3b =  Highcharts.chart('heatmap_3_2',{

        chart: {
            type: 'heatmap',
            marginTop: 80,
            marginBottom: 10,
            plotBorderWidth: 1,
            width: 400,
            height: 200,
        },
    
    
        title: {
            text: ''
        },

        credits: {
            enabled: false
        },

        xAxis: {
            categories: ['Disparition', 'Amélioration'],
            opposite:true
        },
    
        yAxis: {
            categories: ['Nb objets IP'],
            reversed: true,
        },
    
        accessibility: {
            point: {
                descriptionFormatter: function (point) {
                    var ix = point.index + 1,
                        xName = getPointCategoryName(point, 'x'),
                        yName = getPointCategoryName(point, 'y'),
                        val = point.value;
                    return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
                }
            }
        },
    
        colorAxis: [{
            minColor: '#f31457',
            maxColor: '#f31457'
          },
          {
            minColor: '#47f78a',
            maxColor: '#47f78a'
          }
        ],
    
        legend: {
            enabled: false
           },
    
        tooltip: {
            formatter: function () {
                return '<b>' + getPointCategoryName(this.point, 'x') + '</b> sold <br><b>' +
                    this.point.value + '</b> items on <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
            }
        },
    
        series: [{
            type: 'heatmap',
            name: 'Sales per employee',
            borderWidth: 1,
            borderColor: 'grey',   
            data : [[0,0, dispArrTotal]],
            dataLabels: {
                enabled: true,
                style : {fontSize: 16+'px', textOutline: 'none'},
                color: '#000000'
            }
        },
        {
            colorAxis : 1,
            type: 'heatmap',
            name: 'Sales per employee',
            borderWidth: 1,
            borderColor: 'grey',   
            data : [[1,0,amelArrTotal]],
            dataLabels: {
                enabled: true,
                style : {fontSize: 16+'px', textOutline: 'none'},
                color: '#000000'
            }
        }    
    ],
    });

});

}
}

async createNewConclusion() { // ou createNewChantier(): void {
    // Process checkout data here
    this.userConclusion = this.checkoutForm2.value["concl"];
    this.http.post('https://data.pampas.univ-lr.fr/node/postConclusion', {idtoken:this.token, conclusion: this.userConclusion }).toPromise()
        .then(
           response => {           
               console.log(response);
           },
           error => {            
             console.log(error);
           });
        this._apiService.getCountGraphs(this.token).then(data => 
            {
                console.log(data)
        });
}


///////// TEST EXPORT DOCX ///////
testExportDocx(){

const imageBase64Data = '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'
const imageHeaderFier = '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Ij8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczphdXg9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvYXV4LyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bXA6Q3JlYXRvclRvb2w9IlZlci4xLjAyICIgeG1wOkNyZWF0ZURhdGU9IjIwMTgtMDEtMDhUMTU6Mjc6MjEiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTAzLTE5VDE2OjIzOjU5KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTAzLTE5VDE2OjIzOjU5KzAxOjAwIiBhdXg6U2VyaWFsTnVtYmVyPSI0MzU5MzA5IiBhdXg6TGVuc0luZm89IjMwMDAvMTAgMzAwMC8xMCAyOC8xMCAyOC8xMCIgYXV4OkxlbnM9IjMwMC4wIG1tIGYvMi44IiBhdXg6TGVuc0lEPSIxNjYiIGF1eDpJbWFnZU51bWJlcj0iMzAwMzkiIGF1eDpBcHByb3hpbWF0ZUZvY3VzRGlzdGFuY2U9IjQyOTQ5NjcyOTUvMSIgcGhvdG9zaG9wOkRhdGVDcmVhdGVkPSIyMDE4LTAxLTA4VDE1OjI3OjIxLjA1NSIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpEb2N1bWVudElEPSJCQjgwNkQ5NTJDNTZGMUQ3NDQzQ0JGMDVFODg2NUQ5MiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExODIyQUI2NTQyQUUyNDFCNyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJCQjgwNkQ5NTJDNTZGMUQ3NDQzQ0JGMDVFODg2NUQ5MiIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDE4MDExNzQwNzIwNjgxMTgyMkFCNjU0MkFFMjQxQjciIHN0RXZ0OndoZW49IjIwMTktMDMtMTlUMTY6MjM6NTkrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHScdHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQY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';
const imageHeaderBrouage = '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4K8DB9avAACEryEAhq9AAIivbz+Kr+AAjK9vfI6v4ACQrwQAkq8AAJSvAACWrwAA/q8AAPavAADarwEA8K8NAAQGwxcKBgMHCKcEBICvKwGCrxwA7K8iAPD/U1RGASCpAAAiqQAAfKcAALynAAC+pwAArKcAAH6nAACgpwAAoqcAAK6nAACQpwAAkqcAAJSnAACYpwAAgKcAAIKnAACEpwAAhqcAADKmAACwpwAAsqcAALSnAAB2qQAAWKkAAFSpAABWqQAAXqkAAIinAACKpwAAjKcAAI6nAACcpwAAqqcAAJ6nAAAqqQAAcKcAAFCpAABSqQAAKKkAACSpAAAuqQAAWqkAADqpAAA8qQAALKkAADCpAAAyqQAANqkAADipAABgqQAAYqkAAGSpAABoqQAAZqkAAGqpAAB+qQAAPqkAAGCnAABipwAAZqcAAGinAABkpwAAaqcAAHinAABspwAAbqcAAHKnAAB0pwAAdqcAAKSnAACmpwAAqKcAAHKpAAB0qQAAJqkAAJanAAAAqQAAAqkAAASpAAA0qQAA8P9BRb4BAqbBAQCmGgIKphoCBqbBARSm6wYWphwHGKYfByqmxBkspgAADKbV/ySm5QHopgAE7KbpA/KmAAAOptX/KKYEAC6mAAAgpowBfKYAACKmXwUwpnYAJqYEAKamAACqpv//NKcAAICmAACCpgAAhqYAAKCmAADApgAA2qYAAJSmAADipgAA4KYAAISmAADCpgAAiqYAAJCmAACipgAAiKYAAIym//+OpgAAkqb//xqm+wZUpi8CVqYAABCm1f8SptX/RqblAUimAATupukDTqYAAfSmAAB6pgAAUqYEAFimAABApowBfqYAAEKmRAVgpgABWqaJAFymvgUQpwwPZKYBAAanAgBipgAABKcAAEymAACspgAApKYAAKimAAA2pwAAnKYAAGqmAABspgAAbqYAAGamAQDEpgAAxqYWAMimAQDKpgMIzKYAAM6mZADQpgAA1qYAANimAADSpgAA1KYAALCmGACypgAAuqb/ANymgAC2pgAAuKYAAJ6mAACWpgAAvKYKAL6mCgDwpgAAMKe3AQqntwEMpwAADqcAABKnKwEApxIBHqcAAAKnQAAypwQAOKcAADqnAADw/1dCXgIWqKwHGqguCBioIwQcqAsBHqgDAWioHwdgqFMAZKgtAGao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WABmAGIAXQBKAGQAjwBOAGAAKwBhAGQAswCUAHYAXgCwAKIAcgCDACkAqgBiAdECcAEKAQECjwI+AbUBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABXQkNaAgICAgICAgICBQUFAgICAgICAgIFBQUFBgYGBgYGBgEDAQMDBgYGBgYDAwMGAwMDAwEBAwMDAwIBAwMDCAMIAwMDAwMDAwMDAwgDAwgDAwgDAwMDCAgDCAMDAwMDAwMDCAgICAgDCAgIAwMDAwMICAgICAgICAMDAwgHBwcHCAgICAMDAwMHBwcICAgICAMDQk1ITAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEYwODEyMDkxNDAzNjgAAAA5OTk5Ojk5Ojk5IDAwOjAwOjAwAIAAAAAAAQAAgAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADk5OTk6OTk6OTkgMDA6MDA6MDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADk5OTk6OTk6OTkgMDA6MDA6MDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADk5OTk6OTk6OTkgMDA6MDA6MDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAP//////////AAAAADk5OTk6OTk6OTkgMDA6MDA6MDAAAAAAAAoAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAAIAAMBAwABAAAABgAAABIBAwABAAAAAQAAABoBBQABAAAASCwAABsBBQABAAAAUCwAACgBAwABAAAAAgAAAAECBAABAAAA9C0AAAICBAABAAAAHxcAABMCAwABAAAAAgAAAAAAAAC0AAAAAQAAALQAAAABAAAA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Y/9sAhAAEBAQEBAQEBAQEBAgIBAsICAgICA8ICwsLCA8TExMPExMTFxcaHhcXFxoTFyIaGhoeHiIiEyImGiYmJiIiHiIiAQgECAgICAgPDwgXIhcTIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiL/wAARCAB4AKADASEAAhEBAxEB/8QBogAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoLEAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+foBAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKCxEAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8/wCigAooAKKACigAooAKKACigAooAKKACigD0D/hU/xTP/NNPiB/4Baj/wDEUh+FHxTHJ+Gvj/8A8AtR/wDiKAD/AIVR8Uz0+Gvj/wD8AtR/+Ipf+FT/ABT6/wDCtfH/AP4Baj/8RQwuJ/wqj4pdf+Fa+P8A/wAAtR/+IpP+FVfFH/om/j7/AMAtR/8AiKdn2C67ij4U/FI9Pht4/wD/AAC1H/4ikPwq+KOcH4b+Pv8AwC1H/wCIos+wXXcT/hVXxQ/6Jv49/wDALUf/AIik/wCFWfE49Phz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YyAxHJ4xnqc/NipklByTRDsyW7uI7l5beCAJtXCq7AoY25ySM53Dtj3qe3nj0i1lkhgBa4ZsKxICb+Qcj9ePfHapcXyxXe39dP0BXGXOpW9xZ/6ao2qSquA+GY5wQMDHt+voIJyJbdpraWMqqFfLJywY9Qf8/jWqcqUWuXQ1jJq10DzxtaBFjjZ4ThV7B+/SsyWFmtWmtY97chlzyF7YPZh+vvXVF6N9zQ+cW1/XXYM+tasSucEyzEjPXv3pv9t61gD+19U+Xp+8l4/Wu+VOm/8Al2vuJQn9tawJPNGranv5O7zJc5+uakHiDXgCBrer4PP+tm6/nSdGk7ful9yBi/8ACReIOf8Aie6xyMH97P0/OmLruuIFCazqo28DEkwwOvrSdChZr2MfuQNLsH9va4F2DWdVx6eZNj+fvTP7Z1fGP7V1L/v5L/jQqNFf8uo/cgshx1zWiNp1fVMenmS/409df11BtTWtWAPOBLMBn86fsaOv7qP3ILLsRHWdYJJOq6lzn/lpL/jTzrutkqTrGq/Jgj95Nwfbmn7On/IvuAU69rpm+0HWtWMmS2/zZt2T1Oc0HX9dYhm1rViQdwJlm+969aTo0W0/ZR+5Csuwp8Qa8Rg63q5/7azf40r+IvEEiLFJrusMq9FMs5A5z0z/AJNCo0tP3S08kFl2GNrutunlvrGqlc52mSYjP50f29rhYudZ1Xcep8ybP86bp0/5F9w2kKde1xixbWtWJcbWJlm5X060xta1ljltW1MnpkyS/wCNEacFtBAjMoqwCigAooAKKACigAooAKKACigAooAKKAP/2f///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9sAQwAGBAQFBAQGBQUFBgYGBwkOCQkICAkSDQ0KDhUSFhYVEhQUFxohHBcYHxkUFB0nHR8iIyUlJRYcKSwoJCshJCUk/9sAQwEGBgYJCAkRCQkRJBgUGCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQk/8AAEQgCQAQAAwEhAAIRAQMRAf/EABwAAAIDAQEBAQAAAAAAAAAAAAMEAQIFAAYHCP/EAEsQAAIBAwMCBAQDBgQEBgABDQECAwAEEQUSITFBEyJR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';
const imageHeaderTasdon = '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';


    this.endPhase3 = 'yes';
    var today = new Date();
    var date =  today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

    // alert(this.selSite)
    if(this.selSite == '1'){
        this.nomSite = 'Site du Fier d\'Ars';
        this.nbObjetsSite = 67;
        this.headerRapport = imageHeaderFier;
    }
    else if(this.selSite == '2'){
        this.nomSite = 'Site de Tasdon';
        this.nbObjetsSite = 48;
        this.headerRapport = imageHeaderTasdon;
    }
    else if(this.selSite == '3'){
        this.nomSite = 'Site de Moà«ze-Brouage';
        this.nbObjetsSite = 60;
        this.headerRapport = imageHeaderBrouage;
    }
    else{}


var nom ='';
for (let i = 0; i < this.arrayPanier.length; i++) {
    nom += this.arrayPanier[i].split(';')[0] + ', ';
    this.rows = new TextRun({
        text: nom,
  })
}


//alert(this.nameScenario)

if (this.nameScenario == 'scenario_1_1'){
    this.nomScenario = 'Xynthia + 60 cm / Niveau de gestion classique hivernale.';
    this.defScenario = "Les niveaux d'eau initiaux dans les marais correspondent à des niveaux classiques en période hivernale et les ouvrages hydrauliques sont ouverts dès le début de la simulation. L'objectif est de faire varier la hauteur d'eau dans le marais en fonction de côtes de gestion hivernales et des ouvrages ouverts."
}
else if (this.nameScenario == 'scenario_1_2'){
    this.nomScenario = 'Xynthia + 60 cm / Niveau type marais à blanc.';
    this.defScenario = "Les marais sont à blancs avant la submersion marine et les ouvrages hydrauliques sont fermés, puis ouverts à mi-marée descendante 48h après la submersion. Les marais sont dits à blancs, lorsqu'ils sont gorgés d'eau au point d'être entièrement recouverts d'eau, suite à des pluies automnales et hivernales abondantes. L'objectif est de faire varier la hauteur d'eau dans le marais en fonction de côtes de gestion hivernales et des ouvrages ouverts, dans un cas extrême de pluie abondante avant la submersion"
}
else if (this.nameScenario == 'scenario_2_1'){
    this.nomScenario = "Xynthia + 60 cm / Niveau d'eau classique hivernal dans les marais."
    this.defScenario = "Bassin de chasse initialement rempli à 0.75m NGF, avec le même niveau d'eau que dans le marais de Tasdon (gestion classique hivernale), et la vanne de Maubec fonctionnelle. L'objectif est de faire varier la hauteur d'eau dans le marais en fonction de côtes de gestion hivernales et des ouvrages ouverts."
}
else if (this.nameScenario == 'scenario_2_2'){
    this.nomScenario = 'Xynthia + 60 cm / Niveau type marais à blanc (très haut).';
    this.defScenario = "Bassin de chasse plein, avec le même niveau d'eau que dans le marais de Tasdon (marais rempli au maximum, sans impacter les habitations) et la vanne de Maubec défaillante. L'objectif est de simuler les effets d'une submersion considérant le système d'ouverture de Maubec."
}
else if (this.nameScenario == 'scenario_3_1'){
    this.nomScenario = 'Xynthia + 60 cm / Niveau dâ€™eau très bas dans les marais.';
    this.defScenario = "Marais vide + ouvrages ouverts (état actuel) mais brécher les digues lorsqu'on est au niveau extrême. L'objectif est de simuler l'effet d'une submersion, en considérant la brèche dans la digue de rang 1."
}
else if (this.nameScenario == 'scenario_3_2'){
    this.nomScenario = 'Xynthia + 60 cm / Niveau type marais à blanc (très haut).'
    this.defScenario = "Marais blanc + ouvrages fermés (état actuel) mais brecher les digues lorsquâ€™on est au niveau extrême. L'objectif est de simuler l'effet d'une submersion, en considérant la brèche dans la digue de rang 1."
}
else {}

//alert(this.nameScenario)
//alert(this.nomScenario)

this.partObjetsIpDisp = this.objetsIpDisp_2 / this.counter * 100

const table = new Table({
    columnWidths: [3505, 5505],
    rows: [
        new TableRow({
            children: [
                new TableCell({
                    width: {
                        size: 2000,
                        type: WidthType.DXA,
                    },
                    children: [new Paragraph({ text: "Fct pat environnementale", style: "corpsTexte" })],
                    verticalAlign: VerticalAlign.CENTER,
                    shading: { fill: '#c5cafc' }
                 }),
                new TableCell({
                    width: {
                        size: 2100,
                        type: WidthType.DXA,
                    },
                    children: [new Paragraph({ text: "Fct pat productive", style: "corpsTexte" })],
                    verticalAlign: VerticalAlign.CENTER,
                    shading: { fill: '#c5cafc' }
                }),
                new TableCell({
                    width: {
                        size: 2100,
                        type: WidthType.DXA,
                    },
                    children: [new Paragraph({ text: "Fct pat paysagère", style: "corpsTexte" })],
                    verticalAlign: VerticalAlign.CENTER,
                    shading: { fill: '#c5cafc' }
                }),
                new TableCell({
                    width: {
                        size: 2100,
                        type: WidthType.DXA,
                    },
                    children: [new Paragraph({ text: "Fct pat culturelle", style: "corpsTexte" })],
                    verticalAlign: VerticalAlign.CENTER,
                    shading: { fill: '#c5cafc' }
                }),
            ],
        }),
        new TableRow({
            children: [
                new TableCell({
                    width: {
                        size: 2000,
                        type: WidthType.DXA,
                    },
                    children: [new Paragraph({ text: "1", style: "corpsTexte" })],
                    verticalAlign: VerticalAlign.CENTER
                }),
                new TableCell({
                    width: {
                        size: 2100,
                        type: WidthType.DXA,
                    },
                    children: [new Paragraph({ text: "5", style: "corpsTexte" })],
                    verticalAlign: VerticalAlign.CENTER
                }),
                new TableCell({
                    width: {
                        size: 2100,
                        type: WidthType.DXA,
                    },
                    children: [new Paragraph({ text: "7", style: "corpsTexte" })],
                    verticalAlign: VerticalAlign.CENTER
                }),
                new TableCell({
                    width: {
                        size: 2100,
                        type: WidthType.DXA,
                    },
                    children: [new Paragraph({ text: "2", style: "corpsTexte" })],
                    verticalAlign: VerticalAlign.CENTER
                }),
            ],
        }),
    ],
});

const fourniture = new Paragraph({
    spacing: {
        after: 100,
    },
    alignment: AlignmentType.CENTER,
    children: [
    ]
});


const fourniture2 = new Paragraph({
    spacing: {
        after: 100,
    },
    alignment: AlignmentType.CENTER,
    children: [
    ]
});




if (this.creaGraphsDone == 'yes' && this.creaGraphsCompDone == 'yes'){
    this._apiService.getBase64(this.token).then((data: any) =>
    // DEBUT DE LA BOUCLE //
    {
       this.recupBase64 = data;
       for (var j = 0; j < 4; j++){
           fourniture.addChildElement(new ImageRun({
           data:  Buffer.from(this.recupBase64[j].name, "base64"), 
           transformation: {
                width: 500,
                height: 333,
           },
           }));
        }
        for (var j = 4; j < 7; j++){
            fourniture2.addChildElement(new ImageRun({
            data:  Buffer.from(this.recupBase64[j].name, "base64"), 
            transformation: {
                 width: 500,
                 height: 333,
            },
            }));
         }

    var exportName = 'rapport_PAMPAS_' + this.token + '_' + date + '.docx'

    //alert(this.objetsIpDisp_2)
 
    const doc = new Document({

        styles: {
            paragraphStyles: [
                {
                    id: "myWonkyStyle",
                    name: "My Wonky Style",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        color: "29a4f9",
                        size:28 ,
                        font: "Calibri"
                    },
                    paragraph: {
                    },
                },
                {
                    id: "myWonkyStyle2",
                    name: "My Wonky Style2",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        color: "07cb1e",
                        size:22 ,
                        font: "Calibri"
                    },
                    paragraph: {
                    },
                },
                {
                    id: "myWonkyStyle3",
                    name: "My Wonky Style4",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        color: "1faef0",
                        size: 26 ,
                        font: "Calibri"
                    },
                    paragraph: {
                    },
                },
                {
                    id: "corpsTexte",
                    name: "My Wonky Style4",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        color: "000000",
                        size: 22 ,
                        font: "Calibri"
                    },
                    paragraph: {
                    },
                },
            ],
        },
        
        
        sections: [
            {
               // Headers //
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph('Rapport "' + exportName + '" | généré automatiquement par la plate-forme PWIP'),
                        ],
                    }),
                },

                               
                children: [
                    new Paragraph({
                        children: [],  // Just newline without text
                      }),
                      new Paragraph({
                        children: [],  // Just newline without text
                      }),
                      // Logo PAMPAS
                      new Paragraph({
                        spacing: {
                            after: 300,
                        },
                        alignment: AlignmentType.CENTER,
                        children: [
                          new ImageRun({
                            data:  Buffer.from(imageBase64Data, "base64"), 
                            transformation: {
                              width: 75,
                              height: 75,
                            },
                          })
                        ]
                      }),
                    // Titre
                    new Paragraph({
                        spacing: {
                            after: 300,
                        },
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "MON RAPPORT PERSONNALISE",
                                font: "Calibri",
                                bold: true,
                                size: 40,
                            })
                        ]
                    }),
                     // Nom du site
                    new Paragraph({
                        spacing: {
                            after: 400,
                        },
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: this.nomSite,
                                font: "Calibri",
                                size: 28,
                            })
                        ]
                    }),
                    // Image de couverture
                    new Paragraph({
                        spacing: {
                            after: 1000,
                        },
                        alignment: AlignmentType.CENTER,
                        children: [
                          new ImageRun({
                            data:  Buffer.from(this.headerRapport, "base64"), 
                            transformation: {
                              width: 650,
                              height: 375,
                            },
                          })
                        ]
                      }),
                      new Paragraph({
                        spacing: {
                            after: 400,
                        },
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "Copyright LIENSs",
                                font: "Calibri",
                                size: 20,
                            })
                           ]                    
                         }),
                      new Paragraph({
                        text: "Généré le " + date,
                        style: "myWonkyStyle3",
                        spacing: {
                            after: 600,
                        },
                        alignment: AlignmentType.CENTER
                    }),
                    // Intro
                    new Paragraph({
                        pageBreakBefore: true,
                        text: "Disclaimer",
                        style: "myWonkyStyle",
                        spacing: {
                            after: 100,
                        },
                    }),
                    new Paragraph({
                        style: "corpsTexte",
                        spacing: {
                            after: 600,
                        },
                        children: [
                            new TextRun({
                                text: "Cet outil a été élaboré dans le cadre d’un projet de recherche national impliquant des scientifiques de différents laboratoires et disciplines, visant à utiliser le patrimoine comme objet de réflexion sur les futurs des marais retro-littoraux face à l’aléa submersion marine.",
                                break: 1
                            }),
                            new TextRun({
                                text: "L’identification des objets patrimoniaux, leur spatialisation et leur sensibilité face à la submersion marine ont été évaluées à dire d’experts par les scientifiques du projet PAMPAS. Elles ne sont pas exhaustives et restent perfectibles.",
                                break: 1
                            }),
                            new TextRun({
                                text: "Néanmoins l’outil permet de supporter une démarche de reflexion et une mise en discussion, en utilisant le patrimoine comme support de compromis. Il n’a ni vocation à être un outil d’aide à la décision, ni à être diffuser librement au grand public sans accompagnement par des membres du consortium.",
                                break: 1
                            }) 
                        ]
                    }),
                    // Mes données
                    new Paragraph({
                        text: "Mes données : ",
                        style: "myWonkyStyle",
                        spacing: {
                            after: 200,
                        },
                    }),
                    new Paragraph({
                        style: "corpsTexte",
                        spacing: {
                            after: 200,
                        },
                        children: [
                            new TextRun({
                                text: "Vous avez choisi " + this.counter + " objets patrimoniaux sur les " + this.nbObjetsSite + " objets disponibles sur le " + this.nomSite + " :",
                            })                        
                        ]
                    }),
                    new Paragraph({
                        style: "corpsTexte",
                        spacing: {
                            after: 200,
                        },
                        children: [
                            this.rows                         
                        ]
                    }),
                    //table,
                    // Mon scénario
                    new Paragraph({
                        spacing: {
                            before : 600,
                            after: 200
                        },
                        text: "Mon scénario :",
                        style: "myWonkyStyle",
                    }),
                    new Paragraph({
                        style: "corpsTexte",
                        spacing: {
                            after: 600,
                        },
                        children: [
                            new TextRun({
                                text: "Scénario choisi : " + this.nameScenario.split('scenario_')[1],
                            }),
                            new TextRun({
                                text: "Nom du scénario : " + this.nomScenario,
                                break: 1
                            }),
                            new TextRun({
                                text: this.defScenario,
                                break: 1
                            })   
                        ]
                    }),
                    // Mes résultats
                    new Paragraph({
                        spacing: {
                            after: 200,
                        },
                        text: "Mes résultats :",
                        style: "myWonkyStyle",
                    }),
                    new Paragraph({
                        style: "corpsTexte",
                        spacing: {
                            after: 200,
                        },
                        children: [
                            new TextRun({
                                text: this.objetsIpDisp_2 + " objets patrimoniaux issus de votre sélection disparaissent suite au scénario de submersion, soit " + ((this.objetsIpDisp_2 / this.counter) * 100).toFixed(1) + " % de votre sélection.",
                            })                        
                        ]
                    }),
                    new Paragraph({
                        style: "corpsTexte",
                        spacing: {
                            after: 400,
                        },
                        children: [
                            new TextRun({
                                text: "L'ensemble des graphiques (par fonction patrimoniale, par composante patrimoniale et par fonction écologique) issus de vos sélections sont affichés ci-après. On rappelle que la moyenne des notes de sensibilité varie de 0 à 3.",
                            })                        
                        ]
                    }),
                    new Paragraph({
                        text: 'a) Graphiques "Fonctions Patrimoniales" :',
                        style: "myWonkyStyle2",
                    }),
                    fourniture,
                    new Paragraph({
                        spacing: {
                            after: 200,
                            before: 400,
                        },
                        text: 'b) Graphiques "Composantes Patrimoniales" :',
                        style: "myWonkyStyle2",
                    }),
                    fourniture2,
                    // Mes conclusions
                    new Paragraph({
                        spacing: {
                            before : 600,
                            after: 200,
                        },
                        text: "Mes analyses :",
                        style: "myWonkyStyle",
                    }),
                    new Paragraph({
                        style: "corpsTexte",
                        children: [
                            new TextRun({
                                text: this.userConclusion,
                            })                        
                        ]
                    }),                    
                ],
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        children: ["Page ", PageNumber.CURRENT, "/", PageNumber.TOTAL_PAGES],
                                    }),
                                ],
                            }),
                        ],
                    }),
                }
            },
        ],
    });

    Packer.toBlob(doc).then((blob) => {
        console.log(blob);
        saveAs(blob, exportName);
        console.log('Document created successfully');
        console.log(doc);
        // this.http.post('http://51.255.33.78:3000/testexpdoc', {doc:doc}).toPromise()
        // .then(
        //   response => {           
        //       console.log(response);
        //   },
        //   error => {            
        //     console.log(error);
        //   });
    
      });

// FIN DE LA BOUCLE
this.notifyService.showSuccess("Vous pouvez le consulter dans votre dossier des Téléchargements", "Votre rapport a bien été créé")

});

// FIN DE LA FCT
}
else {
    this.notifyService.showError("Problèmes dans la génération du rapport", "Erreur")
}
}


// SCREENSHOT
capture() {
    this.captureService
      .getImage(this.screen.nativeElement, true)
      .pipe(
        tap(img => {
          this.imgBase64 = img;
          console.log(img);
          this.downloadJson();
        })
      )
      .subscribe();
  }

  downloadJson() {
    var element = document.createElement('a');
    element.setAttribute('href', this.imgBase64);
    element.setAttribute('download', 'test.png');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }


  //// TESTS HISTORISATION ////
   histoRapports(){
    this._apiService.getHisto().then((data: any) =>
    {
      this.listrapports = data;
      this.collectionSize = this.listrapports.length;
      this.listrapports = this.listrapports.map((item:any, i:any) => ({ id: i + 1, ...item })).slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize,
    );
    }
  )
}; // fin histoRapports


 




    /* ---------- RETOUR PAGE D'ACCUEIL ---------- */
    retourAccueil(){
        this.router.navigate(['home']);
   }


}


