<template>
    <div class="complaintsReport allcontent">
        <div class="headCss">智慧消防投诉举报</div>
        <div class="headTwoCss">请填写有用的信息有助于帮我们进行审核</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="ruleForm">
            <div class="bgColorBox">
                <el-form-item label="姓名" prop="name">   
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">   
                    <el-input v-model="ruleForm.phone"></el-input>
                </el-form-item>
            </div>
            <div class="bgColorBox">
                <el-form-item label="行业场所类型" prop="type">   
                    <el-select v-model="ruleForm.type" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.desc"
                        :label="item.desc"
                        :value="item.desc">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地址" prop="address">   
                    <el-input v-model="ruleForm.address" :readonly="true"></el-input>
                    <el-button @click="openmap" class="clickButton">点击地图</el-button>
                    <div id="mapdiv">
                        <el-dialog
                            title="百度地图定位查询"
                            :visible.sync="mapVisible"
                            width="95%"
                            class="mapdialog"
                            :modal-append-to-body='false'
                            :before-close="handleClose">
                                <div class="amap-wrapper">
                                    <div class="inputButton">
                                        <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult">
                                        </el-amap-search-box>
                                        <el-button type="primary" @click="getok" class="searchok">确定</el-button>
                                    </div>
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
            </div>
            <div class="bgColorBox">
                <el-form-item label="投诉受理方" prop="unitName">   
                    <el-input v-model="ruleForm.unitName" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="投诉内容" prop="content" class="textareaCss">   
                    <el-input type="textarea" v-model="ruleForm.content"></el-input>
                </el-form-item>
            </div>
            <el-form-item class="formfooter">
                <el-button type="primary" @click="handleSubmit('ruleForm')">立即提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import VueAMap from 'vue-amap'
import {GaodeMap} from './../../js/gaodemap'
export default {
    mixins:[GaodeMap],
    data(){
        return{
            ruleForm:{
                name:'',//姓名
                phone:'',//电话
                type:'',//场所类型
                content:'',//内容
                unitName:'',//受理方
                address:'',//地址
            },
            rules:{
                name: [
                    { required: true, message: '请输入名字', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                ],
                type: [
                    { required: true, message: '请选择类型', trigger: ['change','blur'] },
                ],
                content: [
                    { required: true, message: '请输入投诉内容', trigger: 'blur' },
                ],
                unitName: [
                    { required: true, message: '请输入受理人', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '请输入地址', trigger: 'blur' },
                ],
            },
            options:[],
            unitId:'',//受理人公司id
        }
    },
    methods:{
        handleSubmit(name){//提交表单
             this.$refs[name].validate((valid)=>{
                if(valid){
                    this.axios({
                        url   :'/api/admin/complaints/add',
                        method: 'post',
                        dataType:'json',
                        data:this.ruleForm
                    }).then(res=>{
                        if(res.data.code==0){
                            alert('保存成功');
                        }
                        else{
                            this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                }
                    })
                }
             })
        },
        getType(){
            this.axios({
                url   :'/api/admin/complaints/unit/type',
                method: 'post',
                dataType:'json',
            }).then(res=>{
                if(res.data.code==0){
                    this.options=res.data.data;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
            
        }
    },
    mounted(){
        if(this.$route.query.id){
            this.ruleForm.unitId=Number(this.$route.query.id) ;
            this.ruleForm.unitName=this.$route.query.unitName;
            this.getType();
        }
    }
}
</script>
<style lang="scss" scoped>
    .allcontent{
        padding: 0;
        height: 100%!important;
    }
    /deep/ .el-form-item__error{
        top: 30%;
    }
.complaintsReport{
    color: #111111;
    background-color: #f6f6f6;
    .ruleForm{
        .bgColorBox{
            background-color: #ffffff;
            margin-bottom: 10px;
        }
        /deep/ .textareaCss{
            height: 150px!important;
            .el-textarea{
                height: 150px;
                .el-textarea__inner{
                    height: 100%;
                }
            }
        }
        .el-form-item{
            width: 92%;
            text-align: center;
            line-height: 50px;
            height: 50px;
            margin-bottom: 0;
            margin-left: 4%;
            border-bottom: 1px solid #eee;
            /deep/ .el-input__inner{
                border: none;
                height: 50px;
                text-align: right;
            }
            /deep/ .el-input__suffix{
                top: 5px;
            }
            /deep/ .el-form-item__label{
                height: 100%;
                line-height: 50px;
                text-align: left;
            }
            /deep/ .el-textarea__inner{
                border: none;
            }
            .el-select,.el-input{
                height: 50px;
                width: 100%;
                position: relative;
            }
            .clickButton{
                position: absolute;
                right: 3%;
                top: 10px;
                background-color: #445cc8;
                color: #ffffff;
                border: none;
            }
        }
        .formfooter{
            margin-top: 30px;
            text-align: center;
            /deep/ .el-form-item__content{
                margin: 0!important;
            }
            .el-button{
                width: 100%;
                height: 45px;
                background-color: #445cc8;
                background-image:none;
                margin-left: 0!important;
            }
            border-bottom: none;
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
            
        /deep/ .el-dialog__body{
            padding: 0;
        }
        /deep/ .el-dialog__header {
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
            height: 400px;
        }
        .amap-wrapper{
            position: relative;
        }
        .inputButton{
            position:absolute;
            top: 10px;
            width: 100%;
        }
        .search-box{
            position: relative;
            width: 70%;
            margin-left: 2%;
        }
        .searchok{
            z-index: 22222222;
            padding: 4%;
            position:absolute;
            top: 0;
            left: 74%;
        }
    }
    .headCss{
        height: 50px;
        line-height: 50px;
        background-color: #445cc8;
        text-align: center;
        color: #ffffff;
        font-size: 25px;
    }
    .headTwoCss{
        height: 40px;
        line-height: 40px;
        color: #a3a3a3;
        margin-left: 4%;
    }
}
    
</style>