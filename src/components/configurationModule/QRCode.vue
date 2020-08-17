<template>
    <div class="QRCode allcontent">
         <el-col :span="4" class="tree_box" v-if="userType==1|| userType==2">
            <div>
                <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText" 
                    class="filter_text"
                    >
                </el-input>
                <el-tree 
                    :data="Treedata" 
                    :props="treedefaultProps" 
                    @node-click="handleNodeClick" 
                    :render-content="renderContent"
                    highlight-current
                    :filter-node-method="filterNode"
                    ref="tree"
                >
                </el-tree>
            </div>
        </el-col>
        <el-col :span="20" style="height:100%;padding-left:10px;">
            <!-- 头部 -->
            <div class="top">
                二维码名称:<el-input v-model="areaName" placeholder="搜索名称"></el-input>&nbsp;&nbsp;
                类型:<el-select v-model="type" placeholder="请选择">
                            <el-option
                                v-for="item in typeOptionsData"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                <el-button type="primary" @click='searchData'>查询</el-button>
                <el-button @click='searchreset'>重置</el-button>
                <el-button type="primary" @click="openAddBox" :disabled="addAreaFlag">新增二维码</el-button>
                <el-button type="primary" @click="allPrint" :disabled="addAreaFlag">批量打印二维码</el-button>
            </div>
            <div class="bottom">
                <!-- 表格 -->
                <el-table
                    :data="tableData"
                    border
                    @select-all="allSelectionChange"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                     <el-table-column
                    type="selection"
                    width="45">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="二维码名称"
                    width="240">
                    </el-table-column>
                    <el-table-column
                    prop="expireTime"
                    label="二维码有效期"
                    width="300">
                    </el-table-column>
                    <el-table-column
                    prop="installAddres"
                    label="安装地址"
                    width="250">
                    </el-table-column>
                    <el-table-column
                    prop="site"
                    label="地址"
                    width="300">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope='scope'>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="deleteBox(scope.row.id)">删除</el-button>
                            <el-button
                            size="mini"
                            type="success"
                            @click="printingBox(scope.row)">打印
                            </el-button>
                        </template>
                        <div id="erwei" style="display:none">
                            <div style="display: flex;flex-direction: column;align-items: center;height:520px" v-for="(item, index) in qrList" :key="index">
                                <img :src="item.img" alt="二维码">
                                <div>
                                     <div style="font-size:20px">设备名称：{{item.name}}</div>
                                     <div style="font-size:20px">设备地址：{{item.installAddres&&item.installAddres||''}}</div>
                                </div>
                            </div>
                             <!-- <img :src="downImg" alt=""> -->
                        </div>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="page_all">
                    <pagination :total='total' @pageChange="pageChange"></pagination>
                </div>
                <div class="dialog_transfer">
                    <el-dialog
                        title="二维码信息"
                        :visible.sync="transfer"
                        :close-on-click-modal="false"
                        :modal-append-to-body="false"
                        :before-close="closeAddBox">
                        <el-form :rules="rules" :model="ruleForm" :data="ruleForm" status-icon  ref="ruleForm" label-width="150px" class="demo-ruleForm" >
                            <el-form-item label="二维码名称" prop="name">
                                <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="设备安装位置" prop="installAddres">
                               <el-input v-model="ruleForm.installAddres"></el-input>
                            </el-form-item>
                            <!-- <el-form-item label="设备类型" prop="type">
                               <el-select v-model="ruleForm.type" placeholder="请选择">
                                <el-option
                                    v-for="item in typeOptionsData1"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            </el-form-item> -->
                            <el-form-item label="二维码有效截至时间">
                                <el-date-picker
                                    v-model="ruleForm.expireTime"
                                    type="date"
                                    :picker-options="pickerOptions"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                         
                            <el-form-item label="地址" label-width="150px">
                                <el-input v-model="ruleForm.address" :disabled="true" label-width="150px" ></el-input>
                                <el-button @click="openmap">点击地图</el-button>
                                <div id="mapdiv">
                                    <el-dialog
                                        title="百度地图定位查询"
                                        :visible.sync="mapVisible"
                                        width="95%"
                                        :modal-append-to-body='false'
                                        class="mapdialog"
                                        :before-close="handleClose">
                                            <div class="amap-wrapper">
                                                <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult">
                                                </el-amap-search-box>
                                                <el-button type="primary" @click="getok" class="searchok">确定</el-button>
                                                
                                                <el-amap vid="amap-vue" :plugin="plugins" :events='events'  :zoom="zoom" :center="center" class="amap-demo bm_view" >
                                                    <el-amap-marker v-for="(marker, index) in markermap" :key="marker.index" :position="marker.position" :icon="marker.icon" :title="marker.title" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" :vid="index"></el-amap-marker>
                                                    <el-amap-info-window
                                                        :position="currentWindow.position"
                                                        :content="currentWindow.content"
                                                        :visible="currentWindow.visible"
                                                        :events="currentWindow.events">
                                                    </el-amap-info-window>
                                                </el-amap>
                                            </div>
                                    </el-dialog>
                                </div>
                            </el-form-item>
                             <el-form-item class="formfooter">
                                <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                                <el-button @click="closeAddBox()">关闭</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                </div>
            </div>
        </el-col>
    </div>
</template>
<script>
import {GaodeMap} from './../../js/gaodemap'
import VueAMap from 'vue-amap'
import pagination from '../Children/Pagination'
export default {
    mixins:[GaodeMap],
    components:{
        pagination:pagination
    },
    data(){
        return {
            userType:'',//用户等级
            areaName:'',//区域名称
            type:'',//类型
            tableData:[],//表格数据
            pageNum:1,
            pageSize:10,
            total:200,
            data:[],
            filterText:'',
            Treedata:[],
            unitId:'',//单位id
            addAreaFlag:true,//是否可以新增区域
            transfer:false,//新增弹框
            treedefaultProps: {
                children: 'children',
                label: 'label'
            },
            filterMethod(query, item) {
                return item.initial.indexOf(query) > -1;
            },
            pickerOptions:{
                disabledDate(time) {
                     const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    return time.getTime() <= date;
                }
            },
            ruleForm:{
                name:'',//二维码名称
                expireTime:'',
                installAddres:"",
                type:''
            },
            rules:{
                 name: [
                    { required: true, message: '请输入区域名称', trigger: 'blur' },
                ],
                 installAddres: [
                    { required: true, message: '请输入设备安装位置', trigger: 'blur' },
                ],
                 type: [
                    { required: true, message: '请选择设备类型', trigger: 'blur' },
                ],
            },
            singleData:[],//详情获取区域数据
            typeOptionsData:[
                {
                    name:'未过期',
                    value:'0'
                },
                {
                    name:'已过期',
                    value:'1'
                }
            ],
            typeOptionsData1:[
                {
                    name:'灭火器',
                    value:'0'
                },
                {
                    name:'消火栓',
                    value:'1'
                },
                {
                    name:'水泵房',
                    value:'2'
                },
                {
                    name:'巡更',
                    value:'3'
                },
            ],
            downImg:'',
            mapVisible:false,
            allSelectList:[],//批量选择
            qrList:[],//二维码列表 
        }
    },
    methods:{
        filterNode(value, data) {//树节点筛选
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //树节点方法
        renderContent(h, { node, data}) { //树前小图标
            return (
              <span>
                <i class={data.icon}></i>
                &nbsp;<span>{node.label}</span>
              </span>
              );
        },
        handleNodeClick(data) { //点击树节点
            this.unitId=data.id;
            if( data.type == 0 ) {
                this.addAreaFlag = true
            }else{
                this.addAreaFlag = false
                this.getData();
            }
        },
        searchreset(){//模糊查询重置
            this.areaName='';
            this.type=''
            this.getData();
        },
        searchData(){//模糊查询
            this.pageNum=1;
            this.getData();
        },
        getTreeData(){//获取树状图数据
            var _this=this;
            this.axios({
                    url:'/api/admin/unit/list.left',
                    method: 'post',
                    data:{
                        pageNum: 1000,
                        pageSize:1,
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        _this.Treedata=res.data.data;
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
        },
        openAddBox(){//新增打开弹框
            this.transfer=true;
        },
        closeAddBox(){    //关闭穿梭框
            this.transfer=false;
            delete this.ruleForm.id;
            Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
        },
        handleSubmit(name){//提交表单
            var _this=this; 
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.ruleForm.unitId=this.unitId;
                    this.ruleForm.site=this.ruleForm.address;
                    this.axios({
                        url:'/api/admin//device/qr/add',
                        method:'post',
                        data:this.ruleForm
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('保存成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:()=>{
                                    _this.closeAddBox();
                                    _this.getData();
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
        getData(){//获取列表数据
            var _this=this;
            this.axios({
                url:'/api/admin/device/qr/list',
                method:'post',
                data:{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    unitId:this.unitId,
                    name:this.areaName,
                    isExpire:this.type
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.tableData=res.data.list;
                    for(var i in _this.tableData){
                        if(_this.tableData[i].expireTime==null){
                            _this.tableData[i].expireTime="永久";
                        }else{
                            _this.tableData[i].expireTime=_this.$moment(_this.tableData[i].expireTime).format("YYYY-MM-DD");
                        }
                       if(_this.tableData[i].site==null){
                           _this.tableData[i].site='暂无'
                       }
                    }
                    _this.total=res.data.total;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        deleteBox(id){
            var _this=this;
            this.$confirm('你确定要删除吗')
                .then(()=> {
                    this.axios({
                        url:'/api/admin//device/qr/delete',
                        method:'post',
                        data:{
                            id:id
                        }
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('删除成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:()=>{
                                    _this.getData();
                                }
                            });
                        }else{
                            _this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }
                    })
                })
        },
        print(content, w = null, h = null) {
            const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
            const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
            w = +w === 0 ? width : w;
            h = +h === 0 ? height : h;
            const left = ((width / 2) - (w / 2)) + dualScreenLeft;
            const top = ((height / 2) - (h / 2)) + dualScreenTop;
            var myWindow = window.open("", "打印", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
            var style = "<style type='text/css'>table.gridtable {font-family: verdana,arial,sans-serif;font-size:14px;color:#333333;border-width: 1px;border-color: #666666;border-collapse: collapse;}table.gridtable th {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;}table.gridtable td {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #ffffff;}</style>";
            myWindow.document.write(content + style);
            myWindow.focus();
            myWindow.document.close();     //关闭document的输出流, 显示选定的数据
            myWindow.print();   //打印当前窗口
            return myWindow;
        },
        printingBox(data){//打印
            var that=this;
            this.qrList = [data]
            this.$nextTick( ()=> {
                setTimeout( () => {
                    var windows = that.print(document.getElementById('erwei').innerHTML,800,600);
                },800)
            })
        },
        pageChange (item) {//页数页码改变页面重新刷新
            this.pageNum = item.page_index;
            this.pageSize = item.page_limit;
            this.getData() //改变页码，重新渲染页面
        },
        allSelectionChange(val){
        },
        handleSelectionChange (val) {//选择id
            var arr = []
            var _this = this
            val.map( (item,index) => {
                arr.push(item.id)
            })
            this.allSelectList = arr
        },
        allPrint() {//批量打印
            var that = this
            if( this.allSelectList.length ){
                this.axios({
                    url:"/api/admin/device/qr/batch/print",
                    method:"post",
                    data:{
                        idList:that.allSelectList
                    }
                }).then( res => {
                    if( res.data.code == 0 ){
                        this.qrList = res.data.data
                        this.$nextTick( ()=> {
                            setTimeout( () => {
                                var windows = that.print(document.getElementById('erwei').innerHTML,800,600);
                            },800)
                         })
                    }else{
                         this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
            }else{
                this.$alert("请选择二维码", '提示', {
                    confirmButtonText: 'OK',
                });
            }
        }
    },
    watch:{
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    mounted() {
        this.userType=sessionStorage.getItem('userTypes');
        if(this.userType==3){
            this.unitId=sessionStorage.getItem('unitId');
            this.addAreaFlag=false;
            this.getData();
        }else{
            this.getTreeData();
        }
    },
    
}
</script>

<style lang="scss">
    .QRCode{
        .top{
            .el-input{
                width: 180px;
            }
        }
        /deep/ .el-dialog{
            width: 500px;
            .el-input{
                width: 80%;
            }
        }
        .mapdialog{
            .el-dialog{
                height: 77%;
                width:85%!important;
                margin-left:11%;
            }
            .el-dialog__wrapper{
                height: 100%;
                position: relative;
                margin-top: -10px!important;
            }
                
            .el-dialog__body{
                padding: 0;
            }
            .el-dialog__header {
                padding: 5px 0px!important;
                background-color: #74c6d8;
                text-align: center;
                .el-dialog__title{
                    font-size: 14px!important;
                }
                .el-dialog__headerbtn{
                    top: 15px;
                }
            }
            .bm_view{
                width: 100%;
                height: 700px;
            }
            .search-box{
                position: absolute;
            }
            .searchok{
                position: absolute;
                top: 50px;
                z-index: 22222222;
                right: 25px;
                height:40px;
                width:60px;
            }
            .el-vue-search-box-container{
                right: 90px;
                top: 50px;
            }
        }
    }
</style>