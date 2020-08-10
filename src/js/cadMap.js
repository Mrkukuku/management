export default 	function cadMap(boxName,positionList,deviceId,flag,partId){
    var box = document.getElementById(boxName);
    //两个盒子大小
    var dotWidth=13
    var dotHeight=13
    var pulseWidth=16
    var pulseHeight=16
    var pulseBorder=3
    var big_div=0;
    function cadOnclick(event){
        
        if(document.querySelectorAll('#container>div')){
            big_div=document.querySelectorAll('#container>div');
            if(partId){
                for(var i=0;i<big_div.length;i++){               
                    if(big_div[i].id==partId){
                        box.removeChild(big_div[i])                 
                    }
                }
            }else{
                for(var i=0;i<big_div.length;i++){               
                    if(big_div[i].id==deviceId){
                        box.removeChild(big_div[i])                 
                    }
                }
            }
            
        }
        if(positionList){
            for(var j=0;j<positionList.length;j++){
                if(positionList[j].deviceId==deviceId){
                    positionList.splice(j,1);
                }
            }
        }
        // 获取当前鼠标距离盒子的距离
        var boxTop = event.clientY - box.offsetTop-document.querySelector('.dialog_log .el-dialog').offsetTop;
        var boxLeft = event.clientX - box.offsetLeft-document.querySelector('.dialog_log .el-dialog').offsetLeft;
        
        // 创建div盒子
        var odiv=document.createElement('div');
        var dot_div=document.createElement('div');
        var pulse_div=document.createElement('div');
        
        // 给div添加class
        if(partId){
            odiv.id=partId
            dot_div.className='dot dotnow partdot';
        }else{
            dot_div.className='dot dotnow';
            odiv.id=deviceId;
        }
        
        pulse_div.className='pulse';
        
        //设置dot的位置
        dot_div.style.left=boxLeft-dotWidth/2+'px';
        dot_div.style.top=boxTop-dotHeight/2+'px';
        
        //设置pulse的位置
        pulse_div.style.left=boxLeft-pulseWidth/2-pulseBorder+'px';
        pulse_div.style.top=boxTop-pulseHeight/2-pulseBorder+'px';
        

        // 把创建的盒子追加到页面上
        odiv.appendChild(dot_div)
        odiv.appendChild(pulse_div)
        box.appendChild(odiv);
        // console.log(partId)
        // console.log(deviceId)
        if(partId){
            // console.log(dot_div.style.left)
            // console.log(dot_div.style.top)
            positionList.push({
                x:parseInt(dot_div.style.left),
                y:parseInt(dot_div.style.top),
                partId:partId
        })
        // console.log(positionList)
        }else{
            // console.log(dot_div.style.left)
            // console.log(dot_div.style.top)
            positionList.push({
                    x:parseInt(dot_div.style.left),
                    y:parseInt(dot_div.style.top),
                    deviceId:deviceId
            })
            // console.log(positionList)
        }
        
    }
    
    if(flag==1){
        box.onclick=null;
    }else{
        box.onclick=cadOnclick;
    }
}

// 调用
{/* <div id="container"></div>
cadMap('container') */}