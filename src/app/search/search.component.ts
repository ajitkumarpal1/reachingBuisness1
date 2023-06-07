import { Component, OnInit,Input, Inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router,ActivatedRoute} from '@angular/router';

//import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { CommonService } from '../common.service';
import { AlldataService } from '../alldata.service';
import { from } from 'rxjs'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private sst :Router,private http:HttpClient, private comm:CommonService,private alld:AlldataService,private route:ActivatedRoute) { }
  morus=1;
  morpr=1;
  user;
  product;
  par;
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(param=>{
      this.par="";
      this.user="";
      this.product="";
      this.morus=1;
      this.morpr=1;
    this.par = {...param.keys, ... param};    
    this.par = this.par["params"];
    var id=this.alld.userdataget();
    this.comm.put_search_history(id[0].userID,this.par["search"]).subscribe(resp=>{ 

    });
    this.lode_user();
    this.lode_product();
    });
  }
  lode_user()
  {
    this.comm.search_user(this.par["search"],this.morus).subscribe(resp=>{ 
      
      if(this.morus==1)
      {
         this.user =<any[]> resp;
      }else
      {
        this.user =this.user.concat(<any[]> resp);
      }
         
         this.morus++;
         
      })
  }
  
  lode_product()
  {
    this.comm.search_product(this.par["search"],this.morpr).subscribe(resp=>{ 
      let len=<any[]> resp;
      for (let index = 0; index < len.length; index++) {
        var tamp="http://reachingbusiness.com/reachbisiness/pics/";
        var i=0;
        for (let inloop = 0; inloop < resp[index].product_pic.length; inloop++) {
          if(resp[index].product_pic[inloop]!=',')
          {
            tamp+=resp[index].product_pic[inloop];
          }
          else
          {
            break;
          }
        }
        resp[index].product_pic=tamp;
      }
      resp[0].product_pic;
      if(this.morpr==1)
      {
         this.product =<any[]> resp;
      }else
      {
        this.product =this.product.concat(<any[]> resp);
      }
         this.morpr++;
      })
  }

}
