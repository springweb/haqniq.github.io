var STEE_ADD="",/*定义音视频的播放地址*/
    VIDEO_EXT=".flv";/*定义视频的播放格式*/

function startSearch(tid,kw){
  if($.trim($('#'+kw).val())==''||$.trim($('#'+kw).val())=='请输入关键字'){
  	$('#'+kw).focus();
    return false;
  }
  return true;
}

$(function(){
	var sHtml=$.trim($(".cont_list_title .tl").html());
	if(sHtml!=""){
	  $(".cont_list_title .tl").html(sHtml.replace(/摘选于：/gi,""));
	}

	$("#menuList .menu_sub").each(function(dx){
	   if($(this).css("display")=="block"&&dx>6){
	     $("#menuList").parent().scrollTop(100);
	   }
	});
  $("#showKwAndDes").click(function(){
  	var pObj=$(".document_read")[0],xy=p.getPos(pObj),cLeft=0,cTop=0;
    if(!p.ID("showKwAndDesPan")){
      $("body").append('<div id="showKwAndDesPan" style="width:500px;min-height:110px;_height:110px;left:0px;top:0px;position:absolute;z-index:99;background:#edecf1;border:2px solid #9ea0b5;">'+
       '<div style="width:100%;height:25px;"><div style="width:460px;height:20px;float:left;font-size:14px;line-height:25px;font-weight:bold;padding-top:5px;">'+$(".cont_list_title .tl b").html()+'</div><a style="display:block;height:25px;width:25px;line-height:25px;font-size:25px;_font-size:18px;float:right;color:#333;font-weight:bold;" onclick="$(\'#showKwAndDesPan\').hide()" href="javascript:void(0)">×</a></div>'+
       '<div style="width:480px;text-align:left;padding:10px;color:#161c55;line-height:18px;font-size:13px;"><b>关键字：</b>'+$("#cKeywords").html()+'<br/><b>摘　要：</b>'+$("#cDescription").html()+'</div>'+
       '</div>');
    }
    cLeft=($(pObj).width()-$("#showKwAndDesPan").width())/2+parseInt(xy['x']);
    cTop=($(pObj).height()-$("#showKwAndDesPan").height())/2+parseInt(xy['y']);
    $("#showKwAndDesPan").css({'left':cLeft,'top':cTop});
    $("#showKwAndDesPan").show();
  });
})

function checkDisk(){

}
