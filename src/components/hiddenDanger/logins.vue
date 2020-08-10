<template>
    <div class="logins">
        <div class="loginsBox">
            <div class="login_title">登录</div>
            <el-form :model="ruleForm" status-icon ref="ruleForm" class="demo-ruleForm">
                <el-form-item prop="account">
                    <el-input v-model="ruleForm.name" placeholder="用户名" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="ruleForm.password" placeholder="密码" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">登&nbsp;录</el-button>
                </el-form-item>
            </el-form>
        </div>
        
    </div>
</template>
<script>
export default {
    data(){
        return{
            ruleForm:{
                name:'',
                password:''
            },
        }
    },
    methods:{
        submitForm(formName) {
            var _this=this;
            this.axios({
            method: 'post',
            url: '/api/admin/police/login',
            data: {
                'name': this.ruleForm.name,
                'password': this.ruleForm.password,
            },
            headers:{
                "Authorization":" "
            }
            }).then(res => {  //res是返回结果
                if(res.data.code==0){
                    sessionStorage.setItem('huanUId',res.data.data.id);
                    this.$router.push('/regulations')
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                    _this.ruleForm.name='';
                    _this.ruleForm.password='';
                }
            })
        },
    }
}
</script>
<style lang="scss" scoped>
    .logins{
        display: flex;
        align-items: center;
        .loginsBox{
            flex: 1;
            margin: auto 20px;
            
        }
        .login_title{
            font-size: 32px;
            color: #3C4042;
        }
        .el-form{
            /deep/ .el-input__inner{
                border:none;
                border-bottom: 1px solid #eee;
            }
            .el-button{
                width: 100%;
                background-color: #0B93DD;
            }
        }
    }
</style>