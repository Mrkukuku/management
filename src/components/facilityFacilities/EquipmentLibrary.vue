<template>
    <!-- 设备库 -->
    <div id="EquipmentLibrary" class="allcontent">
        <!-- 头部 -->
        <div class="top">
            <div>
                设备名称:
                <el-input v-model="name"></el-input>
                隶属系统:<el-select v-model="system" placeholder="--请选择--" @change="currentSel">
                    <el-option
                    v-for="item in intelligentFireList"
                    :key="item.code"
                    :label="item.description"
                    :value="item.code">
                    </el-option>
                </el-select>
                设备类型:<el-select v-model="type" placeholder="--请选择--">
                    <el-option
                    v-for="item in deviceTypeList"
                    :key="item.code"
                    :label="item.description"
                    :value="item.code">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="searchsubmit">查询</el-button>
                <el-button @click="searchReset">重置</el-button>
                <span v-if="Jurisdiction==-1">
                    <el-button type="primary" @click="openupdatedialog"><i class="el-icon-plus"></i> 新增</el-button>
                </span>
            </div>
        </div>
        <div class="bottom">
            <el-carousel :autoplay="false" arrow="always" @change="carouselChange" v-if="show">
                <el-carousel-item v-for="j in page" :key="j" style="text-align:center;padding:0% 5%;width:91%" >
                    <div v-for="i in tableData" :key="i.id" style="width:14.5%;height:45%;float:left;margin:1% 2.5%;background:#ffffff">
                        <div class="photobox">
                            <p class="pictrue">
                                <img :src="i.deviceImgUrl" @click="openEquipment(i.id)"/>
                            </p>
                            <div class="Equipmentbox">
                                <p class="title">名称:{{i.deviceName}}</p>
                                <p class="descript">型号:{{i.deviceModel}}</p>
                                <p class="Equipmentbutton" v-if="Jurisdiction==-1">
                                    <el-button type="primary" @click="editData(i.id)" round>编辑</el-button>
                                    <el-button type="danger" @click="handleDelete(i.id)" round>删除</el-button>
                                    <el-button type="success" @click="handleFile(i.id)" round>文档</el-button>               
                                </p>
                                <p class="Equipmentbutton" style="text-align:right" v-else>
                                    <el-button type="success" @click="handleFile(i.id)" round>文档</el-button>
                                </p>
                            </div>
                        </div>
                    </div>
                </el-carousel-item>
            </el-carousel>
            
            <div v-else style="text-align:center;padding-top:100px">
                <h3>暂无数据</h3>
            </div>
        </div>   
        <!-- 添加设备弹框 -->
        <el-dialog
            title="设备新增修改页面"
            :visible.sync="updateVisible"
            width="43%"
            :close-on-click-modal="false"
            :before-close="closeupdatedialog">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" :data="ruleForm" label-width="150px" class="demo-ruleForm">
                        <el-form-item label="设备名称" prop="deviceName">   
                            <el-input v-model="ruleForm.deviceName"></el-input>
                        </el-form-item>
                        <el-form-item label="设备型号" prop="deviceModel">
                            <el-input v-model="ruleForm.deviceModel"></el-input>
                        </el-form-item>
                        <el-form-item label="设备隶属系统" prop="intelligentFireSystemId">   
                            <el-select v-model="ruleForm.intelligentFireSystemId" placeholder="--请选择--" @change="currentSel">
                                <el-option
                                    v-for="item in intelligentFireList"
                                    :key="item.code"
                                    :label="item.description"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="设备类型" prop="deviceTypeId">   
                            <el-select v-model="ruleForm.deviceTypeId" placeholder="--请选择--">
                                <el-option
                                v-for="item in deviceTypeList"
                                :key="item.code"
                                :label="item.description"
                                :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="设备接入类型" prop="accessType">
                            <el-select v-model="ruleForm.accessType" placeholder="--请选择--">
                                <el-option
                                    v-for="item in accessTypeList"
                                    :key="item.code"
                                    :label="item.description"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="设备生产商" prop="manufacturer">
                            <el-input v-model="ruleForm.manufacturer"></el-input>
                        </el-form-item>
                        <el-form-item label="生厂商电话" prop="manufacturerTel">
                            <el-input v-model="ruleForm.manufacturerTel"></el-input>
                        </el-form-item>
                        <el-form-item label="设备供应商" prop="supplier">
                            <el-input v-model="ruleForm.supplier"></el-input>
                        </el-form-item>
                        <el-form-item label="供应商电话" prop="supplierTel">
                            <el-input v-model="ruleForm.supplierTel"></el-input>
                        </el-form-item>  
                        <el-form-item label="品牌" prop="brand">
                            <el-input v-model="ruleForm.brand"></el-input>
                        </el-form-item>
                        <el-form-item label="设备协议类型" prop="protocolId">
                            <el-select v-model="ruleForm.protocolId" placeholder="--请选择--">
                                <el-option
                                    v-for="item in protocolList"
                                    :key="item.code"
                                    :label="item.description"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                       
                        <el-form-item label="设备图片" prop="deviceImgUrl">
                            <el-upload
                                class="avatar-uploader"
                                action=""
                                accept=".jpg,.png,.JPG,.PNG"
                                :show-file-list="false"
                                :on-change="beforeUpload"
                                :auto-upload="false">
                                <img v-if="posterURL" :src="posterURL" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <el-button @click="uploads">立即上传</el-button>
                            <el-button @click="resetUploads">取消</el-button>
                        </el-form-item>
                        <el-form-item class="formfooter">
                            <el-button type="primary" @click="update_insert('ruleForm')" v-noMoreClick>立即提交</el-button>
                            <!-- <el-button @click="handleReset('ruleForm')">重置</el-button> -->
                            <el-button @click="closeupdatedialog">取 消</el-button>
                        </el-form-item>
                    </el-form>
        </el-dialog>

        <!-- 设备详情弹框 -->
        <el-dialog
            title="设备详情"
            :visible.sync="EquipmentVisible"
            width="40%"
            :close-on-click-modal="false"
            :before-close="EquipmentClose">
                <table class="detail_table">
                    <tr>
                        <td rowspan="5" style="width:250px;height:250px;text-align:center"><span style="display:inline-block;width:250px;height:200px;">
                            <img :src='ruleForm.deviceImgUrl' style="width:100%;height:100%"></span>
                        </td>
                        <td>设备名称:{{ruleForm.deviceName}}</td>
                    </tr>
                    <tr>
                        <td>设备型号:{{ruleForm.deviceModel}}</td>
                    </tr>
                    <tr>
                        <td v-for="(item) in intelligentFireListruleform" :key="item.code">
                            <span>设备隶属系统:{{item.description}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td v-for="(item) in deviceTypeListruleform" :key="item.code">
                            <span>设备类型:{{item.description}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>设备品牌:{{ruleForm.brand}}</td>
                    </tr>
                    <tr>
                        <td>设备生产商:{{ruleForm.manufacturer}}</td>
                        <td>生厂商电话:{{ruleForm.manufacturerTel}}</td>
                    </tr>
                    <tr>
                        <td>设备供应商:{{ruleForm.supplier}}</td>
                        <td>供应商电话:{{ruleForm.supplierTel}}</td>
                    </tr>
                    <tr>
                        <td v-for="(item) in protocolListruleform" :key="item.code">设备协议类型:{{item.description}}</td>
                        <td v-for="(item) in accessTypeListruleform" :key="item.code+2">设备接入类型:{{item.description}}</td>
                    </tr>
                </table>
        </el-dialog>

        <!-- 设备文档弹框 -->
        <el-dialog
            title="设备文档"
            :visible.sync="EquipmentVisibleData"
            width="50%"
            :close-on-click-modal="false"
            :before-close="EquipmentClose">
               <el-table					
                    :data="informationData"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="fileName"
                    label="资料名称"
                    width="230">
                    </el-table-column>
                    <el-table-column
                    prop="fileDesc"
                    label="资料描述"
                    width="500">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope='scope'>
                            <el-button
                            size="mini"
                            type="success"
                            class='el-icon-download'
                            @click="dataDownload(scope.row.id)"><a id="download">下载</a></el-button>
                        </template>
                    </el-table-column>
                </el-table>
        </el-dialog>
         
    </div>
</template>

<script>
import {Common} from './../../js/common'
import download from './../../js/download'
export default {
    mixins:[Common],
    data(){
        return {
            module:'device/lib',  //模块
            name:'',    //模糊查询数据
            type:'',   //模糊查询数据
            system:'',//模糊查询数据
            show:true,
            Jurisdiction:sessionStorage.getItem('unitId'),//账号等级
            updateVisible:false, //新增修改弹窗 
            informationData:'',//资料数据
            EquipmentVisibleData:false,//文档弹框
            imgList:[],   //图片数据
            imgNumber:null, //设备总页数
            posterURL:'',//图片显示
            upload:'',//上传图片
            page:null,
            protocolList:[],//设备协议列表
            accessTypeList:[],//设备接入列表
            intelligentFireList:[],//设备隶属系统列表
            deviceTypeList:[],//设备类型列表
            EquipmentVisible:false,//设备详情弹框显示
            ruleForm:{
                id:null,
                deviceName:'', //设备名称
                deviceModel:'', //设备型号
                deviceTypeId:'',//设备类型
                intelligentFireSystemId:'',//设备隶属系统
                manufacturer:'',//设备生产商
                manufacturerTel:'',//生厂商电话
                supplier:'',//设备供应商
                supplierTel:'',//供应商电话
                brand:'',//品牌
                protocolId:'',//设备协议类型
                accessType:'',//设备接入类型
                deviceImgUrl:'',//设备图片
            },
            rules:{
                deviceModel: [
                    { required: true, message: '请输入设备型号', trigger: 'blur' },
                ],
                deviceName: [
                    { required: true,message: '请输入设备名称', trigger: 'blur' },
                ],
                deviceTypeId: [
                    { required: true,message: '请输入设备类型', trigger: 'blur' },
                ],
                intelligentFireSystemId: [
                    { required: true,message: '请输入设备隶属系统', trigger: 'blur' },
                ],
                accessType:[
                    { required: true,message: '请选择设备接入类型', trigger: 'blur' },
                ]
            },
            pickerOptions1: {//限制日期
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            }
        }
    },
    methods: {
        openEquipment(id){  //打开设备库里设备详情
            this.Select(1);
            this.Select(3);
            this.EquipmentVisible=true;
            var _this=this;
            this.axios({
                url:'/api/admin/device/lib/single',
                method:'post',
                data:{
                    id:id
                },
            }).then(res=>{
                if(res.data.code==0){
                    _this.ruleForm=res.data.data;
                    _this.deviceType('');
                    _this.Select(3);
                    _this.Select(1);
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        EquipmentClose(){   //关闭设备库里设备详情
            this.EquipmentVisible=false;
            this.EquipmentVisibleData=false;
        },
        beforeUpload(file) {       //上传前
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            const extension = testmsg === 'jpg'
            const extension2 = testmsg === 'png'
            const isLt2M = file.size / 1024 / 1024 < 5
            if(!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是jpg,png格式!',
                    type: 'warning'
                });
                this.$refs.upload.clearFiles();
                this.ruleForm.unitPlanUrl=null;
                return ;
            }
            if(!isLt2M) {
                this.$message({
                    message: '上传文件大小不能超过 5MB!',
                    type: 'warning'
                });
                this.$refs.upload.clearFiles();
                this.files = null;
                return ;
            }
            this.posterURL = URL.createObjectURL(file.raw);
            this.upload= file.raw;
        },
        uploads(){  //上传图片
            var _this=this;
            let formdata = new FormData();
            formdata.append('file', this.upload);
            formdata.append('fileType',1);
            this.axios({
                url   : "/api/admin/file/upload",
                method: 'post',
                data  :formdata
                }).then(res=>{    
                    if(res.data.code==0){
                        _this.ruleForm.deviceImgUrl=res.data.data.fileUrl;
                        _this.$alert('上传成功', '提示', {
                            confirmButtonText: 'OK',
                        });
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }                                             
                })
        },
        resetUploads(){//重置图片
            this.ruleForm.deviceImgUrl=null;
            this.posterURL ='';
        },
        carouselChange(a){//切换页数
            this.currentPage=a+1;
            this.getData();
        },
        searchReset(){   //搜索条件重置
            this.name='';
            this.type='';
            this.system='';
            this.searchsubmit()
        },
        Select(num){  //下拉框列表 
            //设备协议类型3
            //设备接入类型1
            //系统类型4
            var _this=this;
            this.axios({
                url:'/api/admin/device/dict',
                method:'post',
                data:{
                    id:num
                }
            }).then(res=>{
                if(res.data.code==0){
                    if(num==3){
                        _this.protocolList=res.data.data;
                    }else if(num==1){
                        _this.accessTypeList=res.data.data;
                    }else if(num==4){
                        _this.intelligentFireList=res.data.data;
                        
                        _this.deviceType('');
                    }
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK'
                    });
                }
            })
        },
        openupdatedialog(){ //打开新增弹框
            this.updateVisible=true;
            this.Select(3);
            this.Select(1);
        },
        closeupdatedialog(){//关闭新增弹框
            this.updateVisible=false;
            this.handleReset();
        },
        currentSel(sel){
            this.ruleForm.deviceTypeId='';
            this.type='';
            this.deviceType(sel);
        },
        deviceType(sel){   //设备类型下拉框
            var _this=this;
            this.axios({
                url:'/api/admin/device/system?id='+sel,
                method:'post',
            }).then(res=>{
                _this.deviceTypeList=res.data.data;
            })
        },
        update_insert(name){    //新增修改
            var _this=this;
            this.$refs[name].validate((valid)=>{
                if(valid){
                    if(this.$refs.ruleForm.model.id){
                        // edit
                        this.axios({
                        url   :'/api/admin/device/lib/detail',
                        method: 'post',
                        data  : this.ruleForm
                        }).then(res=>{
                            if(res.data.code==0){
                                _this.$alert("修改成功", '提示', {
                                    confirmButtonText: 'OK',
                                    callback:()=>{
                                         _this.handleReset();
                                        _this.updateVisible=false;
                                        _this.getData();
                                    }
                                });
                                
                            }else{
                                _this.$alert(res.data.msg, '提示', {
                                    confirmButtonText: 'OK',
                                });
                            }                       
                        })
                    }else{
                        delete this.ruleForm.id;
                        this.axios({
                        url   : "/api/admin/device/lib/detail",
                        method: 'post',
                        dataType:'json',
                        data  : this.ruleForm
                        }).then(res=>{    
                            if(res.data.code==0){
                                _this.$alert('添加数据成功!', '提示', {
                                    confirmButtonText: 'OK',
                                });
                                _this.updateVisible=false;
                                _this.handleReset();
                                _this.getData();
                            }else{
                                _this.$alert(res.data.msg, '提示', {
                                    confirmButtonText: 'OK',
                                });
                            }                                             
                        })
                    }
                }else{
                    _this.$alert('添加数据失败', '提示', {
                        confirmButtonText: 'OK',
                    });
                    return false;
                }
            })
        },
        searchsubmit(){//模糊查询
            var _this=this;
            this.axios({
                    url   :'/api/admin/'+this.module+'/list',
                    method: 'post',
                    dataType:'json',
                    data:{
                        pageNum: this.currentPage,
                        pageSize: this.rows,
                        deviceName:this.name,
                        deviceTypeId:this.type,
                        intelligentFireSystemId:this.system
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        _this.tableData = res.data.list;            
                        _this.total= res.data.total;
                        _this.currentPage= res.data.pageNum;
                        _this.page=Math.ceil(_this.total/10)
                        if(res.data.list.length){
                            _this.show=true;
                        }else{
                            _this.show=false;
                        }
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
        },
        handleFile(id){//打开文档
            this.dataList(id);
        },
        dataList(id){ //资料列表
            var _this=this;
            this.axios({
                    url:'/api/admin/device/lib/file.list',
                    method: 'post',
                    data:{
                        id:id
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        _this.informationData = res.data.data;    
                        _this.EquipmentVisibleData=true;      
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
        },
        dataDownload(id){ //下载
            var _this=this;
            this.axios({    
                url:'/api/admin/device/lib/file.single',
                method: 'post',
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.data.code==0){
                //    window.location.href=res.data.data.filePath;
                   var x=new XMLHttpRequest();
                    x.open("GET", res.data.data.filePath, true);
                    x.responseType = 'blob';
                    x.onload=function(){download(x.response, res.data.data.fileName,"text/plain"); }
                    x.send();
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        }
    },
    mounted() {
        this.Select(4);
        this.deviceType('');
        this.Select(3);
        this.Select(1);
    },
    computed: {
        intelligentFireListruleform:function(){
            var _this=this;
            return this.intelligentFireList.filter(function(item){
                    return item.code==_this.ruleForm.intelligentFireSystemId;
            })
        },
        deviceTypeListruleform:function(){
            var _this=this;
            if(this.deviceTypeList){
                return this.deviceTypeList.filter(function(item){
                        return item.code==_this.ruleForm.deviceTypeId;
                })
            }else{
                return false;
            }
            
        },
        protocolListruleform:function(){
            var _this=this;
            return this.protocolList.filter(function(item){
                    return item.code==_this.ruleForm.protocolId;
            })
        },
        accessTypeListruleform:function(){
            var _this=this;
            return this.accessTypeList.filter(function(item){
                    return item.code==_this.ruleForm.accessType;
            })
        }
    },
}
</script>
<style lang="scss">
#EquipmentLibrary{
    p{
        margin:0;
        padding:0;
    }
    background:#fafafa;
    .detail_table{
        border-collapse: collapse;
        border:2px solid #eee;
        tr,td{
            border:2px solid #eee;
            height:40px;
        }
        td{
            width:10%;
            padding-left: 15px;
        }
    }
    .el-carousel,.el-carousel__container{
        height:100%;
        overflow: hidden;
    }
    .el-dialog__body,.top{
        .el-select,.el-input{
            width:180px!important;
        }
    }
    
    .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 300px;
        margin: 0;
    }
    .photobox{
        box-shadow: 0 0 17px 0 rgba(0,0,0,0.1);
        border-radius: 2px;
        height:100%;
        .pictrue{
            width: 90%;
            height: 55%;
            margin:0 auto;
            img{
                width:70%;
                height:70%;
                margin:15% auto;
            }
        }
        .Equipmentbox{
            border-top: 1px solid #bbbcbc;
            padding: 5% 5%;
            height:35%;
            text-align:left;
            .title{
                font-size: 14px;
                line-height: 1.14;
                margin-bottom: 3%;
                color:#666;
            }
            .descript{
                font-size: 14px;
                margin-bottom: 2%;
                font-family: "ducati-extended", Arial, sans-serif;
                font-weight: 500;
                letter-spacing: 0.8px;
                color:#383535;
            }
            .Equipmentbutton{
                margin-top: 13%;
                // text-align: right;
                .el-button.is-round {
                    border-radius: 18px;
                    padding: 5px 12px;
                }
            }
        }
    }
    .photobox:hover{
        box-shadow: 0 0 30px 0 rgba(0,0,0,0.2);
    }
    .el-dialog__header{
        text-align:left;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 177px;
    height: 95px;
    line-height: 95px;
    text-align: center;
  }
  .avatar {
    width: 177px;
    height: 95px;
    display: block;
  }
 
}

</style>