import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Partido } from '../models/partido.model';
import { Persona } from '../models/persona.model'
import { GLOBAL } from './global.service'

@Injectable()
export class PartidoService{
    public url: String;
    
    


    constructor(public _http : HttpClient) { //modulos que trabaja el metodo HTTP de angular
        this.url = GLOBAL.url;
      }
    

      addPartido(token,partido: Partido): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
        let params = JSON.stringify(partido);
        
        return this._http.post(this.url+'addPartido',params,{headers: headers})
      }
    
      getPartidos(): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'partidos', {headers:headers})
      }
      
      ///fin de agregar partido







      editPartido(id,partido: Partido):Observable<any>{
        let headers=new HttpHeaders().set('Content-Type','application/json')  
        let params=JSON.stringify(partido);
    
        return this._http.put(this.url+'editPartido/'+id,params,{headers:headers});
     
      }
     
      getPartido(id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json', );

        return this._http.get(this.url+'getPartido/'+id, {headers:headers})
      }
    

      addPersona(addPersona : Persona) : Observable<any>{ //lista
        let params = JSON.stringify(addPersona);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        
        return this._http.post(this.url + 'addPersona', params, {headers : headers});
      }

     
      /*
      updateUser(user:User): Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization',this.getToken());
    
        return this._http.put(this.url + 'editar-usuario/'+user._id, params, {headers : headers})
      }
    
    
    }*/
/*
    makeFileRequest(url : string, params : Array<string>, files : Array<File>, token : string, name : string){
      return new Promise (function(resolve, reject){
        var formData : any = new FormData(); //para traer el tipo de dato al abrir la ventana
        var xhr = new XMLHttpRequest; //peticion por medio de http

        for(var i = 0; i < files.length; i++){
          formData.append(name, files[i], files[i].name);
        }

        xhr.onreadystatechange = function(){
          if(xhr.readyState == 4){ //stado que dice que si envio los archivos
            if(xhr.status == 200){
              resolve(JSON.parse(xhr.response));
            }else{
              reject(xhr.response);
            }
          }
        }

        xhr.open('POST', url, true); //tipo, url, asincrono
        xhr.setRequestHeader('Authorization', token);//
        xhr.send(formData);//enviamos los datos ya parseados

      })
  }*/

/*
  updateUser(user:User): Observable<any>{
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization',this.getToken());

    return this._http.put(this.url + 'editar-usuario/'+user._id, params, {headers : headers})
  }*/

/*
  updatePartido(partido:Partido): Observable<any>{
    let params = JSON.stringify(partido);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.put(this.url + 'editPartido/'+partido._id, params, {headers : headers})
  }
*/
}