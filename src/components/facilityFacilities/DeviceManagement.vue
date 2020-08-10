<template>
<!-- 设备管理 -->
    <div id="DeviceManagement"  class='allcontent'>
        <!-- 导航树 -->
        <el-col :span="4" class="tree_box" v-if="userType!=3">
            <div>
                <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText" 
                    class="filter_text">
                </el-input>
                <el-tree 
                    :data="Treedata" 
                    :props="treedefaultProps" 
                    @node-click="handleNodeClick" 
                    :render-content="renderContent"
                    highlight-current--
                    :filter-node-method="filterNode"
                    ref="tree">
                </el-tree>
            </div>
        </el-col>

        <el-col :span="20" style="height:100%;">
            <!-- 头部 -->
            <div class="top" style="margin-left:10px">
                <div>
                    设备名称:
                    <el-input v-model="deviceName"></el-input>
                    隶属系统:<el-select v-model="system" placeholder="--请选择--" @change="currentSel">
                        <el-option
                        v-for="item in intelligentFireList"
                        :key="item.code"
                        :label="item.description"
                        :value="item.code">
                        </el-option>
                    </el-select>
                    设备类型:<el-select v-model="devicestype" placeholder="--请选择--">
                        <el-option
                        v-for="item in deviceTypeList"
                        :key="item.code"
                        :label="item.description"
                        :value="item.code">
                        </el-option>
                    </el-select>
                    在线状态:<el-select v-model="onLine" placeholder="--请选择--">
                        <el-option
                        v-for="item in deviceOnline"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button type="danger" plain @click="showOverdueDevice">过期设备</el-button>
                    <el-button type="primary" @click="searchsubmit">查询</el-button>
                    <el-button @click="resetSearch">重置</el-button>
                    <template v-if="userType==3">
                         <el-button type="primary" @click="openchangeSystem"><i class="el-icon-plus"></i> 新增</el-button>
                    </template>
                    <template v-else>
                         <el-button type="primary" @click="openchangeSystem" :disabled="addFlag"><i class="el-icon-plus"></i> 新增</el-button>
                    </template>
                </div>
                    
            </div>

            <!-- 新增弹框 -->
            <el-dialog
                title="添加修改数据设备信息"
                :visible.sync="dialogVisible"
                width="74%"
                :close-on-click-modal="false"
                class='dialog dialog_insert'
                :before-close="closedialog">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :inline='true' :data="ruleForm" label-width="110px" class="demo-ruleForm ruleForm_insert" :disabled="flag==true">      
                        <fieldset>
                            <legend>基本设备信息</legend>
                            <el-form-item label="设备名称">   
                                <el-input v-model="EquipmentDetail.deviceName" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="设备型号">
                                <el-input v-model="EquipmentDetail.deviceModel" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="设备隶属系统">   
                                <el-input v-model="EquipmentDetail.intelligentFireSystemDesc" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="设备类型">   
                                <el-input v-model="EquipmentDetail.deviceTypeDesc" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="设备生产商">
                                <el-input v-model="EquipmentDetail.manufacturer" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="生厂商电话">
                                <el-input v-model="EquipmentDetail.manufacturerTel" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="设备供应商">
                                <el-input v-model="EquipmentDetail.supplier" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="供应商电话">
                                <el-input v-model="EquipmentDetail.supplierTel" disabled></el-input>
                            </el-form-item>  
                            <el-form-item label="品牌">
                                <el-input v-model="EquipmentDetail.brand" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="设备协议类型">
                                <el-input v-model="EquipmentDetail.protocolIdDesc" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="设备接入类型">
                                <el-input v-model="EquipmentDetail.accessTypeDesc" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="设备图片">
                                <img :src="EquipmentDetail.deviceImgUrl" style="width:180px" class="avatar">
                            </el-form-item>
                            <el-form-item label="设备别名" prop="deviceAlias">
                                <el-input v-model="ruleForm.deviceAlias"></el-input>
                            </el-form-item>
                          
                            <el-form-item label="产品序列号" prop="deviceCode" >
                                <el-input v-model="ruleForm.deviceCode" :disabled="serialFlag"></el-input>
                            </el-form-item>
                           
                            <el-form-item label="开通日期" prop="openDate">
                                 <el-date-picker
                                    v-model="ruleForm.openDate"
                                    value-format="yyyy-MM-dd"
                                    placeholder="请选择日期"
                                    type="date">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="过期日期" prop="expirationTime">
                                 <el-date-picker
                                    v-model="ruleForm.expirationTime"
                                    value-format="yyyy-MM-dd"
                                    placeholder="请选择日期"
                                    :picker-options="pickerOptions"
                                    type="date">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="通讯方式" prop="communicationMethod">
                                <el-select v-model="ruleForm.communicationMethod" placeholder="--请选择--">
                                    <el-option
                                    v-for="item in CommunicationList"
                                    :key="item.code"
                                    :label="item.description"
                                    :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="通讯方式信息" prop="communicationInformation">
                                <el-input v-model="ruleForm.communicationInformation"></el-input>
                            </el-form-item>
                        </fieldset>
                        
                        <fieldset>
                            <legend>安装设备信息</legend>
                            <el-form-item label="选择建筑" prop="buildingId">   
                                <el-select v-model="ruleForm.buildingId" placeholder="请选择">
                                <el-option
                                    v-for="item in options"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            </el-form-item>
                            <template v-if="installchange==true">
                                <el-form-item label="选择安装模板" prop="installMsg">   
                                    <el-select v-model="ruleForm.installMsg" placeholder="请选择" @visible-change='installValue'>
                                    <el-option
                                        v-for="item in installOptions"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                </el-form-item>
                            </template>
                            <template v-if="installchange==false">
                                <el-form-item label="安装公司" prop="installationCompany">   
                                    <el-input v-model="ruleForm.installationCompany"></el-input>
                                </el-form-item>
                                <el-form-item label="安装人姓名" prop="installerName">
                                    <el-input v-model="ruleForm.installerName"></el-input>
                                </el-form-item>
                                <el-form-item label="安装人电话" prop="installerPhone">   
                                    <el-input v-model="ruleForm.installerPhone"></el-input>
                                </el-form-item>
                                <el-form-item label="调试人员" prop="debugger">   
                                    <el-input v-model="ruleForm.debugger"></el-input>
                                </el-form-item>
                                <el-form-item label="调试人员电话" prop="debuggerPhone">
                                    <el-input v-model="ruleForm.debuggerPhone"></el-input>
                                </el-form-item>
                            </template>
                            <el-form-item label="安装日期" prop="installationDate">
                                <el-date-picker
                                    v-model="ruleForm.installationDate"
                                    value-format="yyyy-MM-dd"
                                    placeholder="请选择日期"
                                    type="date">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="安装位置" prop="description">
                                <el-input type="textarea" v-model="ruleForm.description"></el-input>
                            </el-form-item>
                        </fieldset>

                        <fieldset>
                            <legend>扩展设备信息</legend>
                            <div v-if="radio==1">
                                <el-form-item label="设备子号" prop="deviceSubNum">   
                                    <el-input v-model="ruleForm.deviceSubNum"></el-input>
                                </el-form-item>
                                <el-form-item label="设备点位管理" prop="devicePointManagement">   
                                    <el-input v-model="ruleForm.devicePointManagement"></el-input>
                                </el-form-item>
                                <el-form-item label="接口类型" prop="interfaceType">
                                    <el-input v-model="ruleForm.interfaceType"></el-input>
                                </el-form-item>
                                <el-form-item label="数据项解析" prop="dataItemAnalysis">   
                                    <el-input v-model="ruleForm.dataItemAnalysis"></el-input>
                                </el-form-item>
                                <el-form-item label="部位解析方式" prop="nodeResolution">   
                                    <el-select v-model="ruleForm.nodeResolution" placeholder="请选择">
                                        <el-option
                                        v-for="item in dataAnalysisOPtions"
                                        :key="item.code"
                                        :label="item.description"
                                        :value="item.code">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="解析方式">   
                                    <el-select v-model="ruleForm.customResolution.resolutionType" placeholder="请选择">
                                        <el-option
                                        v-for="item in resolutionTypeOPtions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="启用部位号" >
                                    <el-radio v-model="ruleForm.customResolutionType" label="1">是</el-radio>
                                    <el-radio v-model="ruleForm.customResolutionType" label="0">否</el-radio>
                                </el-form-item>
                                <el-form-item label="主机" >
                                    <el-select v-model="ruleForm.customResolution.resolutionRule.host.start" placeholder="开始索引小于结束索引">
                                        <el-option
                                        v-for="item in customResolutionOPtions"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.value">
                                        
                                        </el-option>
                                    </el-select> - 
                                    <el-select v-model="ruleForm.customResolution.resolutionRule.host.end" placeholder="结束索引要大于开始索引">
                                        <el-option
                                        v-for="item in customResolutionOPtions"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="回路(大于主机)">
                                    <el-select v-model="ruleForm.customResolution.resolutionRule.loop.start" placeholder="开始索引小于结束索引">
                                        <el-option
                                        v-for="item in customResolutionOPtions"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.value">
                                        </el-option>
                                    </el-select> - 
                                    <el-select v-model="ruleForm.customResolution.resolutionRule.loop.end" placeholder="结束索引要大于开始索引">
                                        <el-option
                                        v-for="item in customResolutionOPtions"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="节点(大于回路主机)" class="nodeWidth">
                                    <el-select v-model="ruleForm.customResolution.resolutionRule.node.start" placeholder="开始索引小于结束索引">
                                        <el-option
                                        v-for="item in customResolutionOPtions"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.value">
                                        </el-option>
                                    </el-select> - 
                                    <el-select v-model="ruleForm.customResolution.resolutionRule.node.end" placeholder="结束索引要大于开始索引">
                                        <el-option
                                        v-for="item in customResolutionOPtions"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div v-if="radio==2">
                                <el-form-item label="端口号" >   
                                    <el-input @focus="openPortdialog=true"></el-input>
                                </el-form-item>
                                <el-form-item label="正常名" prop="normalName">   
                                    <el-input v-model="ruleForm.normalName"></el-input>
                                </el-form-item>
                                <el-form-item label="异常名" prop="exceptionName">
                                    <el-input v-model="ruleForm.exceptionName"></el-input>
                                </el-form-item>
                            </div>
                            <div v-if="radio==3">
                                <el-form-item label="端口号" prop="portNumber" >   
                                    <el-input @focus="openPortdialog=true" placeholder="请选择端口号"></el-input>
                                </el-form-item>
                                <el-form-item label="模拟系数" prop="analogCoefficient">   
                                    <el-input v-model="ruleForm.analogCoefficient"></el-input>
                                </el-form-item>
                                <el-form-item label="上限" prop="upperLimit">
                                    <el-input v-model="ruleForm.upperLimit"></el-input>
                                </el-form-item>
                                <el-form-item label="下限" prop="lowerLimit">   
                                    <el-input v-model="ruleForm.lowerLimit"></el-input>
                                </el-form-item>
                                <el-form-item label="正常名" prop="normalName">   
                                    <el-input v-model="ruleForm.normalName"></el-input>
                                </el-form-item>
                                <el-form-item label="异常名" prop="exceptionName">
                                    <el-input v-model="ruleForm.exceptionName"></el-input>
                                </el-form-item>
                            </div>
                            <div v-if="radio==8">
                                 <el-form-item label="mac地址" >   
                                    <el-input v-model="ruleForm.cameraMacAddress"></el-input>
                                </el-form-item>
                                 <el-form-item label="ip地址" >   
                                    <el-input v-model="ruleForm.cameraAddress"></el-input>
                                </el-form-item>
                                 <el-form-item label="账号" >   
                                    <el-input v-model="ruleForm.cameraAccount"></el-input>
                                </el-form-item>
                                 <el-form-item label="密码">   
                                    <el-input show-password v-model="ruleForm.cameraPassword"></el-input>
                                </el-form-item>
                                 <el-form-item label="设备验证码" >
                                    <el-input  v-model="ruleForm.verificationCode"></el-input>
                                </el-form-item>
                                 
                                <el-form-item label="是否支持云台" v-show="sicFlag">   
                                   <el-select v-model="ruleForm.cameraPlatform" placeholder="请选择">
                                        <el-option
                                        v-for="item in sicOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="是否支持SD卡" v-show="sicFlag">
                                   <el-select v-model="ruleForm.cameraIsExistsSd" placeholder="请选择">
                                        <el-option
                                        v-for="item in sicOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="是否支持云存储" v-show="sicFlag">
                                   <el-select v-model="ruleForm.cameraIsCloud" placeholder="请选择">
                                        <el-option
                                        v-for="item in sicOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="关联摄像头" v-show="!sicFlag">   
                                   <el-select
                                        v-model="ruleForm.cameraIds"
                                        multiple
                                        collapse-tags
                                        placeholder="请选择"
                                        class="sic_width"
                                        >
                                        <el-option
                                        v-for="item in deviceOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                        </el-option>
                                </el-select>
                                </el-form-item>
                                <el-form-item label="关联录像机" v-show="sicFlag">   
                                   <el-select
                                        v-model="ruleForm.cameraBackIds"
                                        multiple
                                        collapse-tags
                                        placeholder="请选择"
                                        class="sic_width"
                                        >
                                        <el-option
                                        v-for="item in deviceOptions1"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                        </el-option>
                                </el-select>
                                </el-form-item>
                                <el-form-item label="设备地址" v-show="sicFlag">   
                                    <el-input v-model="ruleForm.address" :disabled="true" label-width="150px" ></el-input>
                                    <el-button @click="openmap">点击地图</el-button>
                                </el-form-item>
                            </div>
                        </fieldset>

                        <el-form-item class="formfooter">
                            <el-button  type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                            <!-- <el-button @click="handleReset('ruleForm')">重置</el-button> -->
                            <el-button @click="closeequipmentgrounpdialog">取 消</el-button>
                        </el-form-item>
                    </el-form>
            </el-dialog>

            <!-- 选择系统类别 -->
            <el-dialog
                title="选择系统类别"
                :visible.sync="changeSystem"
                width="35%"
                :close-on-click-modal="false"
                class='dialog_system'
                :before-close="closeSystemdialog">

                    <div v-if="choosed=='one'">
                        <el-radio v-model="radio" label="1">远程监控系统</el-radio>
                        <el-radio v-model="radio" label="3">智慧用电系统</el-radio>
                        <el-radio v-model="radio" label="2">智慧用水系统</el-radio>
                        <el-radio v-model="radio" label="4">智能预警系统</el-radio>
                        <el-radio v-model="radio" label="5">燃气监测系统</el-radio>
                        <el-radio v-model="radio" label="6">智能电桩系统</el-radio>
                        <el-radio v-model="radio" label="7">智能疏散系统</el-radio>
                        <el-radio v-model="radio" label="8">视频监控系统</el-radio>
                        <div class="formfooter" style="margin-top:10px;">
                            <el-button @click="closeSystemdialog">取消</el-button>
                            <el-button type="primary" @click="opendialogDeviceManagement">下一步</el-button>
                        </div>
                    </div>
                    <div v-if="choosed=='two'">
                        请选择设备类型
                        <el-table
                            :data="tableEquipmentData"
                            border
                            @selection-change="SelectionChange"
                            style="width: 100%">
                            <el-table-column
                            type="selection"
                            width="55">
                            </el-table-column>
                            <el-table-column
                            prop="deviceName"
                            label="设备名称"
                            width="180">
                            </el-table-column>
                            <el-table-column
                            prop="deviceModel"
                            label="设备型号"
                            width="180">
                            </el-table-column>
                            <el-table-column
                            prop="intelligentFireSystemDesc"
                            label="设备隶属系统"
                            width="180">
                            </el-table-column>
                            <el-table-column
                            prop="deviceTypeDesc"
                            label="设备类型"
                            width="180">
                            </el-table-column>
                            <el-table-column label="操作"
                            >
                            <template slot-scope='scope'>
                                <el-button
                                    size="mini"
                                    type="primary"
                                    @click="ImportEquipment(scope.row.id,2)">导入</el-button>
                            </template>                            
                            </el-table-column>
                        </el-table>
                    </div>
            </el-dialog>

            <!-- 添加修改端口号-->
            <el-dialog
                title="添加修改端口号端口名称"
                :visible.sync="openPortdialog"
                width="35%"
                :close-on-click-modal="false"
                class='dialog'
                :before-close="closePortdialog">
                    <fieldset>
                        <legend>添加端口号</legend>
                        <el-form :model="portForm" :rules="rulesPort" ref="portForm" :data="portForm" label-width="110px" class="demo-ruleForm">
                            <el-form-item label="端口号" prop="portNumber">   
                                <el-input v-model="portForm.portNumber"></el-input>
                            </el-form-item>
                            <el-form-item label="端口名称" prop="portSignalName">   
                                <el-input v-model="portForm.portSignalName"></el-input>
                            </el-form-item>
                            <el-form-item class="formfooter">
                                <el-button type="primary" @click="SubmintPortdialog('portForm')" v-noMoreClick>确定</el-button>
                                <el-button @click="resetPortForm">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </fieldset>
                    
                    <el-table
                        :data="PortData"
                        border
                        style="width: 100%">
                        <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>
                        <el-table-column
                        prop="portNumber"
                        label="端口号"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="portSignalName"
                        label="端口名称"
                        width="180">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope='scope'>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    class='el-icon-delete'
                                    @click="deletePort(scope)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    
                    
            </el-dialog>

            <!-- 部件弹框 -->
            <el-dialog
                title="部件"
                :visible.sync="changeParts"
                width="55%"
                :close-on-click-modal="false"
                class='dialog'
                :before-close="closePartsdialog">

                    <div class="top">
                        <el-button type="primary" @click="openInsertPart"><i class="el-icon-plus"></i> 新增</el-button>
                        <el-upload
                            class="upload-demo"
                            action=""
                            :before-upload="beforeUpload"
                            :limit="1"
                            :file-list="normal"
                            :http-request="uploadFile"
                            :on-exceed="handleExceed">
                            <el-button size="small" type="primary">导入</el-button>
                        </el-upload>
                        <el-button type="primary" @click="exportPart">下载模板</el-button>
                    </div>

                    <!-- //部件添加 -->
                    <el-dialog
                        title="新增修改部件"
                        :visible.sync="Insert_Update_Parts"
                        width="25%"
                        :append-to-body='true'
                        class='dialog'
                        :before-close="closeInsert_Updatedialog">   
                            <el-form :model="partForm" :rules="rulesPart" ref="partForm" :data="partForm" label-width="110px" class="demo-ruleForm">
                                <el-form-item label="部件号" prop="partName">   
                                    <el-input v-model="partForm.partName"></el-input>
                                </el-form-item>
                                <el-form-item label="编号" prop="partNum">   
                                    <el-input v-model="partForm.partNum"></el-input>
                                </el-form-item>
                                <el-form-item label="部件地址" prop="partAddress">   
                                    <el-input v-model="partForm.partAddress"></el-input>
                                </el-form-item>
                                <el-form-item class="formfooter">
                                    <el-button type="primary" @click="SubmitPart('partForm')" v-noMoreClick>确定</el-button>
                                    <el-button @click="resetPartForm">重置</el-button>
                                </el-form-item>
                            </el-form>
                    </el-dialog>
                    <!-- 表格 -->
                    <el-table
                        :data="PartData"
                        border
                        style="width: 100%;heigth:60%">
                        <el-table-column
                        prop="partName"
                        label="部件名"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="partNum"
                        label="部件编号"
                        width="200">
                        </el-table-column>
                        <el-table-column
                        prop="partAddress"
                        label="部件地址"
                        width="200">
                        </el-table-column>
                        <el-table-column label="操作">
                        <template slot-scope='scope'>
                            <el-button
                                size="mini"
                                type="primary"
                                class='el-icon-edit'
                                @click="editPartData(scope.row.id)"> 编辑</el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                class='el-icon-delete'
                                @click="partDelete(scope.row.id)"> 删除</el-button>
                            <el-button
                                size="mini"
                                type="success"
                                class='el-icon-share'
                                plain
                                @click="handleRelation(deviceId,scope.row.deviceFloor,scope.row.id,1)">关联CAD图</el-button>
                        </template>                            
                        </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <div class='page_all' style="position:relative;margin-top: 30px;">
                        <el-pagination
                            @size-change="PartSizeChange"
                            @current-change="PartCurrentChange"
                            :current-page="pagePartNum"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="pagePartSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="partTotal">
                        </el-pagination>
                    </div>
            </el-dialog>

            <!-- CAD弹框 -->
            <el-dialog
                title="关联CAD"
                :visible.sync="changeRelation"
                width="54%"
                :close-on-click-modal="false"
                class='dialog_log'
                :before-close="closeRelationdialog">
                <div style="line-height:43px">
                    建筑楼层:
                    <el-select v-model="Floor" @change="SelectFloorChange" placeholder="请选择">
                        <el-option
                            v-for="item in BuildingFloor"
                            :key="item.id"
                            :label="item.floor"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div>建筑平面图:</div>
                <div id="container" :style="style">
                    
                </div>
                <div style="margin-top:5%; text-align:right">
                    <el-button size="mini" type="primary" @click="submitCad(Floor)" v-noMoreClick :disabled="cadFlag"> 确定</el-button>
                    <el-button size="mini" @click="resetCad(Floor)">重置</el-button>
                </div>
            </el-dialog>
            <!-- 地图 -->
            <div id="mapdiv">
                <el-dialog
                    title="百度地图定位查询"
                    :visible.sync="mapVisible"
                    width="95%"
                    :modal-append-to-body='false'
                    class="mapdialog"
                    :before-close="handleClose">
                        <div class="amap-wrapper">
                            <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult">
                            </el-amap-search-box>
                            <el-button type="primary" @click="getok" class="searchok">确定</el-button>
                            
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

            <!-- 设备额外信息弹框 -->
            <el-dialog
                title=""
                :visible.sync="deviceAdditionalFlag"
                width="55%"
                :close-on-click-modal="false"
                class='dialog'
                :before-close="closedeviceAdditionaldialog">
                    <div class="top">
                        <el-button type="primary" @click="deviceAdditional">新增</el-button>
                    </div>
                    <!-- //设备额外信息添加 -->
                    <el-dialog
                        title="设备额外信息"
                        :visible.sync="Insert_Update_Additional"
                        width="25%"
                        :append-to-body='true'
                        class='dialog'
                        :before-close="closeInsert_UpdateAdditionaldialog">   
                            <el-form :model="deviceAdditionalForm" :rules="rulesdeviceAdditional" ref="deviceAdditionalForm" :data="deviceAdditionalForm" label-width="110px" class="demo-ruleForm">
                                <el-form-item label="系统名称" prop="customSys">
                                    <el-input v-model="deviceAdditionalForm.customSys"></el-input>
                                </el-form-item>
                                <el-form-item label="信号名称" prop="signalName">   
                                    <el-input v-model="deviceAdditionalForm.signalName"></el-input>
                                </el-form-item>
                                <el-form-item label="端口" prop="port">   
                                    <el-input v-model="deviceAdditionalForm.port" v-numberInput  placeholder="1-16"></el-input>
                                </el-form-item>
                                <el-form-item label="子号" prop="num">   
                                    <el-input v-model="deviceAdditionalForm.num" v-numberInput></el-input>
                                </el-form-item>
                                <el-form-item label="参考值最小值" prop="rangeMin">  
                                    <el-input v-model="deviceAdditionalForm.rangeMin"></el-input>
                                </el-form-item>
                                <el-form-item label="参考值最大值" prop="rangeMax">   
                                    <el-input v-model="deviceAdditionalForm.rangeMax"></el-input>
                                </el-form-item>
                                <el-form-item label="单位" prop="unit">   
                                    <el-input v-model="deviceAdditionalForm.unit"></el-input>
                                </el-form-item>
                                <el-form-item class="formfooter">
                                    <el-button type="primary" @click="SubmitAdditionalForm('deviceAdditionalForm')" v-noMoreClick>确定</el-button>
                                    <el-button @click="closeInsert_UpdateAdditionaldialog">关闭</el-button>
                                </el-form-item>
                            </el-form>
                    </el-dialog>

                    <!-- 表格 -->
                    <el-table
                        :data="deviceAdditionalData"
                        border
                        style="width: 100%;heigth:60%">
                        <el-table-column
                        prop="customSys"
                        label="系统名"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="signalName"
                        label="信号名称"
                        width="150">
                        </el-table-column>
                        <el-table-column
                        prop="num"
                        label="子号"
                        width="100">
                        </el-table-column>
                        <el-table-column
                        prop="port"
                        label="端口号"
                        width="100">
                        </el-table-column>
                        <el-table-column
                        label="参考范围"
                        width="200">
                        <template slot-scope="scope">
                            {{scope.row.rangeMin}} - {{scope.row.rangeMax}}
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="unit"
                        label="单位"
                        width="100">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope='scope'>
                                <el-button
                                    size="mini"
                                    type="primary"
                                    class='el-icon-edit'
                                    @click="editdeviceAdditionalData(scope.row.id)"> 编辑</el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    class='el-icon-delete'
                                    @click="deviceAdditionalDelete(scope.row.id)"> 删除</el-button>
                            </template>                            
                        </el-table-column>
                    </el-table>
            </el-dialog>
            
            <!-- 内容 -->
            <div class="bottom" style="padding-left:5px">
                <!-- 表格 -->
                    <el-table
                        :data="tableData"
                        border
                        @selection-change="SelectionChange"
                        style="width: 100%">
                        <!-- </el-table-column> -->
                        <el-table-column
                        prop="deviceAlias"
                        label="设备别名"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="intelligentFireSystemDesc"
                        label="隶属系统"
                        width="150">
                        </el-table-column>
                        <el-table-column
                        prop="deviceTypeDesc"
                        label="设备类型"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="deviceModel"
                        label="设备型号"
                        width="150">
                        </el-table-column>
                        <el-table-column
                        prop="deviceCode"
                        label="产品序列号"
                        width="150">
                        </el-table-column>
                        <el-table-column
                        prop="online"
                        label="在线状态"
                        width="80">
                        </el-table-column>
                        <el-table-column label="操作">
                        <template slot-scope='scope'>
                            <el-button
                                size="mini"
                                type="primary"
                                @click="editDeviceData(scope.row.deviceId,0)"> 编辑</el-button>
                            <template v-if="scope.row.deviceLibId==54">
                                <el-button
                                size="mini"
                                type="primary"
                                @click="openDeviceAdditionalBox(scope.row.deviceId)">设备值</el-button>
                            </template>
                            <el-button
                                size="mini"
                                type="warning"
                                @click="DeviceDataDetail(scope.row.deviceId)"> 查看详情</el-button>
                                
                            <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.row.deviceId)"> 删除</el-button>
                            <el-button
                                size="mini"
                                type="success"
                                @click="changePartsOpen(scope.row.deviceId)"> 部件</el-button>
                            <el-button
                                size="mini"
                                type="success"
                                plain
                                @click="handleRelation(scope.row.deviceId,scope.row.deviceFloor)">关联CAD图</el-button>
                        </template>                            
                        </el-table-column>
                    </el-table>
                <!-- 分页 -->
                <div class='page_all'>
                    <pagination :total='total' ref="paginationChild" @pageChange="pageChange"></pagination>
                </div>
            </div>
        </el-col>
    </div>
</template>

<script>
import {Common} from './../../js/common'
import cadMap from './../../js/cadMap'
import {GaodeMap} from './../../js/gaodemap'
import pagination from '../Children/Pagination'
export default {
    mixins:[Common,GaodeMap],
    components:{
        pagination:pagination
    },
    data(){
        var validatedeviceCode = (rule, value, callback) => {
            if (value=='') {
                callback(new Error('请输入序列号'));
            }else if (value) {
                if(this.radio==2||this.radio==3||this.radio==4){
                    var reg=/^[0-9]*$/;
                   
                    if(reg.test(value)){
                       if(value<100000000000000 || value>1000000000000000){
                            callback(new Error('请输入15位序列号'));
                        }else{
                            callback();
                        } 
                    }else{
                        callback(new Error('请输入正确的序列号'));
                    }
                    
                }
                // else if(this.radio==8){
                //     var reg=/^[0-9A-Z]{15}$/;
                //     if(!reg.test(value)){
                //         callback(new Error('请输入正确格式的15位序列号'));
                //     }else{
                //         callback();
                //     }
                // }
                else{
                    callback();
                }
            }
        };
        var validateDeviceAlias = ( rule,value,callback ) => {
            var reg = /^[\u4e00-\u9fa5\w\s\S]{1,25}$/;
             if (value=='') {
                callback(new Error('请输入设备别名'));
            }else if (value) { 
                if ( reg.test(value) ) {
                    callback()
                }else{
                     callback(new Error('长度不能超过25位'));
                }
            }
        }
        return {
            module:'device',  //模块
            disabled_flag:false,
            currentPage:1,
            rows:10,
            total:1,
            companyId:sessionStorage.getItem('unitId'),//单位id
            companyIds:sessionStorage.getItem('unitId'),//单位id
            deviceId:null,//设备id
            userType:sessionStorage.getItem('userTypes'),
            partId:null,//部件id
            installMsg:'',//安装模板
            partDeviceId:null,//部件里设备id
            installchange:true,//安装信息显示
            radio:'1',//选中系统
            flag:false,//表单是否可以编辑
            choosed:'one',//第一步
            system:'',//系统类型
            devicestype:'',//设备类型
            onLine:'',//在线状态
            deviceName:'',//设备名称
            addFlag:true,//新增开关
            normal:[],//上传部件excel
            changeSystem:false,//选择系统类别弹框
            dialogVisible:false,//设备新增弹框
            openPortdialog:false,//端口号弹框
            changeParts:false,//部件弹框
            Insert_Update_Parts:false,//部件新增弹框
            changeRelation:false,//cad图弹框
            pagePartNum:1,//部件页码
            pagePartSize:10,//部件页数量
            partTotal:0,//部件总数
            PartData:[],//部件表格
            positionList:[],//cad点位集合
            tableEquipmentData:[],//设备回显数据
            PortData:[],//端口数据
            intelligentFireList:[],//设备隶属系统列表
            deviceTypeList:[],//设备类型列表
            portNumberList:[],//端口号list
            addFlag:true,//新增开关
            BuildingFloor:[{     //下拉框数据
                value: '选项1',
                label: '黄金糕'
                }, {
                value: '选项2',
                label: '双皮奶'
                }, {
                value: '选项3',
                label: '蚵仔煎'
                }, {
                value: '选项4',
                label: '龙须面'
                }, {
                value: '选项5',
                label: '北京烤鸭'
            }],//建筑楼层集合
            Floor:'',//楼层值
            FloorImage:'',//楼层图片
            portSignalNameList:[],//端口号名称list
            CommunicationList:[],//通讯方式集合
            options: [{     //下拉框数据
                id: 0,
                name: '室外'
            }],
            installOptions:[],//安装模板数据
            EquipmentDetail:{//设备回显详情
                deviceName:'',    //设备名称
                deviceModel:'', //设备型号
                deviceTypeDesc:'',//设备类型
                intelligentFireSystemDesc:'',//设备隶属系统
                manufacturer:'',//设备生产商
                manufacturerTel:'',//生厂商电话
                supplier:'',//设备供应商
                supplierTel:'',//供应商电话
                brand:'',//品牌
                protocolIdDesc:'',//设备协议类型
                accessTypeDesc:'',//设备接入类型
                deviceImgUrl:'',//设备图片
            },
            unitId:sessionStorage.getItem('unitId'),//左边单位选中
            ruleForm: {     //表格字段
                id:null,
                deviceLibId:'',//关联设备库中设备ID
                deviceAlias:'',//设备别名
                unitId:'',//单位ID
                deviceCode:'',//产品序列号
                deviceUserCode:'',//设备用户编码
                openDate:'',//开通日期
                communicationMethod:'',//通讯方式
                communicationInformation:'',//通讯方式信息（IP、网卡卡号等）
                buildingId:'',//建筑物ID//安装信息
                installationDate:'',//安装日期
                description:'',//安装描述
                installerName:'',//安装工姓名
                installerPhone:'',//安装工电话
                installationCompany:'',//安装公司
                debugger:'',//调试人员
                debuggerPhone:'',//调试人员电话
                deviceSubNum:'',//设备子号     //扩展信息
                devicePointManagement:'',//设备点位管理
                interfaceType:'',//接口类型
                dataItemAnalysis:'',//数据项解析
                nodeResolution:'',//部位解析方式
                installMsg:'',//安装模板选择
                // alarmHostName:'',//报警主机名称
                // alarmHostBrand:'',//报警主机品牌
                // alarmHostModel:'',//报警主机型号
                // alarmHostSubNumber:'',//报警主机子号
                portNumber:'',//端口号
                portSignalName:'',//端口信号名称
                analogCoefficient:'',//模拟系数
                upperLimit:'',//上限
                lowerLimit:'',//下限
                normalName:'',//正常名
                exceptionName:'',//异常名
                // alarmReceiverTel:'',//告警接受人员电话
                // alarmAcceptSelect:'',//告警接受信息选择
                address:"",//设备地址
                longitude:'',//设备经度
                latitude:'',//设备纬度
                cameraMacAddress:"",//摄像头mac地址
                cameraAddress:"",//ip地址
                cameraAccount:"",// 摄像头账号
                cameraPassword:"",// 摄像头密码
                verificationCode:"",//设备验证码
                cameraPlatform:"",//是否支持云台
                cameraIsExistsSd:"",//是否支持sd卡
                cameraIsCloud:"",//是否支持
                cameraIds:[],//关联摄像头
                cameraBackIds:[],//关联录像机
                expirationTime:"",//设备过期时间
                nodeResolution:[],
                customResolution:{
                    resolutionType:'1',
                    resolutionRule:{
                        host:{
                            start:'',
                            end:''
                        },
                        node:{
                            start:'',
                            end:''
                        },
                        loop:{
                            start:'',
                            end:''
                        }
                    }
                },
                customResolutionType:'0',//是否启用部位号
                
            },
            rules: {    //表格字段验证
                deviceAlias: [
                   {validator: validateDeviceAlias, required: true, trigger: 'blur' },                  
                ],
                deviceCode: [
                    { required: true, message: '请输入正确格式的序列号', trigger: 'blur' },
                    {validator: validatedeviceCode, required: true, trigger: 'blur' },          
                ],
                buildingId:[
                    { required: true, message: '请选择建筑', trigger: 'blur' },                   
                ],
                installMsg:[
                    { required: true, message: '请选择安装模板', trigger: 'blur' },                   
                ],
                installationCompany: [
                    { required: true, message: '请输入设备安装公司', trigger: 'blur' },                   
                ],
                openDate: [
                    { required: true, message: '请选择开通日期', trigger: 'blur' },                   
                ],
                communicationMethod: [
                    { required: true, message: '请输入通讯方式', trigger: 'blur' },                   
                ],
                communicationInformation: [
                    { required: true, message: '请输入通讯方式信息', trigger: 'blur' },                   
                ],
                installationDate: [
                    { required: true, message: '请选择安装日期', trigger: 'blur' },                   
                ],
                installerName: [
                    { required: true, message: '请输入安装人姓名', trigger: 'blur' },                   
                ],
                installerPhone: [
                    { required: true, message: '请输入安装人电话', trigger: 'blur' },                   
                ],
                debugger: [
                    { required: true, message: '请输入调试人员', trigger: 'blur' },                   
                ],
                debuggerPhone: [
                    { required: true, message: '请输入调试人员电话', trigger: 'blur' },                   
                ],
                description: [
                    { required: true, message: '请输入安装位置信息', trigger: 'blur' },                   
                ],
                cameraMacAddress: [
                    { required: true, message: '请输入mac地址', trigger: 'blur' },                   
                ],
                cameraAddress: [
                    { required: true, message: '请输入ip地址', trigger: 'blur' },                   
                ],
                cameraAccount: [
                    { required: true, message: '请输入设备账号', trigger: 'blur' },                   
                ],
                cameraPassword: [
                    { required: true, message: '请输入设备密码', trigger: 'blur' },                   
                ],
            },
            portForm:{
                portNumber:'',//端口号
                portSignalName:'',//端口信号名称
            },
            rulesPort:{
                portNumber: [
                    { required: true, message: '请输入端口号', trigger: 'blur' },                   
                ],
                portSignalName: [
                    { required: true, message: '请输入端口号名', trigger: 'blur' },                   
                ],
            },
            partForm:{  //部件新增
                id:null,
                deviceId:null,//设备id
                partName:'',//部件名
                partNum:'',//编号
                partAddress:'',//地址
            },
            rulesPart:{
                partName: [
                    { required: true, message: '请输入部件名', trigger: 'blur' },                   
                ],
                partNum: [
                    { required: true, message: '请输入部件编号', trigger: 'blur' },                   
                ],
                partAddress: [
                    { required: true, message: '请输入部件地址', trigger: 'blur' },                   
                ],
            },
            treedefaultProps: {
                children: 'children',
                label: 'label'
            },
            style:{
                backgroundImage:"url(https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/common/no_pic.gif)",
            },
            deviceData: [{
                id: '12987122',
                name: 'Tom',
                amount1: '234',
                amount2: '3.2',
                amount3: 10
                }, {
                id: '12987123',
                name: 'Tom',
                amount1: '165',
                amount2: '4.43',
                amount3: 12
                }, {
                id: '12987124',
                name: 'Tom',
                amount1: '324',
                amount2: '1.9',
                amount3: 9
                }, {
                id: '12987125',
                name: 'Tom',
                amount1: '621',
                amount2: '2.2',
                amount3: 17
                }, {
                id: '12987126',
                name: 'Tom',
                amount1: '539',
                amount2: '4.1',
                amount3: 15
                }
            ],
            deviceOnline:[
                {
                    id:'',
                    name:'全部'
                },{
                    id:'1',
                    name:'在线'
                },{
                    id:'2',
                    name:'离线'
                }
            ],
            cadFlag:false,//cad开关
            sicOptions:[//云台、SD卡
                {
                    value: 1,
                    label: '是'
                }, 
                {
                    value: 0,
                    label: '否'
                }, 
            ],
            deviceOptions:[//摄像头
                     
            ],
            deviceOptions1:[//录像机
                    
            ],
            sicFlag:true,//摄像头录像机开关
            serialFlag:true,//序列号开关
            overDueTime:null,//过期时间
            pickerOptions:{//时间控件选项
                disabledDate(time) {
                    return time.getTime() < Date.now();
                },
            },
            dataAnalysisOPtions:[],//用传部件数据解析方式
            resolutionTypeOPtions:[
                {
                    name:'十进制',
                    value:'1'
                },
                {
                    name:'十六进制',
                    value:'2'
                },
            ],
            deviceAdditionalFlag:false,//设备额外系统信息框
            deviceAdditionalData:[],//设备额外信息数据
            deviceAdditionalForm:{//设备额外信息数据
                customSys:'',//系统名称
                signalName:'',//信号名称
                port:'',//端口
                num:'',//子号
                rangeMin:'',//最小值
                rangeMax:'',//最大值
                unit:'',//单位
            },
            rulesdeviceAdditional:{
                customSys: [
                    { required: true, message: '请输入系统名称', trigger: 'blur' },                   
                ],
                signalName: [
                    { required: true, message: '请输入信号名称', trigger: 'blur' },                   
                ],
                port: [
                    { required: true, message: '请输入端口号', trigger: 'blur' },                   
                ],
                num: [
                    { required: true, message: '请输入子号', trigger: 'blur' },                   
                ],
                rangeMin: [
                    { required: true, message: '请输入参考值最小值', trigger: 'blur' },                   
                ],
                rangeMax: [
                    { required: true, message: '请输入参考值最大值', trigger: 'blur' },                   
                ],
                unit: [
                    { required: true, message: '请输入单位', trigger: 'blur' },                   
                ],
            },
            Insert_Update_Additional:false,
            customResolutionOPtions:[
                    {
                        name:'0',
                        value:'0'
                    },
                    {
                        name:'1',
                        value:'1'
                    },
                    {
                        name:'2',
                        value:'2'
                    },
                    {
                        name:'3',
                        value:'3'
                    },
                    {
                        name:'4',
                        value:'4'
                    },
                    {
                        name:'5',
                        value:'5'
                    },
                    {
                        name:'6',
                        value:'6'
                    },
                    {
                        name:'7',
                        value:'7'
                    },
                ],
            
        }
    },
    methods:{
        getDataAnalysis () {//获取用传部件数据解析方式
            this.axios({
                url:"/api/admin/device/node/resolution/list",
                method:"post",
                data:{}
            }).then ( res => {
                this.dataAnalysisOPtions = res.data.data
            })
        },
        showOverdueDevice () {//查看即将过期设备
           this.overDueTime = new Date()
           this.getData()
        },
        renderContent(h, { node, data}) {//树前小图标
            return (
              <span>
                <i class={data.icon}></i>
                &nbsp;<span>{node.label}</span>
              </span>
            );
        },
        handleNodeClick(data){ //点击树节点
            this.companyId=data.id;
            this.unitId=data.id;
            this.rows = 10
            this.currentPage = 1
            this.overDueTime = null
            this.istallmsgFun();
            if(data.type == 0) {
                this.addFlag = true
            }else{
                this.addFlag = false
            }
            this.getData();
        },
        opendialogDeviceManagement(){//回显设备库数据弹框打开
            // this.changeSystem=false;
            var _this=this;
            this.axios({
                url:'/api/admin/device/lib/list',
                method: 'post',
                dataType:'json',
                data:{
                    pageNum:1,
                    pageSize: 1000,
                    intelligentFireSystemId:this.radio
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.tableEquipmentData=res.data.list;                   
                    document.querySelector('.dialog_system div').style.width='50%';
                    _this.choosed='two'
                }
            })
            
        },
        closeequipmentgrounpdialog(){//新增设备弹框
            this.dialogVisible=false;
            this.handleReset()
        },
        getSicList () {//获取摄像头录像机列表
            this.axios({
                url:"/api/admin/device/unit/camera/list",
                method:"post",
                data:{
                    id:this.companyId
                }
            }).then( res => {
                 this.deviceOptions  = res.data.data
            })
            this.axios({
                url:"/api/admin/device/unit/camera/back/list",
                method:"post",
                data:{
                    id:this.companyId
                }
            }).then( res => {
                this.deviceOptions1 = res.data.data
            })
        },
        BuildList(){//获取单位建筑列表
            this.options= [{id: 0,name: '室外'}];
            var _this=this;
            this.axios({
                url   :'/api/admin/building/unit',
                method: 'post',
                dataType:'json',
                data:{
                    pageNum: 1,
                    pageSize: 100,
                    unitId:this.companyId
                }
            }).then(res=>{
                if(res.data.code==0){
                   if(res.data.list.length){
                       for(var i=0;i<res.data.list.length;i++){
                           _this.options.push(res.data.list[i]);
                       }
                   }
                }
            })
        },
        ImportEquipment(id,type){//导入个别设备
            var _this=this;
            this.BuildList();
            this.axios({
                url   :'/api/admin/device/lib/single',
                method: 'post',
                dataType:'json',
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.EquipmentDetail=res.data.data;
                    _this.ruleForm.deviceLibId=id;
                    _this.radio=res.data.data.intelligentFireSystemId;
                    _this.Communication();
                    if(type ==1){//查看
                        this.installchange=false;
                        this.flag= true
                    }else if (type == 0) {//编辑
                        this.flag = false
                        this.installchange=false;
                    }else if ( type == 2 ) {//导入
                        this.installchange =true
                        this.flag = false
                        this.ruleForm.installationDate = new Date();
                        this.ruleForm.openDate = new Date();
                    }
                    _this.dialogVisible=true;
                    setTimeout(function(){
                        _this.changeSystem=false;
                    },1000)
                    if ( res.data.data.cameraType == 1 ) {
                        this.sicFlag = true
                        this.getSicList()
                    }else if ( res.data.data.cameraType == 2 ) {
                        this.sicFlag = false
                        this.getSicList()
                    }
                    if ( res.data.data.intelligentFireSystemId == 1 ) {
                        this.getDataAnalysis()
                    }
                }
            })
        },
        Communication(){//通讯方式类别
            var _this=this;
            this.axios({
                url   :'/api/admin/device/dict',
                method: 'post',
                dataType:'json',
                data:{
                    id:6
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.CommunicationList=res.data.data;
                }
            })
        },
        openchangeSystem(){//打开选择系统
            this.choosed='one'
            this.radio='1';
            document.querySelector('.dialog_system div').style.width='35%';
            this.changeSystem=true;
            this.serialFlag = false
        },
        closeSystemdialog(){//关闭选择系统
            this.changeSystem=false;
        },
        deviceType(sel){   //设备类型下拉框
            var _this=this;
            this.axios({
                url:'/api/admin/device/system?id='+sel,
                method:'post',
            }).then(res=>{
                _this.deviceTypeList=res.data.data;
            })
        },
        Select(){//系统类型
            var _this=this;
            this.axios({
                url:'/api/admin/device/dict',
                method:'post',
                data:{
                    id:4
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.intelligentFireList=res.data.data;
                    _this.deviceType('');
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK'
                    });
                }
            })
        },
        currentSel(sel){
            this.devicestype='';
            this.deviceType(sel);
        },
        resetSearch(){
            this.system='';
            this.devicestype='';
            this.onLine='';
            this.deviceName=''
            this.overDueTime = null
            this.getData()
        },
        searchsubmit(){//条件查询
            var _this=this;
            this.currentPage = 1;
            this.$refs.paginationChild.changePageNum(this.currentPage)
            this.axios({
                url   :'/api/admin/device/list',
                method: 'post',
                data  : {
                    pageNum: this.currentPage,
                    pageSize: this.rows,
                    unitId:this.companyId,
                    systemId:this.system,
                    deviceType:this.devicestype,
                    online:this.onLine,
                    deviceName:this.deviceName,
                    now:this.overDueTime
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.tableData=res.data.list;
                    _this.total= res.data.total;
                    _this.currentPage= res.data.pageNum;
                    _this.overDueTime = null;
                    _this.tableData.map( ( item ) => {
                        if(item.online==1){
                            item.online='在线';
                        }else if(item.online==2){
                            item.online='离线';
                        }else{
                            item.online='故障';
                        } 
                    })
                }
            })
        },
        pageChange (item) {//页数页码改变页面重新刷新
            this.currentPage = item.page_index;
            this.rows = item.page_limit;
            this.getData() //改变页码，重新渲染页面
        },
        resetPortForm(){//重置端口号表单
            this.portForm.portNumber='';
            this.portForm.portSignalName='';
        },
        closePortdialog(){//关闭端口号弹框
            this.openPortdialog=false;
            this.ruleForm.portNumber=this.portNumberList.join();
            this.ruleForm.portSignalName=this.portSignalNameList.join();
        },
        SubmintPortdialog(name){//添加端口号
            var _this=this;
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.PortData.push({'portNumber':_this.portForm.portNumber,'portSignalName':_this.portForm.portSignalName});
                    this.portNumberList.push(_this.portForm.portNumber);
                    this.portSignalNameList.push(_this.portForm.portSignalName);
                    _this.portForm.portNumber='';
                    _this.portForm.portSignalName='';
                }
            })
        },
        deletePort(scope){//删除端口号
            this.portNumberList.splice(scope.$index,1)
            this.portSignalNameList.splice(scope.$index,1)
            this.PortData.splice(scope.$index,1)
        },
        closePartsdialog(){//关闭部件弹框
            this.changeParts=false;
        },
        closeRelationdialog(){ //关联CAD关闭
            this.changeRelation=false;
            this.Floor='';
            this.style.backgroundImage="url(https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/common/no_pic.gif)";
            if(document.querySelector('#container>div')){
                var big_div=document.querySelectorAll('#container>div');
                for(var i=0;i<big_div.length;i++){
                    document.getElementById('container').removeChild(big_div[i])
                }
            }
        },
        handleRelation(deviceId,floor,partId,aa){//关联CAD打开
            this.deviceId=deviceId;
            this.partId=partId;
            var id=deviceId;
            if(aa){
                id=this.partDeviceId
            }
            var _this=this;
            var buildingId='';
            
            this.axios({
                url   :'/api/admin/device/single',
                method: 'post',
                dataType:'json',
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.data.code==0){
                   buildingId=res.data.data.buildingId;
                   _this.axios({
                        url   :'/api/admin/building/list.picture',
                        method: 'post',
                        dataType:'json',
                        data:{
                            id:buildingId
                        }
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.BuildingFloor=res.data.data;
                            if(floor){
                                 _this.SelectFloorChange(floor);
                            }
                           
                            _this.changeRelation=true;
                            
                        }
                    })
                }
            })
                        
        },
        createDIv(x,y,deviceId,partId){    //创建cad报警点
            var dotWidth=14
            var dotHeight=14
            var pulseWidth=16
            var pulseHeight=16
            var pulseBorder=3
            // 创建div盒子
            var odiv=document.createElement('div');
            var dot_div=document.createElement('div');
            var pulse_div=document.createElement('div');
            
            // console.log(deviceId,partId)
            // 给div添加class
            if(deviceId){
                odiv.id=deviceId
                dot_div.className='dot';
            }
            if(partId){
                odiv.id=partId
                dot_div.className='dot partdot';
            }
            // console.log(partId)
            if(deviceId==this.deviceId && !partId){
                dot_div.className='dot dotnow';
            }
            if(partId==this.partId&&partId){
                dot_div.className='dot dotnow partdot';
            }

            pulse_div.className='pulse';
            
            //设置dot的位置x
            dot_div.style.left=x+'px';
            dot_div.style.top=y+'px';
            
            //设置pulse的位置
            pulse_div.style.left=parseInt(x)+dotWidth/2-pulseWidth/2-pulseBorder+'px';
            pulse_div.style.top=parseInt(y)+dotHeight/2-pulseHeight/2-pulseBorder+'px';
            
            // 把创建的盒子追加到页面上
            odiv.appendChild(dot_div);
            odiv.appendChild(pulse_div);
            document.getElementById('container').appendChild(odiv);
        },
        SelectFloorChange(floor){//楼层选择时回显图片
            if(document.querySelector('#container>div')){
                var big_div=document.querySelectorAll('#container>div');
                for(var i=0;i<big_div.length;i++){
                    document.getElementById('container').removeChild(big_div[i])
                }
            }
            if(floor){
                this.Floor=floor;
            }
            var _this=this;
            this.axios({
                url   :'/api/admin/cad/position.list',
                method: 'post',
                dataType:'json',
                data:{
                    pictureId:this.Floor
                }
            }).then(res=>{
                if(res.data.code==0){
                    for(var i=0;i<res.data.data.length;i++){
                        _this.createDIv(res.data.data[i].x,res.data.data[i].y,res.data.data[i].deviceId,res.data.data[i].partId);
                    } 
                }
            });
            this.axios({
                url   :'/api/admin/building/position',
                method: 'post',
                dataType:'json',
                data:{
                    id:this.Floor
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.FloorImage=res.data.data.img;
                    if(_this.FloorImage=='https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/common/no_pic.gif'){
                        //  _this.$alert('该层没有上传平面图，请先给建筑添加平面图', '提示', {
                        //     confirmButtonText: 'OK',
                        //     callback:()=>{
                        //         _this.style.backgroundImage="url("+_this.FloorImage+")";
                        //         cadMap('container',_this.positionList,_this.deviceId,1);
                                
                        //     }
                        // });
                        this.cadFlag = true
                        _this.$message({
                            message: '该层没有上传平面图，请先给建筑添加平面图',
                            type: 'warning',
                            callback:()=>{
                                _this.style.backgroundImage="url("+_this.FloorImage+")";
                                cadMap('container',_this.positionList,_this.deviceId,1);
                                
                            }
                            });
                        

                    }else{
                        _this.style.backgroundImage="url("+_this.FloorImage+") ";
                        cadMap('container',_this.positionList,_this.deviceId,0,_this.partId);
                        this.cadFlag = false
                    }

                }
            })
        },
        editDeviceData(id,type){//编辑回显
            this.serialFlag = true
            
            var _this=this;
            this.axios({
                url   :'/api/admin/device/single',
                method: 'post',
                dataType:'json',
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.ruleForm=res.data.data;
                    _this.ruleForm.id=res.data.data.deviceId
                    _this.ruleForm.nodeResolution = _this.ruleForm.nodeResolution && _this.ruleForm.nodeResolution *1;
                    _this.ruleForm.customResolutionType=String(res.data.data.customResolutionType);
                    _this.ImportEquipment(res.data.data.deviceLibId,type);
                }
            })
        },
        DeviceDataDetail(id){//设备详情
            this.editDeviceData(id,1);
        },
        submitCad(id){//提交cad图上设备点位
            var _this=this;
            for(var i=0;i<this.positionList.length;i++){
                this.positionList[i].pictureId=id;
            }
            this.axios({
                url   :'/api/admin/cad/position.update',
                method: 'post',
                dataType:'json',
                data:this.positionList[this.positionList.length-1]
            }).then(res=>{
                if(res.data.code==0){
                    _this.$alert('添加成功', '提示', {
                        confirmButtonText: 'OK',
                        callback:()=>{
                            _this.closeRelationdialog();
                            _this.searchsubmit();
                        }
                    });
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    })
                }
            })
        },
        resetCad(id){//删除设备关联在cad图上的点
            var aa=[{}];
            var _this=this;
            aa[0].pictureId=id;
            aa[0].deviceId=this.deviceId

            this.axios({
                url   :'/api/admin/cad/position.update',
                method: 'post',
                dataType:'json',
                data:aa[0]
            }).then(res=>{
                if(res.data.code==0){
                    _this.$alert('删除成功', '提示', {
                        confirmButtonText: 'OK',
                        callback:()=>{
                            _this.closeRelationdialog();
                            _this.partList();
                            _this.searchsubmit();
                        }
                    });
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    })
                }
            })
        },
        changePartsOpen(id){//部件弹框打开
            this.partDeviceId=id;
            this.partList();
        },
        partList(){//部件列表
            var _this=this;
            this.axios({
                url   :'/api/admin/device/part.list',
                method: 'post',
                dataType:'json',
                data:{
                    deviceId:this.partDeviceId,
                    pageNum:this.pagePartNum,
                    pageSize:this.pagePartSize
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.PartData=res.data.list;
                    _this.partTotal=res.data.total
                    _this.changeParts=true;
                }
            })
        },
        openInsertPart(){//部件新增弹框打开
            this.Insert_Update_Parts=true;
            this.resetPartForm()
        },
        closeInsert_Updatedialog(){//部件新增弹框关闭
            this.Insert_Update_Parts=false;
            delete this.partForm.id;
            Object.assign(this.$data.partForm,this.$options.data().partForm);
        },
        PartSizeChange(pageSize){//条数改变
            this.pagePartSize = pageSize;
            this.partList();
        },
        PartCurrentChange(page){ //页数改变
            this.pagePartNum = page;
            this.partList();
        },
        SubmitPart(name){//添加部件
            var _this=this;
            this.partForm.deviceId=this.partDeviceId
            this.$refs[name].validate((valid)=>{
                if(valid){
                    var url='/api/admin/device/part.add';
                    var msg='添加成功';
                    if(this.partForm.id){
                        url='/api/admin/device/part.update';
                        msg='修改成功';
                    }
                    this.axios({
                        url   :url,
                        method: 'post',
                        dataType:'json',
                        data:this.partForm
                    }).then(res=>{
                        if(res.data.code==0){ 
                            _this.$alert(msg, '提示', {
                                    confirmButtonText: 'OK',
                                    callback:()=>{
                                        _this.closeInsert_Updatedialog();
                                        _this.partList();
                                    }
                                });
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                }
            })

            
        },
        resetPartForm(){//重置部件添加
            this.partForm.partName='';
            this.partForm.partNum='';
            this.partForm.partAddress='';
        },
        partDelete(id){//部件删除
            var _this=this;
            this.$confirm('你确定要删除吗')
                .then(()=> {
                    this.axios({
                        url   :'/api/admin/device/part.delete',
                        method: 'post',
                        dataType:'json',
                        data:{
                            id:id
                        }
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('删除成功', '提示', {
                                    confirmButtonText: 'OK',
                                    callback:()=>{
                                        this.partList();
                                    }
                                });
                        }
                    })
                 })
        },
        editPartData(id){//编辑回显
            var _this=this;
            this.axios({
                url   :'/api/admin/device/part.list',
                method: 'post',
                dataType:'json',
                data:{
                    id:id,
                    pageNum:1,
                    pageSize:10
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.partForm=res.data.list[0];
                    _this.Insert_Update_Parts=true;
                }
            })
        },
        handleExceed(files, fileList) {
            this.$alert('当前限制选择 1 个文件，请重新上传', '提示', {
                confirmButtonText: 'OK',
            });
        },
        beforeUpload (file) { // 上传文件之前的钩子
            if(file.type === 'application/vnd.ms-excel'){
                return true;
            }else{
                this.$alert('添加文件类型不对，请重新选择excel格式', '提示', {
                    confirmButtonText: 'OK'
                });
                return false;
            }
        },
        exportPart(){//导出模板
            window.location.href='https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/duty/1587457164952-%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E9%83%A8%E4%BB%B6.xls';
        },
        uploadFile(file){//上传excel
            var _this=this;
            var formdata = new FormData();
            formdata.append('file',file.file);
            formdata.append('deviceId',this.partDeviceId);
            this.axios({
                url   :'/api/admin/device/part.excel',
                method: 'post',
                dataType:'json',
                data:formdata
            }).then(res=>{
                if(res.data.code==0){
                    _this.$alert('上传成功', '提示', {
                            confirmButtonText: 'OK',
                            callback:()=>{
                                _this.normal=[];
                            }
                        });
                    _this.partList()
                }
            })
        },
        istallmsgFun(){//模板接口
            var _this=this;
            this.axios({
                url   :'/api/admin/device/install.select',
                method: 'post',
                dataType:'json',
                data:{
                    id:this.companyIds
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.installOptions=res.data.data;
                }
            })
            
        },
        installValue(flag){//查询安装模板
            if(flag==false){
                var _this=this;
                this.axios({
                    url   :'/api/admin/device/install.search',
                    method: 'post',
                    dataType:'json',
                    data:{
                        id:this.ruleForm.installMsg,
                        pageNum:1,
                        pageSize:100
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        var data=res.data.list[0];
                        this.ruleForm.installerName=data.installerName;
                        this.ruleForm.installerPhone=data.installerPhone;
                        this.ruleForm.installationCompany=data.unitName;
                        this.ruleForm.debugger=data.debuggerName;
                        this.ruleForm.debuggerPhone=data.debuggerPhone;
                    }
                })
            }
            
        },
        openDeviceAdditionalBox(id){//设备额外信息弹框打开
            this.deviceAdditionalFlag=true;
            this.deviceId=id;
            this.deviceAdditionalList(id)
        },
        closedeviceAdditionaldialog(){//设备额外信息弹框关闭
            this.deviceAdditionalFlag=false;
        },
        editdeviceAdditionalData(id){//设备额外信息编辑
            var _this=this;
            this.axios({
                url   :'/api/admin/rtu/info/single',
                method: 'post',
                dataType:'json',
                data:{
                    id:id,
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.deviceAdditionalForm=res.data.data;
                    _this.Insert_Update_Additional=true;
                }
            })
        },
        deviceAdditionalDelete(id){//设备额外信息删除
            var _this=this;
            this.$confirm('你确定要删除吗')
                .then(()=> {
                    this.axios({
                        url   :'/api/admin/rtu/info/delete',
                        method: 'post',
                        dataType:'json',
                        data:{
                            id:id
                        }
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('删除成功', '提示', {
                                    confirmButtonText: 'OK',
                                    callback:()=>{
                                        this.deviceAdditionalList();
                                    }
                                });
                        }
                    })
                })
        },
        deviceAdditionalList(){//设备额外信息列表
            var _this=this;
            this.axios({
                url   :'/api/admin/rtu/info/list',
                method: 'post',
                dataType:'json',
                data:{
                    id:this.deviceId,
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.deviceAdditionalData=res.data.data;
                }
            })
        },
        closeInsert_UpdateAdditionaldialog(){
            this.Insert_Update_Additional=false;
            delete this.deviceAdditionalForm.id;
            Object.assign(this.$data.deviceAdditionalForm,this.$options.data().deviceAdditionalForm);
        },
        deviceAdditional(){//打开新增弹框
            this.Insert_Update_Additional=true;
        },
        SubmitAdditionalForm(name){
            var _this=this;
            this.deviceAdditionalForm.deviceId=this.deviceId
            this.$refs[name].validate((valid)=>{
                if(valid){
                    var url='/api/admin/rtu/info/add';
                    var msg='添加成功';
                    if(this.deviceAdditionalForm.id){
                        url='/api/admin/rtu/info/update';
                        msg='修改成功';
                    }
                    this.axios({
                        url   :url,
                        method: 'post',
                        dataType:'json',
                        data:this.deviceAdditionalForm
                    }).then(res=>{
                        if(res.data.code==0){ 
                            _this.$alert(msg, '提示', {
                                    confirmButtonText: 'OK',
                                    callback:()=>{
                                        _this.closeInsert_UpdateAdditionaldialog();
                                        _this.deviceAdditionalList();
                                    }
                                });
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    })
                }
            })
        }
        
    },
    mounted(){
        this.Select();
        if(this.companyId!=-1){
            this.istallmsgFun();
        }
    },
    created(){
        this.companyId=sessionStorage.getItem('unitId');
        this.myHeader={Authorization:sessionStorage.getItem('Authorization')}
    }
}
</script>
<style lang="scss">
   #DeviceManagement{
       
       fieldset{
           border: 1px solid #eee;
           legend{
               font-size: 16px;
           }
       }
       .dialog_insert,.dialog_log{
           .el-dialog{
               margin-top: 6.5vh!important;
           }
       }
       .el-dialog {
           .el-form-item{
                margin-bottom: 17px;
            }
           .el-dialog__body{
               padding:0 20px 20px;
           }
           .el-form {
               .el-select,.el-input{
                    width: 180px!important;
                }
           }
       }
       .top{
           .el-select,.el-input{
                width: 133px!important;
            }
       }
       .upload-demo{
           display: inline-block;
       }
       .el-upload-list{
           display: none
       }
       .el-radio{
           line-height: 50px;
       }
       @keyframes warn {
            0% {
                transform: scale(1);   
                opacity: 0.0;
            }  
            25% {  
                transform: scale(1.1);      
            }  
            50% {  
                transform: scale(1.2);  
                opacity: 0.5;
            }  
            75% {  
                transform: scale(1.3);  
            }  
            100% {  
                transform: scale(1.4);  
                opacity: 0.0;  
            }  
        }
    #container {
        position: relative;
        width: 1000px;
        height: 600px;
        border: 1px solid #eee;
        background-color: #2C3A43;
        // background: url('../../assets/image/draw.png') no-repeat;
        background-size: 100% 100%;

        /* 保持大小不变的小圆圈  */
        // <!-- dot 的left+width/2==pulse的left+width/2+border -->
        .dot{
            position: absolute;
            width: 13px;
            height: 13px;
            border-radius: 50%;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            background-color: orangered;
            z-index: 2;
        }

        .dotnow{
            background-color: green;
        }
        .partdot{
            border-radius: 0%;
        }

        /* 产生动画（向外扩散变大）的圆圈  */
        .pulse{
            position: absolute;
            width: 16px; 
            height: 16px; 
            border: 3px solid red;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            z-index: 1;
            opacity: 0;
            -webkit-animation: warn 3s ease-out;
            -moz-animation: warn 3s ease-out;
            animation: warn 3s ease-out;
            -webkit-animation-iteration-count: infinite;
            -moz-animation-iteration-count: infinite;
            animation-iteration-count: infinite;
        }
    }
    .nodeWidth{
        /deep/ .el-form-item__label{
            width: 140px!important;
        }
    }
   }
    
</style>

<style lang="scss" scoped>
    .el-form .el-input{
        width: 200px!important;
        height: 35px!important;
    }
    .el-page{
        width: 100px;
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
            
        .el-dialog__body{
            padding: 0;
        }
        .el-dialog__header {
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
            height: 700px;
        }
        .search-box{
            position: absolute;
        }
        .searchok{
            position: absolute;
            top: 50px;
            z-index: 22222222;
            right: 25px;
            height:40px;
            width:60px;
        }
        .el-vue-search-box-container{
            right: 90px;
            top: 50px;
        }
    
           /deep/ .el-select__tags{
                max-width:none!important;
            }
            // .el-select .el-tag{
            //     margin-top: 12px;
            // }
        
    }
    
</style>