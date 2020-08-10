<template>
    <div class="regulations">
        <div class="searchBox">
            <el-input v-model="unitName" @input="getData" placeholder="搜索名称"></el-input>
        </div>
        <div class="content">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="法条依据" name="1">
                    <el-collapse v-model="activeCollapse" accordion>
                        <el-collapse-item title="消防法 第六十条" name="1">
                            <div>
                                &nbsp;&nbsp;单位违反本法规定，有下列行为之一的，责令改正，处五千元以上五万元以下罚款：<br/>
                                （一）消防设施、器材或者消防安全标志的配置、设置不符合国家标准、行业标准，或者未保持完好有效的；<br/>
                                （二）损坏、挪用或者擅自拆除、停用消防设施、器材的； <br/>
                                （三）占用、堵塞、封闭疏散通道、安全出口或者有其他妨碍安全疏散行为的； <br/>
                                （四）埋压、圈占、遮挡消火栓或者占用防火间距的； <br/>
                                （五）占用、堵塞、封闭消防车通道，妨碍消防车通行的； <br/>
                                （六）人员密集场所在门窗上设置影响逃生和灭火救援的障碍物的； <br/>
                                （七）对火灾隐患经消防救援机构通知后不及时采取措施消除的。 <br/>
                                &nbsp;&nbsp; 个人有前款第二项、第三项、第四项、第五项行为之一的，处警告或者五百元以下罚款。 <br/>
                                &nbsp;&nbsp; 有本条第一款第三项、第四项、第五项、第六项行为，经责令改正拒不改正的，强制执行，所需费用由违法行为人承担。
                                                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="浙江省消防条例 第六十一条" name="2">
                            <div>
                                &nbsp;&nbsp;违反本条例第三十三条规定，自动消防系统未定期检测、消防控制室未实行二十四小时值班制度的，责令改正，处警告或者五百元以上五千元以下罚款；未按规定保存检测报告的，处警告或者五百元以下罚款。<br/>
                                《浙江省高层建筑消防安全管理规定》<br/>
                                第六条任何单位和个人不得有下列危害高层建筑消防安全的行为：<br/>
                                    &nbsp;（一）超负荷用电；<br/>
                                    &nbsp;（二）违反规定使用瓶装液化石油气；<br/>
                                    &nbsp;（三）违反法律、法规、规章的规定或者业主大会、业主委员会的决定，在禁放区域燃放烟花爆竹；<br/>
                                    &nbsp;（四）制造、储存易燃易爆危险品；<br/>
                                    &nbsp;（五）损坏、挪用、擅自拆除或者擅自停用消防设施及器材；<br/>
                                    &nbsp;（六）占用、堵塞、封闭疏散通道、安全出口、避难层（间）或者有其他妨碍安全疏散的行为；<br/>
                                    &nbsp;（七）占用、堵塞、封闭消防车通道和消防登高场地，影响消防车通行和灭火救援；<br/>
                                    &nbsp;（八）拒绝履行消防安全职责、义务，或者经公安机关消防机构通知后不及时采取措施消除火灾隐患；<br/>
                                    &nbsp;（九）其他危害消防安全的行为。<br/>
                                    &nbsp;违反前款规定的，按照下列规定给予处罚：<br/>
                                    &nbsp;（一）违反第一项规定的，由公安机关消防机构责令限期改正；逾期不改正的，责令停止使用，可以并处1000元以上5000元以下罚款。<br/>
                                    &nbsp;（二）违反第二项、第三项规定的，由公安机关消防机构责令改正，对个人处100元以上200元以下罚款，对单位处500元以上2000元以下罚款；构成违反治安管理行为的，按照《中华人民共和国治安管理处罚法》有关违法使用爆炸性物质的规定给予处罚。<br/>
                                    &nbsp;（三）违反第四项规定的，按照《中华人民共和国治安管理处罚法》有关违法制造、储存爆炸性物质的规定给予处罚。<br/>
                                    &nbsp;（四）违反第五项至第九项规定的，由公安机关消防机构责令改正，对个人处警告或者500元以下罚款，对单位处5000元以上5万元以下罚款。<br/>
                                    &nbsp;（五）单位、个人因危害消防安全的行为引起火灾或者造成火灾危害扩大的，对单位直接负责的主管人员和其他直接责任人员或者行为人个人按照《中华人民共和国消防法》第六十四条的规定给予处罚。
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="行政处罚法 第二十七条" name="3">
                            <div>
                                &nbsp;&nbsp;当事人有下列情形之一的，应当依法从轻或者减轻行政处罚: <br/>
                                （一）主动消除或者减轻违法行为危害后果的； <br/>
                                （二）受他人胁迫有违法行为的； <br/>
                                （三）配合行政机关查处违法行为有立功表现的； <br/>
                                （四）其他依法从轻或者减轻行政处罚的。 违法行为轻微并及时纠正，没有造成危害后果的，不予行政处罚。
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="行政处罚法 第三十一条" name="4">
                            <div>&nbsp;&nbsp;行政机关在作出行政处罚决定之前，应当告知当事人作出行政处罚决定的事实、理由及依据，并告知当事人依法享有的权利。</div>
                        </el-collapse-item>
                    </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="消防监督检查" name="2" class="checkBox2">
                    <div v-for="(item,index) in checkData" :key="index" class="checkCss">
                        <div class="row1">
                            <div>
                                时 间 : {{item.createdTime}}
                            </div>
                            <div>
                                检察人 : {{item.rummager}}
                            </div>
                        </div>
                        <div class="row2">
                            <div>
                                单位名称 : {{item.unitName}}
                            </div>
                        </div>
                        <div class="row3">
                            <div>
                                是否违法 : {{item.illegal==0?'是':'否'}}
                            </div>
                            <div>
                                是否上诉 : {{item.statingPlea==0?'是':'否'}}
                            </div>
                            <div>
                                电子照片
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <template v-if="activeName==2">
            <div class="shaixuan" @click="dialogVisible=true">筛选</div>
            </template>
        </div>
        <el-dialog
            title="筛选条件"
            :visible.sync="dialogVisible"
            width="90%"
            :close-on-click-modal="false"
            class='searchdialog'
            :before-close="closedialog">
                <el-form status-icon ref="ruleForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="检查人">
                        <el-input v-model="rummager" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="单位名称">
                        <el-input v-model="unitName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="是否违法">
                        <el-radio v-model="illegal" label="0">是</el-radio>
                        <el-radio v-model="illegal" label="1">否</el-radio>
                    </el-form-item>
                    <el-form-item label="是否上诉">
                        <el-radio v-model="statingPlea" label="0">是</el-radio>
                        <el-radio v-model="statingPlea" label="1">否</el-radio>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-date-picker
                            v-model="startTime"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker
                            v-model="endTime"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm">查询</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
        </el-dialog>
        <template v-if="activeName==2">
            <el-button class="Jump" @click="Jump">创建新任务</el-button>
        </template>
        
    </div>
</template>
<script>
export default {
    data(){
        return{
            name:'',
            activeName:'1',
            activeCollapse:'',
            checkData:[],
            dialogVisible:false,
            unitName:'',
            illegal:'',// 0 是 1 否
            statingPlea:'',// 0 是 1 否
            startTime:'',
            endTime:'',
            rummager:'',
            userId:'',//用户id
        }
    },
    methods:{
        handleClick(){

        },
        closedialog(){//关闭查询弹框
            this.dialogVisible=false;
            
        },
        submitForm(name){//筛选条件查询
            this.getData();
            this.closedialog();
        },
        resetForm(){//重置筛选条件查询
            this.unitName="";
            this.startTime="";
            this.endTime="";
            this.rummager="";
            this.illegal="";
            this.statingPlea="";
            this.getData();
            this.closedialog();
        },
        getData(){//获取列表数据
            this.axios({
                url   :'/api/admin/police/trouble/list',
                method: 'post',
                data  : {
                    uid:this.userId,
                    unitName:this.unitName,
                    startTime:this.startTime,
                    endTime:this.endTime,
                    rummager:this.rummager,
                    illegal:this.illegal,
                    statingPlea:this.statingPlea
                }
            }).then(res=>{
                if(res.data.code==0){
                    this.checkData=res.data.data;
                    for(var i in this.checkData){
                       this.checkData[i].createdTime=this.$moment(this.checkData[i].createdTime).format("YYYY-MM-DD");
                    }
                    
                }else{
                    this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        Jump(){//跳转新页面创建任务
           this.$router.push({path:"/addTask"}) 
        }
    },
    mounted(){
        this.userId=sessionStorage.getItem('huanUId');
        this.getData();
    }
}
</script>
<style lang="scss" scoped>
    .regulations{
        background-color:#FBFBFB;
        height: 100%;
        overflow: hidden;
        position: relative;
        .searchBox{
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            .el-input{
                margin: auto 15px;
                
                /deep/ .el-input__inner{
                    background-color: #F5F5F5;
                    border: none;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                }
                
            }
        }
        .content{
            position: relative;
            display: flex;
            background-color: #FBFBFB;
            // background-color: #eee;
            /deep/ .el-tabs__nav-wrap::after{
                background-color: transparent;
            }
            .el-tabs{
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            /deep/ .el-tabs__header{
                background-color: #ffffff;
                padding:0 10px;
                margin: 0;
            }
            /deep/ .el-tabs__content{
                padding:0 10px;
                flex: 1;
                overflow-y: auto;
                /deep/ .el-collapse-item__header{
                    font-weight: 600;
                    font-size: 15px;
                }
            }
        }
        
        .checkBox2{
            width: 100%;
            .checkCss{
                background-color: #ffffff;
                color: #303133;
                margin-top: 10px;
                border-radius: 3px;
                padding: 5px 15px;
                font-size: 14px;
                
                &>div{
                    display: flex;
                    line-height: 25px;
                }
                .row1,.row3{
                    justify-content: space-between;
                }
                .row2{
                    flex: 1;
                    &>div{
                        width: 300px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                    
                }
            }
        }
        .shaixuan{
            position: absolute;
            color:#303133;
            top: 10px;
            right: 10px;
            font-size: 14px;
        }
        .searchdialog{
            .el-date-editor,.el-input{
                width: 100%!important;
            }
        }
        .Jump{
            position: absolute;
            bottom: 15px;
            width: 80%;
            left: 10%;
            background-color: #0B93DD;
            color: #ffffff;
        }
    }
</style>