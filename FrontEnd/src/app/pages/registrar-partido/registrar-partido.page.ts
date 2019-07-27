import { Component, OnInit, ViewChild } from '@angular/core';
import { PartidoService } from 'src/app/services/partido.service';
import { Partido } from 'src/app/models/partido.model';
import { UploadService } from 'src/app/services/upload.service';
import { IonSlides } from '@ionic/angular';
import { GLOBAL } from 'src/app/services/global.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-partido',
  templateUrl: './registrar-partido.page.html',
  styleUrls: ['./registrar-partido.page.scss'],
  providers: [
    PartidoService, 
    UploadService,
    UserService
  ]
})
export class RegistrarPartidoPage implements OnInit {

  @ViewChild ('slidePrincipal') slides: IonSlides;

  
  public registro : Partido;
  public registro1 : Partido;
  
  public partido : Partido;
  //******/
  public idPartido : String;
  private identity: any;
  public token;
  public status : string;
  public url;
  private name;
 
  private rol;
  private usuario;
  
  public partidos: Partido; //get
  public partidoModel: Partido; //post

  constructor(
    private _userService : UserService,
    private _regristroPartido : PartidoService,
    private _partidoService : PartidoService,
    private _uploadService : UploadService,
    private _router: Router
  ) { 
    this.partidoModel = new Partido("","","","");
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.rol = this.identity.rol;
    this.usuario = this.identity.usuario;
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.slides.lockSwipes(true);
    this.getLPartidos();
  }

  


  mostrarRegistro(){
    this.slides.lockSwipes(false);

    this.slides.slideTo(1);

    this.slides.lockSwipes(true);
  }
 
  getLPartidos(){
    this._partidoService.getPartidos().subscribe(
      response=>{
        if(response.listarPartidos){
          console.log(response.listarPartidos)
          this.partidos = response.listarPartidos;
        }
      },
      error=>{
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage !=null){
          this.status = 'ERROR'
        }
      }
    )
  }

  public fileToUpload: Array<File>
  fileChangeEvent(fileInput: any){
  this.fileToUpload = <Array<File>>fileInput.target.files;
  }

  addPartido(){
    this._partidoService.addPartido(this.token,this.partidoModel).subscribe(
      response=>{
        if(response){
          this.status = 'ok';
          this.partidoModel = new Partido("","","","")
          this.getLPartidos();
          console.log(response)
        }
      },
      error=>{
        console.log(<any>error);
        this.status = 'error';
      }
    )
  }
/*
  getPartido(id){
    this._partidoService.getPartido(id).subscribe(
      response=>{
        if(response.partido){
          console.log(response.partido)
          console.log('Entro al partido')
          this.partido = response.partido; //contacto modelo
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
  } */


  Redi(id, nombre, descripcion, imagen){
    console.log(id)
    this.partidoModel = new Partido(id,nombre,descripcion,imagen)
    sessionStorage.setItem('id', JSON.stringify(this.partidoModel));
    this.status = 'OK';
    this.partidoModel = new Partido("","","","")
  }
  idP(id){
    this.idPartido = id;
    console.log(this.idPartido);
  }

  imagenPartido(){
    this._uploadService.makeFileRequest(this.url+'uploadImage/'+this.idPartido,[],this.fileToUpload,this.token,'image')
    .then((result: any)=>{
      console.log(result);
      this.getLPartidos();
    }  
    )
  }
/*
  editPartido(id){
    this._partidoService.editParitido(id,this.registro).subscribe(
      response=>{
        if(!response.partidoPolitico){
          this.status = "error"
        }else{
          this.status = "Success";
          this.getPartido(id)
          this._uploadService.makeFileRequest(this.url+'uploadImage/'+id,[],this.fileToUpload,'image')
          .then((result: any)=>{
            console.log(result);
            this.partido.image = result.equipos.image;
            
          })
          
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = "error";
        }
      }
    )
  }*/

/*
  editPartido(){
    this._partidoService.updatePartido(this.registro).subscribe(
      response=>{
        if(!response.user){
          this.status = "error"
        }else{
          this.status = "Success"

          sessionStorage.setItem('identity', JSON.stringify(this.user));
          this.identity = this.user;

          //SUBIR IMAGEN DEL USUARIO
          this._uploadService.makeFileRequest(this.url+'subir-imagen-usuario/'+this.user._id,[],this.filesToUpload,this.token,'image')
          .then((result : any)=> {
            console.log(result);
            this.user.image = result.user.image;
            sessionStorage.setItem('identity', JSON.stringify(this.user));
          })
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = "error";
        }
      }
    )
  }*/

 //imagena
/*
  editUser(){
    this._partidoService.updateUser(this.registro).subscribe(
      response=>{
        if(!response.user){
          this.status = "error"
        }else{
          this.status = "Success"

          sessionStorage.setItem('identity', JSON.stringify(this.registro));
          this.identity = this.registro;

          //SUBIR IMAGEN DEL USUARIO
          this._uploadService.makeFileRequest(this.url+'subir-imagen-usuario/'+this.registro._id,[],this.filesToUpload,this.token,'image')
          .then((result : any)=> {
            console.log(result);
            this.registro.image = result.user.image;
            sessionStorage.setItem('identity', JSON.stringify(this.registro));
          })
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = "error";
        }
      }
    )
  }
*/

}
