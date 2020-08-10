<template>
    <!-- 企业通讯录 -->
    <div id='maillist' class='allcontent'>
         <!-- 头部 -->
       <el-row style='height:100%'>
            <el-col :span="4" class="tree_box" v-if="userType!=3">
                <div>
                    <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="filterText" 
                        class="filter_text"
                        >
                    </el-input>
                    <el-tree 
                        :data="Treedata" 
                        :props="defaultProps" 
                        @node-click="handleNodeClick" 
                        :render-content="renderContent"
                        highlight-current
                        :filter-node-method="filterNode"
                        ref="tree"
                    >
                    </el-tree>
                </el-tree>
                </div>
            </el-col>
                <el-col :span="20" style='padding-left:10px;height:100%'>
                        <div>
                            <div class="top">
                                员工姓名:
                                <el-input v-model='staffName'></el-input>
                                <el-button type="primary" @click="searchmaillist">查询</el-button>
                                <el-button @click="resetmaillist">重置</el-button>
                                <template v-if="userType==3">
                                    <el-button type="primary" @click="opendialog"><i class="el-icon-plus"></i> 新增</el-button>
                                </template>
                                <template v-else>
                                    <el-button type="primary" @click="opendialog" :disabled="addFalg"><i class="el-icon-plus"></i> 新增</el-button>
                                </template>
                            </div>
                        </div>
                        <!-- 内容 -->
                        <div style='margin-top:10px;height: 88%;position: relative;'>
                            <!-- 表格 -->
                            <el-table					
                                :data="tableData"
                                border
                                style="width: 150">
                                <el-table-column
                                type="selection"
                                width="55">
                                </el-table-column>
                                <el-table-column
                                prop="staffName"
                                label="员工姓名"
                                width="200">
                                </el-table-column>
                                <el-table-column
                                prop="phone"
                                label="联系电话"
                                width="250">
                                </el-table-column>
                                <el-table-column
                                prop="startTime"
                                label="开始时间"
                                width="270">
                                </el-table-column>
                                <el-table-column
                                prop="endTime"
                                label="结束时间"
                                width="270">
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope='scope'>
                                        <el-button
                                        size="mini"
                                        type="primary"
                                        class='el-icon-edit'
                                        @click="editData(scope.row.id)">编辑</el-button>
                                        <el-button
                                        size="mini"
                                        type="danger"
                                        class='el-icon-delete'
                                        @click="handleDelete(scope.row.id)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- 分页 -->
                            <div style="position:absolute;bottom:0;">
                                <pagination :total='total' ref="paginationChild" @pageChange="pageChange"></pagination>
                            </div>
                        </div>
                </el-col>
        </el-row>

        <!-- 弹框 -->
        <el-dialog
            title="添加修改人员信息"
            :visible.sync="dialogVisible"
            width="30%"
            class='dialog'
            :close-on-click-modal="false"
            :before-close="closedialog">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="员工姓名" prop="staffName">
                        <el-input v-model="ruleForm.staffName" class="picker"></el-input>
                    </el-form-item> 
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="ruleForm.phone" class="picker"></el-input>
                    </el-form-item> 
                    <el-form-item label="设备集合" prop="deviceIdList">
                        <el-cascader
                        v-model="deviceIdList"
                        :options="equmentList"
                        :props="props"
                        collapse-tags
                        filterable
                        clearable></el-cascader>
                    </el-form-item> 
                        
                    <el-form-item label="开始时间" prop="startTime">
                        <el-date-picker
                        v-model="ruleForm.startTime"
                        type="datetime"
                        placeholder="选择开始日期时间"
                        :picker-options="expireTimeOptionStart"
                        class="picker"
                        default-time="12:00:00">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endTime">
                        
                        <el-date-picker
                        v-model="ruleForm.endTime"
                        type="datetime"
                        :picker-options="expireTimeOptionEnd"
                        placeholder="选择结束日期时间"
                        default-time="12:00:00"
                        class="picker"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class='submitagency formfooter'>
                        <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                        <!-- <el-button @click="resetForm">重置</el-button> -->
                        <el-button @click="closedialog">取 消</el-button>
                    </el-form-item>
                </el-form>
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
        var timeEnd = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请选择结束时间'));
            } else if (value < this.ruleForm.startTime) {
            callback(new Error('结束时间在开始时间之前，请重新选择!'));
            } else {
            callback();
            }
        };
        var timeStart = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请选择开始时间'));
            } else if (this.ruleForm.endTime&&value > this.ruleForm.endTime) {
            callback(new Error('结束时间要在开始时间之前，请重新选择时间!'));
            } else {
            callback();
            }
        };
        return {
            module:'phone',
            addFalg:true,//新增按钮
            userType:sessionStorage.getItem('userTypes'),//用户等级
            companyId:sessionStorage.getItem('unitId'),
            staffName:'',//模糊查询字段
            equmentList:[],//设备集合
            deviceIdList:[],
            props: { multiple: true },
            options:[{
                type:'',
                desc:'',
            }],
            currentPage:1,
            rows:10,
            total:1,
            ruleForm: {
                id:null,
                unitId:'',//企业Id
                staffName: '',//员工姓名
                phone:'',//手机号
                startTime:'',//开始时间
                endTime:'',//结束时间
                deviceIdList:[]//设备集合
            },
            rules: {
                staffName: [
                    { required: true, message: '请输入员工姓名', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    {pattern: /^1\d{10}$/, message: '手机格式不正确', trigger: 'blur' }
                ],
                startTime: [
                    { required: true, validator: timeStart, trigger: 'blur' },
                    
                ],
                endTime: [
                    {validator: timeEnd, required: true, trigger: 'blur' }
                ],
            },
            data:[
                {
                    children: [
                        {
                            label:'江干'
                        }
                    ],
                    label:'城市'
                    
                },
                {
                    children: [
                        {
                            label:'江干1'
                        }
                    ],
                    label:'城市1'
                    
                },
            ],
            defaultProps: { //树
                children: 'children',
                label: 'label'
            },
            expireTimeOptionStart: {//时间范围
                disabledDate(date) {
                        return date.getTime()+24*60*60*1000 < Date.now();
                }
            },
            expireTimeOptionEnd: {
                    disabledDate: time => {
                        let beginDateVal = this.ruleForm.startTime;
                        if (beginDateVal) {
                            return (
                                time.getTime() < new Date(beginDateVal).getTime()
                            );
                        }
                    },
                },
        }
    },
    methods:{
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
       },
        searchmaillist(){  //模糊查询
            var _this=this;
            this.currentPage=1;
            this.$refs.paginationChild.changePageNum(this.currentPage)
            this.axios({    
                url:'/api/admin/phone/list',
                method: 'post',
                data:{
                    unitId:this.companyId,
                    pageSize:this.rows,
                    pageNum:this.currentPage,
                    staffName:this.staffName,
                   
                }
            }).then(res=>{
                if(res.data.code==0){
                    
                     _this.tableData = res.data.list;            
                    _this.total= res.data.total;
                    _this.currentPage= res.data.pageNum;
                    _this.tableData.map( ( item ) => {
                                item.startTime = item.startTime && _this.$moment(item.startTime).format("YYYY-MM-DD HH:mm") || ''
                                item.endTime = item.endTime && _this.$moment(item.endTime).format("YYYY-MM-DD HH:mm") || ''
                            })
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        resetmaillist(){   //模糊查询重置
            this.staffName="";
            this.searchmaillist()
        },
        resetForm () {//重置编辑
                // Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
                this.ruleForm.staffName= ''//员工姓名
                this.ruleForm.phone=''//手机号
                this.ruleForm.startTime=''//开始时间
                this.ruleForm.endTime=''//结束时间
                this.ruleForm.deviceIdList=[];//设备集合
                this.deviceIdList=[];

        },
         //树节点方法
        renderContent(h, { node, data}) { //树前小图标
            // console.log(node)
            return (
              <span>
                <i class={data.icon}></i>
                &nbsp;<span>{node.label}</span>
              </span>
              );
        },
        handleNodeClick(data) { //点击树节点
         this.companyId = data.id
         this.ruleForm.unitId = data.id
         this.addFalg = false
         this.rows = 10
         this.currentPage = 1
         this.getData()
         this.getequmentList();
        },
        getequmentList(){//设备列表
            var _this=this;
            this.axios({    
                url:'/api/admin/phone/deviceList',
                method: 'post',
                data:{
                    id:this.companyId,               
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.equmentList=res.data.data;
                    // console.log(_this.equmentList)
                   
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        pageChange (item) {//页数页码改变页面重新刷新
            this.currentPage = item.page_index;
            this.rows = item.page_limit;
            this.getData() //改变页码，重新渲染页面
        },
    } ,
    created() {
        this.ruleForm.unitId =Number(sessionStorage.getItem('unitId'))
        this.companyId = Number(sessionStorage.getItem('unitId'))
    },     
    
}
</script>

<style lang="scss">
    #maillist{
        .top,.dialog{
            .el-select,.el-input{
                width:200px;
            } 
        }
        .el-pagination .el-input__icon{
            margin-top: 15px;
        }
        .dialog{
            .el-date-editor{
                width:200px!important;
            }
        }
         .picker{
            width: 200px!important;

        }
        .picker{
            width: 200px!important;

        }
//         .el-tree--highlight-current .el-tree-node.is-checked > .el-tree-node__content {
//     background-color: rgb(255, 255, 255);
//      color:rgb(64, 158, 255);
//    }
//  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
//     background-color: rgb(255, 255, 255);
//    color:rgb(64, 158, 255);  }
    }
  

</style>