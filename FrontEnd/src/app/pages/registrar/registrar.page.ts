import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { MenuService } from 'src/app/services/menu.service';
import { MenuController, IonSlides } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Componente } from 'src/app/interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  providers: [ UserService ]
})
export class RegistrarPage implements OnInit {

  @ViewChild ('slidePrincipal') slides: IonSlides;




  public user : User;
  public status : string;

  ///LOGIN  
  public token;
  public identity;  //guardara los datos del usuario logeado
  
  

  constructor(private _userService : UserService,
    private menuService: MenuService,
     private menuController: MenuController,
     //LOGIN
     private _router : Router,) {
      this.user = new User("","","","","");
      
   }

   menu: Observable<Componente[]>;
   
 
   ngOnInit() {
     this.menu = this.menuService.getMenu();
     this.slides.lockSwipes(true);
   }

  toggleMenu(){
    this.menuController.toggle();
  }

  mostrarRegistro(){

    this.slides.lockSwipes(false);
    
    this.slides.slideTo(1);
    
    this.slides.lockSwipes(true);
  }
  mostrarLogin(){
    
    this.slides.lockSwipes(false);
    
    this.slides.slideTo(0);
    
    this.slides.lockSwipes(true);
  }


  registrar(){
    this._userService.registro(this.user).subscribe(
      response=>{
        if(response){
          this.status = 'ok';
          this.user = new User("","","","",""
          )
          this._router.navigate(['/registrar'])
        //  console.log(response)
        }
      },
      error=>{
        console.log(<any>error);
        this.status = 'error';
      }
      
    )
  }



  //LOGIN
  getToken(){
    this._userService.login(this.user, 'true').subscribe(
      response=>{
     //   console.log(response)
        this.token = response.token;
        if(this.token.length <= 0){
          this.status = 'error'
        }else{
          sessionStorage.setItem('token',this.token)
        }
      },
      error=>{
        var errorMessage = <any>error;
        console.log(errorMessage)
        if(errorMessage != null){
          this.status = 'error'
        }
      }
    )
  }

  login(){
    this._userService.login(this.user).subscribe(
      response=>{
        this.identity = response.user;
        console.log(this.identity);
        if(!this.identity){
          this.status = 'error'
        }else{
          sessionStorage.setItem('identity', JSON.stringify(this.identity));
          this.getToken();
          this.status = 'OK';
          this._router.navigate(['/home'])
        }
      },
      error=>{
        var errorMessage = <any>error;
        console.log(errorMessage)
        if(errorMessage != null){
          this.status = 'error'
        }
      }
    )
  }


}


