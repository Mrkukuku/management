export const Common={
    data(){
        return {
            module:'user',    //模块
            currentPage: 1,    //第几页
            total:100,      //总条数
            rows:10,        //一页几条
            ids:[],         //全选多选的id
            dialogVisible:false,     //是否显示新增修改弹框
            FrozenVisible:false,     //是否显示冻结弹框
            options:[],
            unitid_flag:false,
            Treedata: [],
            tableData: [],//表格数据
            filterText: '',//树节点筛选值
            defaultProps: { //树
                children: 'children',
                label: 'label'
            },
            
        }   
    },
    methods:{
        renderContent(h, { node, data}) { //树前小图标
            return (
            <span>
                <i class={data.icon}></i>
                &nbsp;<span>{node.label}</span>
            </span>
            );
        },
        filterNode(value, data) {//树节点筛选
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        opendialog(num){   //打开新增表单弹框
            this.dialogVisible=true;
            
            if(this.module=='user'||this.module=='unit'){
                this.DropdownData();
            }
            if(this.module=='train/task'){
                this.filelist();
                this.factorylist();
            }
            if(this.module=='user'){
                
                if(this.ruleForm.id){
                    this.updateVisible=false;
                }else{
                    if(this.companyId==-1){
                        this.dialogVisible=false;
                        this.$alert('请选择单位', '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                    this.updateVisible=true;
                }
            }
            if(this.module=='unit'){
                if(num==0){
                    this.ruleForm.unitId=-1;
                    this.dialogVisibleunit=true;
                    this.detailFlag =false
                }else{
                    if(this.unitId==-1){
                        this.$alert('请选择单位', '提示', {
                            confirmButtonText: 'OK',
                        });
                    }else{
                        this.dialogVisibleunit=true;
                        if ( num == 1 ) {
                            this.axios({
                                url:"/api/admin/unit/single",
                                method:"post",
                                data:{
                                    id:this.unitId
                                }
                            }).then ( res => {
                                this.currentWindow.position=[res.data.data.longitude,res.data.data.latitude];
                                this.markermap = [{
                                    position: [res.data.data.longitude,res.data.data.latitude],
                                }];
                                this.center=[res.data.data.longitude,res.data.data.latitude]
                                this.currentWindow.content='经纬度:'+res.data.data.longitude+','+res.data.data.latitude+'<br/>地址:'+res.data.data.address;
                                this.currentWindow.visible=true;
                            })
                            this.detailFlag =false
                        }
                    }
                }
                // this.ruleForm.address = "浙江鼎任"
            }
            // if(this.module === 'building') {
            //      this.ruleForm.unitId =''
            // }
        },
        closedialog(){  //关闭新增表单弹框
            
            if(this.module=='unit'){
                this.dialogVisibleunit=false;
            }else{
                this.dialogVisible=false;
            }
            this.handleReset();

            if( this.module === 'building') {
                // this.getData();
                this.ruleForm.unitId = this.buildId//重置表单后给unitId赋值
                
            }
            if( this.module === 'phone') {
                this.ruleForm.unitId = this.companyId//重置表单后给unitId赋值
            }
           
        },
        handleSubmit(name){     //表单提交
            if(this.module=='user'){
                this.ruleForm.companyId=this.companyId;
            }
            if(this.module=='phone'){
                this.ruleForm.deviceIdList=[];
                for(var i=0;i<this.deviceIdList.length;i++){
                    this.ruleForm.deviceIdList[i]=this.deviceIdList[i][1];
                }
            }
            var _this=this;
            this.$refs[name].validate((valid)=>{
                if(valid){
                   
                    _this.loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    setTimeout( ()=> {
                        if ( _this.loading ) {
                            _this.loading.close()
                            _this.loading = ""
                        }
                    },12000)
                    if(this.$refs.ruleForm.model.id || this.ruleForm.id ){
                        // edit
                        var url_update='/api/admin/'+this.module+'/update';

                        if(this.module=='installationInformation'){
                            url_update='/api/admin/device/install.update'
                        }
                        this.axios({
                            url   :url_update,
                            method: 'post',
                            data:this.ruleForm
                        // data
                        }).then(res=>{
                            if(res.data.code==0){
                                _this.getData();
                                if ( _this.loading ) {
                                    _this.loading.close()
                                    _this.loading = ""
                                }
                                _this.$alert('修改成功', '提示', {
                                    confirmButtonText: 'OK',
                                    callback:() => {
                                        _this.closedialog();
                                    }
                                });
                                
                            }else{
                                if ( _this.loading ) {
                                    _this.loading.close()
                                    _this.loading = ""
                                }
                                _this.$alert(res.data.msg, '提示', {
                                    confirmButtonText: 'OK',
                                });
                            }                       
                        })
                    }else{
                        delete this.ruleForm.id;
                        if(this.module=='unit'){
                            this.ruleForm.unitId=this.unitId;
                        }
                        if(this.module=='user'){
                            this.ruleForm.unitId=this.companyId;
                        }
                        if(this.module=='device'){
                            this.ruleForm.unitId=this.unitId;
                        }
                    
                        // add
                        var url="/api/admin/"+this.module+"/register";
                        if(this.module=='train/task'||this.module=='phone' || this.module === 'building' || this.module === 'device'){
                            url="/api/admin/"+this.module+"/add";
                        }
                        if(this.module=='installationInformation'){
                            url='/api/admin/device/install.add'
                        }
                        this.axios({
                            url   : url,
                            method: 'post',
                            data  : this.ruleForm
                        }).then(res=>{    
                            if(res.data.code==0){
                                if(_this.module=='unit' || _this.module === 'building'){
                                    _this.Treeunit();
                                }
                                _this.getData();
                                if ( _this.loading ) {
                                    _this.loading.close()
                                    _this.loading = ""
                                }
                                _this.$alert('添加数据成功!', '提示', {
                                    confirmButtonText: 'OK',
                                    callback:() => {
                                        _this.closedialog();                                 
                                    }
                                });

                            }else{
                                if ( _this.loading ) {
                                    _this.loading.close()
                                    _this.loading = ""
                                }
                                _this.$alert(res.data.msg, '提示', {
                                    confirmButtonText: 'OK',
                                });
                            }                                             
                        })
                    
                    }
                }else{
                    this.$alert('添加数据失败,请填完必填字段!', '提示', {
                        confirmButtonText: 'OK',
                    });
                    return false;
                }
            })
        },
        handleReset (name) {    //表单重置
            
            if(this.module=='device/lib'|| this.module=='user' || this.module === 'building'){
                this.posterURL = '';
                this.posterURL1 = '';
                if(name){
                    var id=this.ruleForm.id;
                    var usertype=this.ruleForm.userType;
                   
                    this.$options.data().ruleForm.password="";
                    Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
                    this.ruleForm.id=id;
                    this.ruleForm.userType=usertype;
                }else{
                    Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
                }
                // 
                if( this.module === 'building') {//清空
                    this.exits = [];
                    this.ruleForm.id = this.buildingId
                    this.ruleForm.unitId = this.buildId
                }
            }else if(this.module=='train/file'){
                this.upload = '';
            }else{
                if(this.module=='train/task'){
                    this.unitIds_cascader=[];
                }
                if(name){
                    var id=this.ruleForm.id;
                    Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
                    this.ruleForm.id=id;
                }else{
                    Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
                }
            }
            if(this.module=='phone'){
                this.deviceIdList=[];
            }
        },
        handleFrozen(id,isFrozen){     //封号弹框打开
            if(isFrozen){
                var _this=this;
                this.axios({
                    url   :'api/admin/'+this.module+'/frozen.reason',
                    method: 'post',
                    data:{
                        unitId:id
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        var startTime=_this.$moment(res.data.data.startTime).format("YYYY-MM-DD HH:mm");
                        var endTime=_this.$moment(res.data.data.endTime).format("YYYY-MM-DD HH:mm");
                        const confirmText = ['冻结时间:\n\n\n'+startTime+'\n至\n'+endTime,'冻结原因:\n'+res.data.data.frozenDesc, '你确定要解冻吗?'] 
                        const newDatas = []
                        const h = _this.$createElement
                        for (const i in confirmText) {
                        newDatas.push(h('p', null, confirmText[i]))
                        }
                        _this.$confirm(
                            '提示',
                            {
                            title: '提示',
                            message: h('div', null,newDatas),
                            showCancelButton: true,
                            confirmButtonText: '解冻',
                            cancelButtonText: '取消',
                            // type: 'warning'
                            }
                        )
                        .then(()=> {
                            _this.axios({
                                url   :'api/admin/'+_this.module+'/frozen.un',
                                method: 'post',
                                data:{
                                    unitId:id
                                }
                            }).then(res=>{
                                if(res.data.code==0){
                                    _this.FrozenReset(); 
                                }else{
                                    _this.$alert(res.data.msg, '提示', {
                                        confirmButtonText: 'OK',
                                    });
                                }
                                _this.getData();
                            })
                        })

                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                    _this.getData();
                })
            }else{
                this.FrozenForm.unitId=id;
                this.FrozenVisible=true;
            }
        },
        FrozenReset(){      //重置封号冻结原因    
            Object.assign(this.$data.FrozenForm,this.$options.data().FrozenForm);
            delete(this.FrozenForm.id);
        },
        closeFrozen(){  //关闭封号冻结框
            this.FrozenVisible=false;
            this.FrozenReset();
        },
        FrozenSubmit(name){     //封号冻结提交
            this.$refs[name].validate((valid)=>{
                if(valid){
                    var _this=this;
                    this.FrozenForm.startTime=this.FrozenForm.time[0];
                    this.FrozenForm.endTime=this.FrozenForm.time[1];
                    delete this.FrozenForm.time;
                    this.axios({
                        url   :'api/admin/'+this.module+'/frozen',
                        method: 'post',
                        data:this.FrozenForm
                    }).then(res=>{
                        if(res.data.code==0){
                             
                            _this.$alert('冻结成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:() => {
                                    _this.FrozenVisible=false;
                                    _this.FrozenReset();
                                }
                            });
                        }else{
                            _this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }
                        _this.getData();
                    })
                }
            })
            
        },
        handleDelete(id){     //表格一条数据删除
            var _this=this;
            var Id = id
            if( this.module === 'phone') {
                Id = [id]
            }
            var url='/api/admin/'+this.module+'/delete'
            if(this.module=='installationInformation'){
                url='/api/admin/device/install.delete'
            }
            this.$confirm('你确定要删除吗')
                .then(()=> {
                    this.axios({
                    url:url,
                    method:'post',
                    data:{
                        id:Id,
                    }
                    }).then(res=>{
                        if(res.data.code==0){
                             _this.$alert('删除成功', '提示', {
                                confirmButtonText: 'OK',
                            });                           
                        }else{
                            _this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }
                        _this.getData();
                        if(_this.module=='unit'){
                            _this.Treeunit();
                        }
                    })
                })
        },
        SelectionChange(selection){  //表格前全选多选
            var selectionLen = selection.length;
            if(selectionLen>0){
                for(let i=0;i<selectionLen;i++){
                    this.ids[i]=selection[i].id;
                    
                }
            }
        },
        deleteall(){    //批量删除
            var _this=this;
            this.$confirm('你确定要删除吗')
            .then(()=> {
                _this.axios({
                  url:'api/admin/'+this.module+'/delete.list',
                  method:'post',
                  data:{
                    idList: this.ids,
                  }
                }).then(res=>{
                    if(res.data.code==1){
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                    _this.getData();
                })
            })
        },
        editData(id,type){       //点击表格修改按钮
            var _this=this;
            var url="/api/admin/"+this.module+"/single"
            if(_this.module === "mark"){
                url='/api/admin/mark/list'
            }
            this.axios({
                url:url,
                method:'post',
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.data.code==0){
                     _this.ruleForm=res.data.data;
                     if(type==1){
                        delete _this.ruleForm.id;
                        this.ruleForm.regionType=1;
                    }
                    if(_this.module=='device/lib'){
                        _this.ruleForm.intelligentFireSystemId=String(_this.ruleForm.intelligentFireSystemId);
                        _this.ruleForm.protocolId=String(_this.ruleForm.protocolId);
                        _this.ruleForm.accessType=String(_this.ruleForm.accessType);
                        _this.ruleForm.deviceTypeId=String(_this.ruleForm.deviceTypeId);
                        _this.posterURL=_this.ruleForm.deviceImgUrl
                        _this.openupdatedialog();
                    }else{
                        if(_this.module === 'phone'){
                            _this.deviceIdList=[];
                            for(var i=0;i<_this.ruleForm.deviceIdList.length;i++){
                                _this.$set(this.deviceIdList,i,[]);
                                _this.$set(this.deviceIdList[i],0,1);
                                _this.$set(this.deviceIdList[i],1,_this.ruleForm.deviceIdList[i]);
                                
                            }
                            _this.opendialog();
                        }else{
                            if(_this.module=='train/task'){
                                _this.ruleForm.trainFileId=Number(_this.ruleForm.trainFileId);
                                //字符串转数组
                                var bb= _this.ruleForm.note.split('-');
                                var ee=[];
                                for(var i=0;i<bb.length;i++){
                                    var cc=[];
                                    var dd=bb[i].split(',');
                                    for(var j=0;j<dd.length;j++){
                                        dd[j]=Number(dd[j]);
                                        cc[j]=dd[j]
                                    }
                                    ee.push(cc);           
                                }
                                _this.unitIds_cascader=ee;
                            }
                            if(_this.module=='user'){
                                _this.posterURL=_this.ruleForm.avatar;
                                _this.posterURL1=_this.ruleForm.certificateImage;
                                _this.ruleForm.certificated=String(_this.ruleForm.certificated)
                                _this.$set(_this.ruleForm,'password', '')
                                _this.$set(_this.ruleForm,'repassword', '')
                            }
                            if(_this.module=='unit'){
                                // _this.ruleForm.typeName=_this.ruleForm.type;
                                if ( type == 3 ) {
                                    _this.detailFlag = true
                                }else{
                                    _this.detailFlag = false
                                }
                                _this.ruleForm.important=_this.ruleForm.important && String(_this.ruleForm.important)||'0';
                                _this.ruleForm.station=_this.ruleForm.station && String(_this.ruleForm.station)||'0';
                                _this.ruleForm.fireControlStation=String(_this.ruleForm.fireControlStation);
                                setTimeout(() => {
                                    this.center=[res.data.data.longitude,res.data.data.latitude]
                                    this.markermap = [{
                                        position: [res.data.data.longitude,res.data.data.latitude],
                                    }];
                                    this.currentWindow.position=[res.data.data.longitude,res.data.data.latitude];
                                    this.currentWindow.content='经纬度:'+res.data.data.longitude+','+res.data.data.latitude+'<br/>地址:'+res.data.data.address;
                                    this.currentWindow.visible=true;
                                },500)
                            }
        
                            if(_this.module === 'mark'){
                                _this.ruleForm = res.data.data[0]
                            }
        
                            if( _this.module === 'building') {//回显
                                _this.ruleForm.id = id
                                _this.exits = res.data.data.exits
                                _this.buildingId = id
                            }
                            
                            _this.opendialog();
                        }
                    }
                   
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                } 
            })
        },
        getData(){      //获取表格列表
            var _this=this;
            if(this.module=='unit'){
                this.axios({
                    url   :'/api/admin/'+this.module+'/list',
                    method: 'post',
                    data:{
                        pageNum: this.currentPage,
                        pageSize: this.rows,
                        unitId:this.unitId,
                        name:this.unitname,
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        _this.tableData = res.data.list;          
                        _this.total= res.data.total;
                        _this.currentPage= res.data.pageNum;
                        if(_this.tableData){
                            for(var i=0;i<_this.tableData.length;i++){
                                _this.tableData[i].createdTime=_this.$moment(_this.tableData[i].createdTime).format("YYYY-MM-DD");
                            }
                        }
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
            }else if(this.module=='user' || this.module === 'phone'){
                
                this.axios({
                    url   :'/api/admin/'+this.module+'/list',
                    method: 'post',
                    dataType:'json',
                    data:{
                        unitId:this.companyId,
                        pageNum: this.currentPage,
                        pageSize: this.rows,
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        _this.tableData = res.data.list;            
                        _this.total= res.data.total;
                        _this.currentPage= res.data.pageNum;
                        if( _this.module === 'phone') {
                            this.tableData.map( ( item ) => {
                                item.startTime = item.startTime && _this.$moment(item.startTime).format("YYYY-MM-DD HH:mm") || ''
                                item.endTime = item.endTime && _this.$moment(item.endTime).format("YYYY-MM-DD HH:mm") || ''
                            })
                        }
                        

                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
            } else if ( this.module == "device") {
                var _this=this;
                this.axios({
                    url   :'/api/admin/device/list',
                    method: 'post',
                    data  : {
                        pageNum: this.currentPage,
                        pageSize: this.rows,
                        unitId:this.companyId,
                        systemId:this.system,
                        deviceType:this.devicestype,
                        online:this.onLine,
                        deviceName:this.deviceName,
                        now:this.overDueTime
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        _this.tableData=res.data.list;
                        _this.total= res.data.total;
                        _this.currentPage= res.data.pageNum;
                        _this.overDueTime = null;
                        _this.tableData.map( ( item ) => {
                            if(item.online==1){
                                item.online='在线';
                            }else if(item.online==2){
                                item.online='离线';
                            }else{
                                item.online='故障';
                            } 
                        })
                    }
                })
            }
            else if ( this.module === 'log' ) {
                this.axios({
                    url   :'/api/admin/'+this.module+'/list',
                    method: 'post',
                    dataType:'json',
                    data:{
                        unitId:this.companyId,
                        pageNum: this.currentPage,
                        pageSize: this.rows,
                        username:this.username,
                        type:this.type,
                        startTime:this.startTime,
                        endTime:this.endTime,
                        isBackSystem:this.isBackSystem,
                        
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        _this.tableData = res.data.list;            
                        _this.total= res.data.total;
                        _this.currentPage= res.data.pageNum;
                        this.tableData.map( ( item ) => {
                            item.createdTime = item.createdTime && _this.$moment(item.createdTime).format("YYYY-MM-DD HH:mm:ss") || ''
                        })
                      
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })

            } else if (this.module === 'mark' ) {
                this.axios({
                    url : '/api/admin/'+this.module+'/list',
                    method:'post',
                    dataType:'json',
                    data:{
                        scoreType:1
                    }
                }).then( res => {
                    if( res.data.code === 0) {
                        _this.tableData = res.data.data
                    }
                }).catch( error => console.log( error ))
            }
            else if ( this.module === 'building' ) {
                this.axios({
                    url:'/api/admin/'+this.module+'/unit',
                    method:"post",
                    data:{
                        unitId:this.buildId,
                        pageNum: this.currentPage,
                        pageSize: this.rows,
                        type: this.type,
                        structure: this.type1,
                    }
                }).then ( res => {
                    if( res.data.code === 0 ) {
                        // var time = _this.$moment(res.data.list.constructionTime).format("YYYY-MM-DD HH:mm")
                        
                        _this.tableData = res.data.list;
                        
                        _this.tableData.map( ( item ) => {
                            item.constructionTime = item.constructionTime && _this.$moment(item.constructionTime).format("YYYY-MM-DD") || ''
                        })
                        _this.total= res.data.total;
                        _this.currentPage= res.data.pageNum;
                        _this.ruleForm.unitId = this.buildId//重置表单后给unitId赋值
                        
                    }
                })
                
               
            }else if(this.module==='installationInformation'){
                this.axios({
                    url:'/api/admin/device/install.search',
                    method:"post",
                    data:{
                        unitId:this.unitId,
                        pageNum: this.currentPage,
                        pageSize: this.rows,
                    }
                }).then ( res => {
                    if( res.data.code === 0 ) {
                        _this.tableData = res.data.list;
                        _this.total= res.data.total;
                        _this.currentPage= res.data.pageNum;
                        _this.ruleForm.unitId = this.unitId//重置表单后给unitId赋值
                        
                    }
                })
            } else if ( this.module === "AreaModuleConfiguration")  {
                this.axios({
                    url:"/api/admin/area/search/page",
                    method:"post",
                    data:{
                        pageNum: this.currentPage,
                        pageSize: this.rows,
                    }
                }).then( res => {
                    this.tableData = res.data.list
                    this.tableData.map( item => {
                       for ( var i = 0; i<item.unitNameList.length; i++ ) {
                           item.unitNameList[i] += " "
                       }
                    })
                    this.total = res.data.total
                })
         } 
         else if ( this.module === "PollingTask") {
               
         }
            
            else{
                if(this.module === 'equipment'){
                    this.module='device/lib';
                }
                this.axios({
                    url   :'/api/admin/'+this.module+'/list',
                    method: 'post',
                    dataType:'json',
                    data:{
                        unitId:sessionStorage.getItem('unitId'),
                        pageNum: this.currentPage,
                        pageSize: this.rows,
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        _this.tableData = res.data.list;
                        _this.total= res.data.total;
                        _this.currentPage= res.data.pageNum;
                        if(_this.module=='device/lib'){
                            _this.page=Math.ceil(_this.total/10)
                            if(res.data.list){
                                _this.show=true;
                            }else{
                                _this.show=false;

                            }
                        }
                        if(_this.module=='train/task'){
                            _this.unitIds_cascader=_this.ruleForm.unitIds;
                            if(_this.tableData){
                                for(var i=0;i<_this.tableData.length;i++){
                                    _this.tableData[i].trainTime=_this.$moment(_this.tableData[i].trainTime).format("YYYY-MM-DD");
                                }
                            }
                        }
                        if(_this.module=='train/file'){
                            _this.tableData.map( (item) =>{
                                item.createdTime = item.createdTime && this.$moment( item.createdTime).format("YYYY-MM-DD HH:mm") || ''
                            })
                        }
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
            }
        },
        Treeunit(){     //单位树
            var _this=this;
            var url="api/admin/unit/list.left";
            if(this.module=="unit"){
                url="/api/admin/unit/list/left";
            }
            this.axios({
                url   :url,
                method: 'post',
                params  : {
                    pageNum:1,
                    pageSize:1000,
                }
            }).then(res=>{
                if(res.data.code==0){
                    if(res.data.data){
                        _this.Treedata= Object.freeze(res.data.data) 
                        if(_this.module=='unit'){
                            // _this.unitId=-1;
                            _this.unitid_flag=true;
                        }
                        if( _this.module === 'building' || _this.module === 'phone' || _this.module === 'PollingTask' || _this.module === "MaintenancePlan" ) {//建筑物区域
                            _this.data=res.data.data
                        }
                        for(var i=0;i<_this.Treedata.length;i++){
                            _this.Treedata[i].icon='el-icon-folder';
                        }
                    } 
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        getBuildOptions (id,options) {//获取建筑物区域管理的options
            var _this = this
           this.axios({
               url:'/api/admin/'+this.module+'/dict',
               method:'post',
               data:{
                id
               }

           }).then( res => {
               _this[options] = res.data.data
           })
        }
    },
    mounted(){
         if(this.module=='user' || this.module ==='building' || this.module === 'phone' || this.module === 'device'|| this.module === 'log' || this.module=='SmsPhone' || this.module=='ImportantAlarm'|| this.module=='installationInformation' || this.module === "PollingTask" || this.module === "MaintenancePlan"|| this.module == 'inspectionRecord'){
             if(sessionStorage.getItem('userTypes')!=3){
                this.Treeunit();
             }
        }
        if(this.module=='unit'){
            if(sessionStorage.getItem('userTypes')==1){
                this.Treeunit();
            }else{
                this.getData();
            }
        }else if(this.module==='SmsPhone' || this.module==='ImportantAlarm' || this.module ==="MaintenancePlan" || this.module == "AudioConfig"|| this.module ==='building'){
        }else{
            this.getData();
        }
         
        if( this.module === 'building') {//获取建筑下拉框字段
            this.getBuildOptions(1,'fireFightingOPtions')
            this.getBuildOptions(2,'fireResistanceOptions')
            this.getBuildOptions(3,'propertyOptions')
            this.getBuildOptions(4,'fireRiskOptions')
            this.getBuildOptions(5,'constructionOptions')
            this.getBuildOptions(6,'typeOptions')
            this.getBuildOptions(7,'exitsOPtions')
        }
      },
      watch:{
        unitid_flag:function(){
            this.getData();
        },
        filterText(val) {
            this.$refs.tree.filter(val);
          }
      }
}