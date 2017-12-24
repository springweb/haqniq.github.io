/*修正浏览器差异*/
if(document.implementation.hasFeature("XPath","3.0")){
   XMLDocument.prototype.selectNodes=function(cXPathString,xNode){
      if(!xNode){xNode=this;}
      var oNSResolver=this.createNSResolver(this.documentElement);
      var aItems=this.evaluate(cXPathString, xNode, oNSResolver,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var aResult=[];
      for(var i=0;i< aItems.snapshotLength;i++){
         aResult[i]=aItems.snapshotItem(i);
      }
      return aResult;
   }
   Element.prototype.selectNodes=function(cXPathString){
      if(this.ownerDocument.selectNodes){
         return this.ownerDocument.selectNodes(cXPathString,this);
      }else{throw "For XML Elements Only";}
   }
}

/*加入收藏*/
function addFavorite(site,wname){
	if(document.all){
	  window.external.addFavorite(site,wname);
	}else if(window.sidebar){
	  window.sidebar.addPanel(wname,site,"");
	}
}

/*设为首页*/
function setHomepage(site){
	if (document.all){
		document.body.style.behavior='url(#default#homepage)';
		document.body.setHomePage(site);
	}else if(window.sidebar){
		if(window.netscape){
			try{
			  netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			}catch(e){
			  alert("该操作被浏览器拒绝，假如想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
			}
		}
		var prefs=Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
		prefs.setCharPref('browser.startup.homepage',site);
	}
}

/*
用法示例:
var glideObj=new myGlide();
glideObj.sRoll(['#reco_box1'],{'pre':"#recoUpBt",'next':"#recoNextBt","handle":null},true,1,20,'left');
参数说明:
start(auto,oBoxs,oHandle,second,fstep,direc)
auto:是否自动播放
oBoxs:外部容器
oHandle:控制容器
second:动画完成时间(秒)
fstep:动画的速度,即是完成动画需要的步数
direc:自动播放的方
*/
function myGlide(){
	function ID(cid){
	   return document.getElementById(filter(cid));
	}
	function swing(p){/*加速效果函数*/
	   return( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
	}
	function filter(str){
	  return str.replace(/[^\w_]+/gi,"");
	}
	this.sRoll=function(oBoxs,oHandle,settings,callBack){
	  var auto=typeof(settings['auto'])!='undefined'?settings['auto']:false,
	      second=typeof(settings['second'])!='undefined'?settings['second']:1,
	      fstep=typeof(settings['fstep'])!='undefined'?settings['fstep']:20,
	      direc=typeof(settings['direc'])!='undefined'?settings['direc']:'left',
	      fn=typeof(callBack)!='function'?function(){}:callBack,
	      oWidth=0,iWidth=0,sWidth=0,ratios=[],num=0,rNum=0,speed=(second/fstep)*1000,
	      step=fstep,timerId,autotimerId,alNum,
	      toLeft,toRight,run;

    oWidth=$(oBoxs[0]).width();
    iWidth=$(oBoxs[0]+" > :first-child").width();
    alNum=$(oBoxs[0]+" > :first-child").children().length;
    sWidth=iWidth/alNum;

    if(oWidth >= iWidth){
      return false;
    }

    for(var i=0;i< oBoxs.length;i++){
       $(oBoxs[i]+" > :first-child").width($(oBoxs[i]+" > :first-child").width()*2);
	     $(oBoxs[i]+" > :first-child").append($(oBoxs[i]+" > :first-child").html());
	     ratios[i]=$(oBoxs[i]).width()/$(oBoxs[0]).width();
    }
    iWidth*=2;

	  run=function(s,bm){
		  return function(){
				if(s==1){/*向左滑动*/
					num++;
					if(num >step){
					  num=0;
					  clearInterval(timerId);
					  rNum+=bm;
					  if(rNum >=(iWidth/sWidth/2)){/*当滑动等于半宽时设置为0*/
							for(var i=0;i< oBoxs.length;i++){
							    ID(oBoxs[i]).scrollLeft=0;
							}
							rNum=0;
						}
					  if(oHandle['handle']){
					    try{
					      $(oHandle['handle']+" a").attr("class",filter(oHandle['handle'])+"_out");
					      $(oHandle['handle']+" a:eq("+rNum+")").attr("class",filter(oHandle['handle'])+"_over");
					    }catch(e){}
					  }
					  (fn)(rNum);
					}else{
					  for(var i=0;i< oBoxs.length;i++){
					     var rw=(swing(num/step)*sWidth+rNum*sWidth)*ratios[i]*bm;
					    ID(oBoxs[i]).scrollLeft=rw;
					  }
					}
				}else{/*向右滑动*/
				  if(!rNum&&!num){/*当为0时设置半宽*/
				     for(var i=0;i< oBoxs.length;i++){
				       ID(oBoxs[i]).scrollLeft=(iWidth/2)*ratios[i];
				     }
				     rNum=iWidth/sWidth/2;
				  }
				  num++;
				  if(num >step){
				    num=0;
				    clearInterval(timerId);
				    rNum-=bm;
				    if(oHandle['handle']){
				      $(oHandle['handle']+" a").attr("class",filter(oHandle['handle'])+"_out");
				      $(oHandle['handle']+" a:eq("+rNum+")").attr("class",filter(oHandle['handle'])+"_over");
				    }
				    (fn)(rNum);
				  }else{
				    for(var i=0;i< oBoxs.length;i++){
				      var rw=(rNum*sWidth-swing(num/step)*sWidth*bm)*ratios[i];
				      ID(oBoxs[i]).scrollLeft=rw;
				    }
				  }
				}
		  }
	  }

		toLeft=function(bm){
		  clearInterval(timerId);
		  timerId=setInterval(run(1,(typeof(bm)=="number"&&bm >0?bm:1)),speed);
		}
		toRight=function(bm){
		  clearInterval(timerId);
		  timerId=setInterval(run(-1,(typeof(bm)=="number"&&bm >0?bm:1)),speed);
		}

	  if(auto){
	    autotimerId=setInterval((direc=='left'?toLeft:toRight),(second+5)*1000);
	  }
	  if(oHandle['pre']){
	    $(oHandle['pre']).click(function(){
	      clearInterval(autotimerId);
	      toLeft();
	    });
	  }
	  if(oHandle['next']){
	    $(oHandle['next']).click(function(){
	      clearInterval(autotimerId);
	      toRight();
	    });
	  }
	  if(oHandle['handle']){
	    $(oHandle['handle']+" a").click(function(){
	      clearInterval(autotimerId);
        var cdx=$(oHandle['handle']+" a").index(this);
        if(cdx < rNum){
          toRight(rNum-cdx);
        }else if(cdx > rNum){
          toLeft(cdx-rNum);
        }
	    });
	  }
	}
}

function confirmurl(url){
  if(confirm("您确定要删除吗？删除后不可恢复！")){
  	window.location=url;
  }
}