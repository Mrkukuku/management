<template>
    <!-- 区域模块 -->
    <div id='unitIndustry' class='allcontent'>
         <el-col :span="4" class="tree_box" v-if="userType==1">
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
                行业名称:<el-input v-model="industryName" placeholder="搜索名称"></el-input>&nbsp;&nbsp;
                <el-button type="primary" @click='searchData'>查询</el-button>
                <el-button type="primary" @click='searchreset'>重置</el-button>

                <el-button type="primary" @click="openTranferBox" :disabled="addAreaFlag">新增行业</el-button>
            </div>
            <div class="bottom">
                <!-- 表格 -->
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="industryName"
                    label="行业名称"
                    width="140">
                    </el-table-column>
                    <el-table-column
                    prop="list"
                    label="单位集合"
                    width="800">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope='scope'>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="SperRela(scope.row.id)">编辑</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="deleteBox(scope.row.id)">删除</el-button>
                           
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="page_all">
                    <pagination :total='total' ref="paginationChild" @pageChange="pageChange"></pagination>
                </div>

                <!-- 穿梭框 -->
                <div class="dialog_transfer">
                    <el-dialog
                        title="提示"
                        :visible.sync="transfer"
                        width="50%"
                        :close-on-click-modal="false"
                        :modal-append-to-body="false"
                        :before-close="Closetransfer">
                        <el-form :rules="rules" :model="ruleForm" :data="ruleForm" status-icon  ref="ruleForm" label-width="150px" class="demo-ruleForm" >
                            <el-form-item label="区域名称" prop="industryName">
                                <el-input v-model="ruleForm.industryName"></el-input>
                            </el-form-item>
                            <el-transfer
                                filterable
                                :filter-method="filterMethod"
                                filter-placeholder="State Abbreviations"
                                v-model="transferValue"
                                :titles="transfer_title"
                                @change='changeTransfer'
                                :data="data">
                            </el-transfer>
                             <el-form-item class="formfooter">
                                <el-button type="primary" @click="handleSubmit('ruleForm')">立即提交</el-button>
                                <el-button @click="Closetransfer()">取消</el-button>
                                <!-- <el-button @click="handleReset('ruleForm')">重置</el-button> -->
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                </div>
            </div>
        </el-col>
    </div>
</template>
<script>
import pagination from '../Children/Pagination'
export default {
    components:{
        pagination:pagination
    },
    data(){
        var validatename=(rule, value, callback) => {
            if(value){
                this.axios({ 
                    method: 'post',
                    url: "/api/admin/industry/manager/unit/name/isexist",
                    data: {
                        industryName:value,
                        unitId:this.unitId,
                        industryId:this.ruleForm.id,
                        pageSize:1,
                        pageNum:1
                    },
                }).then(res => {
                    if(res.data.code==0){
                        callback();
                    }else{
                        callback(new Error(res.data.msg));
                    }
                })
            }else{
                callback(new Error('行业名称不能为空'));
            }
        }
        return {
            userType:'',//用户等级
            industryName:'',//区域名称
            tableData:[],//表格数据
            pageNum:1,
            pageSize:10,
            total:200,
            transfer:false,//穿梭框
            transfer_title:['未关联的单位列表','已关联的单位列表'],//穿梭框标题
            data:[],
            transferValue:[],//过滤值
            filterText:'',
            Treedata:[],
            unitId:'',//单位id
            addAreaFlag:true,//是否可以新增区域
            treedefaultProps: {
                children: 'children',
                label: 'label'
            },
            filterMethod(query, item) {
                return item.initial.indexOf(query) > -1;
            },
            ruleForm:{
                industryName:'',//区域名称
                movekeys:[],//穿梭框选择的数组
                delete:[]
            },
            rules:{
                 industryName: [
                    {validator: validatename, required: true, trigger: 'blur' },
                ],
            },
            singleData:[],//详情获取区域数据
        }
    },
    methods:{
        changeTransfer(value,direction,movekeys){   //添加修改关系
            var _this=this;
            if(direction=='left'){
                for(var i in movekeys){
                    for(var j in this.ruleForm.movekeys){
                        if(movekeys[i]==this.ruleForm.movekeys[j]){
                            this.ruleForm.movekeys.splice(j,1)
                        }
                    }
                    for(var k in this.singleData){
                        if(movekeys[i]==this.singleData[k]){
                            this.ruleForm.delete.push(movekeys[i])
                        }
                    }
                    
                }
                console.log('left')
                console.log(this.ruleForm.delete)
                console.log(this.ruleForm.movekeys)
            }else{
                for(var i in movekeys){
                    for(var j in this.ruleForm.delete){
                        if(movekeys[i]==this.ruleForm.delete[j]){
                            this.ruleForm.delete.splice(j,1)
                        }
                    }
                    if(this.ruleForm.id){
                        var index=0;
                        for(var k in this.singleData){
                            if(movekeys[i]==this.singleData[k]){
                                index=1;
                            }
                        }
                        if(index!=1){
                            this.ruleForm.movekeys.push(movekeys[i]); 
                        }
                    }else{
                        this.ruleForm.movekeys.push(movekeys[i]) 
                    }
                    
                    
                }
                console.log('right')
                console.log(this.ruleForm.delete)
                console.log(this.ruleForm.movekeys)
            }
            // console.log(movekeys)
            /* this.$confirm('你确定要移动吗')
                .then(()=> {
                    this.ruleForm.movekeys=movekeys;
                }) */
        },
        SperRela(id){   //打开穿梭框
            this.getSingle(id);
            this.ruleForm.movekeys=[];
            this.ruleForm.delete=[];
        },
        getSingle(id){//查看某个区域的详情
            var _this=this;
            _this.singleData=[];
            this.axios({
                url:'/api/admin/industry/manager/unit/detail',
                method:'post',
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.ruleForm.industryName=res.data.data.industryName;
                    _this.ruleForm.id=res.data.data.id;
                    _this.singleData=res.data.data.unitIds;
                    _this.getTranfer(res.data.data.unitIds);
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        getTranfer(list){   //打开列表渲染
            this.data=[];
            this.transferValue=[];
            var _this=this;
            _this.initials=[];
            this.axios({    //显示列表
                url:'api/admin/unit/sub/ids',
                method: 'post',
                data:{
                    id:this.unitId
                }
            }).then(res=>{
                if(res.data.code==0){
                    var unitData=res.data.data.children;
                    for(var i=0;i<unitData.length;i++){
                        _this.initials.push(unitData[i].label)
                        _this.data.push({   //未关联单位
                            label: unitData[i].label,
                            key: unitData[i].value,
                            initial:_this.initials[i]
                        })  
                    }
                    if(list){
                        _this.transferValue=list;
                        _this.transfer=true;
                    }

                }
            })
        },
        Closetransfer(){    //关闭穿梭框
            this.transfer=false;
            delete this.ruleForm.id;
            Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
        },
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
            }
            this.getData();
        },
        searchreset(){//模糊查询重置
            this.industryName='';
        },
        searchData(){//模糊查询
            this.pageNum=1;
            this.$refs.paginationChild.changePageNum(this.pageNum)
            this.getData();
        },
        getTreeData(){//获取树状图数据
            var _this=this;
            this.axios({
                    url   :'/api/admin/unit/list/left',
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
        openTranferBox(){//新增打开弹框
            this.transfer=true;
            this.ruleForm.movekeys=[];
            this.ruleForm.delete=[];
            this.getTranfer();
        },

        handleSubmit(name){//提交表单
            var _this=this; 
            this.$refs[name].validate((valid)=>{
                if(valid){
                    var url='/api/admin/industry/manager/unit/register';
                    if(this.ruleForm.id){
                        url='/api/admin/industry/manager/unit/update';
                        this.axios({
                            url:url,
                            method:'post',
                            data:{
                                id:this.ruleForm.id,
                                managerUnitId:this.unitId,
                                add:this.ruleForm.movekeys,
                                delete:this.ruleForm.delete,
                                industryName:this.ruleForm.industryName
                            }
                        }).then(res=>{
                            if(res.data.code==0){
                                _this.$alert('关联成功', '提示', {
                                    confirmButtonText: 'OK',
                                    callback:()=>{
                                        _this.Closetransfer();
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
                        this.axios({
                            url:url,
                            method:'post',
                            data:{
                                managerUnitId:this.unitId,
                                subUnitIds:this.ruleForm.movekeys,
                                industryName:this.ruleForm.industryName
                            }
                        }).then(res=>{
                            if(res.data.code==0){
                                _this.$alert('关联成功', '提示', {
                                    confirmButtonText: 'OK',
                                    callback:()=>{
                                        _this.Closetransfer();
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
                }
            })
               
        },
        handleReset(){//重置
            this.ruleForm.industryName='';
            this.getTranfer();
        },
        getData(){//获取列表数据
            var _this=this;
            this.axios({
                url:'/api/admin/industry/manager/unit/search/page',
                method:'post',
                data:{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    unitId:this.unitId,
                    industryName:this.industryName
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.tableData=res.data.list;
                    
                    for(var i in _this.tableData){
                        _this.tableData[i].list='';
                        for(var j in _this.tableData[i].unitNameList){
                            _this.tableData[i].list+=_this.tableData[i].unitNameList[j]+' 、 '
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
        deleteBox(id){//删除某区域
            var _this=this;
            this.$confirm('你确定要删除吗')
                .then(()=> {
                    this.axios({
                        url:'/api/admin/industry/manager/unit/delete',
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
        pageChange (item) {//页数页码改变页面重新刷新
            this.pageNum = item.page_index;
            this.pageSize = item.page_limit;
            this.getData() //改变页码，重新渲染页面
        },
    },
    watch:{
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    mounted() {
        this.userType=sessionStorage.getItem('userTypes');
        if(this.userType==2){
            this.unitId=sessionStorage.getItem('unitId');
            this.addAreaFlag=false;
        }else{
            this.getTreeData();
        }
        this.getData();
        
    },
    
}
</script>

<style lang="scss">
    #unitIndustry{
        .top{
            .el-input{
                width: 180px;
            }
        }
        .el-dialog{
            .el-input{
                width: 80%;
            }
        }

        .el-transfer-panel__body{
            height:350px;
            .el-transfer-panel__list.is-filterable{
                height:300px;
            }
            .el-checkbox{
                display:block;
            }
        } 
        .el-transfer-panel{
            width:250px;
            text-align:left;
        }
        .el-transfer{
            text-align:center;
        }
        .el-transfer__button:nth-child(2){
            margin-left:8px;
        } 
    }
</style>