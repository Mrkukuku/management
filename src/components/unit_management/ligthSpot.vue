<template>
    <!-- 公告管理 -->
    <div id="pollingSummary" class='allcontent'>
      
         <!-- 头部 -->
            <div class="top">
               
                <div class="date">
                    <!-- 每日防火巡查记录 -->
                     <el-page-header @back="goBack" content="应急灯/疏散指示灯点检表">
                </el-page-header>
                </div>
                <div></div>
            </div>
            <!-- 内容 -->
            <div style='margin-top:10px;height: 88%;position: relative;'>
                <!-- 表格 -->
                <el-table					
                    :data="tableData"
                    border
                   >
                    <el-table-column
                    prop="name"
                    label="区域"
                    align="center"
                    width="140">
                    </el-table-column>
                    <el-table-column
                    label="点检时间"
                    align="center"
                    width="160">
                       <template slot-scope="scope">
                        <span >{{ scope.row.updatedTime|timeFormat }}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                     label="点检项目"
                     align="center"
                     >
                        <el-table-column
                            prop="time"
                            label="有无接电源"
                            align="center"
                            width="120">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.subOptionList[0] }}</span>
                                </template>
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="灯泡有无损坏"
                            align="center"
                            width="120">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.subOptionList[1] }}</span>
                                </template>
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="应急灯插上电源"
                            align="center"
                            width="120">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.subOptionList[2] }}</span>
                                </template>
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="后绿灯是否显示"
                            align="center"
                            width="120">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.subOptionList[3] }}</span>
                                </template>
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="按测试按钮后应急灯是否亮灯"
                            align="center"
                            width="170">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.subOptionList[4] }}</span>
                                </template>
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="应急灯是否有破损"
                            align="center"
                            width="140">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.subOptionList[5] }}</span>
                                </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                        prop="uname"
                        align="center"
                        label="点检人员签名"
                        width="140">
                    </el-table-column>
                    <el-table-column
                        prop="num"
                        align="center"
                        label="数量"
                        width="90">
                    </el-table-column>
                     <el-table-column
                        prop="content"
                        align="center"
                        label="备注">
                    </el-table-column>
                </el-table>
             
                <div class="bottom"> 
                  
                </div>
            </div>
    </div>
</template>

<script>
export default {
    data(){
       
        return {
            pageNum:1,
            pageSize:10,
            total:0,
            tableData:[
             
            ],
            parameter:{},
            allDate:[],
            pollingVisible:false,
            pollingDetail:{},
            date:'',
            taskId:""
        }
    },
    methods:{
        getData(){
                this.axios({
                url:"/api/admin/device/inspection/emergency/detail",
                method:"post",
                data:{
                  id:this.taskId
                }
            }).then( res =>{
                if( res.data.code ==0 ){
                  this.tableData = res.data.data
                }else{
                    this.$alert(res.data.msg)
                }
            })
        },
        goBack(){
            this.$router.push({path: '/unitmanagement/lightPolling'});
            this.$store.commit('routeJump/delete_tabs', '/unitmanagement/ligthSpot');
        }
    },
    mounted(){
      if(this.$route.query.id){
          this.taskId = this.$route.query.id
          this.getData()
      }else{
            this.goBack()
      }
    },
   
}
</script>

<style lang="scss">
    #pollingSummary{
         .el-table{
            border-bottom: 1px solid #EBEEF5;
        }
     .top{
         display: flex;
         align-items: center;
         border: none;
         .date{
             flex: 1;
         }
         
        .el-page-header__content{
            flex: 1;
             text-align: center;
             font-size: 29px;
        }
     }
     .name{
        text-decoration:underline;
        width: 40px;
     }
     .el-table thead.is-group th{
         background-color: #FFF;
     }
    }

</style>