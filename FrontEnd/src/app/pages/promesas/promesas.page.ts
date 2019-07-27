import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Promesa } from 'src/app/models/promesas.model';
import { Router } from '@angular/router';
import { PromesasService } from 'src/app/services/promesas.service';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.page.html',
  styleUrls: ['./promesas.page.scss'],
  
  providers: [UserService,PromesasService]
})
export class PromesasPage implements OnInit {
  @ViewChild ('slidePrincipal') slides: IonSlides;
  private name;
  private email;
  private usuario;
  private identity: any;
  public token;
  public id;
  private rol;
  public status: string;
  public voto: Boolean ;
  
    //PARTIDOS VARIABLES
    public datos: Promesa[]; //traer
    public datoModel: Promesa; //emviar
    constructor(private _userService : UserService, private _Service : PromesasService,private _router: Router) {
      
      this.identity = this._userService.getIdentity();
      this.email = this.identity.email;
      this.id = this._userService.getIdCandidato();
      this.rol = this.identity.rol;
      this.usuario = this.identity.usuario;
      this.token = this._userService.getToken(); 
      this.datoModel = new Promesa("","","",1,0,0,0,[])
     }
  ngOnInit() {
    this.getDatos();
    this.slides.lockSwipes(true);
  }

  mostrarRegistro(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }
  
  addPromosa(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }



  getDatos(){
    console.log(this.id.nombre)
    this._Service.getDatos(this.token,this.id._id).subscribe(
      response=>{
        if(response.listaPromesas){
          console.log(response.listaPromesas)
          this.datos = response.listaPromesas;
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
    
    this._Service.addDato(this.token,this.id._id,this.datoModel).subscribe(
      response=>{
        if(response){
          this.status = 'ok';
          this.datoModel = new Promesa("","","",0,0,0,0,[])
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
    
promesaVotada(id, si , no){
    console.log(this.datoModel)
    this._Service.addVoto(this.token,id,si, no ).subscribe(
      response=>{
        if(response.message === 'Ya voto')
        {
          this.status = 'Ya voto'
          setTimeout(() => 
        {
          this.status = 'ok'
          },
        2000);
        }else{
            this.status = 'ok';
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
}
