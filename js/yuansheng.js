
//导航onmouseover
(function($, window, undefined) {
    // outside the scope of the jQuery plugin to
    // keep track of all dropdowns
    var $allDropdowns = $();

    // if instantlyCloseOthers is true, then it will instantly
    // shut other nav items when a new one is hovered over
    $.fn.dropdownHover = function(options) {

        // the element we really care about
        // is the dropdown-toggle's parent
        $allDropdowns = $allDropdowns.add(this.parent());

        return this.each(function() {
            var $this = $(this).parent(),
                defaults = {
                    delay: 500,
                    instantlyCloseOthers: true
                },
                data = {
                    delay: $(this).data('delay'),
                    instantlyCloseOthers: $(this).data('close-others')
                },
                options = $.extend(true, {}, defaults, options, data),
                timeout;

            $this.hover(function() {
                if(options.instantlyCloseOthers === true)
                    $allDropdowns.removeClass('open');

                window.clearTimeout(timeout);
                $(this).addClass('open');
            }, function() {
                timeout = window.setTimeout(function() {
                    $this.removeClass('open');
                }, options.delay);
            });
        });
    };

    $('[data-hover="dropdown"]').dropdownHover();
})(jQuery, this);

//slide 滑动间隔
$('.carousel').carousel({
  interval: 2000
})




//导航右侧弹出的div部分的hover事件
$(function(){
  $(".body_middle").hover(function(){
    $(this).css("display","block").siblings(".body_middle").css("display","none")
    
    },function(){
    
    $(".body_middle").eq(0).css("display","block").siblings(".body_middle").css("display","none")
    })
  
  
    
  }
);



//天猫必逛（第二个轮播-原生）
$(function(){
    var size=$(".each_lb_content").length;
    for(var i=0;i<size;i++){
        var li="<li>"+"</li>"
        $("#middle_leftbottom_tabs").append(li);
    }
//插入标签li
    $("#middle_leftbottom_tabs li").eq(0).addClass("selected");
    $(".each_lb_content").eq(0).show();
//第一个div显示（display：block ）
    var j=0,
        timer=null;
    timer=setInterval(autoPlay,2000)

//自动轮播事件
    function autoPlay(){
        j++;
        if(j==size){j=0;}
        change();
    }
    function change(){
        $("#middle_leftbottom_tabs li").eq(j).addClass("selected").siblings().removeClass("selected");
        $(".each_lb_content").eq(j).fadeIn().siblings().fadeOut();
    }
//封装autoPlay、change函数
    $("#middle_leftbottom_tabs li").click(function(){
        clearInterval(timer);
        $(this).addClass("selected").siblings().removeClass("selected");
        var index=$(this).index();
        $(".each_lb_content").eq(index).css("display","block").siblings().css("display","none")
        j=index;
        setTimeout(function(){setInterval(autoPlay,2000);},3000);       
    })
//onclick事件  延时执行timer  并且把点击的index值传给j
    $(".middle_leftbottom_left").click(function(){
        j--;
        if(j<0){j=size-1}
        change();      
    })
    $(".middle_leftbottom_right").click(function(){
        j++;
        if(j==size){j=0}
        change();
    })
//左滑动、右滑动onclick事件
    $("#middle_leftbottom").hover(function(){
        clearInterval(timer);
    },function(){
        timer=setInterval(autoPlay,2000);
    })
//容器鼠标停留 停止滚动，鼠标移开继续滚动
});



//右侧选项卡（充话费、游戏、旅行、车险部分）
$(function(){
  $("#rightpart_tab .rightpart_tab_contents").eq(0).show();
  $("#rightpart_tab_1stline li").mouseover(function(){
    $(this).css({"border-left":"1px solid red","border-right":"1px solid red","border-top":"1px solid red","border-bottom":"1px solid white"}).siblings().css({"border-left":"1px solid #CCC","border-right":"1px solid #CCC","border-bottom":"1px solid red","border-top":"none"});
    var m=$(this).index();
    $("#rightpart_tab .rightpart_tab_contents").eq(m+1).css("display","block").siblings(".rightpart_tab_contents").css("display","none")

  })
});




//阿里APP ：popover 设置hover属性，鼠标经过弹出
$(function(){
  $("#ali_popover li").popover({trigger:"hover",placement:"top",html:"true"})
});

$(function(){
  $("#body_doufu2_title-1 li").popover({trigger:"hover",placement:"bottom",html:"true"})
});






//淘宝头条（向上轮播）
$(function(){
  var i=0;      
      size=$(".scroll_part").length;
      Hei=$("#scroll_up").height();
  function autoPlay(){
  $(".scroll_part").eq(i).show().animate({top:-Hei});
  i++;
  if(i==size){i=0}
  $(".scroll_part").eq(i).show().css("top",Hei).animate({top:"0px"})
  }
  setInterval(autoPlay,2000);
})



//充话费、游戏、选项卡中插入X，绑定点击关闭事件
$(function(){
    var x="<label>X</label>",   
        size=$("#rightpart_tab .rightpart_tab_contents").length;
    for(var i=1;i<size;i++){
    $("#rightpart_tab .rightpart_tab_contents").eq(i).append(x);

    }   
    $(".rightpart_tab_contents label").click(function(){
        $(".rightpart_tab_contents label").css("color","white");
        $("#rightpart_tab_1stline li").css({"border-right":"1px solid #CCC","border-bottom":"1px solid #CCC","border-top":"none","border-left":"none"})
        $("#rightpart_tab .rightpart_tab_contents").eq(0).css("display","block").siblings(".rightpart_tab_contents").css("display","none");
    })  
})







//选项卡
function xuanxiangka1(nav_className,div_className){
	var navs=document.getElementsByClassName(nav_className);
	var divs=document.getElementsByClassName(div_className);
	for(var i=0;i<navs.length;i++){
		navs[i].index=i;
		navs[i].onmouseover=function(){
			for(i=0;i<navs.length;i++){
				
				divs[i].style.display="none";
				}
			
			divs[this.index].style.display="block";	
			}
		}
	}
	
//左侧onmouseoverout还原  选项卡
function xuanxiangka2(){
	var nav_groups=document.getElementsByClassName("nav_group");
	var body_middles=document.getElementsByClassName("body_middle");
	//标签触发事件
	for(var i=0;i<nav_groups.length;i++){
		nav_groups[i].index=i;
		
		nav_groups[i].onmouseover=function(){
			for(i=0;i<nav_groups.length;i++){
			body_middles[i].style.display="none";
			nav_groups[this.index].style.backgroundColor="#F94A14";
			
			}
			body_middles[this.index+1].style.display="block";
			
		}
		
		nav_groups[i].onmouseout=function(){
			
			for(i=0;i<body_middles.length;i++){
				body_middles[i].style.display="none";
				nav_groups[this.index].style.backgroundColor="#FF6905";
				
				}
				body_middles[0].style.display="block";
			}
	
	}
}

xuanxiangka1("title","content_block");
addLoadEvent(xuanxiangka2);



 $("#footer li").after("<li>|</li>");   //footer 插入|


 $("#request").click(function(){
    $.ajax({
      url:"request.json",
      error:function(){
        $("#response").html("Loading  =_=!! ")
      }

    })

})                                       //ajax  success:function(){};