import { Component, OnInit,Input, Inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router,ActivatedRoute} from '@angular/router';
import { AlldataService } from '../alldata.service';
import { AdminComponent} from '../admin/admin.component';


//import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { CommonService } from '../common.service';
import { from } from 'rxjs'

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.component.html',
  styleUrls: ['./viewprofile.component.css']
})
export class ViewprofileComponent implements OnInit {
  par;
  user;
  products;
  followid;
  userdata;
  last=0;
  
  constructor(private sst :Router,private http:HttpClient, private comm:CommonService,private route:ActivatedRoute,private alld:AlldataService,private admin:AdminComponent) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(param=>{
    this.par = {...param.keys, ... param};    
    this.par = this.par["params"];
    //this.admin.test();
    this.comm.product_by_userID(this.par["userid"]).subscribe(resp=>{
      var len=<any[]>resp;
      for (let index = 0; index < len.length; index++) {
        var tamp="http://reachingbusiness.com/reachbisiness/pics/";
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


      this.products=<any[]>resp;

    })
    this.user=this.comm.user_by_id(this.par["userid"]).subscribe(resp=>{
      this.user=resp;
    
    this.followid=this.alld.get_follow_list();
    this.user[0].follow=0;
      var r=this.alld.userdataget();
      
        for (var i = 0; i < this.followid.length; i++) 
        {
          if(this.user[0].userID== this.followid[i])
          {
            this.last=i;
            this.user[0].follow=1;
            break;
          }
        }
        this.userdata=this.alld.userdataget();
    })
    });
  }
  follow()
  {
    this.comm.follow(this.par["userid"],this.userdata[0].userID).subscribe(resp=>{
      this.followid.push(this.par["userid"]);
      this.user[0].follow=1;
      this.last=this.followid.length-1;
    })
  }
  unfollow()
  {
    this.comm.unfollow(this.par["userid"],this.userdata[0].userID).subscribe(resp=>{
      this.user[0].follow=0;
      delete this.followid[this.last];
      /* for (var i = 0; i < this.followid.length; i++) 
        {
          if(this.par["userid"]== this.followid[i])
          {
            delete this.followid[i];
            break;
          }
        } */
    })
  }
  

}
