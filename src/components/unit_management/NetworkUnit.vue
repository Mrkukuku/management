<template>
    <!-- 联网单位管理 -->
    <div id='NetworkUnit' class='allcontent'>
         <el-col :span="3" class="tree_box" v-if="userType==1">
            <div style="margin:16px;text-align:right;" v-if='unitIdInsert==-1'>
                <el-button type="primary" @click="opendialog(0)"><i class="el-icon-plus"></i> 新增管理单位</el-button>
            </div>
            <div>
                <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText" 
                    class="filter_text"
                    >
                </el-input>
                <el-tree 
                    :data="Treedata" 
                    :props="treedefaultProps" 
                    @node-click="handleNodeClick" 
                    :render-content="renderContent"
                    highlight-current
                    :filter-node-method="filterNode"
                    ref="tree"
                >
                </el-tree>
            </div>
        </el-col>
        <el-col :span="21" style="height:100%;">
            <!-- 头部 -->
            <div class="top">
               <span class="online" v-if="userType!=3"> <span v-if="managementUnit">管理单位: {{managementUnit}}</span> 联网单位: {{networkingUnit}} </span> 
                <div v-if="userType!=3">
                    <el-input v-model="unitname" placeholder="搜索单位名称"></el-input>&nbsp;&nbsp;
                    <el-button type="primary" @click='searchsubmit'>查询</el-button>
                    <el-button type="primary" @click='searchreset'>重置</el-button>
                    <el-upload
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :http-request="uploadsFile"
                        style="display:inline-block"
                        :show-file-list="false"
                        :limit="1"
                        ref="my-upload"
                    >
                    <el-button size="small" type="primary" :disabled="fileLoading">导入</el-button>
                    </el-upload>
                    <el-button type="primary" @click='downFile'>下载模板</el-button>
                    <el-button type="primary" @click="opendialog(1)"><i class="el-icon-plus"></i> 新增联网单位</el-button>
                </div>
            </div>
                   
            <div class="bottom"  v-loading="fileLoading">
                <!-- 表格 -->
                <el-table
                    :data="tableData"
                    :row-class-name="rowCalss"
                    border
                    @selection-change="SelectionChange"
                    style="width: 100%">
                    <el-table-column
                    prop="unitNum"
                    label="单位编号"
                    width="140">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="单位名称"
                    width="130">
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="单位地址"
                    width="300">
                    </el-table-column>
                    <el-table-column
                    prop="createdTime"
                    label="入网时间"
                    width="110">
                    </el-table-column>
                    <!-- <el-table-column
                    prop="competentOrganization"
                    label="上级主管单位名称"
                    width="170">
                    </el-table-column> -->
                    <!-- <el-table-column
                    prop="unitDesc"
                    label="单位备注"
                    width="130">
                    </el-table-column> -->
                    <el-table-column label="操作">
                        <template slot-scope='scope'>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="editData(scope.row.id,2)">编辑</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="editData(scope.row.id,3)">查看详情</el-button>
                            <span v-if='scope.row.important==0'>
                                <el-button
                                size="mini"
                                type="warning"
                                :disabled="userType==3"
                                @click="importEdit(scope.row.id,3)">一般单位</el-button>
                            </span>
                            <span v-if='scope.row.important==1'>
                                <el-button
                                size="mini"
                                type="warning"
                                :disabled="userType==3"
                                @click="importEdit(scope.row.id,3)">重点单位</el-button>
                            </span>
                            <span v-if='unitIdInsert!=scope.row.id'>
                                <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.row.id)">删除</el-button>
                            </span>
                            <span v-if='unitIdInsert==-1'>
                                <el-button
                                size="mini"
                                type="primary"
                                @click='SperRela(scope.row.id)'
                                >指定权限关系</el-button>
                                <span v-if="scope.row.isFrozen==true">
                                    <el-button
                                    size="mini"
                                    type="success"
                                    class='Frozen'
                                    @click="handleFrozen(scope.row.id,scope.row.isFrozen)"
                                    >解冻</el-button>
                                </span>
                                <span v-else>
                                    <el-button
                                    size="mini"
                                    type="warning"
                                    class='Frozen'
                                    @click="handleFrozen(scope.row.id,scope.row.isFrozen)"
                                    >冻结</el-button>
                                </span>
                            </span>
                            <span v-else>
                                <span v-if="scope.row.isFrozen==true">
                                    <el-button
                                    size="mini"
                                    type="success"
                                    class='Frozen'
                                    disabled
                                    @click="handleFrozen(scope.row.id,scope.row.isFrozen)"
                                    >解冻</el-button>
                                </span>
                                <span v-else>
                                    <el-button
                                    size="mini"
                                    type="warning"
                                    class='Frozen'
                                    disabled
                                    @click="handleFrozen(scope.row.id,scope.row.isFrozen)"
                                    >冻结</el-button>
                                </span>
                            </span>
                            <span v-if="scope.row.regionType==0">
                                    <el-button
                                    size="mini"
                                    type="success"
                                    class='Frozen'
                                    @click="editData(scope.row.id,1)"
                                    >复制</el-button>
                                </span>
                            <el-button
                                    size="mini"
                                    type="primary"
                                    @click="openUnitImg(scope.row.id)">查看单位图
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="page_all">
                    <pagination :total='total' @pageChange="pageChange" ref="paginations"></pagination>
                </div>

                <!-- 新增弹框 -->
                <el-dialog
                    title="添加修改单位"
                    :visible.sync="dialogVisibleunit"
                    width="50%"
                    :close-on-click-modal="false"
                    :before-close="closedialog">
                    <el-form :inline="true" :rules="rules" :model="ruleForm" :data="ruleForm" status-icon  ref="ruleForm" label-width="200px" class="demo-ruleForm" :disabled = "detailFlag">
                        <fieldset>
                            <legend>单位信息</legend>
                                <el-form-item label="单位名称" prop="name">
                                    <el-input v-model="ruleForm.name" :disabled="userType==3"></el-input>
                                </el-form-item>
                                <el-form-item label="单位电话" prop="phone">
                                    <el-input v-model="ruleForm.phone"></el-input>
                                </el-form-item>
                                <el-form-item label="单位类型" prop="type">
                                    <el-select v-model="ruleForm.type" placeholder="请选择">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.type"
                                            :label="item.desc"
                                            :value="item.type">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="邮政编码" prop="postalCode">
                                    <el-input v-model.number="ruleForm.postalCode"></el-input>
                                </el-form-item>
                                <el-form-item label="法人姓名" prop="legalPersonName">
                                    <el-input v-model="ruleForm.legalPersonName"></el-input>
                                </el-form-item>
                                <el-form-item label="所属区域" prop="region">
                                    <el-input v-model="ruleForm.region"></el-input>
                                </el-form-item>
                                <el-form-item label="统一社会信用代码" prop="organizationCode">
                                    <el-input v-model="ruleForm.organizationCode"></el-input>
                                </el-form-item>
                                <el-form-item label="法人电话" prop="legalPersonPhone">
                                    <el-input v-model="ruleForm.legalPersonPhone"></el-input>
                                </el-form-item>
                                <el-form-item label="成立时间" prop="establishmentDate">
                                    <el-date-picker
                                        v-model="ruleForm.establishmentDate"
                                        type="date"
                                        placeholder="Pick a day"
                                        >
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="法人身份证号" prop="legalPersonIdNo">
                                    <el-input v-model="ruleForm.legalPersonIdNo"></el-input>
                                </el-form-item>
                                <el-form-item label="单位邮箱" prop="email">
                                    <el-input v-model="ruleForm.mail"></el-input>
                                </el-form-item>
                                  <el-form-item label="重点单位">
                                    <el-radio v-model="ruleForm.important" :disabled="userType==3" label="1">是</el-radio>
                                    <el-radio v-model="ruleForm.important" :disabled="userType==3" label="0">否</el-radio>
                                </el-form-item>
                                <el-form-item label="消防站">
                                    <el-radio v-model="ruleForm.station" label="1">有</el-radio>
                                    <el-radio v-model="ruleForm.station" label="0">无</el-radio>
                                </el-form-item>
                                <el-form-item label=" 消控室">
                                    <el-radio v-model="ruleForm.fireControlStation" label="1">有</el-radio>
                                    <el-radio v-model="ruleForm.fireControlStation" label="0">无</el-radio>
                                </el-form-item>
                                 <el-form-item label="单位星级评定">
                                    <!-- <el-select v-model="ruleForm.unitStar" placeholder="请选择" :disabled="userType==3">
                                        <el-option
                                            v-for="item in unitStarList1"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select> -->
                                    <div style="display:flex;align-items: center;">

                                        <el-rate
                                        v-model="ruleForm.unitStar"
                                        :disabled="userType==3"
                                        :max="3"
                                        show-text
                                        :texts="['一星','二星','三星']"
                                        >
                                        </el-rate>
                                        <el-radio v-model="ruleForm.unitStar" :disabled="userType==3" :label="0" class="unitStars">不达标</el-radio>
                                        <el-radio v-model="ruleForm.unitStar" :disabled="userType==3" :label="-1" class="unitStars">不评定</el-radio>
                                    </div>
                                </el-form-item>

                                <template v-if="ruleForm.fireControlStation==1">
                                    <el-form-item label="值班次数" prop="fireControlRoomWatchRecordsCount">
                                        <el-select v-model="ruleForm.fireControlRoomWatchRecordsCount" placeholder="请选择">
                                            <el-option
                                                v-for="item in unitStarList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>

                                <!-- <el-form-item label="" prop="latitude">
                                    <el-input id='lat' type='hidden' v-model.number="ruleForm.latitude" style='width:0px'></el-input>
                                </el-form-item>
                                <el-form-item label="" prop="longitude">
                                    <el-input id='lng' type='hidden' v-model.number="ruleForm.longitude" style='width:0px'></el-input>
                                </el-form-item> -->
                                <el-form-item label="单位地址" prop="address">
                                    <el-input id='address' :disabled="!ruleForm.latitude" v-model="ruleForm.address" style='width:350px'></el-input>
                                    <el-button @click="openmap">点击地图</el-button>
                                    <div id="mapdiv">
                                        <el-dialog
                                            title="百度地图定位查询"
                                            :visible.sync="mapVisible"
                                            width="95%"
                                            class="mapdialog"
                                            :modal-append-to-body='false'
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
                                </el-form-item>
                                <el-form-item label="单位备注" prop="unitDesc">
                                    <el-input type="textarea" v-model="ruleForm.unitDesc" class='unitDesc'></el-input>
                                </el-form-item>
                        </fieldset>
                        <fieldset>
                            <legend>消防信息</legend>
                            <el-form-item label="消防安全责任人姓名" prop="fireRunnerName">
                                <el-input v-model="ruleForm.fireRunnerName"></el-input>
                            </el-form-item>
                            <el-form-item label="消防安全管理人姓名" prop="fireSafetyOfficerName">
                                <el-input v-model="ruleForm.fireSafetyOfficerName"></el-input>
                            </el-form-item>
                            <el-form-item label="消防安全责任人电话" prop="fireRunnerPhone">
                                <el-input v-model="ruleForm.fireRunnerPhone"></el-input>
                            </el-form-item>
                            <el-form-item label="消防安全管理人电话" prop="fireSafetyOfficerPhone">
                                <el-input v-model="ruleForm.fireSafetyOfficerPhone"></el-input>
                            </el-form-item>
                            <el-form-item label="微型消防站站长姓名" prop="unitFireStationName">
                                <el-input v-model="ruleForm.unitFireStationName"></el-input>
                            </el-form-item>
                            <el-form-item label="微型消防站站长电话" prop="unitFireStationPhone">
                                <el-input v-model="ruleForm.unitFireStationPhone"></el-input>
                            </el-form-item>
                             <el-form-item label="消防安全控制室电话" prop="fireControlRoomPhone">
                                <el-input v-model="ruleForm.fireControlRoomPhone"></el-input>
                            </el-form-item>
                            <el-form-item label="微型站座机" prop="fireSafetyOfficerBackupPhone">
                                <el-input v-model="ruleForm.fireSafetyOfficerBackupPhone"></el-input>
                            </el-form-item>
                            <el-form-item label="消防安全责任人身份号码" prop="fireRunnerIdNo">
                                <el-input v-model="ruleForm.fireRunnerIdNo"></el-input>
                            </el-form-item>
                            <el-form-item label="消防安全管理人身份号码" prop="fireSafetyOfficerIdNo">
                                <el-input v-model="ruleForm.fireSafetyOfficerIdNo"></el-input>
                            </el-form-item>
                            <!-- <template v-for="(item, index) in ruleForm.fireStaffList">
                            <el-form-item :label="'消防安全员工姓名'+(index+1)">
                                <el-input v-model="item.name"></el-input>
                            </el-form-item>
                            <el-form-item :label="'消防安全员工电话'+(index+1)">
                                <el-input v-model="item.phone"></el-input>
                                <i class="el-icon-error plus" @click="deleteDevice(index)"></i>
                                <i class="el-icon-circle-plus plus" @click="addDevice" v-if="index == ruleForm.fireStaffList.length- 1" ></i>
                            </el-form-item>
                            </template> -->
                        </fieldset>
                        <fieldset>
                            <legend>其他信息</legend>
                            <el-form-item label="经济所有制" prop="economicsOwnership">
                                <el-select v-model="ruleForm.economicsOwnership" placeholder="--请选择--">
                                    <el-option label="国有企业" value="国有企业"></el-option>
                                    <el-option label="集体企业" value="集体企业"></el-option>
                                    <el-option label="民营企业" value="民营企业"></el-option>
                                    <el-option label="个体工商户" value="个体工商户"></el-option>
                                    <el-option label="中外合资企业" value="中外合资企业"></el-option>
                                    <el-option label="外商独资企业" value="外商独资企业"></el-option>
                                    <el-option label="股份制企业" value="股份制企业"></el-option>
                                    <el-option label="事业单位" value="事业单位"></el-option>
                                    <el-option label="其他" value="其他"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="单位固定资产" id="fixedAssets" prop="fixedAssets">
                                <el-input v-model.number="ruleForm.fixedAssets" maxlength="10"></el-input>&nbsp;万
                            </el-form-item>
                            <el-form-item label="单位占地面积" prop="unitArea">
                                <el-input v-model.number="ruleForm.unitArea" maxlength="10"></el-input>&nbsp;㎡
                            </el-form-item>
                            <el-form-item label="单位职工人数" prop="staffNum">
                                <el-input v-model.number="ruleForm.staffNum" maxlength="10"></el-input>&nbsp;人
                            </el-form-item>
                            <el-form-item label="单位建筑面积" prop="totalArea">
                                <el-input v-model.number="ruleForm.totalArea" maxlength="10"></el-input>&nbsp;㎡
                            </el-form-item>
                            <el-form-item label="单位总平面图" prop="unitPlanUrl">
                                <el-upload
                                    class="avatar-uploader"
                                    action=""
                                    accept=".jpg,.png,.JPG,.PNG"
                                    :show-file-list="false"
                                    :on-change="beforeUpload"
                                    :auto-upload="false">
                                    <img v-if="posterURL" :src="posterURL" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                                <el-button @click="uploads">立即上传</el-button>
                                <el-button @click="resetUploads">取消</el-button>
                            </el-form-item>
                             <el-form-item label="测试开始时间">   
                                <el-time-picker
                                    v-model="ruleForm.testStartTime"
                                    format="HH:mm"
                                >
                                </el-time-picker> 
                            </el-form-item>
                             <el-form-item label="测试结束时间">   
                                 <el-time-picker
                                    v-model="ruleForm.testEndTime"
                                    format="HH:mm"
                                    >
                                </el-time-picker>
                            </el-form-item>
                        </fieldset>
                        <fieldset v-if="ruleForm.regionType!=0">
                            <legend>智慧消防设备安装情况</legend>
                            <el-form-item label="远程监控设备数量" prop="number1">
                                    <el-input v-model="ruleForm.deviceInstallDesc.system1.count" v-numberInput @blur="blurSystem(1,ruleForm.deviceInstallDesc.system1.count)"></el-input>
                            </el-form-item>
                            <el-form-item label="智慧用水设备数量" prop="number2">
                                    <el-input v-model="ruleForm.deviceInstallDesc.system2.count" v-numberInput @blur="blurSystem(2,ruleForm.deviceInstallDesc.system2.count)"></el-input>
                            </el-form-item>
                            <el-form-item label="智慧用电设备数量" prop="number3">
                                    <el-input v-model="ruleForm.deviceInstallDesc.system3.count" v-numberInput @blur="blurSystem(3,ruleForm.deviceInstallDesc.system3.count)"></el-input>
                            </el-form-item>
                            <el-form-item label="智能预警设备数量" prop="number4">
                                    <el-input v-model="ruleForm.deviceInstallDesc.system4.count" v-numberInput @blur="blurSystem(4,ruleForm.deviceInstallDesc.system4.count)"></el-input>
                            </el-form-item>
                            <el-form-item label="燃气监控设备数量" prop="number5">
                                    <el-input v-model="ruleForm.deviceInstallDesc.system5.count" v-numberInput @blur="blurSystem(5,ruleForm.deviceInstallDesc.system5.count)"></el-input>
                            </el-form-item>
                            <el-form-item label="智能电桩设备数量" prop="number6">
                                    <el-input v-model="ruleForm.deviceInstallDesc.system6.count" v-numberInput @blur="blurSystem(6,ruleForm.deviceInstallDesc.system6.count)"></el-input>
                            </el-form-item>
                            <el-form-item label="智能疏散设备数量" prop="number7">
                                    <el-input v-model="ruleForm.deviceInstallDesc.system7.count" v-numberInput @blur="blurSystem(7,ruleForm.deviceInstallDesc.system7.count)"></el-input>
                            </el-form-item>
                            <el-form-item label="视频监控设备数量" prop="number8">
                                    <el-input v-model="ruleForm.deviceInstallDesc.system8.count" v-numberInput @blur="blurSystem(8,ruleForm.deviceInstallDesc.system8.count)"></el-input>
                                    <el-dialog
                                        title="合同有效期"
                                        :visible.sync="dialogVisibleunitSystem"
                                        width="50%"
                                        :append-to-body="true"
                                        :before-close="closeVisibleunitSystem">
                                        合同有效期:
                                        <el-date-picker
                                            v-model="valueTime"
                                            type="daterange"
                                            align="right"
                                            unlink-panels
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            :picker-options="pickerOptions">
                                        </el-date-picker><br>
                                        <div style="margin:80px 0 30px 0;text-align:center">
                                            <el-button type="primary" @click="submitUnitSystem">确定</el-button>
                                            <el-button @click="closeVisibleunitSystem">取消</el-button>
                                        </div>
                                        
                                    </el-dialog>
                            </el-form-item>
                         

                        <!-- <el-form-item label="过期时间">
                            <el-date-picker
                                v-model="ruleForm.deviceInstallDesc.expirationTime"
                                type="date"
                                placeholder="Pick a day"
                                >
                            </el-date-picker>
                        </el-form-item> -->
                        </fieldset>
                        <el-form-item class="formfooter">
                            <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                            <!-- <el-button @click="NetworkReset('ruleForm')">重置</el-button> -->
                            <el-button @click="closedialog">取 消</el-button>
                        </el-form-item>
                    </el-form>
                    
                </el-dialog>

                <!-- 冻结接口 -->
                <el-dialog
                    title="冻结账号"
                    :visible.sync="FrozenVisible"
                    width="30%"
                    :close-on-click-modal="false"
                    :before-close="closeFrozen">
                        <el-form :rules="rulesFrozen" :model="FrozenForm" :data="FrozenForm" status-icon  ref="FrozenForm" label-width="130px" class="demo-ruleForm">
                            <el-form-item label="冻结时间" prop="time">
                                <el-date-picker
                                    v-model="FrozenForm.time"
                                    type="datetimerange"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    :default-time="['12:00:00']">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="封号原因" prop="frozenDesc">
                                <el-input type="textarea" v-model="FrozenForm.frozenDesc"></el-input>
                            </el-form-item>
                            <el-form-item class="formfooter">
                                <el-button type="primary" @click="FrozenSubmit('FrozenForm')">冻结</el-button>
                                <!-- <el-button @click="FrozenReset('FrozenForm')">重置</el-button> -->
                                <el-button @click="closeFrozen">取 消</el-button>
                            </el-form-item>
                        </el-form>
                </el-dialog>
                <!-- 单位图 -->
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
                                <span style="width:100%;text-align: center;display:inline-block;margin-bottom:5px;"> {{ item.name }} </span>
                                <img  style="width: 100%; height: 100%" :src="item.url"  alt="">
                            </el-carousel-item>
                        </el-carousel>
                    </fieldset>                    
                    <fieldset>
                        <legend>新增单位图片</legend>
                        <el-form  :model="Architect" :data="Architect" status-icon  ref="Architect" label-width="100px">
                           
                            <el-form-item label="图片选项" prop="buildFloor">
                                <el-select v-model="unitName" placeholder="请选择" >
                                    <el-option
                                        v-for="item in unitOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name">
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
                            <!-- <el-form-item>
                                     
                                     <el-button @click="cancelUpload" >取消上传</el-button>
                            </el-form-item> -->
                            <el-form-item solt-scope="scope">
                                <el-button size="small" type="primary" @click="photoSubmit" v-noMoreClick>提交</el-button>
                                <!-- slot.row.id -->
                                <el-button size="small" type="primary" @click="photoReset">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </fieldset>
                </el-dialog>

                <!-- 穿梭框 -->
                <div class="dialog_transfer">
                    <el-dialog
                        title="提示"
                        :visible.sync="transfer"
                        width="40%"
                        :close-on-click-modal="false"
                        :modal-append-to-body="false"
                        :before-close="Closetransfer">
                            <el-transfer
                                filterable
                                :filter-method="filterMethod"
                                filter-placeholder="State Abbreviations"
                                v-model="value"
                                :titles="transfer_title"
                                @change='changeTransfer'
                                :data="data">
                            </el-transfer>
                    </el-dialog>
                </div>
            </div>
        </el-col>
    </div>
</template>
<script>
import VueAMap from 'vue-amap'
import {GaodeMap} from './../../js/gaodemap'
import {Common} from './../../js/common'
import pagination from '../Children/Pagination'
export default {
    mixins:[GaodeMap,Common],
    components:{
        pagination:pagination
    },
    data(){
        const generateData =()=> {
            const data = [];
            const states = ['California', 'Illinois', 'Maryland', 'Texas', 'Florida', 'Colorado', 'Connecticut '];
            const initials = states;
            states.forEach((city, index) => {
            data.push({
                label: city,
                key: index,
                initial: initials[index]
            });
            });
            return data;
        };
        var userEmail=(rule, value, callback) => {
            if(value){
                var regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if(regEmail.test(value)){
                    callback();
                }else{
                    callback(new Error('邮箱格式错误'));
                }
            }else{
                callback();
            }
        }
        var number1=(rule, value, callback) => {
            if(this.ruleForm.deviceInstallDesc.system1.count===""){
                callback(new Error('不能为空'));
            }else if(this.ruleForm.deviceInstallDesc.system1.count>=0){
                callback();
            }else{
                callback(new Error('不能为空'));
            }
        }
        var number2=(rule, value, callback) => {
            if(this.ruleForm.deviceInstallDesc.system2.count===""){
                callback(new Error('不能为空'));
            }else if(this.ruleForm.deviceInstallDesc.system2.count>=0){
                callback();
            }else{
                callback(new Error('不能为空'));
            }
        }
        var number3=(rule, value, callback) => {
            if(this.ruleForm.deviceInstallDesc.system3.count===""){
                callback(new Error('不能为空'));
            }else if(this.ruleForm.deviceInstallDesc.system3.count>=0){
                callback();
            }else{
                callback(new Error('不能为空'));
            }
        }
        var number4=(rule, value, callback) => {
            if(this.ruleForm.deviceInstallDesc.system4.count===""){
                callback(new Error('不能为空'));
            }else if(this.ruleForm.deviceInstallDesc.system4.count>=0){
                callback();
            }else{
                callback(new Error('不能为空'));
            }
        }
        var number5=(rule, value, callback) => {
            if(this.ruleForm.deviceInstallDesc.system5.count===""){
                callback(new Error('不能为空'));
            }else if(this.ruleForm.deviceInstallDesc.system5.count>=0){
                callback();
            }else{
                callback(new Error('不能为空'));
            }
        }
        var number6=(rule, value, callback) => {
            if(this.ruleForm.deviceInstallDesc.system6.count===""){
                callback(new Error('不能为空'));
            }else if(this.ruleForm.deviceInstallDesc.system6.count>=0){
                callback();
            }else{
                callback(new Error('不能为空'));
            }
        }
        var number7=(rule, value, callback) => {
            if(this.ruleForm.deviceInstallDesc.system7.count===""){
                callback(new Error('不能为空'));
            }else if(this.ruleForm.deviceInstallDesc.system7.count>=0){
                callback();
            }else{
                callback(new Error('不能为空'));
            }
        }
        var number8=(rule, value, callback) => {
            if(this.ruleForm.deviceInstallDesc.system8.count===""){
                callback(new Error('不能为空'));
            }else if(this.ruleForm.deviceInstallDesc.system8.count>=0){
                callback();
            }else{
                callback(new Error('不能为空'));
            }
        }
        return {
            managementUnit:"",//管理单位的数量
            networkingUnit:"",//联网单位的数量
            detailFlag:false,//查看详情开关
            imgList:[],//单位图片列表
            unitImgId:'',//单位图片新增时提交的单位id
            unitName:'',//单位图片名称
            imgUrl:'',//上传成功的单位图片路径
            Architect : {

            },
            loading:false,//上传图片
            currentPage:1,
            rows:10,
            total:1,
            userType:sessionStorage.getItem('userTypes'),//单位等级
            unitId:sessionStorage.getItem('unitId'),//单位等级
            uid:sessionStorage.getItem('user_id'),//单位等级
            unitOptions:[
                {
                    id:0,
                    name:'主图',
                },
                {
                    id:1,
                    name:'第一张',
                },
                {
                    id:2,
                    name:'第二张',
                },
                {
                    id:3,
                    name:'第三张',
                },
                {
                    id:4,
                    name:'第四张',
                },
            ],
            ArchitecturalVisible :false,
            module:'unit',  //模块
            posterURL:'',//图片显示
            upload:'',  //图片file
            dialogVisibleunit:false,//新增弹框
            transfer_title:['未关联', '已关联'],//穿梭框标题
            unitIdInsert:sessionStorage.getItem('unitId'),
            commentname:[],//上级公司名字
            options: [{
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
                    }
            ],
          
            unitStarList:[
                {
                    value: 1,
                    label: '一次'
                },
                {
                    value: 2,
                    label: '二次'
                },
                {
                    value: 3,
                    label: '三次'
                },
                {
                    value: 4,
                    label: '四次'
                },
                {
                    value: 5,
                    label: '五次'
                },
                {
                    value: 6,
                    label: '六次'
                },
                {
                    value: 7,
                    label: '七次'
                },
                {
                    value: 8,
                    label: '八次'
                },
            ],
            unitStarList1:[
                {
                    value: 0,
                    label: '不达标'
                },
                {
                    value: 1,
                    label: '一星'
                },
                {
                    value: 2,
                    label: '二星'
                },
                {
                    value: 3,
                    label: '三星'
                },
            ],
            treedefaultProps: {
                children: 'children',
                label: 'label'
            },
            unitaddress: '', //搜索条件地址
            unitname:'', //搜索条件名称
            competentname:'', //搜索条件上级单位名称
            // fileList:[],
            ruleForm: {
                id:null,
                unitId:sessionStorage.getItem('unitId'),    //单位左边树id
                name:'',        //单位名字/
                address:'',     //单位地址/
                latitude:0,     //单位纬度/
                longitude:0,    //单位经度/
                organizationCode:'',//单位隶属组织机构编码/统一社会信用代码
                phone:'',       //单位手机/
                postalCode:'',  //邮政编码/
                region:'',      //单位所属区域/
                type:'',    //单位类型名/
                mail:'',//单位邮箱
                // unitNum:'',    //单位编号/
                station:'0',//是否有消防站
                fireControlStation:'0',//是否有消防站
                important:'0',//是否是重点单位
                fireControlRoomPhone:'',//消控室电话/
                fireRunnerName:'',//消防安全责任人姓名/
                fireRunnerPhone:'',//消防安全责任人电话/
                unitFireStationPhone:'',//消防安全责任人电话/
                fireRunnerIdNo:'',//消防安全责任人身份号码/
                fireSafetyOfficerName:'',//消防安全管理人姓名/
                unitFireStationName:'',//消防安全管理人姓名/
                fireSafetyOfficerPhone:'',//消防安全管理人电话/
                fireSafetyOfficerIdNo:'',//消防安全管理人身份号码/
                fireSafetyOfficerBackupPhone:'',//后补消防管理人电话/
                legalPersonName:'',//法人代表姓名/
                legalPersonIdNo:'',//法人代表公民身份号码/
                legalPersonPhone:'',//法人代表电话/
                staffNum:'',//职工总人数/
                establishmentDate:'',//成立时间/
                // competentOrganization:'',//上级主管单位名称/
                // governmentOrganization:'',//管辖单位名称/
                economicsOwnership:'',//经济所有制/
                fixedAssets:null,//固定资产/
                unitArea:null,//单位占地面积/
                totalArea:null,//总建筑物面积/
                // superviseLevel:0,//监管等级/
                unitPlanUrl:'',//单位总平面图
                // centerName:'',//单位所属中心名称/
                unitDesc:'',//单位描述
                createdTime:'',
                fireStaffList:[
                    {
                        name:'',
                        phone:""
                    }
                ],
                unitStar:-1,
                fireControlRoomWatchRecordsCount:1,
                deviceInstallDesc:{
                    "system1":{
                        count:0,
                        expirationStartTime:'',
                        expirationEndTime:''
                    },
                    "system2":{
                        count:0,
                        expirationStartTime:'',
                        expirationEndTime:''
                    },
                    "system3":{
                        count:0,
                        expirationStartTime:'',
                        expirationEndTime:''
                    },
                    "system4":{
                        count:0,
                        expirationStartTime:'',
                        expirationEndTime:''
                    },
                    "system5":{
                        count:0,
                        expirationStartTime:'',
                        expirationEndTime:''
                    },
                    "system6":{
                        count:0,
                        expirationStartTime:'',
                        expirationEndTime:''
                    },
                    "system7":{
                        count:0,
                        expirationStartTime:'',
                        expirationEndTime:''
                    },
                    "system8":{
                        count:0,
                        expirationStartTime:'',
                        expirationEndTime:''
                    },
                   
                },
                 testStartTime:'',//测试起始开始时间
                testEndTime:'',//测试起始开始时间
                // regionType:null,
            },
            rules:{//新增表单验证
                name: [
                    { required: true, message: '请输入正确的单位名字', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '单位地址', trigger: 'blur' }
                ],
                email: [
                    { validator:userEmail, trigger: 'blur' }
                ],
                organizationCode: [
                    { required: false, message: '请输入正确的统一社会信用代码', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入正确的单位电话', trigger: 'blur' },
                    // {pattern: /^(1\d{10})|(0\d{2,3}-\d{7,8})$/, message: '电话/手机格式不正确', trigger: 'blur' }
                ],
                postalCode: [
                    { required: false, message: '请输入正确类型长度的邮政编码', trigger: 'blur' },
                    {pattern: /^\d{6}$/,message: '请输入正确类型长度的邮政编码', trigger: 'blur' }

                ],
                region: [
                    { required: false, message: '请输入正确的单位所属组织', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请输入正确的单位类型名', trigger: ['blur','change' ]}
                ],
                fireControlRoomPhone: [
                    { required: false, message: '请输入正确的消控室电话', trigger: 'blur' },
                    // {pattern: /^(1\d{10})|(0\d{2,3}-\d{7,8})$/, message: '电话/手机格式不正确', trigger: 'blur' }
                ],
                fireRunnerName: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                fireRunnerPhone: [
                    { required: true, message: '请输入正确的消防安全责任人电话', trigger: 'blur' },
                    {pattern: /^(1\d{10})|(0\d{2,3}-\d{7,8})$/, message: '电话/手机格式不正确', trigger: 'blur' }
                ],
                unitFireStationPhone: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                ],
                fireRunnerIdNo: [
                    { required: false, message: '请输入消防安全责任人身份号码', trigger: 'blur' },
                    {pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,message: '证件号码格式有误！',trigger: 'blur'}
                ],
                fireSafetyOfficerName: [
                    { required: true, message: '请输入正确的消防安全管理人姓名', trigger: 'blur' },
                ],
                unitFireStationName: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                fireSafetyOfficerPhone: [
                    { required: true, message: '请输入正确的消防安全管理人电话', trigger: 'blur' },
                    {pattern: /^(1\d{10})|(0\d{2,3}-\d{7,8})$/, message: '电话/手机格式不正确', trigger: 'blur' }
                ],
                fireSafetyOfficerIdNo: [
                    { required: false, message: '请输入正确的消防安全管理人身份号码', trigger: 'blur' },
                    {pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,message: '证件号码格式有误！',trigger: 'blur'}
                ],
                fireSafetyOfficerBackupPhone: [
                    { required: false, message: '请输入管理人电话', trigger: 'blur' },
                ],
                legalPersonName: [
                    { required: false, message: '请输入正确的法人代表姓名', trigger: 'blur' }
                ],
                legalPersonIdNo: [
                    { required: false, message: '请输入正确的法人代表公民身份号码', trigger: 'blur' },
                    {pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,message: '证件号码格式有误！',trigger: 'blur'}
                ],
                legalPersonPhone: [
                    { required: false, message: '请输入正确的法人代表电话', trigger: 'blur' },
                    // {pattern: /^(1\d{10})|(0\d{2,3}-\d{7,8})$/, message: '电话/手机格式不正确', trigger: 'blur' }
                ],
                staffNum: [
                    { required: false,  message: '请输入正确类型的职工总人数', trigger: 'blur' },
                    {pattern: /^\d{1,9}$/,message: '请输入正确类型的职工总人数', trigger: 'blur' }
                ],
                establishmentDate: [
                    { required: false, message: '请输入成立时间', trigger: 'blur' }
                ],
                economicsOwnership: [
                    { required: false, message: '请选择经济所有制', trigger: 'blur' }
                ],
                fixedAssets: [
                    { required: false,message: '请输入正确类型长度的固定资产', trigger: 'blur' },
                    {pattern: /^\d{1,9}$/,message: '请输入正确类型长度的固定资产', trigger: 'blur' }
                ],
                unitArea: [
                    { required: false, message: '请输入正确类型的单位占地面积', trigger: 'blur' },
                    {pattern: /^\d{1,9}$/,message: '请输入正确类型的单位占地面积', trigger: 'blur' }
                ],
                totalArea: [
                    { required: false, message: '请输入正确类型的总建筑物面积', trigger: 'blur' },
                    {pattern: /^\d{1,9}$/,message: '请输入正确类型的总建筑物面积', trigger: 'blur' }
                ],
                unitPlanUrl: [
                    { required: false, message: '请选择单位总平面图', trigger: 'blur' }
                ],
                fireControlRoomWatchRecordsCount: [
                    { required: true, message: '请选择值班次数', trigger: 'blur' }
                ],
                number1:[
                    { validator:number1, trigger: 'blur' }
                ],
                number2:[
                    { validator:number2, trigger: 'blur' }
                ],
                number3:[
                    { validator:number3, trigger: 'blur' }
                ],
                number4:[
                    { validator:number4, trigger: 'blur' }
                ],
                number5:[
                    { validator:number5, trigger: 'blur' }
                ],
                number6:[
                    { validator:number6, trigger: 'blur' }
                ],
                number7:[
                    { validator:number7, trigger: 'blur' }
                ],
                number8:[
                    { validator:number8, trigger: 'blur' }
                ]
            },
            FrozenForm:{    //冻结表单
                time:'',    //冻结时间
                frozenDesc:'',//冻结原因
                unitId:null   //冻结id
            },
            rulesFrozen:{   //冻结表单验证
                time: [
                    {required: true, message: '冻结时间', trigger: 'blur' }
                ],
                frozenDesc: [
                    {required: true, message: '冻结原因', trigger: 'blur' }
                ],

            },
            SperRelaId:null,//子公司id
            transfer:false,//穿梭框是否显示
            data: generateData(),//穿梭框函数
            value: [1,2,3],  //穿梭框值
            initials:[],//查询条件
            filterMethod(query, item) {
                return item.initial.indexOf(query) > -1;
            },
            fileLoading:false,//导入等待
            fileErrorUrl:"",
            dialogVisibleunitSystem:false,
            valueTime:[],//合同有效时间
            valueTimeFlag:false,//合同有效时间系统挂钩
            systemType:'',//合同有效期系统类型
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
                },
            }
    },
    methods:{
        getUnitNum () {
            this.axios({
                url:"api/admin/unit/sub/count",
                method:"post",
                data:{
                    id:this.unitId
                }
            }).then ( res => {
                this.managementUnit = res.data.data.managerUnitCount
                this.networkingUnit = res.data.data.subUnitCount
            })
        },
        rowCalss ({row, column, rowIndex, columnIndex}) {//样式
            if ( row.regionType == 0) {
                return "td_style"
            }
        },
        deleteDevice (index) {//删除消防人员
          if ( index ||  this.ruleForm.fireStaffList.length > 1) {
              this.ruleForm.fireStaffList.splice(index,1)
          }
        },
        addDevice () {
            this.ruleForm.fireStaffList.push({
                name:"",
                phone:""
            })
        },
        beforeUpload(file) {//上传前
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
                this.ruleForm.unitPlanUrl=null;
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
            this.posterURL = URL.createObjectURL(file.raw);
            this.upload= file.raw;
        },
        searchreset(){  //条件查询重置
            this.unitaddress='';
            this.unitname='';
            this.competentname='';
            this.currentPage = 1;
            this.$refs.paginationChild.changePageNum(this.currentPage)
            this.getData()
        },
        uploads(){  //上传图片
            var _this=this;
            let formdata = new FormData();
            formdata.append('file', this.upload);
            formdata.append('fileType',4);
            this.axios({
                url   : "/api/admin/file/upload",
                method: 'post',
                data  :formdata
                }).then(res=>{    
                    if(res.data.code==0){
                        _this.ruleForm.unitPlanUrl=res.data.data.fileUrl;
                        
                        _this.$alert('上传成功', '提示', {
                            confirmButtonText: 'OK',
                        });
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }                                             
                })
            

        },
        unituploads(){  //上传图片
            var _this=this;
            this.loading=true;
            if( _this.unitName ) {
                if( !_this.posterURL ) {
                    _this.imgList.map( item => {
                        if( item.name === _this.unitName ) { 
                            item.url = "https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/common/no_pic.gif"
                            _this.$alert('操作成功', '提示', {
                                confirmButtonText: 'OK',
                            });
                        }    
                    })
                }else{
                    let formdata = new FormData();
                    formdata.append('file', this.upload);
                    formdata.append('fileType',4);
                    this.axios({
                    url   : "/api/admin/file/upload",
                    method: 'post',
                    data  :formdata
                    }).then(res=>{    
                        if(res.data.code==0){
                            _this.ruleForm.unitPlanUrl=res.data.data.fileUrl;
                            _this.imgUrl = res.data.data.fileUrl;
                            var flag = true
                            _this.imgList.map( item => {
                                if( item.name === _this.unitName ) {
                                    
                                    item.url = _this.imgUrl 
                                    flag = false
                                    this.$message({
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                }    
                                
                            })
                            if( flag) {
                                    _this.imgList.push({
                                    url:_this.imgUrl,
                                    name:_this.unitName,
                                })
                            }
                            // _this.photoReset()
                            this.loading=false;
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
                }
            }else{
                this.loading=false;
                this.$message({
                    message: '请选择图片选项',
                    type: 'error'
                });
            }
        },
        searchsubmit(){     //条件查询
            var _this=this;
            this.currentPage=1;
             this.$refs.paginations.page.page_index = 1
            this.axios({
                url   :'/api/admin/unit/list',
                method: 'post',
                data  : {
                    pageNum: this.currentPage,
                    pageSize: this.rows,
                    name:this.unitname,
                    unitId :this.unitId
                    // address:this.unitaddress,
                    // region:this.competentname
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.tableData=res.data.list
                     for(var i=0;i<_this.tableData.length;i++){
                            _this.tableData[i].createdTime=_this.$moment(_this.tableData[i].createdTime).format("YYYY-MM-DD");
                        }
                    _this.total=res.data.total;
                }
            })
        },
        changeTransfer(value,direction,movekeys){   //添加修改关系
            var _this=this;
            var type=0;
            if(direction=='left'){
                type=0
            }else{
                type=1
            }
                this.$confirm('你确定要移动吗')
                .then(()=> {
                    this.axios({
                        url:'/api/admin/unit/maintain/relation',
                        method:'post',
                        data:{
                            unitId:this.SperRelaId,
                            maintainUnitIdList:movekeys,
                            type:type
                        }
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('关联成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:()=>{
                                    _this.getTranfer();
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
        SperRela(id){   //打开穿梭框
            this.SperRelaId=id;
            this.getTranfer();
            this.transfer=true;
        },
        getTranfer(){   //打开列表渲染
            this.data=[];
            this.value=[];
            var _this=this;
            _this.initials=[];
            this.axios({    //显示列表
                url:'/api/admin/unit/lists',
                method: 'post',
                data:{
                    id:this.SperRelaId
                }
            }).then(res=>{
                if(res.data.code==0){
                    for(var i=0;i<res.data.data.units.length;i++){
                        _this.initials.push(res.data.data.units[i].name)
                        _this.data.push({   //未关联单位
                            label: res.data.data.units[i].name,
                            key: res.data.data.units[i].id,
                            initial:_this.initials[i]
                        })  
                    }
                    for(i=0;i<res.data.data.maintains.length;i++){//已关联单位
                        _this.value[i]=res.data.data.maintains[i].id
                    }
                    if(res.data.data.type==0){
                        _this.transfer_title=['未关联联网单位','已关联联网单位']; 
                    }else if(res.data.data.type==1){
                        _this.transfer_title=['未关联管理单位','已关联管理单位'];
                    }
                }
            })
        },
        Closetransfer(){    //关闭穿梭框
            this.transfer=false;
        },
        resetUploads(){ //图片取消
            this.ruleForm.unitPlanUrl=null;
            this.posterURL ='';
        },
        NetworkReset() {    //表单重置
            this.posterURL=null;
            Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
            delete(this.ruleForm.id);
        },
        //树节点方法
        renderContent(h, { node, data}) {//树前小图标
            return (
              <span>
                <i class={data.icon}></i>
                &nbsp;<span>{node.label}</span>
              </span>
              );
        },
        handleNodeClick(data) { //点击树节点
            this.ruleForm.unitId=data.id;
            this.unitId=data.id;
            this.rows = 10
            this.currentPage = 1
            this.$refs.paginations.page.page_index = 1
            this.getData();
            this.getUnitNum()
        },
        openUnitImg (unitId) {//查看单位图
            var _this = this
            this.ArchitecturalVisible = true
            this.unitImgId = unitId
            this.axios({
                url:"/api/admin/unit/images/list",
                method:"post",
                data:{
                    unitId
                }
            }).then( res => {
                if( res.data.code === 0) {
                    _this.imgList = res.data.data
                }
                
            })
        },
        photoSubmit () {
            var _this = this
            this.axios({
                url:"/api/admin/unit/images/add",
                method:"post",
                data:{    
                    images:_this.imgList,
                    unitId:_this.unitImgId
                }
            }).then( res => {
                if( res.data.code === 0) {

                    this.photoReset()
                    this.openUnitImg(this.unitImgId)
                    this.$alert('添加成功', '提示', {
                        confirmButtonText: 'OK',
                    });

                }else{
                    this.$alert(res.data.message, '提示', {
                        confirmButtonText: 'OK',
                    }); 
                }                    
            })
        },
        photoReset () {
            this.posterURL = ''
            this.imgUrl = ''
            this.upload = ''
        },
        closeArchitectural () {
            this.ArchitecturalVisible = false
        },
        importEdit(id){//是否是重点单位
            var _this = this;
            this.$confirm('你确定要改变单位类型吗')
                .then(()=> {
                    this.axios({
                        url:"/api/admin/unit/update/imp",
                        method:"post",
                        data:{    
                            id:id
                        }
                    }).then( res => {
                        if( res.data.code === 0) {
                            this.$alert('保存成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:()=>{
                                    _this.searchsubmit();
                                }
                            });
                        }else{
                            this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            }); 
                        }                    
                    })
                })
        },
        DropdownData(){ //下拉框类型
            var _this=this;
            this.axios({
                url   :'/api/admin/unit/type',
                method: 'post',
            }).then(res=>{
                if(res.data.code==0){
                    _this.options=res.data.data;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                } 
            })
        },
        pageChange (item) {//页数页码改变页面重新刷新
            this.currentPage = item.page_index;
            this.rows = item.page_limit;
            this.getData() //改变页码，重新渲染页面
        },
        uploadsFile(file){//导入单位
            var _this=this;
            let formdata = new FormData(); 
            formdata.append('multis',file.file );
            formdata.append('unitId',_this.unitId);
            this.fileLoading = true
            this.axios({
                url:"/api/admin/unit/batch/import",
                method:"post",
                data:formdata,
                dataType:'json',
            }).then( res => {
                if( res && res.status==200  ) {
                    if( res.data.code==0 ) {
                     this.fileLoading = false
                     this.$alert("导入成功"+res.data.data.successCount+"条\n导入失败"+res.data.data.errorCount+'条')
                     this.getData()
                     this.$refs['my-upload'].clearFiles();
                     if( this.instance ) {
                         this.instance.close()
                     }
                     if( res.data.data.errorCount ) {
                         this.instance =  this.$notify.error({
                            title: '提示',
                            dangerouslyUseHTMLString: true,
                            message: '<p style="cursor: pointer;">点击下载导入错误原因</p>',
                            duration: 0,
                            // onClick:_this.downErrorFlie,
                            position: 'bottom-right',
                            offset: 100
                        })
                        this.instance.onClick =  () => {
                            _this.downErrorFlie(res.data.data.id);
                        }
                     }
                    }else{
                        this.$alert(res.data.msg);
                    }
                }else{
                    this.fileLoading = false;
                    this.$alert("导入失败");
                    this.$refs['my-upload'].clearFiles();
                }
            })
        },
        downFile() {//下载单位导入模板
            location.href="https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/单位导入模板.xls";
        },
        downErrorFlie(id) {
            this.instance.close();
            if( id ) {
              location.href = "https://admin.dingrennet.cn/api/admin/unit/backup?id="+id+"&uid="+this.uid;
            }
        },
        blurSystem(type,data){//填写系统数量补充合同日期
            if(data>0){
                this.systemType=type;
                 this.$set(this.valueTime,0,this.ruleForm.deviceInstallDesc['system'+this.systemType].expirationStartTime)
                this.$set(this.valueTime,1,this.ruleForm.deviceInstallDesc['system'+this.systemType].expirationEndTime)
                this.dialogVisibleunitSystem=true;
                // console.log(this.valueTime)
            }
        },
        closeVisibleunitSystem(){//关闭合同有效期弹框
            if(this.valueTimeFlag==true){
                this.ruleForm.deviceInstallDesc['system'+this.systemType].count=0;
            }
            if(this.ruleForm.deviceInstallDesc['system'+this.systemType].count>0 && (this.ruleForm.deviceInstallDesc['system'+this.systemType].expirationStartTime==''||this.ruleForm.deviceInstallDesc['system'+this.systemType].expirationEndTime=='')){
                this.ruleForm.deviceInstallDesc['system'+this.systemType].count=0;
            }
            if(!this.valueTime){
                this.valueTime=[];
            }
            this.dialogVisibleunitSystem=false;
        },
        submitUnitSystem(){//合同有效期提交弹框
            if(this.valueTime&&this.valueTime.length==2){
                this.ruleForm.deviceInstallDesc['system'+this.systemType].expirationStartTime=this.valueTime[0];
                this.ruleForm.deviceInstallDesc['system'+this.systemType].expirationEndTime=this.valueTime[1];
                this.$message({
                    type:'success',
                    message:'保存成功'
                })
                this.valueTimeFlag=false;
                this.closeVisibleunitSystem();
            }else{
                // this.$message({
                //     type:'error',
                //     message:'合同有效时间清除，设备数量也将清除'
                // })
                this.$confirm('你确定要保存吗,合同有效时间清除，设备数量也将清除')
                .then(()=> {
                    this.valueTimeFlag=true;
                    this.valueTime=[];
                    this.ruleForm.deviceInstallDesc['system'+this.systemType].expirationStartTime="";
                    this.ruleForm.deviceInstallDesc['system'+this.systemType].expirationEndTime="";
                }).catch(() => {
                    this.$message({
                        type:'info',
                        message:'已撤销清除'
                    })
                    this.dialogVisibleunitSystem=false;    
                    this.valueTime=[];     
                });
                
            }
            
        }
    },
    watch:{
        'ruleForm.competentOrganization':function(){
            var _this=this;
            this.axios({
                url   :'/api/admin/unit/search',
                method: 'get',
                params  : {
                    name: this.ruleForm.competentOrganization,
                }
            }).then(res=>{
                document.getElementById('competentBox').innerHTML='';
                document.getElementById('competentmsg').innerHTML='';
                if(res.data.code==0){ 
                   var oul=document.getElementById('competentBox');
                   if(res.data.data.length==0){
                       document.getElementById('competentmsg').innerHTML='沒有该公司';
                   }else{
                       document.getElementById('competentBox').style.display='block';
                        for(var i in res.data.data){
                            var oLi=document.createElement('li');
                            oLi.innerHTML=res.data.data[i].name;
                            oLi.className='liname'
                            oul.appendChild(oLi);
                        }
                        var liLength=document.getElementsByClassName('liname').length;
                        for(var j=0;j<liLength;j++){
                            document.getElementsByClassName('liname')[j].onclick=function(){
                                _this.ruleForm.competentOrganization=this.innerHTML;
                                document.getElementById('competentBox').style.display='none';
                            }
                        }
                     }
                }else{
                    alert(res.data.msg);
                }
            })
        }
    },
    mounted() {
        this.getUnitNum()
    },
    
}
</script>

<style lang="scss">
    #NetworkUnit{
        .td_style{
            background-color: #70f1d1;
        }
        .el-rate{
            margin-top: 10px;
            display: inline-block;
            margin-right: 10px;
        }
        .unitStars{
            margin-top: 10px;
        }
        .el-form-item__content{
            min-width: 180px;
        }
        .top{
            display: flex;
            justify-content: space-between;
            .el-input{
                width: auto;
            }
            .online{
                // opacity: .8;
                margin-left: 10px;
                color: #909399;
                font-size: 14px;
                font-weight: 700;
            }
            border:none;
        }
        .plus{
            font-size: 21px;
            margin-left: 3px;
            cursor: pointer;
        }
        .el-dialog{
            .el-select,.el-input{
                width:180px;
            }
        }
        .el-input--mini .el-input__icon{
            line-height: 50px;
        }
        
        fieldset{
            border:1px solid #eee;
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
        }
        #fixedAssets label{
            width: 220px!important;
        }
        .unitDesc{
            width:575px;
        }
        .avatar-uploader>div{
            border: 1px solid #eee;
        }
        .el-transfer-panel__body{
            height:350px;
            .el-transfer-panel__list.is-filterable{
                height:300px;
            }
            .el-checkbox{
                display:block;
            }
        } 
        .el-transfer-panel{
            width:250px;
            text-align:left;
        }
        .el-transfer{
            text-align:center;
        }
        .el-transfer__button:nth-child(2){
            margin-left:8px;
        } 
        
        .el-radio{
            margin-right:45px;
        }
        .el-date-range-picker__time-header{
            .el-input{
                width:144px!important;
            }
        } 
        .el-date-editor{
            width:180px!important;
        }
        li{
            list-style:none;
        }
        #competentmsg{
            display:inline-block;
        }
        .avatar-uploader .el-upload {
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
        // .el-loading-spinner{
            // position: relative;
            // top: 0;
            // margin-top: 0px;
        // }
    }
    // .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    //     width: 100%;
    //     height: 100%;
    //     position: absolute;
    // }
</style>