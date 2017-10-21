$("#list li").click(function(){
    var music_name=$(this).attr("title");
	$(this).addClass("selected").siblings().removeClass("selected");
	$("#h1").html(music_name);	
	load("/media/"+music_name);
})
//音乐列表点击事件


var xhr=new XMLHttpRequest();
var ac = new (window.AudioContext||window.webkitAudioContext)();
var gainNode=ac[ac.createGain?"createGain":"createGainNode"]();	   
//创建音量控制对象
gainNode.connect(ac.destination);								   
//音量控制对象 连接api进行控制播放
var analyser=ac.createAnalyser();

//创建音频分析器
var size=32;
//实时音频数据个数
analyser.fftSize=size*2;
//设置音频 频域（实时频域个数的2倍）
analyser.connect(gainNode);
//bufferSource-analyser-gainNode-destination 连接链
var cur_source=null;											   
//当前资源
var bufferSource;
var count=0; 
//当前请求数   进行请求处理限制 （在一个请求load或者encode之前，继续发送请求，会继续进行cur_source赋值。）
function load(url){
	++count;
	var n=count;
	//进行load，则全局++count.
	cur_source&&cur_source.stop();										   
	//短路算法，如果source存在，则执行source.stop();如果不存在，则选取source
	xhr.abort(); 
	//新的load发生时，中断其他当前请求            ？？？单独使用有疑问？？？ 如果某个操作需要一系列的操作顺序完成，而这其中出现任何异常，都会导致当前操作的结束，当检测到某个步骤出现异常时，使用abort()方法，中止当前的处理。
	xhr.open("GET",url);
	xhr.responseType="arraybuffer";
	xhr.onload=function(){
		if(n!=count)return;
		//如果新请求发生，当前onload阶段请求 退出
		ac.decodeAudioData(xhr.response,function(buffer){           
		//音频数据解析
			if(n!=count)return;
			//如果新请求发生，当前encode解码阶段请求 退出
			bufferSource=ac.createBufferSource();     			
			//创建分配音频 缓冲资源区
			bufferSource.buffer=buffer;								
			//缓存资源区=文件缓存
			bufferSource.connect(analyser);							
			bufferSource.start(0);									
			//进行播放（setoff=0 可选）
			cur_source=bufferSource;
			//请求成功，并encode，进行保存
		},function(err){
			console.log(err);
		});
	}
	xhr.send();
}
			

function changeVolume(percent){
	gainNode.gain.value=percent;   //percent*percent   单位更小，更精准
}
$("#volume").change(function(){
	changeVolume(this.value/this.max);
})
//音量控制函数




function visualize(){
	var array=new Uint8Array(analyser.frequencyBinCount);
	//创建 ！！长度！！为analyser.frequrencyBinCount的 8位无符号整型类型化数组  ！！uint8是指0 ~ 2^8-1=255数据类型（共256位），一般在图像处理中很常见。
	analyser.getByteFrequencyData(array);
	//复制音频频域数据到数组中
	requestAnimationFrame=window.requestAnimationFrame||
						  window.webkitRequestAnimationFrame||
						  window.mozRequestAnimationFrame;
	//定义重绘函数  (动画)更加流畅   (不同浏览器兼容处理)
	function v(){
		analyser.getByteFrequencyData(array);
		draw(array);
		requestAnimationFrame(v);
		//函数按频率重复执行	
	}
	//复制音频数据
	requestAnimationFrame(v);
	//按设备重绘频率，更新音频数组数据, 得到实时音频数组，从而进行canvas绘制。
}
visualize();



var box=$("#box"),
	height=box.height(),
	width=box.width();

var canvas=document.createElement("canvas");
var ctx=canvas.getContext("2d");
var line;
$("#box").append(canvas);
function resize(){
	canvas.height=box.height();
	canvas.width=box.width();
	//将右侧容器宽高 赋值给画布
	line=ctx.createLinearGradient(0,0,0,height);
	//定义渐变色（从左向右），作为矩形的填充样式
	line.addColorStop(0,"red");
	line.addColorStop(0.5,"yellow");
	line.addColorStop(1,"green");
	//设置渐变色 红-黄-绿
	createDots();
	//窗口改变时，点状重新绘制
}
resize();
window.onresize=resize;
//窗口、框架大小调整时，调用resize进行改变




draw.type="column";	
//设置默认 绘制样式为柱状。全局变量，避免每次绘制再次赋值
$(".nav li").click(function(){
	$(this).addClass("selected").siblings().removeClass("selected");
	draw.type=$(this).attr("data-type");
})

//点击事件 放在draw.type定义之后

function draw(arr){
	//绘制音频
	ctx.clearRect(0,0,width,height);
	//每次绘制，清空区域 ，避免叠加
	
	ctx.fillStyle=line;
	//将line 设置为填充样式      每次都会执行，防止被dot_color覆盖
	
	var w=(width/size)*1.15;
	//每个音频宽度=容器宽度/音频数据个数	
	for(var i=0;i<size;i++){
		if(draw.type=="column"){
			//遍历所有音频单位
			var h=arr[i]/256*height;
			//高度=音频单位/总数(占比)*容器高度  ？？array[i]/256 ？？  音频解码得到的数组
			ctx.fillRect(w*i,height-h,w*0.8,h);
			// fillReact(矩形左上角x，矩形左上角y，矩形宽度，矩形高度)   填充矩形
		}else if(draw.type=="dot"){
			ctx.beginPath();
			//beginPath() 丢弃任何当前定义的路径并且开始一条新的路径，避免和前一条路径连线。
			var o=Dots[i];
			var r=arr[i]/256*70;
			//根据音频大小，设置圆点半径在0-50之间，
			ctx.arc(o.x,o.y,r,0,Math.PI*2,true);
			var dot_color=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,r);
			//两个圆之间填充渐变色，（x1,y1,r1,x2,y2,r2）圆心坐标相同，r1=0,r2=r,绘制整个圆
			dot_color.addColorStop(0,"pink");
			dot_color.addColorStop(1,o.color);
			ctx.fillStyle=dot_color;
			ctx.fill();
		}
	}
}
//绘制填充 矩形图 





function random(m,n){
	return Math.round(Math.random()*(n-m)+m);
}
//返回 m~n 之间随机整数


function createDots(){
	 Dots=new Array();
	for(var i=0;i<size*2;i++){
		var x=random(0,width),
			y=random(0,height),
			//随机设置圆点 位置（x、y坐标）
			color="rgba("+random(0,255)+","+random(0,255)+","+random(0,255)+","+"0.6"+")"
			//随机设置圆点颜色
			Dots.push({
				x:x,
				y:y,
				color:color
			})
			//向Dots数组中添加 {x,y,color}数组
	}
}



