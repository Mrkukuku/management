<template>
    <!-- 微型站 -->
    <div class="miniStationManagement allcontent">
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
            <el-col :span="20" style='padding-left:10px;height:100%'>
                <!-- 头部 -->
                <div >
                     &nbsp;微型站类型 <el-select v-model="types" placeholder="请选择">
                            <el-option
                            v-for="item in gradeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        &nbsp;是否备案 <el-select v-model="types1" placeholder="请选择">
                            <el-option
                            v-for="item in typeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    <el-button type="primary" @click="addBuild" :disabled='addFalg'>新增</el-button>
                    <el-button type="primary" @click="seach"> 查询</el-button>
                    <el-button type="primary" @click="handleReset1">重置</el-button>
                    <el-button type="primary" class="imageBox">人员要求
                        <el-image 
                            :src="url" 
                            :preview-src-list="srcPerson">
                        </el-image>
                    </el-button>
                    <el-button type="primary" class="imageBox">
                        设施参考标准
                        <el-image 
                            :src="url" 
                            :preview-src-list="srcList">
                        </el-image>
                    </el-button>
                </div>

                <!-- 内容 -->
                <div class="bottom">
                    <!-- 表格 -->
                    <el-table
                        :data="tableData"
                        border
                        style="width: 100%">
                        <el-table-column
                        type="selection"
                        width="55"
                        >
                        </el-table-column>
                         <el-table-column   									
                        prop="unitName"
                        label="单位名称"
                        width="180">
                        </el-table-column>
                        <el-table-column   									
                        prop="name"
                        label="名称"
                        width="220">
                        </el-table-column>
                        <el-table-column
                        prop="typeName"
                        label="类型"
                        width="140">
                        </el-table-column>
                        <el-table-column
                        prop="recordName"
                        label="是否备案"
                        width="100">
                        </el-table-column>
                        <el-table-column
                        prop="principal"
                        label="负责人姓名"
                        width="100">
                        </el-table-column>
                        <el-table-column
                        prop="phone"
                        label="负责人电话"
                        width="130">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope='scope'>
                                <el-button
                                size="mini"
                                type="primary"
                                @click="editData(scope.row.id)">编辑</el-button>
                                <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.row.id)">删除</el-button>
                                <el-button
                                size="mini"
                                type="primary"
                                @click="personBox(scope.row.id,scope.row.type)">人员信息</el-button>
                                <el-button
                                size="mini"
                                type="primary"
                                @click="facilitiesBox(scope.row.id,scope.row.type)">设施信息</el-button>
                                <el-button
                                size="mini"
                                type="primary"
                                @click="openArchitectural(scope.row.id)">查看图片</el-button>
                             </template>
                        </el-table-column>
                        
                    </el-table>
                    <!-- 分页 -->
                </div>

                <!-- 微型站图片 -->
                <el-dialog
                    title="单位图"
                    :visible.sync="ArchitecturalVisible"
                    width="50%"
                    class='dialog'
                    :close-on-click-modal="false"
                    :before-close="closeArchitectural">
                    <fieldset>
                        <legend>各单位图片</legend>
                        <el-carousel :autoplay=false arrow ='always'  height="300px" :initial-index = 1 >
                            <el-carousel-item v-for="item in imgList" :key="item.name" class="elbg">
                                <span style="width:100%;text-align: center;display:inline-block;margin-bottom:5px;"> 第{{ item.num }}张 </span>
                                <img  style="width: 100%; height: 100%" :src="item.image"  alt="">
                            </el-carousel-item>
                        </el-carousel>
                    </fieldset>                    
                    <fieldset>
                        <legend>新增单位图片</legend>
                        <el-form  label-width="100px">
                           
                            <el-form-item label="图片选项">
                                <el-select v-model="phoneName" placeholder="请选择" >
                                    <el-option
                                        v-for="item in unitOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="单位图片" prop="phone" style="height:auto">
                               <el-upload
                                    class="avatar-uploader"
                                    action=""
                                    accept=".jpg,.png,.JPG,.PNG"
                                    :show-file-list="false"
                                    :on-change="beforeUpload"
                                    :auto-upload="false">
                                        <template v-if="posterURL">
                                            <template v-if="loading">
                                                <div 
                                                    v-if="posterURL"
                                                    v-loading="loading"
                                                    element-loading-text="上传中"
                                                    element-loading-spinner="el-icon-loading"
                                                    element-loading-background="rgba(0, 0, 0, 0.8)"
                                                >
                                                    <img  :src="posterURL" class="avatar">
                                                </div>
                                            </template>
                                            <template v-else>
                                                <img  :src="posterURL" class="avatar">
                                            </template>
                                        </template>
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                                    <el-button @click="unituploads" >立即上传</el-button>
                            </el-form-item>
                            <el-form-item solt-scope="scope">
                                <el-button size="small" type="primary" @click="photoSubmit">提交</el-button>
                                <!-- slot.row.id -->
                                <el-button size="small" type="primary" @click="photoReset">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </fieldset>
                </el-dialog>

                <!-- 微型站基础信息弹框 -->
                <el-dialog
                    title="微型站基础信息"
                    :visible.sync="dialogVisible"
                    width="45%"
                    :close-on-click-modal="false"
                    class='dialog'
                    :before-close="closedialog">
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                            <div class="doubtBox">
                                <div class="title">
                                    微型站类型如何判断?
                                </div>
                                <div class="doubtBox_content">
                                    <h3>分级标准</h3>
                                    <h5>单位微型消防站分为三级：</h5>
                                    <span>（一）设有消控室的重点单位，应建立一级微型消防站。同一建筑内多个重点单位共用消防控制室的，应按照一级微型消防站的要求分别独立建站。</span>
                                    <span>（二）无消控室、员工人数在10人（含）以上的重点单位，应建立二级微型消防站。</span>
                                    <span>（三）无消控室、员工人数在10人以下的重点单位，应建立三级微型消防站。</span>
                                    <span>（四）非重点单位可参照此分级标准建立微型消防站。</span>
                                </div>
                            </div>
                            <el-form-item label="微型站名称" prop="name">
                               <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="微型站类型" prop="type">
                                <el-select v-model="ruleForm.type" placeholder="请选择">
                                    <el-option
                                        v-for="item in gradeData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="是否备案" prop="record">
                                <el-radio v-model="ruleForm.record" label="1">是</el-radio>
                                <el-radio v-model="ruleForm.record" label="0">否</el-radio>
                            </el-form-item>
                            <el-form-item label="负责人姓名" prop="principal">
                                <el-input v-model="ruleForm.principal"></el-input>
                            </el-form-item>
                            <el-form-item label="负责人电话" prop="phone">
                                <el-input v-model="ruleForm.phone"></el-input>
                            </el-form-item>
                            <el-form-item label="位置描述" prop="address" >
                                <el-input v-model="ruleForm.address" type="textarea" placeholder="请填写具体建设位置 如：1楼北角落"></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="dialog-footer">
                            <el-button type="primary" @click="nextBox">下一步</el-button>
                            <el-button @click="closedialog">取 消</el-button>
                        </div>

                        <el-dialog
                            title="人员数量信息"
                            :visible.sync="basicInformation"
                            width="45%"
                            :close-on-click-modal="false"
                            class='dialog'
                            :append-to-body="true"
                            :before-close="closeBasicInformation">
                                <el-form :model="ruleForm" :rules="peoplerules" ref="peopleForm" label-width="150px" class="demo-ruleForm">
                                    <el-form-item label="值班员数量" prop="attendant">
                                        <el-input v-model="ruleForm.attendant"></el-input>
                                    </el-form-item>
                                    <el-form-item label="消防员数量" prop="firefighters">
                                        <el-input v-model="ruleForm.firefighters"></el-input>
                                    </el-form-item>
                                    <template>
                                        <el-form-item label="消控室操作员数量" prop="operator">
                                            <el-input v-model="ruleForm.operator"></el-input>
                                        </el-form-item>
                                    </template>
                                    <el-form-item label="班组长数量">
                                        <el-input v-model="ruleForm.teamLeader"></el-input>
                                    </el-form-item>
                                    <el-form-item label="驾驶员数量">
                                        <el-input v-model="ruleForm.driver"></el-input>
                                    </el-form-item>
                                    <div class="dialog-footer">
                                    <el-button type="primary" @click="submitData('peopleForm')" v-noMoreClick>保存</el-button>
                                    <el-button @click="closeBasicInformation">取 消</el-button>
                                </div>
                                </el-form>
                        </el-dialog>

                </el-dialog>
                <!-- 人员信息弹框 -->
                <el-dialog
                    title="人员信息"
                    :visible.sync="personDialog"
                    width="65%"
                    :close-on-click-modal="false"
                    class='personDialog'
                    :before-close="closepersonDialog">
                        <!-- 人员模糊查询 -->
                        <div class="personTop">
                            人员姓名:
                            <el-input v-model="searchPersonValue"></el-input>
                            人员类型:
                            <el-select v-model="searchPersonType" placeholder="请选择">
                                <el-option
                                    v-for="item in personTypeData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="searchPerson">查询</el-button>
                            <el-button @click="resetPerson">重置</el-button>
                            <el-button type="primary" @click="addPerson">新增</el-button>
                        </div>
                        <!-- 人员列表 -->
                        <el-table
                            :data="personData"
                            border
                            style="width: 100%">
                            <el-table-column
                            type="selection"
                            width="55"
                            >
                            </el-table-column>
                            <el-table-column   									
                            prop="name"
                            label="姓名"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="phone"
                            label="电话"
                            width="150">
                            </el-table-column>
                            <el-table-column
                            prop="certificateName"
                            label="是否持证"
                            width="100">
                            </el-table-column>
                            <el-table-column
                            prop="typeName"
                            label="人员类型"
                            width="100">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope='scope'>
                                    <!-- <el-button
                                    size="mini"
                                    type="primary"
                                    @click="editPersonData(scope.row.id)">编辑</el-button> -->
                                    <el-button
                                    size="mini"
                                    type="danger"
                                    @click="deletePersonData(scope.row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                        <!-- 分页 -->
                        <div class="page_all">
                            <el-pagination
                                @size-change="personSizeChange"
                                @current-change="personCurrentChange"
                                :current-page="personPageNum"
                                :page-sizes="[10, 20, 50, 100]"
                                :page-size="personPageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="personTotal">
                            </el-pagination>
                        </div>

                        <el-dialog
                            title="人员信息"
                            :visible.sync="personAddDialog"
                            width="40%"
                            :close-on-click-modal="false"
                            class='dialog'
                            :append-to-body="true"
                            :before-close="personAddDialogFun">
                            
                            <el-form :model="personForm" :rules="personRules" ref="personForm" label-width="150px" class="demo-ruleForm">
                                <el-form-item label="姓名" prop="name">
                                    <el-input v-model="personForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="电话" prop="phone">
                                    <el-input v-model="personForm.phone"></el-input>
                                </el-form-item>
                                <el-form-item label="人员类型" prop="type">
                                    <el-select v-model="personForm.type" placeholder="请选择">
                                        <el-option
                                            v-for="item in personTypeData"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="是否持证" prop="certificate">
                                    <el-radio v-model="personForm.certificate" label="1">是</el-radio>
                                    <el-radio v-model="personForm.certificate" label="0">否</el-radio>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="personSubmit('personForm')" v-noMoreClick>保存</el-button>
                                    <el-button @click="personAddDialogFun">取消</el-button>
                                </el-form-item>
                            </el-form>

                        </el-dialog>
                </el-dialog>
                <!-- 设施信息弹框 -->
                <el-dialog
                    title="设施信息"
                    :visible.sync="facilitiesAddDialog"
                    width="75%"
                    :close-on-click-modal="false"
                    class='dialog'
                    :before-close="facilitiesAddDialogFun">

                    <el-form :inline="true" :model="facilitiesForm"  ref="facilitiesForm" label-width="220px" class="demo-ruleForm">
                        <!-- :rules="facilitiesRules" -->
                        <fieldset>
                            <legend>灭火器材</legend>
                            <el-form-item label="水枪数量" prop="waterGun">
                                <el-input type='number' v-model="facilitiesForm.waterGun"></el-input> 把
                            </el-form-item>
                            <el-form-item label="消火栓扳手数量" prop="hydrantWrench">
                                <el-input type='number' v-model="facilitiesForm.hydrantWrench"></el-input> 把
                            </el-form-item>
                            <el-form-item label="ABC型干粉灭火器(4公斤装)数量" prop="extinguisher">
                                <el-input type='number' v-model="facilitiesForm.extinguisher"></el-input> 个
                            </el-form-item>
                            <el-form-item label="强光照明灯数量" prop="strongLight">
                                <el-input type='number' v-model="facilitiesForm.strongLight"></el-input> 个
                            </el-form-item>
                            <el-form-item label="水带(根据实际配备80MM/65MM水带)数量" prop="hose">
                                <el-input type='number' v-model="facilitiesForm.hose"></el-input> 盘
                            </el-form-item>
                        </fieldset>
                        
                        <fieldset>
                            <legend>破拆器材</legend>
                            <template v-if="type==3">
                                <el-form-item label="消防斧数量">
                                    <el-input type='number' v-model="facilitiesForm.fireAxe"></el-input> 把
                                </el-form-item>
                            </template>
                            <template v-else>
                                <el-form-item label="消防斧数量" prop="fireAxe">
                                    <el-input type='number' v-model="facilitiesForm.fireAxe"></el-input> 把
                                </el-form-item>
                            </template>
                            <el-form-item label="绝缘剪断钳数量">
                                <el-input type='number' v-model="facilitiesForm.scissorsPliers"></el-input> 把
                            </el-form-item>
                            <el-form-item label="铁铤数量">
                                <el-input type='number' v-model="facilitiesForm.ironCollar"></el-input> 把
                            </el-form-item>
                        </fieldset>

                        <fieldset>
                            <legend>个人防护装备</legend>
                            <el-form-item label="消防头盔数量" prop="fireHelmet">
                                <el-input type='number' v-model="facilitiesForm.fireHelmet"></el-input> 顶
                            </el-form-item>
                            <el-form-item label="消防员灭火防护服数量" prop="protectiveClothing">
                                <el-input type='number' v-model="facilitiesForm.protectiveClothing"></el-input> 套
                            </el-form-item>
                            <el-form-item label="消防员灭火防护靴数量" prop="protectiveBoots">
                                <el-input type='number' v-model="facilitiesForm.protectiveBoots"></el-input> 双
                            </el-form-item>
                            <el-form-item label="消防安全腰带数量" prop="safetyBelt">
                                <el-input type='number' v-model="facilitiesForm.safetyBelt"></el-input> 条
                            </el-form-item>
                            <el-form-item label="消防手套数量" prop="fireGloves">
                                <el-input type='number' v-model="facilitiesForm.fireGloves"></el-input> 双
                            </el-form-item>
                            <template v-if="type==3">
                                <el-form-item label="消防过滤式综合防毒面具数量">
                                    <el-input type='number' v-model="facilitiesForm.gasMask"></el-input> 个
                                </el-form-item>
                            </template>
                            <template v-else>
                                <el-form-item label="消防过滤式综合防毒面具数量" prop="gasMask">
                                    <el-input type='number' v-model="facilitiesForm.gasMask"></el-input> 个
                                </el-form-item>
                            </template>
                        </fieldset>

                         <fieldset>
                            <legend>通讯器材</legend>
                            <el-form-item label="固定电话(值班室,寝室同号分机)数量" prop="telephone">
                                <el-input type='number' v-model="facilitiesForm.telephone"></el-input> 台
                            </el-form-item>
                            <template v-if="type==1">
                                <el-form-item label="对讲机数量" prop="intercom">
                                    <el-input type='number' v-model="facilitiesForm.intercom"></el-input> 台
                                </el-form-item>
                            </template>
                            <template v-else>
                                <el-form-item label="对讲机数量" prop="intercom">
                                    <el-input type='number' v-model="facilitiesForm.intercom"></el-input> 台
                                </el-form-item>
                            </template>
                            <el-form-item label="POC对讲机数量">
                                <el-input type='number' v-model="facilitiesForm.pocIntercom"></el-input> 台
                            </el-form-item>
                        </fieldset>
                        <el-form-item>
                            <el-button type="primary" @click="facilitiesSubmit('facilitiesForm')" v-noMoreClick>保存</el-button>
                            <el-button @click="facilitiesAddDialogFun">取消</el-button>
                        </el-form-item>
                    </el-form>

                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data(){
        var valueInputvar=(rule, value, callback) => {
            var reg = /^\+?[1-9]\d*$/;
            if (reg.test(value)) {
                if (value<1) {
                    callback(new Error('数量最少为1'));
                }else{
                    callback();
                }
            }else{
                callback(new Error('数量必须大于零且不能为小数'));
            }
        };
        var valueInputvar1=(rule, value, callback) => {
            var reg = /^\+?[1-9]\d*$/;
            if (reg.test(value)) {
                if(this.type==1||this.type==2){
                    if (value<2) {
                        callback(new Error('数量最少为2'));
                    }else{
                        callback();
                    }
                }else{
                    if (value<1) {
                        callback(new Error('数量最少为1'));
                    }else{
                        callback();
                    }
                }
            }else{
                callback(new Error('数量必须大于零且不能为小数'));
            }
            
        };
        var valueInputvar2=(rule, value, callback) => {
            var reg = /^\+?[1-9]\d*$/;
            if (reg.test(value)) {
                if (value<2) {
                    callback(new Error('数量最少为2'));
                }else{
                    callback();
                }
            }else{
                callback(new Error('数量必须大于零且不能为小数'));
            }
        };
        var valueEqument=(rule, value, callback) => {
            var reg = /^\+?[1-9]\d*$/;
            if (reg.test(value)) {
                callback();
            }else{
                callback(new Error('数量必须大于零且不能为小数'));
            }
        };
        return {
            userType:'',//用户等级
            loading:false,//上传图片显示loading
            ruleForm: {
                principal:'',//负责人名称
                type:'',//微型站类型
                phone:'',//负责人电话
                record:'1',//是否备案
                address:'',//位置描述
                attendant:'0',//值班员
                firefighters:'0',//消防员
                operator:'0',//消控室操作员
                teamLeader:'0',//班组长
                driver:'0',//驾驶员
                name:"",//微型站名称
            },
            rules: {
                   name:[
                       { required: true, message: '请输入微型站名称', trigger: 'blur' },
                   ],
                   principal:[
                       { required: true, message: '请输入负责人姓名', trigger: 'blur' },
                   ],
                   phone:[
                       { required: true, message: '请输入负责人手机', trigger: 'blur' },
                       {pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: '手机格式不正确', trigger: 'blur' }
                   ],
                   type:[
                       { required: true, message: '请选择微型站等级', trigger: 'blur' },
                   ],
                   record:[
                       { required: true, message: '请选择是否备案', trigger: 'blur' },
                   ],
                   address:[
                       { required: true, message: '请描述微型站具体位置', trigger: 'blur' },
                   ],
            },
            peoplerules: {
                   attendant:[
                       { required: true, message: '请输入值班员数量', trigger: 'blur' },
                    //    {validator: valueInputvar, required: true, trigger: 'blur' }
                   ],
                   firefighters:[
                       { required: true, message: '请输入消防员数量', trigger: 'blur' },
                    //    {validator: valueInputvar1, required: true, trigger: 'blur' }

                   ],
                   operator:[
                       { required: true, message: '请输入消控室操作员数量', trigger: 'blur' },
                       {validator: valueInputvar2, required: true, trigger: 'blur' }
                   ]
                   
            },
            personForm:{
                certificate:'1',//是否持证
                name:'',//姓名
                phone:'',//电话
                type:'',//人员类型
            },
            personRules:{
                name:[
                       { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                phone:[
                    { required: true, message: '请输入联系电话', trigger: 'blur' },
                    {pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: '手机格式不正确', trigger: 'blur' }
                ],
                type:[
                    { required: true, message: '请选择人员类型', trigger: 'blur' },
                ],
                keepRecord:[
                    { required: true, message: '请选择是否持证', trigger: 'blur' },
                ]
            },
            facilitiesForm:{
                waterGun:'0',//水枪
                hose:'0',//水带
                hydrantWrench:'0',//消火栓扳手数量
                extinguisher:'0',//ABC型干粉灭火器(4公斤装)数量
                strongLight:'0',//强光照明灯数量
                fireAxe:'0',//消防斧数量
                scissorsPliers:'0',//绝缘剪断钳数量
                ironCollar:'0',//铁铤数量
                fireHelmet:'0',//消防头盔数量
                protectiveClothing:'0',//消防员灭火防护服数量
                protectiveBoots:'0',//消防员灭火防护靴数量
                safetyBelt:'0',//消防安全腰带数量
                fireGloves:'0',//消防手套数量
                gasMask:'0',//消防过滤式综合防毒面具数量
                telephone:'0',//固定电话(值班室,寝室同号分机)数量
                intercom:'0',//对讲机数量
                pocIntercom:'0'//POC对讲机数量
            },
            facilitiesRules:{
                waterGun:[
                    { required: true, message: '请输入水枪数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                hose:[
                    { required: true, message: '请输入消火栓扳手数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                hydrantWrench:[
                    { required: true, message: '请输入水带数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                extinguisher:[
                    { required: true, message: '请输入ABC型干粉灭火器(4公斤装)数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                strongLight:[
                    { required: true, message: '请输入强光照明灯数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                fireAxe:[
                    { required: true, message: '请输入消防斧数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                scissorsPliers:[
                    { required: true, message: '请输入绝缘剪断钳数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                ironCollar:[
                    { required: true, message: '请输入铁铤数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                fireHelmet:[
                    { required: true, message: '请输入消防头盔数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                protectiveClothing:[
                    { required: true, message: '请输入消防员灭火防护服数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                protectiveBoots:[
                    { required: true, message: '请输入消防员灭火防护靴数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                safetyBelt:[
                    { required: true, message: '请输入消防安全腰带数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                fireGloves:[
                    { required: true, message: '请输入消防手套数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                gasMask:[
                    { required: true, message: '请输入消防过滤式综合防毒面具数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                telephone:[
                    { required: true, message: '请输入固定电话(值班室,寝室同号分机)数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                intercom:[
                    { required: true, message: '请输入对讲机数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
                pocIntercom:[
                    { required: true, message: '请输入POC对讲机数量', trigger: 'blur' },
                    {validator: valueEqument, required: true, trigger: 'blur' }
                ],
            },
            gradeData:[
                {
                    value:1,
                    label:'一级微型站'
                },
                {
                    value:2,
                    label:'二级微型站'
                },
                {
                    value:3,
                    label:'三级微型站'
                },
            ],
            personTypeData:[//1 值班员 2 消防员 3 操作员 4 班组长 5驾驶员
                {
                    value:1,
                    label:'值班员'
                },
                {
                    value:2,
                    label:'消防员'
                },
                {
                    value:3,
                    label:'消控室操作员'
                },
                {
                    value:4,
                    label:'班组长'
                },
                {
                    value:5,
                    label:'驾驶员'
                },
            ],
            defaultProps: { //树
                children: 'children',
                label: 'label'
            },
            addFalg: true,//新增开关
            Treedata:[],//树状图数据
            filterText:'',//树状图过滤框
            unitId:'',//单位Id
            pageNum:1,
            pageSize:10,
            total:100,
            tableData:[],//微型站列表数据
            personData:[
                {
                    name:'张三',
                    phone:'13095570045',
                    height:'是',
                    type:'值班人员'
                }
            ],//人员列表信息
            dialogVisible:false,//新增弹框
            basicInformation:false,//人员弹框
            type:'2',//微型站等级
            personDialog:false,//人员列表弹框
            personAddDialog:false,//人员信息弹框
            searchPersonValue:'',//模糊搜索人员姓名
            searchPersonType:'',//模糊搜索人员类型
            personPageNum:1,
            personPageSize:10,
            personTotal:100,
            stationId:'',//微型站id
            facilitiesAddDialog:false,//设施信息弹框
            srcList:['https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/unit/1581668243291-328125c648bb2029679c13313392a21.png'],
            url:'https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/unit/1581668243291-328125c648bb2029679c13313392a21.png',
            srcPerson:['https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/unit/1581669761852-c3f9460deb62678e8277632bef55e2b.png'],
            ArchitecturalVisible:false,//微型站弹框
            imgList:[],//图片集合
            unitOptions:[
                {
                    id:1,
                    name:'第一张'
                },
                {
                    id:2,
                    name:'第二张'
                },
                {
                    id:3,
                    name:'第三张'
                },
                {
                    id:4,
                    name:'第四张'
                },
            ],
            posterURL:'',//图片数据
            phoneName:'',//图片第几张
            imgUrl:'',//上传图片数据
            upload:'',//图片数据
            typeList:[
                {
                    id:1,
                    name:"是"
                },
                {
                    id:0,
                    name:'否'
                }
            ],
            types:'',
            types1:''
        }
    },
    methods:{
        handleReset1(){
            this.types=''
            this.types1=''
            this.currentPage=1
            this.getData()
        },
         seach(){
            this.currentPage = 1
            this.getData()
        },
        beforeUpload(file) {       //上传前
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            const extension = testmsg === 'jpg'
            const extension2 = testmsg === 'png'
            const isLt2M = file.size / 1024 / 1024 < 5
            if(!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是jpg,png格式!',
                    type: 'warning'
                });
                this.$refs.upload.clearFiles();
                this.imgFile=null;
                return ;
            }
            if(!isLt2M) {
                this.$message({
                    message: '上传文件大小不能超过 5MB!',
                    type: 'warning'
                });
                this.$refs.upload.clearFiles();
                this.files = null;
                return ;
            }
            // console.log(file)
            this.posterURL = URL.createObjectURL(file.raw);
            this.upload= file.raw;
        
        },
        unituploads(){  //上传图片
            var _this=this;
            this.loading=true;
            if( _this.phoneName ) {
                if( !_this.posterURL ) {
                    _this.$alert('请上传图片', '提示', {
                        confirmButtonText: 'OK',
                    });
               }
                    let formdata = new FormData();
                    formdata.append('file', this.upload);
                    formdata.append('fileType',6);
                    this.axios({
                    url   : "/api/admin/file/upload",
                    method: 'post',
                    data  :formdata
                    }).then(res=>{    
                        if(res.data.code==0){
                            this.loading=false;
                            _this.imgUrl = res.data.data.fileUrl;
                            this.$message({
                                message: '上传成功',
                                type: 'success'
                            });
                        }else{
                            this.loading=false;
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });
                        }                                             
                    })
            }else{
                _this.$alert('请选择图片选项', '提示', {
                        confirmButtonText: 'OK',
                });
            }
        },
        photoSubmit () {//图片个数上传
            var _this = this
            this.axios({
                url:"api/admin/fire/station/images/add",
                method:"post",
                data:{    
                    image:this.imgUrl,
                    stationId:this.stationId,
                    num:this.phoneName
                }
            }).then( res => {
                if( res.data.code === 0) {
                    _this.$alert('添加成功', '提示', {
                        confirmButtonText: 'OK',
                        callback:()=>{
                            _this.photoReset();
                            _this.photoList();
                        }
                    });
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    }); 
                }                    
            })
        },
        photoList(){//图片列表
            var _this = this
            this.axios({
                url:"/api/admin/fire/station/images/list",
                method:"post",
                data:{    
                    id:this.stationId
                }
            }).then( res => {
                if( res.data.code === 0) {
                    _this.imgList=res.data.data;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    }); 
                }                    
            })
        },
        photoReset () {//重置图片
            this.posterURL = ''
            this.imgUrl = ''
            this.phoneName = ''
        },
        openArchitectural(id){//上传图片页面打开
            this.stationId=id;
            this.photoList();
            this.ArchitecturalVisible=true;
        },
        closeArchitectural(){//关闭上传图片弹框
            this.ArchitecturalVisible=false;
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
           this.unitId = data.id
           this.pageSize = 10
           this.pageNum = 1
           if( data.type == 0 ) {
               this.addFalg = true
           }else{
                this.addFalg = false
           }
           this.getData()
        },
        openNode(data){     //打开树节点
            data.icon='el-icon-folder-opened'
        },
        closeNode(data){    //关闭树节点
            data.icon='el-icon-folder'
        },
        filterNode(value, data) {//树节点筛选
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        addBuild(){//打开新增弹框
            this.dialogVisible=true;
        },
        closedialog(){//关闭弹框
            this.dialogVisible=false;
            delete this.ruleForm.id;
            Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
        },
        nextBox(){//填写人员数量信息
            this.basicInformation=true;
        },
        submitData(name){//提交人员信息数量
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.ruleForm.unitId=this.unitId;
                    var url="/api/admin/fire/station/add";
                    if(this.ruleForm.id){
                        url="/api/admin/fire/station/update"
                    }
                    var _this=this;
                    this.axios({
                        url:url,
                        method:'post',
                        data:this.ruleForm
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('保存成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:()=>{
                                    _this.getData();
                                    _this.closeBasicInformation();
                                }
                            });
                        }else{
                            _this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }
                    })
                }
            })
        },
        handleDelete(id){//删除微型站
            this.$confirm('你确定要删除吗')
                .then(()=> {
                    var _this=this;
                    this.axios({
                        url:'/api/admin/fire/station/delete',
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
        editData(id){//编辑微型站回显
            var _this=this;
            this.axios({
                url:'/api/admin/fire/station/single',
                method:'post',
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.ruleForm=res.data.data;
                    _this.ruleForm.record=String(_this.ruleForm.record)
                    _this.addBuild();
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        closeBasicInformation(){
            this.dialogVisible=false;
            this.basicInformation=false;
            
        },
        getData(){//获取表格数据
            var _this=this;
            this.axios({
                url:'/api/admin/fire/station/list',
                method:'post',
                data:{
                    id:this.unitId,
                    type:this.types,
                    record:this.types1
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.tableData=res.data.data;
                    _this.total=res.data.total;
                    for(var i in _this.tableData){
                        _this.tableData[i].typeName=_this.tableData[i].type+'级微型站';
                        if(_this.tableData[i].record==1){
                           _this.tableData[i].recordName='是'; 
                        }else{
                            _this.tableData[i].recordName='否'; 
                        }
                        
                    }
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        getTreeData(){//获取单位树状图列表
            var _this=this;
            this.axios({
                url   :"api/admin/unit/list.left",
                method: 'post',
                params  : {
                    pageNum:1,
                    pageSize:1000,
                }
            }).then(res=>{
                if(res.data.code==0){
                    this.Treedata=res.data.data;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        personSizeChange(pageSize){//改变人员信息页数
            this.personPageSize=pageSize;
            this.getPersonData();
        },
        personCurrentChange(pageNum){//改变人员信息页码
            this.personPageNum=pageNum;
            this.getPersonData();
        },
        personBox(id,type){//打开人员列表信息弹框
            this.stationId=id;
            this.type=type;
            this.personDialog=true;
            this.getPersonData();
        },
        getPersonData(){//人员列表信息
            var _this=this;
            this.axios({
                url:'/api/admin/fire/station/person/search/page',
                method:'post',
                data:{
                    pageNum:this.personPageNum,
                    pageSize:this.personPageSize,
                    stationId:this.stationId,
                    name:this.searchPersonValue,
                    type:this.searchPersonType
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.personTotal=res.data.total;
                    _this.personData=res.data.list;
                    for(var i in _this.personData){
                        if(_this.personData[i].type==1){//1 值班员 2 消防员 3 操作员 4 班组长 5驾驶员
                            _this.personData[i].typeName='值班员'
                        }else if(_this.personData[i].type==2){
                            _this.personData[i].typeName='消防员'
                        }else if(_this.personData[i].type==3){
                            _this.personData[i].typeName='操作员'
                        }else if(_this.personData[i].type==4){
                            _this.personData[i].typeName='班组长'
                        }else{
                            _this.personData[i].typeName='驾驶员'
                        }

                        if(_this.personData[i].certificate==1){
                            _this.personData[i].certificateName='是';
                        }else{
                            _this.personData[i].certificateName='否';
                        }
                        
                        
                    }
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        closepersonDialog(){//关闭人员列表信息弹框
            this.personDialog=false;
        },
        personAddDialogFun(){//新增人员弹框关闭
            this.personAddDialog=false;
            Object.assign(this.$data.personForm,this.$options.data().personForm);
        },
        searchPerson(){//模糊查询人员
            this.getPersonData();
        },
        resetPerson(){//重置模糊查询人员
            this.searchPersonValue='';
            this.searchPersonType='';
        },
        addPerson(){//新增人员弹框打开
            this.personAddDialog=true;
        },
        personSubmit(name){//提交人员信息
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.personForm.stationId=this.stationId;
                    var _this=this;
                    this.axios({
                        url:'/api/admin/fire/station/person/add',
                        method:'post',
                        data:this.personForm
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('保存成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:()=>{
                                    _this.personAddDialogFun();
                                    _this.getPersonData();
                                }
                            });
                        }else{
                            _this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }
                    })
                }
            })
        },
        deletePersonData(id){//删除某人员
            var _this=this;
            this.axios({
                url:'/api/admin/fire/station/person/delete',
                method:'post',
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.$alert('删除成功', '提示', {
                        confirmButtonText: 'OK',
                        callback:()=>{
                            _this.getPersonData();
                        }
                    });
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        editPersonData(id){//修改人员信息
            var _this=this;
            this.axios({
                url:'/api/admin/fire/station/person/search/single',
                method:'post',
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.personForm=res.data.data;
                    _this.personForm.certificate=String(_this.personForm.certificate)
                    _this.addPerson();
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        facilitiesBox(id,type){//打开设施弹框
            this.type=type;
            this.stationId=id;
            this.facilitiesSingle(id);
            this.facilitiesAddDialog=true;
        },
        facilitiesAddDialogFun(){//关闭设施弹框
            this.facilitiesAddDialog=false;
            Object.assign(this.$data.facilitiesForm,this.$options.data().facilitiesForm);
        },
        facilitiesSubmit(name){//设备提交
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.facilitiesForm.stationId=this.stationId;
                    var _this=this;
                    this.axios({
                        url:'/api/admin/fire/station/equipment/save',
                        method:'post',
                        data:this.facilitiesForm
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('保存成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:()=>{
                                    _this.facilitiesAddDialogFun();
                                }
                            });
                        }else{
                            _this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }
                    })
                }
            })
        },
        facilitiesSingle(id){//设备查看详情
            var _this=this;
            this.axios({
                url:'/api/admin/fire/station/equipment/single',
                method:'post',
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.data.code==0){
                    if(res.data.data){
                        _this.facilitiesForm=res.data.data;
                    }
                    
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
      
    },
    mounted(){
        this.userType=sessionStorage.getItem('userTypes');
            this.unitId=sessionStorage.getItem('unitId');
            this.getData();
        if(this.userType==3){
            this.addFalg=false;
        }else{
            this.getTreeData();
        }
        
    },
    watch:{
        filterText(val) {
            this.$refs.tree.filter(val);
          }
      }
}
</script>

<style lang="scss" scoped>
    .miniStationManagement{
         background: #fff;
         /deep/ .el-input{
            width:180px;
        }
    }
    
    .personDialog{
        /deep/ .el-dialog{
             .el-dialog__body{
                height: 600px;
                padding: 20px 20px 30px;
                .el-input{
                    width: auto;
                }
            }
            .personTop{
                margin-bottom: 10px;
            }
        }
        
    }
    .imageBox{
        display:inline-block;
        position: relative;
        &>span{
            display: inline-block;
            position: relative;
            .el-image{
                width: 100%;
                height: 15px;
                position: absolute;
                left: 0;
                /deep/ .el-image__inner{
                opacity: 0;
            }
            }
            
        }
    }
    .page_all .el-select{
        width: 100px;
    }
    .el-dialog{
        .el-dialog__body{
            padding: 0 20px 30px;
        }
        .el-select,.el-input{
            width:220px;
        }
        .el-textarea{
            width: 80%;
        }
    }
    .doubtBox{
        position: relative;
        text-align: right;
        .title{
            text-decoration: underline;
            cursor: pointer;
            font-size: 15px;
            position: relative;
            display: inline-block;
        }
        .title:hover+.doubtBox_content{
            display: block;
        }
        .doubtBox_content{
            display: none;
            text-align: left;
            position:absolute;
            background-color: #fff;
            width: 400px;
            height: 290px;
            top: 30px;
            right: 0;
            z-index: 1000;
            padding: 10px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            span{
                display: inline-block;
            }
        }
    }
    .dialog-footer{
        text-align: center;
    }
    /deep/ .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 177px;
        height: 95px;
        line-height: 95px;
        text-align: center;
    }
    .avatar {
        width: 177px;
        height: 95px;
        display: block;
    }
    .el-loading-spinner{
        position: relative;
        top: 0;
        margin-top: 0px;
    }
        
</style>