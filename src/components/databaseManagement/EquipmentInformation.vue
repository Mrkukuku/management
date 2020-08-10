<template>
    <!-- 设备资料 -->
    <div id='equipmentdatabase' class='allcontent'>
         <!-- 头部 -->
        <div class="top">
            <div>
                 &nbsp;&nbsp;设备名称:
                <el-input v-model='deviceName'></el-input>
                <el-button type="primary" @click="searchdata">查询</el-button>
                <el-button @click="searchReset">重置</el-button>
                <!-- <el-button type="primary" @click="opendialog"><i class="el-icon-plus"></i> 新增</el-button> -->
            </div>
        </div>
        <!-- 内容 -->
        <div style='margin-top:10px;height: 88%;position: relative;'>
            <!-- 表格 -->
            <el-table					
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="deviceName"
                label="设备名称"
                width="230">
                </el-table-column>
                <el-table-column
                prop="deviceModel"
                label="型号"
                width="200">
                </el-table-column>
                <el-table-column
                prop="intelligentFireSystemDesc"
                label="隶属系统"
                width="200">
                </el-table-column>
                <el-table-column
                prop="deviceTypeDesc"
                label="设备类型"
                width="200">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope='scope'>
                        <el-button
                        size="mini"
                        type="primary"
                        class='el-icon-bank-card'
                        @click="handleDetail(scope.row.id)">设备资料管理</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="position:absolute;bottom:0;">
                <pagination :total='total' ref="paginationChild" @pageChange="pageChange"></pagination>
            </div>
        </div>

        <!-- 资料弹框 -->
        <el-dialog
            title="添加修改数据"
            :visible.sync="dialogVisible"
            width="50%"
            class='dialog'
            :close-on-click-modal="false"
            :before-close="closedialog">
            <fieldset>
                <legend style="font-size:19px;">资料上传</legend>
                <el-form :model="informationDataForm" :rules="rulesinformationData" ref="informationDataForm" :data="informationDataForm" label-width="150px" class="demo-ruleForm">
                     <el-form-item label="设备名称" prop="filePath">   
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            action=""
                            :on-change="beforeUpload"
                            :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary">请选择文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传文件</el-button>
                            <!-- <div class="el-upload__tip" slot="tip">files with a size less than 500kb</div> -->
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="资料描述" prop="fileDesc">   
                        <el-input type="textarea" v-model="informationDataForm.fileDesc"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="dataSubmit('informationDataForm')" v-noMoreClick>立即提交</el-button>
                        <!-- <el-button @click="dataReset('informationDataForm')">重置</el-button> -->
                        <el-button @click="closedialog">取 消</el-button>
                    </el-form-item>
                </el-form> 
            </fieldset>
                <div style="margin-top:10%;">
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
                                type="danger"
                                class='el-icon-delete'
                                @click="dataDelete(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

        </el-dialog>
    </div>
</template>

<script>
import {Common} from './../../js/common'
import pagination from '../Children/Pagination'
export default {
    mixins:[Common],
    components:{
        pagination:pagination
    },
    data(){
        return {
            module:'equipment',  //模块
            deviceName:'',//设备名称
            upload:'',
            currentPage:1,
            rows:10,
            total:1,
            deviceId:null,//设备id
            ruleForm:{
                id:null,
                deviceName:'',//设备名称
                deviceModel:'',//设备型号
                intelligentFireSystemDesc:'',//隶属系统
                deviceTypeDesc:'',//设备类型
            },
            informationData:[],//资料列表
            informationDataForm:{
                id:null,
                fileDesc:'',//资料描述
                filePath:'',//资料路径
                deviceId:null,//设备id
                fileName:''//资料名称
            },
            rulesinformationData:{
                filePath: [
                    { required: true, message: '请先上传资料', trigger: 'blur' },
                ]
            }
        }
    },
    methods: {
        beforeUpload(file) {       //上传前
            this.upload= file.raw;
        },
        submitUpload() { //文件上传
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
                        _this.informationDataForm.filePath=res.data.data.fileUrl;
                        _this.informationDataForm.fileName=res.data.data.fileName;
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
        dataSubmit(name){   //资料上传
            var _this=this;
            _this.informationDataForm.deviceId=this.deviceId;
             this.$refs[name].validate((valid)=>{
                 if(valid){
                    _this.axios({
                    url   : "/api/admin/device/lib/file.add",
                    method: 'post',
                    data  :_this.informationDataForm
                    }).then(res=>{   
                        if(res.data.code==0){
                            _this.$alert('添加成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:() => {
                                    _this.dataReset();
                                    _this.dataList(_this.deviceId);

                                }
                            });
                        }else{
                            _this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }                                             
                    })
                 }
             })
            
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
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
        },
        dataReset(){
            Object.assign(this.$data.informationDataForm,this.$options.data().informationDataForm);
            this.$refs.upload.clearFiles()
        },
        searchdata(){//模糊查询
            var _this=this;
            this.currentPage = 1;
            this.$refs.paginationChild.changePageNum(this.currentPage)
            this.axios({
                    url:'/api/admin/device/lib/list',
                    method: 'post',
                    data:{
                        deviceName:this.deviceName,
                        unitId:sessionStorage.getItem('unitId'),
                        pageNum: this.currentPage,
                        pageSize: this.rows,
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        _this.tableData = res.data.list;          
                        _this.total= res.data.total;
                        _this.currentPage= res.data.pageNum;
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
        },
        searchReset(){    //模糊查询
            this.deviceName='';
            this.searchdata()
        },
        handleDetail(id){
            this.informationDataForm.deviceId=id;
            this.deviceId=id;
            this.dataList(id);
            this.dialogVisible=true;
        },
        dataDelete(id){     //表格一条数据删除
            var _this=this;
            this.$confirm('你确定要删除吗')
                .then(()=> {
                    this.axios({
                    url:'/api/admin/device/lib/file.delete',
                    method:'post',
                    data:{
                        id:id
                    }
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('删除成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:() => {
                                    _this.dataList(_this.deviceId);
                                }
                            });
                        }else{
                            _this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }
                        _this.getData();
                    })
                })
        },
        pageChange (item) {//页数页码改变页面重新刷新
            this.currentPage = item.page_index;
            this.rows = item.page_limit;
            this.getData() //改变页码，重新渲染页面
        },
    }
}
</script>

<style lang="scss">
    #equipmentdatabase{
        .el-dialog,.top{
            .el-select,.el-input{
                width:180px;
            }
        }
        
        textarea{
            width:500px;
        }
        .el-form-item{
            height: 60px;
        }
        .upload-demo{
            width:100%;
            position:relative;
        }
        .el-upload__tip{
            margin-left:3%;
            display: inline;
        }
        .el-upload-list{
            position: relative;
            margin-left: 5%;
        }
        fieldset{
            border: 1px solid #ded6d6;
            width: 80%;
        }
    }
    

</style>