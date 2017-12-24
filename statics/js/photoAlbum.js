/*
常用相册代码
调用示例及说明
photoAlbum({
	  'slider_Ctrl':"#t_pcAlen", //拖动控制按钮
	  'thumbInner':"#thumbInner", //缩略图内容器
	  'thumbOuter',"#thumbOuter", //缩略图外容器
	  'showLoadProcess',"#showLoadProcess", //显示加载进度
	  'showCImg',"#showCImg",//图片显示容器，注意：以背景方式显示
	  'preBt',"#preBt", //显示上一张
	  'nextBt',"#nextBt", //显示下一张
	  'leftMBt',"#leftMBt", //显示缩略图上一张
	  'rightMBt',"#rightMBt",  //显示缩略图下一张
	  'showsourceURL',"#showsourceURL", //显示当前原图片地址
	  'phCTitle',"#phCTitle", //显示当前图片标题
	  'phCnum',"#phCnum",  //显示当前正在播放的图片序号
	  'phTnum',"#phTnum" //显示总的图片数量
	});
*/
function photoAlbum(idInfo){
	  if(!$(idInfo['slider_Ctrl'])[0]){return false;}
		var loadImgs,setUVL,center,move,run,curNum=0,ox,eObj=0,para={"tId":null,"mtp":"stop","speed":10,"intval":1},showImgId="showImgObj"+new Date().getTime(),
		    oObj=$(idInfo['thumbOuter']),iObj=$(idInfo['thumbInner']),deBg=$(idInfo['showLoadProcess']).css("background-image");

    $("body").append('<img id="'+showImgId+'" style="position:absolute;left:0px;top:0px;visibility:hidden;"/>');
    /*内置图片对象函数加载事件函数*/
    $("#"+showImgId).bind("load",function(){
    	 $(idInfo['showLoadProcess']).css("background-image","none");
    	 $(idInfo['showCImg']).css("background-image","url("+this.src+")");
		});
    /*图片上左右箭头按钮事件*/
		$(idInfo['preBt']).bind("click",function(){return loadImgs("pre");});
		$(idInfo['nextBt']).bind("click",function(){return loadImgs("next");});
    $(idInfo['leftMBt']).bind("mousedown",function(){para["mtp"]="right";run();});
    $(idInfo['leftMBt']).bind("mouseup",function(){para["mtp"]="stop";run();});
    $(idInfo['rightMBt']).bind("mousedown",function(){para["mtp"]="left";run();});
    $(idInfo['rightMBt']).bind("mouseup",function(){para["mtp"]="stop";run();});
    /*缩略图事件*/
		$(idInfo['thumbInner']+" li").hover(
		   function(){$(this).addClass("pic_turn_border");},
		   function(){if($(idInfo['thumbInner']+" li").index(this)!=curNum){$(this).removeClass("pic_turn_border");}}
		);
		$(idInfo['thumbInner']+" a").bind("click",function(){
			 loadImgs($(idInfo['thumbInner']+" a").index(this));
		});
    /*拖动块对象时间*/
		$(idInfo['slider_Ctrl']).hover(
	     function(){},
	     function(){}
		);
		$(idInfo['slider_Ctrl']).bind("mousedown",function(event){
			var allWidth=$(this).parent().width()-$(this).width();
			eObj=event.srcElement ? event.srcElement : event.target;
			eObj.setCapture();
			ox=event.clientX;
		});
		$(idInfo['slider_Ctrl']).bind("mouseup",function(event){
			if(!eObj){return false};
			var allWidth=$(this).parent().width()-$(this).width();
			eObj.releaseCapture();
			eObj=0;
		});
		$(idInfo['slider_Ctrl']).bind("mousemove",function(event){
			if(!eObj){return false};
			var allWidth=$(this).parent().width()-$(this).width(),nx=parseInt(this.style.left)+event.clientX-ox;
			if(nx< allWidth&&nx>0){
			  this.style.left=nx+"px";
			  move(allWidth,nx);
			  ox=event.clientX;
			}
		});
    setUVL=function(arr,sArr){
      for(var i=0;i< arr.length;i++){
        for(var j=0;j< sArr.length;j++){
          if(arr[i]==sArr[j]){
            return arr[i];
          }
        }
      }
      return sArr[0];
    };

    /*图片加载函数*/
		loadImgs=function(){
		  var cType=setUVL(arguments,["cur","url","next","pre"]),PICS=$(idInfo['thumbInner']+" a"),
		      mUrl=location.href.match(/#pic\d+$/gi),pUrl=location.href.match(/#pid\d+$/gi),
		      cNum=typeof(arguments[0])=="number"?arguments[0]:curNum,
		      cid=parseInt(mUrl ? mUrl[0].replace(/^#pic/gi,""):0);
			  cNum=cNum< 0 ? 0:(cNum> PICS.length-1?PICS.length-1:cNum);
			  curNum=curNum< 0 ? 0:(curNum> PICS.length-1?PICS.length-1:curNum);
		  switch(cType){
			  case "url":
             curNum=pUrl ? parseInt($("#"+pUrl[0].replace(/^#/gi,"")).attr("href").replace(/^#pic/gi,"")):(cid >PICS.length-1?PICS.length-1:(cid< 0?0:cid));
			  break;
			  case "cur":
			      curNum=cNum;
			  break;
			  case "next":
			      if(curNum+1 > PICS.length-1 && $("#nextThumbURL").attr("href")){
			        window.location.href=$("#nextThumbURL").attr("href");
			        return false;
			      }
			      curNum=curNum+1 > PICS.length-1?0:curNum+1;
			  break;
			  case "pre":
			   		if(curNum-1 && $("#preThumbURL").attr("href")){
			        location.href=$("#preThumbURL").attr("href");
			        return false;
			      }
			      curNum=curNum-1 < 0?PICS.length-1:curNum-1;
			  break;
		  }

      $(idInfo['showLoadProcess']).css("background-image",deBg);
      $("#"+showImgId).attr("src",$(PICS[curNum]).attr("rel"));
      $(idInfo['showsourceURL']).attr("href",$(PICS[curNum]).attr("role"));
      $(idInfo['phCTitle']).html($(PICS[curNum]).attr("title"));
	    $(idInfo['thumbInner']+" li").removeClass("pic_turn_border");
	    $(idInfo['thumbInner']+" li:eq("+curNum+")").addClass("pic_turn_border");
		  location.href="#pic"+curNum;
		  $(idInfo['phCnum']).html(curNum+1);
		  $(idInfo['phTnum']).html(PICS.length);
		  center();
		  return true;
		};
		/*拖动拖动块，拖动块移动函数*/
    move=function(){
    	var aLen=arguments[0],cLen=arguments[1],sLen=iObj.width()-oObj.width();
    	oObj[0].scrollLeft=cLen*sLen/aLen;
    };
    /*拖动块被动移动函数*/
    byMove=function(){
    	var cL=oObj[0].scrollLeft,aL=iObj.width()-oObj.width(),
    	    mL=$(idInfo['slider_Ctrl']).parent().width()-$(idInfo['slider_Ctrl']).width();
    	if(aL <=0){
    	  return false;
    	}else{
    	  $(idInfo['slider_Ctrl']).css("left",cL*mL/aL+"px");
    	}
    };
    /*图片居中*/
    center=function(){
      var eW=$(idInfo['thumbInner']).width()/$(idInfo['thumbInner']+" li").length;
      oObj[0].scrollLeft=(curNum-2)*eW;
      byMove();
    };
    /*自动移动函数*/
    run=function(){
      if(!para['speed']||para['mtp']=='stop'){clearTimeout(para['tId']);para['tId']=0;return false;};
      var iW=iObj.width(),iH=iObj.height(),oW=oObj.width(),oH=oObj.height(),
          oT=oObj[0].scrollTop,oL=oObj[0].scrollLeft;
			switch(para['mtp']){
				case "left":
						if(iW-oW-oL > 0){
						  oObj[0].scrollLeft+=para['speed'];
						}else{
						  para['mtp']=='stop';
						}
				break;
				case "right":
						if(oL > 0){
						  oObj[0].scrollLeft-=para['speed'];
						}else{
						  para['mtp']=='stop';
						}
				break;
				case "up":
					if(iH-oH-oT > 0){
					  oObj[0].scrollTop+=para['speed'];
					}else{
					  para['mtp']=='stop';
					}
				break;
				case "down":
					if(oT > 0){
					  oObj[0].scrollTop-=para['speed'];
					}else{
					  para['mtp']=='stop';
					}
				break;
		  }
		  byMove();
		  para['tId']=setTimeout(run,para['intval']);
    };
	  loadImgs("url");
}