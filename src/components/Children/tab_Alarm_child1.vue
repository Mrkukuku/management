<template>
    <div class="child1">
        <div>
            <el-checkbox-group v-model="checkedAlarm" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="item in name" :label="item.alarmTypeId" :key="item.alarmTypeId">{{item.alarmTypeName}}</el-checkbox>
            </el-checkbox-group>

            <el-button type="primary" @click="submitTmportant">确定</el-button>
        </div>
    </div>
</template>

<script>
    export default {
      name: 'child1',
      props:{
            name: Array,
            ids:Object,
            checkedCities:Array,
            required: true
      },
      data(){
          return {
              typeData:[{
                  alarmTypeName:'aa',
                  alarmTypeId:1
              }],
              checkedAlarm:[],
          }
      },
      methods:{
          handleCheckedCitiesChange(val){
              console.log(this.checkedCities)
          },
          submitTmportant(){
                var _this=this;
                this.axios({
                    url   :'/api/admin/alarm/alarmList',
                    method: 'post',
                    data  : {
                        systemId:Number(this.ids.systemId),
                        unitId:this.ids.companyId,
                        list:this.checkedAlarm
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        _this.$emit('list');
                        this.$alert('添加成功', '提示', {
                        confirmButtonText: 'OK',
                    });
                    }
                })
          }
      },
      watch:{
          checkedCities:function(val){
              this.checkedAlarm=val
          }
      }
    }
</script>

<style lang="scss" scoped>
    .child1{
        font-size: 15px;
        width: 100%;
    }
    .el-checkbox-group{
        margin:5% 0 0 5%; 
        width: 70%;
    }
    .el-checkbox{
        line-height: 70px;
        margin-right: 70px;
    }
    button{
        margin-left: 60%!important;
        margin-top: 4%;
        width: 100px;
        line-height: 20px;
    }
</style>