import { Component, OnInit, ViewChild } from '@angular/core';
import { PartidoService } from 'src/app/services/partido.service';
import { Partido } from 'src/app/models/partido.model';
import { GLOBAL } from 'src/app/services/global.service';
import { UserService } from 'src/app/services/user.service';
import { UploadService } from 'src/app/services/upload.service';
import { IonSlides } from '@ionic/angular';
import { Persona } from 'src/app/models/persona.model'
import { Router } from '@angular/router';




@Component({
  selector: 'app-partido',
  templateUrl: './partido.page.html',
  styleUrls: ['./partido.page.scss'],
  providers : [UserService,PartidoService,UploadService]
})
export class PartidoPage implements OnInit {
  @ViewChild ('slidePrincipal') slides: IonSlides;
  private name;
  private email;
  private rol;
  private usuario;
  
  public url;
  public idPartido: String;
  private identity: any;
  public token;
  public status: string;
  //PARTIDOS VARIABLES
  public partidos: Partido; //traer
  public partidoModel: Partido; //emviar

  constructor(
    private _userService : UserService, 
    private _partidoService : PartidoService,
    private _router: Router,
    private _uploadService: UploadService
  ) {
    this.identity = this._userService.getIdentity();
    this.email = this.identity.email;
    this.rol = this.identity.rol;
    this.usuario = this.identity.usuario;

    this.token = this._userService.getToken(); 
    this.partidoModel = new Partido(
      "",
      "",
      "",
      "" )
      this.url = GLOBAL.url;
   }

  ngOnInit() {
    this.getLPartidos();
    this.slides.lockSwipes(true);
  }

  mostrarRegistro(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }
  
  mostrarSubirImagen(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }

  getLPartidos(){
    this._partidoService.getPartidos().subscribe(
      response=>{
        if(response.listaPartidos){
          console.log(response.listaPartidos)
          this.partidos = response.listaPartidos;
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

  addPartido(){
    //this.validateBtnState = ClrLoadingState.LOADING;
    this._partidoService.addPartido(this.token,this.partidoModel).subscribe(
      response=>{
        if(response){
          this.status = 'ok';
          this.partidoModel = new Partido(
            "",
            "",
            "",
            ""
          )
          this.getLPartidos();
          //this.validateBtnState = ClrLoadingState.SUCCESS;
          console.log(response)
        }
      },
      error=>{
        console.log(<any>error);
        this.status = 'error';
      }
      
    )
  }
  Redi(id, nombre, descripcion, imagen){
    console.log(id)
    this.partidoModel = new Partido(
      id,
      nombre,
      descripcion,
      imagen
    )
    sessionStorage.setItem('id', JSON.stringify(this.partidoModel));
    this.status = 'OK';
    this._router.navigate(['/candidatos'])
    this.partidoModel = new Partido(
      "",
      "",
      "",
      ""
    )
  }

  editEquipo(id){
    this._partidoService.editPartido(id,this.partidoModel).subscribe(
      response=>{
        if(!response.actualizado){
          this.status = "error"
        }else{
          this.status = "Success";
          //this.getEquip(id)

        /*  
          this._uploadService.makeFileRequest(this.url+'subir-imagen-contacto/'+id,[],this.fileToUpload,'image')
          .then((result: any)=>{
            console.log(result);
            this.equipos.image = result.equipos.image;
            //sessionStorage.setItem('identity',JSON.stringify(this.user))
          })*/
          
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

  idP(id){
    this.idPartido = id;
    console.log(this.idPartido);
  }

  imagenPartido(){
    this._uploadService.makeFileRequest(this.url+'subir-imagen-partido/'+this.idPartido,[],this.fileToUpload,this.token,'image')
    .then((result: any)=>{
      console.log(result);
      this.getLPartidos();
     // this._router.navigate(['/partido'])
      this.slides.lockSwipes(true);
    }  
    )
  }

  public fileToUpload: Array<File>
  fileChangeEvent(fileInput: any){
  this.fileToUpload = <Array<File>>fileInput.target.files;
  }

}


