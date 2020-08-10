<template>
<!-- 声音任务 -->
    <div id='polling_config' class='allcontent'>
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
                </div>
            </el-col> 
        <el-col :span="20" style='height:100%;border:1px solid #eee;'>
        <!-- 内容 -->
        <div style='margin-top:10px;height: 88%;position: relative;padding-left:10px;'>
            <div v-show="addFalg">
                 <el-form  :model="ruleForm" label-width="150px" ref="ruleForm" :rules="rules" style="width:350px">
                    <el-form-item label="是否只显示当前任务" prop="startTime">
                        <el-select v-model="ruleForm.display" placeholder="请选择">
                            <el-option
                            v-for="item in gradeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="巡检开始时间" prop="startTime">
                         <el-time-picker
                            v-model="ruleForm.startTime"
                            value-format="HH:mm"
                            format="HH:mm"
                            placeholder="巡检开始时间">
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="巡检结束时间" prop="endTime">
                         <el-time-picker
                            v-model="ruleForm.endTime"
                            value-format="HH:mm"
                            format="HH:mm"
                            placeholder="巡检结束时间">
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="巡检次数" prop="fireInspectionNum">
                        <el-input v-model="ruleForm.fireInspectionNum" type="number"  placeholder="巡检次数"></el-input>
                    </el-form-item>
                    <el-form-item label="巡检间隔" prop="intervalTime">
                        <el-input v-model="ruleForm.intervalTime" type="number"  placeholder="巡检次数"></el-input>小时
                    </el-form-item>
                    <el-form-item class='submitagency'>
                        <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                        <el-button type="primary" @click="reset">重置</el-button>
                    </el-form-item>
                 </el-form>
            </div>
        </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import {Common} from './../../js/common'
export default {
    mixins:[Common],
   data() {
       var validateTime=(rule, value, callback) => {
            if (value === ''|| value==null) {
                callback(new Error('请输入巡检间隔'));
            }
            if (value) {
                var num = parseInt(value)
                if(num>=0){
                    this.ruleForm.intervalTime = num
                }else{
                     this.ruleForm.intervalTime = num*-1
                }
                callback();
            }else{
                callback(new Error('巡检间隔时间过长'));
            }
        };
       return {
            module:'pollingConfig',//模块
            userType:"",//用户类型
            unitId:'',//单位id
            Treedata:[],
            addFalg:false,
            ruleForm:{
                startTime:'',
                fireInspectionNum:"",
                unitId:"",
                endTime:'',
                display:'0',
                intervalTime:2
            },
            rules: {
                   startTime:[
                        { required: true, message: '请选择开始时间', trigger: 'blur' },
                   ],
                   endTime:[
                        { required: true, message: '请选择结束时间', trigger: 'blur' },
                   ],
                   fireInspectionNum:[
                       { required: true, message: '请输入巡检次数', trigger: 'blur' },
                   ],
                   intervalTime:[
                       { required: true, message: '请输入巡检间隔', trigger: 'blur' },
                        {validator: validateTime, required: true, trigger: 'change' }
                   ],
            },
            gradeData:[
                {
                    value:0,
                    label:'否'
                },
                {
                    value:1,
                    label:'是'
                },
            ],
       }
   },
    methods: {
        handleSubmit (name) {//提交
           var _this = this
           this.$refs[name].validate((valid)=>{
               if(valid){
                  var url=''
                  if(_this.ruleForm.id){
                      url = "/api/admin/fire/inspection/config/update"
                  }else{
                       url = "/api/admin/fire/inspection/config/add"
                  }
                   _this.axios({
                        url,
                        method:"post",
                        data:{
                            ...this.ruleForm,
                        }
                    }).then ( res => {
                        if( res.data.code ==0 ){
                            }
                            _this.$alert(res.data.msg)
                    })
               }else{
                   this.$alert('请填写必填字段')
               }
           })
        },
        reset(){
                this.ruleForm.startTime='',
                this.ruleForm.fireInspectionNum=""
        },
        getData () {//获取数据
            if( this.unitId ){
                this.axios({
                    url:"/api/admin/fire/inspection/config/single",
                    method:"post",
                    data:{
                        id:this.unitId
                    }
                }).then ( res => {
                    if( res.data.code==0 ){
                        this.ruleForm = res.data.data
                    }
                })
            }
        },
        handleNodeClick (data) {//点击树节点
           this.unitId = data.id
           this.ruleForm.unitId = data.id
            if( data.type == 0 ) {
                this.addFalg = false
            }else{
                this.addFalg = true
                this.getData()
            }
        },
        Treeunit(){//单位树
            var _this=this;
            var url="/api/admin/unit/list.left";
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
                        _this.Treedata=res.data.data;
                        _this.data=res.data.data
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
    },
    mounted() {
        this.userType = sessionStorage.getItem('userTypes')
        this.unitId =Number(sessionStorage.getItem('unitId'))
        this.ruleForm.unitId =Number(sessionStorage.getItem('unitId'))
        if ( this.userType ==3 ) {
             this.addFalg = true
            this.getData()
        }else{
            this.Treeunit()
        }
    },
}
</script>

<style lang="scss" >
    #polling_config{
        .el-table::before{
            width:0;
        }
        .el-input{
            width:80%;
        }
        .top{
            border-bottom: 1px solid #eee;
        }
        .top .el-date-editor{
            width:180px;
        }
        .el-table--border{
            border: none;
        }
    }
</style>