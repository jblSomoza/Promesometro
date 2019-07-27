import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Componente } from '../../interfaces/interfaces';
import { MenuService } from 'src/app/services/menu.service';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Partido } from 'src/app/models/partido.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers:[UserService]
})
export class HomePage implements OnInit{

  
  //private name;
  //private email;
  //private rol;
  //private usuario;
  //public token;
  
  private identity;
  menu: Observable<Componente[]>;
  constructor(private menuService: MenuService,
    private _userService : UserService,
    private menuController: MenuController) { 
      this.identity = this._userService.getIdentity();
     // this.rol = this.identity.rol;
     // this.token = this._userService.getToken();
    //  this.usuario = this.identity.usuario;
    }

  ngOnInit() {
    this.menu = this.menuService.getMenu();
  }



  componentes: Componente[] = [];

  //constructor() {}



  toggleMenu(){
    this.menuController.toggle();
  }

}
