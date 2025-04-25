import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

    // Création d'un nouveau chantier (Post API).
    async postObjets0(idtoken:any){
      return this.http.post('https://data.pampas.univ-lr.fr/node/init', {idtoken:idtoken})
      .toPromise()
      .then(
        response => {           
            console.log(response);
        },
        error => {            
          console.log(error);
        });
    }

    // Création d'un nouveau chantier (Post API).
    async postObjets(nom:any, idtoken:any){
      return this.http.post('https://data.pampas.univ-lr.fr/node/sendPanier', {nom:nom, idtoken:idtoken})
      .toPromise()
      .then(
        response => {           
            console.log(response);
        },
        error => {            
          console.log(error);
        });
    }

    // Création d'un nouveau chantier (Post API).
    async postObjets2(selSite:any, nameScenario:any, nameLayer:any){
      return this.http.post('https://data.pampas.univ-lr.fr/node/runScenario', {selSite:selSite, nameScenario:nameScenario, nameLayer:nameLayer})
      .toPromise()
      .then(
        response => {           
            console.log(response);
        },
        error => {            
          console.log(error);
        });
    }

    //
    async testPost(nameLayer2:any){
      console.log(nameLayer2)
      return this.http.post('https://data.pampas.univ-lr.fr/node/fonction', {layer:nameLayer2})
      .toPromise()
      .then(
        response => {           
            console.log(response);
        },
        error => {            
          console.log(error);
        });
    }

    async stylePost(nameLayer2:any){
      return this.http.post('https://data.pampas.univ-lr.fr/node/style', {layer:nameLayer2})
      .toPromise()
      .then(
        response => {           
            console.log(response);
        },
        error => {            
          console.log(error);
        });
    }


  async getGroupes(nameLayer2:any){
    return this.http.get('https://data.pampas.univ-lr.fr/node/getGroupes/'+ nameLayer2).toPromise();
  }

  async getStatsGraph(idtoken:any){
    return this.http.get('https://data.pampas.univ-lr.fr/node/stats/'+ idtoken).toPromise();
  }

  async getStatsGraph1(idtoken:any){
    return this.http.get('https://data.pampas.univ-lr.fr/node/stats_g1/'+ idtoken).toPromise();
  }

  async getStatsGraph2(idtoken:any){
    return this.http.get('https://data.pampas.univ-lr.fr/node/stats_g2/'+ idtoken).toPromise();
  }

  async getStatsGraphComp(idtoken:any){
    return this.http.get('https://data.pampas.univ-lr.fr/node/statscomp/'+ idtoken).toPromise();
  }

  async getStatsGraphComp1(idtoken:any){
    return this.http.get('https://data.pampas.univ-lr.fr/node/statscomp_g1/'+ idtoken).toPromise();
  }

  async getStatsGraphComp2(idtoken:any){
    return this.http.get('https://data.pampas.univ-lr.fr/node/statscomp_g2/'+ idtoken).toPromise();
  }

  async getStatsGraphEcol(idtoken:any){
    return this.http.get('https://data.pampas.univ-lr.fr/node/statsecol/'+ idtoken).toPromise();
  }

  async getStatsGraphEcol1(idtoken:any){
    return this.http.get('https://data.pampas.univ-lr.fr/node/statsecol_g1/'+ idtoken).toPromise();
  }




    // Création d'un nouveau chantier (Post API).
    async createPngs(base64chart1:any, token:any){
      return this.http.post('https://data.pampas.univ-lr.fr/node/createpng', {base64chart1:base64chart1, token:token})
      .toPromise()
      .then(
        response => {           
            console.log(response);
        },
        error => {            
          console.log(error);
        });
    }

  async getBase64(idtoken:any){
      return this.http.get('https://data.pampas.univ-lr.fr/node/base64/'+ idtoken).toPromise();
    }
  
  
    // Suppression résultats d'un scénario
    async deleteResultatsScenario(selSite:any, nameScenario:any, nameLayer:any){
      return this.http.post('https://data.pampas.univ-lr.fr/node/deleteScenario', {selSite:selSite, nameScenario:nameScenario, nameLayer:nameLayer})
      .toPromise()
      .then(
        response => {           
            console.log(response);
        },
        error => {            
          console.log(error);
        });
    }

    async getAttributs(vue:any){
      return this.http.get('https://data.pampas.univ-lr.fr/node/attributs/'+ vue).toPromise();
    }

    async getHisto(){
      return this.http.get('https://data.pampas.univ-lr.fr/node/listrapports/').toPromise();
    }

    async getHistoDetails(idrapport:any){
      return this.http.get('https://data.pampas.univ-lr.fr/node/listdatascen/'+ idrapport).toPromise();
    }

    async getCountGraphs(idtoken:any){
      return this.http.get('https://data.pampas.univ-lr.fr/node/countgraphs/'+ idtoken).toPromise();
    }

}
