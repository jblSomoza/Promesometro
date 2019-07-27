import { Component, OnInit, ViewChild } from '@angular/core';
import { CandidatosService } from 'src/app/services/candidatos.service';
import { Candidato } from 'src/app/models/candidato.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

import { UploadService } from 'src/app/services/upload.service';
import { GLOBAL } from 'src/app/services/global.service';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.page.html',
  styleUrls: ['./candidatos.page.scss'],
  providers:[CandidatosService, UserService,UploadService]
})
export class CandidatosPage implements OnInit {
  @ViewChild ('slidePrincipal') slides: IonSlides;
  

  private name;
  private email;
  private rol;
  private usuario;

  public url;
  public idCandidato: String;
  private identity: any;
  public token;
  public id;
  public status: string;
  
    //PARTIDOS VARIABLES
    public datos: Candidato[]; //traer
    public datoModel: Candidato; //emviar
  constructor(
    private _userService : UserService, private _Service : CandidatosService,private _router: Router,private _uploadService: UploadService
  ) { 
    this.identity = this._userService.getIdentity();
      this.email = this.identity.email;
      this.usuario = this.identity.usuario;
      this.id = this._userService.getId();
      this.rol = this.identity.rol;
      this.token = this._userService.getToken(); 
      this.datoModel = new Candidato("","","","","","")
      this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.getDatos();
    this.slides.lockSwipes(true);
  }

  mostrarRegistro(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }
  
  addPromosa(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }

  mostrarSubirImagen()
{
  this.slides.lockSwipes(false);
    this.slides.slideTo(2);
    this.slides.lockSwipes(true);
}

  getDatos(){
    console.log(this.id.nombre)
    this._Service.getCandidatos(this.token,this.id._id).subscribe(
      response=>{
        if(response.listaCandidatos){
          console.log(response.listaCandidatos)
          this.datos = response.listaCandidatos;
        }
      },
      error=>{
        var errorMessage = <any>error; 
        console.log(errorMessage); 
        if(errorMessage != null){
          this.status = 'ERROR'
        }
      }
    )
  }

  addDato(){
    this._Service.addCandidato(this.token,this.id._id,this.datoModel).subscribe(
      response=>{
        if(response){
          this.status = 'ok';
          this.datoModel = new Candidato("","","","","","")
          this.getDatos();
          console.log(response)
        }
      },
      error=>{
        console.log(<any>error);
        this.status = 'error';
      }
      
    )
  }
  Redi(id, nombre, descripcion, imagen, cargo){
    console.log(id)
    this.datoModel = new Candidato(id,nombre,descripcion,cargo,this.id._id,imagen,)
    sessionStorage.setItem('idCandidato', JSON.stringify(this.datoModel));
    this.status = 'OK';
    this._router.navigate(['/promesas'])
    this.datoModel = new Candidato("","","","","","")
  }

  idC(id){
    this.idCandidato = id;
    console.log(this.idCandidato);
  }

  imagenCandidato(){
    this._uploadService.makeFileRequest(this.url+'subir-imagen-candidato/'+this.idCandidato,[],this.fileToUpload,this.token,'image')
    .then((result: any)=>{
      console.log(result);
      this.getDatos();
    }  
    )
  }

  public fileToUpload: Array<File>
  fileChangeEvent(fileInput: any){
  this.fileToUpload = <Array<File>>fileInput.target.files;
  }



}
