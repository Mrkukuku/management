<template>
<div class="allcontent maintenanceLibrary">
    <el-col :span="6" class="tree_box">
      <div class="treeTop">
        
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-button type="success" @click="addParent">新增</el-button>
      </div>
      <el-tree :data="data"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        ref="tree"
        @node-click="nodeclick"
        >
        <span class="custom-tree-node"
          slot-scope="{ node, data }">
          <!-- 如果是编辑状态 -->
          <template v-if="data.isEdit==1">
            <el-input ref="input"
              v-model="newApiGroupName"
              style="height:20px line-height:20px"></el-input>
              <el-button type="text"
              size="mini"
              @click="() => cancelEdit(node,data)">撤销</el-button>
            <el-button type="text"
              size="mini"
              @click="() => submitEdit(node,data)">保存</el-button>
          </template>
           
          <!-- 如果不是编辑状态 -->
          <span v-else>
            <span v-text="data.content"></span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => edit(node,data)">
                编辑
              </el-button>
              <template v-if="data.pid==0">
                <el-button type="text"
                  size="mini"
                  @click="() => addChild(node,data)">
                  新增
                </el-button>
              </template>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)">
                删除
              </el-button>
            </span>
          </span>
          
        </span>
      </el-tree>
    </el-col>
    <el-col :span="18">
      <div class="top">
        <el-button type="success" @click="addThreeData">新增</el-button>
      </div>
      <el-table					
        :data="tableData"
        border
        >
        <el-table-column
        prop="content"
        label="维保内容"
        width="240">
        </el-table-column>
        <el-table-column
        prop="method"
        label="测试方法和要求"
        width="350">
        </el-table-column>
        <el-table-column
        prop="note"
        label="备注"
        width="230">
        </el-table-column>
        <el-table-column
        label="维保周期"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.month==1">
            月,
          </span>
          <span v-if="scope.row.quarter==1">
            季,
          </span>
          <span v-if="scope.row.year==1">
            年
          </span>
        </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope='scope'>
                <el-button
                size="mini"
                type="primary"
                @click="editThree(scope.row.id)"
                >编辑</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="deleteThree(scope.row.id)"
                >删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-dialog
      title="维保项"
      :visible.sync="dialogVisibleThree"
      :close-on-click-modal="false"
      :before-close="ThreeClose">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="维保内容" prop="content">   
              <el-input type="textarea" v-model="ruleForm.content"></el-input>
            </el-form-item>
            <el-form-item label="测试方法和要求" prop="method">   
              <el-input type="textarea" v-model="ruleForm.method"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="note">   
              <el-input type="textarea" v-model="ruleForm.note"></el-input>
            </el-form-item>
            <el-form-item label="维保周期" prop="time">   
              <el-checkbox-group v-model="time" >
                <el-checkbox label="1">月</el-checkbox>
                <el-checkbox label="2">季</el-checkbox>
                <el-checkbox label="3">年</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item class="footer"> 
              <el-button type="primary" @click="submitThree('ruleForm')">确 定</el-button>
              <el-button @click="ThreeClose">取 消</el-button>
            </el-form-item>
          </el-form>
    </el-dialog>
    </el-col>
</div>
  
</template>

<script>
export default {
  data() {
    return {
      data: [],//树状图数据
      newApiGroupName: '',//树状图name值
      filterText: '',//过滤值
      tableData:[],//表格数据
      defaultProps: {
        children: 'children',
        name: 'content'
      },
      dialogVisibleThree:false,//新增弹框
      time:[],
      ruleForm:{
        content:'',//维保内容
        method:'',//测试方法要求
        note:'',//备注 
      },
      rules:{
        content: [
            { required: true, message: '请输入维保内容', trigger: 'blur' },
        ],
        method: [
            { required: true, message: '请输入测试方法和要求', trigger: 'blur' },
        ],
        note: [
            { required: true, message: '请输入相关补充备注', trigger: 'blur' },
        ],
      },
      unitId:'',
      pid:0,//维保项目等级
    }
  },
  
  methods: {
    // 调api获取接口分组数据
    getApiGroupData() {
      this.axios({    
          url:'/api/admin/maintenancelib/list',
          method: 'post',
      }).then(res=>{
          if(res.data.code==0){
            this.data = res.data.data;            
          }else{
              this.$alert(res.data.msg, '提示', {
                  confirmButtonText: 'OK',
              });
          }
      })
    },
    addChild(node, data) {//新增二集维保项
      const newChild = {
        isEdit: 1,
        content: 'xxxxxxx',
        children: [],
        pid:data.id
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    addParent(){//新增一级维保项
      const newChild = {
        isEdit: 1,
        content: 'xxxxxxx',
        children: [],
        pid:0,
      }
      this.data.push(newChild)
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
      
    },
    remove(node, data) {//点击删除一级二级维保项
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      
      if(data.id){
        this.deleteParentChild(data.id);
      }else{
        children.splice(index, 1)
      }
      
    },
    deleteParentChild(id){//点击删除一级二级维保项接口
      this.$confirm('你确定要删除吗')
        .then(()=> {
          this.axios({    
            url:'/api/admin/maintenancelib/delete',
            method: 'post',
            data:{
                id:id,
            }
          }).then(res=>{
              if(res.data.code==0){
                this.$message({
                  type:'success',
                  message:'删除成功'
                })
              }else{
                this.$message({
                  type:'error',
                  message:res.data.msg
                })
              }
              this.getApiGroupData();
          })
        })
      
    },
    edit(node, data) {//编辑一级二级维保项的名称
      for(var i in this.data){
        delete(this.data[i].isEdit)
        if(this.data[i].children){
          for(var j in this.data[i].children){
            delete(this.data[i].children[j].isEdit);
          }
        }
      }
      this.$set(data, 'isEdit', 1)
      this.newApiGroupName = data.content;
      // this.$nextTick(() => {
      //   this.$refs.input.focus()
      // })
    },
    cancelEdit(node, data) {//编辑时点击返回按钮撤销编辑
      this.newApiGroupName = '';
      this.$set(data, 'isEdit', 0)
    },
    submitEdit(node, data) {//提交编辑一级二级维保项的名称
      if (data.name == this.newApiGroupName) {
        this.newApiGroupName = '';
        this.$set(data, 'isEdit', 0)
      } else {
        if(this.newApiGroupName){
          this.$set(data, 'content', this.newApiGroupName)
          this.newApiGroupName = '';
          this.$set(data, 'isEdit', 0);
          this.updatesubmit(data.pid,data.content,data.id)
        }else{
          this.getApiGroupData();
        }
        
      }
    },
    updatesubmit(pid,name,id) {//提交编辑一级二级维保项的名称接口
      var url;
      if(id){
        url="/api/admin/maintenancelib/update";
      }else{
        url='/api/admin/maintenancelib/add';
      }
      this.axios({    
          url:url,
          method: 'post',
          data:{
              pid:pid,
              content:name,
              id:id
          }
      }).then(res=>{
          if(res.data.code==0){
            this.$message({
              type:'success',
              message:'保存成功'
            })
          }else{
              this.$message({
                type:'error',
                message:res.data.msg
              })
          }
          this.getApiGroupData();
      })
    },
    nodeclick(node, data, obj) {
      console.log(node)
      if(node.pid!=0){
        this.getData(node.id);
      }
    },
    filterNode(value, data) {//树状图过滤值
      if (!value) return true;
      return data.content.indexOf(value) !== -1;
    },
    addThreeData(){//新增三级维保项弹框打开
      this.dialogVisibleThree=true;
    },
    ThreeClose(){//新增三级维保项弹框关闭
      this.dialogVisibleThree=false;
      delete this.ruleForm.id;
      Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
    },
    editThree(id){//编辑回显三级维保项
      
      this.axios({    
          url:'/api/admin/maintenancelib/content/single',
          method: 'post',
          data:{
            id:id
          }
      }).then(res=>{
          if(res.data.code==0){
            this.ruleForm = res.data.data;  
            var time=[];
            if(this.ruleForm.month==1){
              // this.$set(this.ruleForm.time,this.ruleForm.time.length-1,'月')
              time.push('1')
            }
            if(this.ruleForm.quarter==1){
              // this.$set(this.ruleForm.time,this.ruleForm.time.length,'季')
              time.push('2')
            }
            if(this.ruleForm.year==1){
              // this.$set(this.ruleForm.time,this.ruleForm.time.length,'年')
              time.push('3')
            }
            this.time=time;
            
            this.addThreeData();    
          }else{
              this.$message({
                type:'error',
                message:res.data.msg
              })
          }
      })
    },
    handleCheckedCitiesChange(val){
      // this.
    },
    deleteThree(id){//删除回显三级维保项
      this.$confirm('你确定要删除吗')
        .then(()=> {
          this.axios({    
            url:'/api/admin/maintenancelib/content/delete',
            method: 'post',
            data:{
                id:id,
            }
          }).then(res=>{
              if(res.data.code==0){
                this.$message({
                  type:'success',
                  message:'删除成功'
                })
              }else{
                this.$message({
                  type:'error',
                  message:res.data.msg
                })
              }
              this.getData(this.libId);
          })
        })
    },
    submitThree(name){//表单提交维保内容
      this.$refs[name].validate((valid)=>{
        if(valid){
          var url="/api/admin/maintenancelib/content/add";
          if(this.ruleForm.id){
            url="/api/admin/maintenancelib/content/update";
          }
          this.ruleForm.libId=this.libId;
          this.ruleForm.month=0;
          this.ruleForm.quarter=0;
          this.ruleForm.year=0;
          for(var i in this.time){
            if(this.time[i]=='1'){
              this.ruleForm.month=1;
            }

            if(this.time[i]=='2'){
              this.ruleForm.quarter=1;
            }

            if(this.time[i]=='3'){
              this.ruleForm.year=1;
            }
          }
          this.axios({    
              url:url,
              method: 'post',
              data:this.ruleForm
          }).then(res=>{
              if(res.data.code==0){
                this.$message({
                  type:'success',
                  message:'保存成功'
                })
                this.ThreeClose();
              }else{
                  this.$message({
                    type:'error',
                    message:res.data.msg
                  })
              }
              this.getData(this.libId);
          })
        }
      })
    },
    getData(id){
      this.libId=id;
      this.axios({    
          url:'/api/admin/maintenancelib/content/list',
          method: 'post',
          data:{
            id:id
          }
      }).then(res=>{
          if(res.data.code==0){
            this.tableData = res.data.data;
                        
          }else{
              this.$message({
                type:'error',
                message:res.data.msg
              })
          }
      })
    }

  },
  mounted() {
    this.unitId =sessionStorage.getItem('unitId');
    this.getApiGroupData()
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
}
</script>
<style lang="scss" scoped>
.maintenanceLibrary{
  .tree_box{
    .treeTop{
      margin-bottom: 10px;
      .el-input{
        width: 180px;
        /deep/ .el-input__inner {
          height: 30px;
          width: 100%;
        }
      }
    }
    .el-input{
      width: 180px;
      /deep/ .el-input__inner {
        height: 20px;
        width: 100%;
      }
    }
  }
  /deep/ .el-dialog{
    width: 600px!important;
    .footer{
      text-align: center;
      &>div{
        margin-left: 0!important;
      }
    }
  }
}

</style>