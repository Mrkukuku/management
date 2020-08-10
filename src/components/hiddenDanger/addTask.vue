<template>
    <div class="addTask">
        <el-form :model="ruleForm" status-icon ref="ruleForm" :rules="rules" class="demo-ruleForm">
            <el-form-item label="单位名称" prop="unitName">
                <el-input v-model="ruleForm.unitName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="单位地址" prop="address">
                <el-input v-model="ruleForm.address" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="法人代表/主要负责人" prop="leader">
                <el-input v-model="ruleForm.leader" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
                <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
            </el-form-item>
            <div class="textDesc">单位履行消防安全职责情况</div>
            <div class="textDesc">消防安全管理</div>
            <el-form-item label="消防安全制度">
                <el-radio v-model="ruleForm.fireSafety" label="0">有</el-radio>
                <el-radio v-model="ruleForm.fireSafety" label="1">无</el-radio>
                <el-radio v-model="ruleForm.fireSafety" label="2">不全</el-radio>
            </el-form-item>
            <el-form-item label="日常检查制度">
                <el-radio v-model="ruleForm.dailyCheck" label="0">有</el-radio>
                <el-radio v-model="ruleForm.dailyCheck" label="1">无</el-radio>
            </el-form-item>
            <el-form-item label="日常培训情况">
                <el-radio v-model="ruleForm.fireProtection" label="0">有</el-radio>
                <el-radio v-model="ruleForm.fireProtection" label="1">无</el-radio>
            </el-form-item>
            <el-form-item label="检查情况" prop="safetyContent">
                <el-input v-model="ruleForm.safetyContent" type="textarea" autocomplete="off"></el-input>
            </el-form-item>
            <div class="textDesc">火源控管</div>
            <el-form-item label="电气线路敷设,安装">
                <el-radio v-model="ruleForm.eleWiring" label="0">符合</el-radio>
                <el-radio v-model="ruleForm.eleWiring" label="1">不符合</el-radio>
            </el-form-item>
            <el-form-item label="明火区域设置">
                <el-radio v-model="ruleForm.openArea" label="0">有隔离</el-radio>
                <el-radio v-model="ruleForm.openArea" label="1">无隔离</el-radio>
            </el-form-item>
             <el-form-item label="检查情况" prop="controlContent">
                <el-input v-model="ruleForm.controlContent" type="textarea" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="检查结果">
                <el-select v-model="ruleForm.result" placeholder="请选择">
                    <el-option
                    v-for="item in resultOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否存在违法行为">
                <el-radio v-model="ruleForm.illegal" label="0">是</el-radio>
                <el-radio v-model="ruleForm.illegal" label="1">无</el-radio>
            </el-form-item>
            <template v-if="ruleForm.illegal==0">
                <div class="textDesc">违法行为人基本情况</div>
                <el-form-item label="姓名" prop="illegalName">
                    <el-input v-model="ruleForm.illegalName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="ruleForm.illegalSex" label="0">男</el-radio>
                    <el-radio v-model="ruleForm.illegalSex" label="1">女</el-radio>
                </el-form-item>
                <el-form-item label="联系方式" prop="illegalPhone">
                    <el-input v-model="ruleForm.illegalPhone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="居民身份证" prop="illegalCard">
                    <el-input v-model="ruleForm.illegalCard" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="告知情况">
                    <div class="Information">{{Information}}</div>
                    <el-radio v-model="ruleForm.statingPlea" label="0">是</el-radio>
                    <el-radio v-model="ruleForm.statingPlea" label="1">否</el-radio>
                </el-form-item>
                <el-form-item label="违法行为人签名">
                    <el-input v-model="ruleForm.delinquent" autocomplete="off"></el-input>
                </el-form-item>
            </template>
            <el-form-item label="备注">
                <el-input v-model="ruleForm.content" type="textarea" autocomplete="off"></el-input>
            </el-form-item>
            <div class="textDesc" @click="jump">电子凭据 +</div>
            <el-form-item label="检察人签名" prop="rummager">
                <el-input v-model="ruleForm.rummager" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="陪同检查人员签名" prop="accpmpaniedRummager">
                <el-input v-model="ruleForm.accpmpaniedRummager" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item class="submitButton">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data(){
        return{
            ruleForm:{
                unitName:'',//单位名称
                address:'',//单位地址
                leader:'',//负责人
                phone:'',//联系方式
                fireSafety:'0',//消防安全制度
                dailyCheck:'0',//日常检查制度
                fireProtection:'0',//消防培训情况
                safetyContent:'',//消防安全管理检查情况
                eleWiring:'0',//电气线路敷设、安装
                openArea:'0',//明火区域设置
                controlContent:'',//火源控管检查情况
                result:'0',//检查结果
                illegal:'1',//是否违法
                illegalName:'',//违法人员姓名
                illegalSex:'0',//违法人员性别
                illegalPhone:'',//违法人员电话
                illegalCard:'',//违法人员身份证
                statingPlea:'1',//是否陈诉申辩
                delinquent:'',//违法行为人签字
                rummager:'',//检查人签名
                accpmpaniedRummager:'',//陪同检查人签名
                content:'',//备注
            },
            rules:{
                unitName: [
                    { required: true, message: '请输入正确的单位名字', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '请输入正确的单位地址', trigger: 'blur' },
                ],
                leader: [
                    { required: true, message: '请输入正确的负责人', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入正确的联系方式', trigger: 'blur' },
                    {pattern: /^(1\d{10})|(0\d{2,3}-\d{7,8})$/, message: '联系方式格式不正确', trigger: 'blur' }
                ],
                safetyContent: [
                    { required: true, message: '请输入消防安全管理检查情况', trigger: 'blur' },
                ],
                controlContent: [
                    { required: true, message: '请输入火源控管检查情况', trigger: 'blur' },
                ],
                illegalName: [
                    { required: true, message: '请输入违法人员姓名', trigger: 'blur' },
                ],
                illegalPhone: [
                    { required: true, message: '请输入违法人员电话', trigger: 'blur' },
                    {pattern: /^(1\d{10})|(0\d{2,3}-\d{7,8})$/, message: '联系方式格式不正确', trigger: 'blur' }
                ],
                illegalCard: [
                    { required: true, message: '请输入正确的违法人员身份证', trigger: 'blur' },
                    {pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,message: '证件号码格式有误！',trigger: 'blur'}
                ],
                rummager: [
                    { required: true, message: '请输入正确的检查人签名', trigger: 'blur' },
                ],
                accpmpaniedRummager: [
                    { required: true, message: '请输入正确的陪同检查人签名', trigger: 'blur' },
                ],
            },
            Information:'因你的行为可能涉嫌违法《中华人民共和国消防法》和《浙江省消防条例》相关规定，我单位将依法将本案件移交相关消防机构进行处理，你是否提出陈诉和申辩？',
            resultOptions:[
                {
                    label:'合格',
                    value:'0'
                },
                {
                    label:'不合格',
                    value:'1'
                },
                {
                    label:'不合格经口头责令当场整改',
                    value:'2'
                }
            ],
            taskId:'',
            userId:''
        }
    },
    methods:{
        submitForm(name){//提交表单
            this.$refs[name].validate((valid) => {
                if(!this.taskId){
                    this.$message.error('请补充完整电子凭证');
                }else{
                    if (valid) {
                        this.ruleForm.imageId=this.taskId;
                        this.ruleForm.uid=this.userId;
                        this.axios({
                            method: 'post',
                            url: '/api/admin/police/trouble/add',
                            data: this.ruleForm,
                        }).then(res => {  //res是返回结果
                            if(res.data.code==0){
                                this.$message({
                                    message: '创建成功',
                                    type: 'success'
                                });
                                sessionStorage.removeItem('ruleForm');
                                sessionStorage.removeItem('taskId');
                                this.$router.push('/regulations')
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
        jump(){//跳转电子凭证
            sessionStorage.setItem('ruleForm',JSON.stringify(this.ruleForm))
            this.$router.push('/electronic')
        }

    },
    mounted(){
        this.userId=sessionStorage.getItem('huanUId');
        if(sessionStorage.getItem('taskId')){
          this.taskId=sessionStorage.getItem('taskId');
        }
        if(sessionStorage.getItem('ruleForm')){
          this.ruleForm=JSON.parse(sessionStorage.getItem('ruleForm')) ;
        }
    }
}
</script>
<style lang="scss" scoped>
    .addTask{
        .el-form{
            margin: 10px 15px;
            /deep/ .el-form-item{
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #eee;
                margin-bottom: 0;

                .el-form-item__content{
                    flex: 1;
                }
                .el-input__inner{
                    border: none;
                }
                .el-textarea__inner{
                    border: none;
                    background-color: #e9e9e9;
                    margin: 10px 0;
                }
                .el-select{
                    width: 100%;
                }
                .el-form-item__error{
                    top: 20%;
                }
            }
            .textDesc{
                color: black;
                background-color: #FBFBFB;
                font-size: 15px;
                line-height: 30px;
            }
            .Information{
                line-height: 20px;
                margin: 5px 0;
                color: #000000;
            }
            .submitButton{
                text-align: center;
                margin: 15px 0;
                border-bottom: 0;
                .el-button{
                    width: 200px;
                    background-color: #0B93DD;
                }
            }
        }
        
    }
    
</style>