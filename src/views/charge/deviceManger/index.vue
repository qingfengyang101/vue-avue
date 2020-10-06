<template>
  <div>
    <h2 class="layout-pages-title">充电设备管理</h2>
    <div class="layout-pages-search">
      <el-input placeholder="请输入设备编号"
                size="small"
                class="search-btn"
                v-model="listQuery.code"
                @keyup.native.enter='handleFilter'
                clearable>
      </el-input>
      <el-col :span="3">
        <el-select v-model="listQuery.online"
                    size="small"
                    clearable
                    @change="handleFilter"
                    placeholder="请选择在线状态">
          <el-option size="small" label="在线" value="0"></el-option>
          <el-option size="small" label="离线" value="1"></el-option>
        </el-select>
      </el-col>
      <el-button size="small"
                 type="primary"
                 @click="handleFilter">搜索</el-button>
    </div>
    <div class="layout-pages-content">
      <el-button type="success"
                 size="mini"
                 v-if="add_setEquipment"
                 class="btn-opearator"
                 @click="handleAdd">添加设备</el-button>
      <el-button type="primary"
                 size="mini"
                 v-if="add_setEquipment"
                 class="btn-opearator"
                 @click="handleBindMB">绑定充电模板</el-button>
      <el-button
        size="mini"
        class="btn-opearator"
        type="warning"
        @click="handleUpdateAllLoops">更新全部回路</el-button>
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-table :data="tableData"
                class="layout-pages-content-table"
                v-loading="listLoading"
                @selection-change="handleSelectionChange"
                style="width: 100%">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="设备编号">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="模板名称">
          <template slot-scope="scope">
            <span>{{scope.row.ratename}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="卡类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type===0">识别所有卡</span>
            <span v-if="scope.row.type===1">只识别加密卡</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="设备安装地址">
          <template slot-scope="scope">
            <span>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="最大功率">
          <template slot-scope="scope">
            <span>{{scope.row.maxPower}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="过温保护值">
          <template slot-scope="scope">
            <span>{{scope.row.temperature}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="上次通讯时间">
          <template slot-scope="scope">
            <span>{{scope.row.lastTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="在线状态">
          <template slot-scope="scope">
            <span v-if="scope.row.online === 1">离线</span>
            <span v-if="scope.row.online === 0">在线</span>
          </template>
        </el-table-column>
        
        <el-table-column align="center"
                         width="350px"
                         label="操作">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="edit_equipment"
                  @click="handleUpdate(scope.row)"
                  effect="plain">
              编辑
            </span>
            <span class="tag-opearte"
                  @click="handleDetEquirment(scope.row)"
                  v-if="del_setEquipment"
                  effect="plain">
              删除
            </span>
            <span class="tag-opearte"
                  @click="handleDetail(scope.row)"
                  effect="plain">
              详情
            </span>
            <span class="tag-opearte"
                  @click="printDetail(scope.row)"
                  effect="plain">
              打印
            </span>
            <el-dropdown>
              <span class="el-dropdown-link tag-opearte"
                    effect="plain">
                更多
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="send_setEquipment"
                                  @click.native="handleSendDevice(scope.row)">更新设备参数</el-dropdown-item>
                <el-dropdown-item divided
                                  v-if="update_equipment"
                                  @click.native="handleGetUpdateDeviceInfo(scope.row)">设置设备参数</el-dropdown-item>
                <el-dropdown-item divided
                                  v-if="temp_setEquipment"
                                  @click.native="handleSetTemp(scope.row)">设置过温保护</el-dropdown-item>
                <el-dropdown-item divided
                                  v-if="ip_setEquipment"
                                  @click.native="handleGetUpdateIpInfo(scope.row)">设置设备ip</el-dropdown-item>
                <el-dropdown-item divided
                                  @click.native="handleUpdateLines(scope.row)"
                                  v-if="updata_circuit">更新回路信息</el-dropdown-item>
                <el-dropdown-item divided
                                  v-if="look_circle"
                                  @click.native="handleGetCircuitListObj(scope.row)">查看回路信息</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="layout-pages-pagination">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10, 20, 30, 50]"
                     :page-size="listQuery.limit"
                     layout="sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <!-- 编辑、详情、添加 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="formDialogVisible"
               width="70%">
      <el-form :model="setEquipment"
               :rules="ruleSetEquipment"
               ref="setEquipment"
               label-width="140px">
        <el-row>
          <el-col :span="7">
            <el-form-item label="设备编号"
                          prop="code">
              <el-input v-model="setEquipment.code"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update' ||  dialogStatus=== 'updateDevice' "></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="温度保护值"
                          v-if="dialogStatus !== 'create'"
                          prop="temperature">
              <el-input v-model="setEquipment.temperature"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update' ||  dialogStatus=== 'updateDevice'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="设备信号强度"
                          v-if="dialogStatus !== 'create'"
                          prop="level">
              <el-input v-model="setEquipment.level"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update' ||  dialogStatus=== 'updateDevice'"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <el-form-item label="经度坐标"
                          prop="lng">
              <el-input v-model="setEquipment.lng"
                        @focus="mapDialogVisible = true"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' ||  dialogStatus=== 'updateDevice'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="纬度坐标"
                          prop="lat">
              <el-input v-model="setEquipment.lat"
                        @focus="mapDialogVisible = true"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' ||  dialogStatus=== 'updateDevice'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="设备安装地址"
                          prop="address">
              <el-input v-model="setEquipment.address"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' ||  dialogStatus=== 'updateDevice'"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <el-form-item label="充电方式"
                          prop="chargeMethod">
              <el-select v-model="setEquipment.chargeMethod"
                         :disabled="dialogStatus=== 'detail' ||  dialogStatus=== 'update'||  dialogStatus=== 'updateDevice'"
                         size="small">
                <el-option v-for="item in chargeDList"
                           size="small"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="设备类型"
                          prop="typeid">
              <el-select v-model="setEquipment.typeid"
                         :disabled="dialogStatus=== 'detail' ||  dialogStatus=== 'update'||  dialogStatus=== 'updateDevice'"
                         size="small">
                <el-option v-for="item in typeList"
                           size="small"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="卡类型"
                          prop="type">
              <el-select v-model="setEquipment.type"
                         :disabled="dialogStatus=== 'detail' ||  dialogStatus=== 'update'||  dialogStatus=== 'updateDevice'"
                         size="small">
                <el-option v-for="item in cardTypeList"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="最大功率"
                          v-if="dialogStatus !== 'create'"
                          prop="maxPower">
              <el-input v-model="setEquipment.maxPower"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'|| dialogStatus=== 'update'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="充满自停功率"
                          v-if="dialogStatus !== 'create'"
                          prop="autoStopPower">
              <el-input v-model="setEquipment.autoStopPower"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="充满自停延长时间"
                          v-if="dialogStatus !== 'create'"
                          prop="minuts">
              <el-input v-model="setEquipment.minuts"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="创建时间"
                          v-if="dialogStatus !== 'create'"
                          prop="createTime">
              <el-input v-model="setEquipment.createTime"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update' ||  dialogStatus=== 'updateDevice'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="上次通讯时间"
                          v-if="dialogStatus !== 'create'"
                          prop="lastTime">
              <el-input v-model="setEquipment.lastTime"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update' ||  dialogStatus=== 'updateDevice'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-dialog title="选取经纬度"
                 :visible.sync="mapDialogVisible"
                 append-to-body>
        <el-amap vid="amapDemo"
                 :zoom="zoom"
                 :events="reqPosition"
                 :center="center"
                 style="height: 55vh;">
        </el-amap>
      </el-dialog>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'create' || dialogStatus=== 'update' ||  dialogStatus=== 'updateDevice'">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'create'"
                   @click="handleSubmit('setEquipment')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('setEquipment')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'updateDevice'"
                   @click="handleDeviceUptForm('setEquipment')">更 新</el-button>
      </span>
    </el-dialog>
    <!-- 过温保护 -->
    <el-dialog title="温度过温保护"
               width="30%"
               :visible.sync="setTempformDialogVisible">

      <el-form :model="setTempForm"
               :rules="rules"
               ref="setTempForm"
               label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="过温温度"
                          prop="temperature">
              <el-input v-model="setTempForm.temperature"
                        size="small"
                        clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   size="small"
                   @click="handleSetTempSubmit('setTempForm')">确 定</el-button>
        <el-button size="small"
                   @click="setTempformDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 设置设备ip -->
    <el-dialog title="设置设备IP"
               width="50%"
               :visible.sync="ipInfoDialogVisible">
      <el-form :model="ipInfoForm"
               :rules="rules"
               ref="ipInfoForm"
               label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="ip地址"
                          prop="ip">
              <el-input v-model="ipInfoForm.ip"
                        size="small"
                        clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="端口号"
                          prop="port">
              <el-input v-model="ipInfoForm.port"
                        size="small"
                        clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备类型"
                          prop="type">
              <el-select v-model="ipInfoForm.type"
                         size="small">
                <el-option v-for="item in typeList"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleIpInfoSubmit('ipInfoForm')">确 定</el-button>
        <el-button type="primary"
                   @click="ipInfoDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!--  -->
    <el-dialog title="回路信息"
               :visible.sync="dialogTableVisible">
      <el-table :data="circuittableData">
        <el-table-column align="center"
                         label="设备id">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="回路编号">
          <template slot-scope="scope">
            <span>{{scope.row.lineId}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="回路状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state === 1">空闲</span>
            <span v-if="scope.row.state === 2">占用</span>
            <span v-if="scope.row.state === 3">故障</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="充电模板"
               v-loading="listTemplateLoading"
               width="75%"
               :visible.sync="TemplateDialogVisible">
      <el-table :data="TemplateSelectData"
                @selection-change="handleBindSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="模板编号">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="模板名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="充电时长">
          <template slot-scope="scope">
            <span>{{scope.row.time}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="第一功率">
          <template slot-scope="scope">
            <span>{{scope.row.viewPower[0]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="第二功率">
          <template slot-scope="scope">
            <span>{{scope.row.viewPower[1]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="第三功率">
          <template slot-scope="scope">
            <span>{{scope.row.viewPower[2]}}</span>
          </template>
        </el-table-column>

      </el-table>
      <div class="layout-pages-pagination">
        <el-pagination @size-change="handleTemplateSizeChange"
                       @current-change="handleTemplateCurrentChange"
                       :current-page.sync="listQueryTemplate.page"
                       :page-sizes="[10, 20, 30, 50]"
                       :page-size="listQueryTemplate.limit"
                       layout="sizes, prev, pager, next, jumper"
                       :total="totalTemplate">
        </el-pagination>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   size="small"
                   @click="handleBindCode">绑 定</el-button>
        <el-button @click="TemplateDialogVisible = false"
                   size="small">关 闭</el-button>
      </span>
    </el-dialog>

    <div style="position: fixed;left: 10000px;right:10000px;">
      <div id="demo">
          <div class="box">
              <h4><img :src='logo' /><span>U家社区</span></h4>
              <p>扫码充电</p>
              <div class="tel">
                <p>服务电话: 0395-5577287</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17339572083</p>
              </div>
              <div class="qrcode" id="qrcode"></div> 
              <span>设备编号: {{ printCode }}</span>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import logo from '@/assets/img/logo.png'
import {  getEquipPage, 
          getEquiInfo, 
          editEquipment, 
          singleEquipment, 
          setTemp, 
          getUpdateIpInfo, 
          delEquipment, 
          bindChargingRate, 
          setEquiInfo,
          handleUpdateAllLoops 
} from '@/api/setCharge'
import { addObj } from '@/api/chargeDevice'
import { getRateListObj } from '@/api/setCharge'
import { updateLines, getListObj } from '@/api/circuit'
import { isPassword } from '@/api/validator'
import printJS from 'print-js'
import QRCode from 'qrcodejs2'  // 引入qrcode
import { filterError } from '@/util/filterError'

export default {
  data() {
    const self = this
    return {
      logo,
      update_setRate: false,
      del_setEquipment: false,
      add_setEquipment: false,
      send_setEquipment: false,
      ip_setEquipment: false,
      temp_setEquipment: false,
      edit_equipment: false,
      update_equipment: false,
      updata_circuit: false,
      listLoading: false,
      look_circle: false,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      circuittotal: 0,
      circuittableData: [],
      circuitListQuery: {
        page: 1,
        limit: 20,
        code: undefined
      },
      dialogTableVisible: false,
      formDialogVisible: false,
      multipleSelection: [],
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情',
        updateDevice: '设置设备参数'
      },
      setEquipment: {
        id: undefined,
        code: undefined,
        typeid: undefined,
        type: undefined,
        lng: undefined,
        lat: undefined,
        address: undefined,
        createTime: undefined,
        chargeMethod: undefined,
        lastTime: undefined,
        temperature: undefined,
        maxPower: undefined,
        autoStopPower: undefined,
        minuts: undefined,
        temperlevelature: undefined
      },
      setTempformDialogVisible: false,
      setTempForm: {
        temperature: '',
        code: ''
      },
      ipInfoDialogVisible: false,
      ipInfoForm: {
        ip: '',
        code: '',
        port: '',
        type: 1
      },
      typeList: [{
        label: '安卓',
        id: 1
      }, {
        label: '4G',
        id: 2
      }],
      cardTypeList: [{
        label: '识别所有卡',
        id: 0
      }, {
        label: '只识别加密卡',
        id: 1
      }],
      chargeDList: [{
        label: '按时间',
        id: 0
      }],
      rules: {
        temperature: [
          { required: true, message: '请输入过温温度', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请输入ip', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '请输入端口号', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入类型', trigger: 'blur' }
        ]
      },
      qrcode: null,
      printCode: '',
      ruleSetEquipment: {
        maxPower: [
          { required: true, message: '请输入最大功率', trigger: 'blur' }
        ],
        autoStopPower: [
          { required: true, message: '请输入充满自停功率', trigger: 'blur' }
        ],
        minuts: [
          { required: true, message: '请输入充满自停延长时间', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入设备编号', trigger: 'blur' },
          { validator: isPassword, trigger: 'blur' }
        ]
      },
      mapDialogVisible: false,
      zoom: 16,
      center: [114.01669, 33.580473],
      reqPosition: {
        click(e) {
          const { lng, lat } = e.lnglat
          self.setEquipment.lng = lng
          self.setEquipment.lat = lat
          self.mapDialogVisible = false
        }
      },
      TemplateDialogVisible: false,
      listTempLoading: false,
      TemplateSelectData: [],
      listTemplateLoading: [],
      listQueryTemplate: {
        page: 1,
        limit: 20
      },
      totalTemplate: 0,
      multipleBindSelection: []
    }
  },
  created() {
    this.update_setRate = this.permissions['update_setRate']
    this.del_setEquipment = this.permissions['del_setEquipment']
    this.send_setEquipment = this.permissions['send_setEquipment']
    this.ip_setEquipment = this.permissions['ip_setEquipment']
    this.temp_setEquipment = this.permissions['temp_setEquipment']
    this.edit_equipment = this.permissions['edit_equipment']
    this.update_equipment = this.permissions['update_equipment']
    this.updata_circuit = this.permissions['updata_circuit']
    this.look_circle = this.permissions['look_circle']
    this.add_setEquipment = this.permissions['add_setEquipment']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
    this.initQrcode();
  },
  methods: {

    async getList() {
      
      try {
        this.listLoading = true
        const res = ({ data: { data: { total: this.total, records: this.tableData } } } = await getEquipPage(this.listQuery))
        this.listLoading = false
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 更新全部回路
     */
    async handleUpdateAllLoops() {

      try {
        await this.$confirm('是否更新全部回路', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})

        const res = await handleUpdateAllLoops();

        await filterError(res, 'notify', 3)
        this.getList()

      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 重置表单
     */
    resetForm() {
      this.setEquipment = {
        id: undefined,
        code: undefined,
        typeid: undefined,
        type: undefined,
        lng: undefined,
        lat: undefined,
        address: undefined,
        createTime: undefined,
        chargeMethod: undefined,
        lastTime: undefined,
        temperature: undefined,
        maxPower: undefined,
        autoStopPower: undefined,
        minuts: undefined,
        temperlevelature: undefined
      }
    },

    /**
     * desc 触发添加设备
     */
    handleAdd() {
      this.dialogStatus = 'create'
      this.resetForm()
      this.formDialogVisible = true
    },

    /**
     * desc 新增设备管理
     */
    async handleSubmit(formName) {
      
      try {
        await this.$refs[formName].validate()
        const res = await addObj(this.setEquipment)
        await filterError(res, 'notify', 1)
        this.formDialogVisible = false
        this.getList()

      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 设置设备参数
     */
    handleGetUpdateDeviceInfo(rows) {
      this.dialogStatus = 'updateDevice'
      Object.assign(this.setEquipment, rows)
      this.formDialogVisible = true
    },

    /**
     * desc 触发编辑按钮
     */
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.setEquipment, rows)
      this.formDialogVisible = true
    },

    /**
     * desc 更新设备参数
     */
    async handleDeviceUptForm(formName) {
      
      try {
        await this.$refs[formName].validate()
        const res = await setEquiInfo(this.setEquipment)
        await filterError(res, 'notify', 2)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }

    },

    /**
     * desc 更新设备
     */
    async handleUptForm(formName) {
      
      try {
        const res = await editEquipment(this.setEquipment)
        await filterError(res, 'notify', 2)
        this.formDialogVisible = false
        this.getList()

      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 查看详情
     */
    async handleDetail({ id }) {
      
      try {
        const res = ({ data: { data: this.setEquipment } } = await singleEquipment(id))
        await filterError(res, 'notify')
        this.dialogStatus = 'detail'
        this.formDialogVisible = true
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 更新设备参数
     */
    async handleSendDevice({ code }) {

      try {
        const res = await getEquiInfo({ code })
        await filterError(res, 'notify', 9)
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 设置过温保护
     */
    handleSetTemp({ code, temperature }) {
      this.setTempForm = { ...this.setTempForm, temperature: undefined, code, temperature}
      this.setTempformDialogVisible = true
    },

    /**
     * desc 更新过温保护
     */
    async handleSetTempSubmit(formName) {
      
      try {
        await this.$refs[formName].validate()
        this.getList()
        const res = await setTemp(this.setTempForm)
        await filterError(res, 'notify', 10)
        this.setTempformDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }

    },

    /**
     * desc 设置设备ip
     */
    handleGetUpdateIpInfo({ code, ip, port }) {
      this.ipInfoForm = { ...this.ipInfoForm, code, ip, port }
      this.ipInfoDialogVisible = true
    },

    /**
     * desc 更新设备ip
     */
    async handleIpInfoSubmit(formName) {
      
      try {
        await this.$refs[formName].validate()
        const res = await getUpdateIpInfo(this.ipInfoForm)
        await filterError(res, 'notify', 11)
        this.getList()
        this.ipInfoDialogVisible = false
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 删除设备
     */
    async handleDetEquirment(row) {
      
      try {
        await this.$confirm('是否删除此设备?', '提示', {  confirmButtonText: '确定',  cancelButtonText: '取消', type: 'warning' })
        const res = await delEquipment(row.code)
        await filterError(res, 'notify', 4)
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 更新回路信息
     */
    async handleUpdateLines({ code }) {
     
      try {
        const res = await updateLines({ code })
        await filterError(res, 'notify', 12)
        this.getList()

      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 查看回路信息
     */
    async handleGetCircuitListObj({ code }) {
      this.circuitListQuery.code = code

      try {
        const res = ({ data: { data: { total: this.circuittotal, records: this.circuittableData } } } = await getListObj(this.circuitListQuery))
        await filterError(res, 'notify')
        this.dialogTableVisible = true

      }catch(err) {
        console.log(err)
      }
    },
    handleBindSelectionChange(val) {
      this.multipleBindSelection = val
    },

    /**
     * desc 绑定充电模板
     */
    handleBindMB() {
      if (this.multipleSelection.length) {
        this.TemplateDialogVisible = true
        this.listTempLoading = true
        this.getTemplateObj()
      } else {
        this.$notify({
          title: '警告',
          message: '请先选择要绑定的设备',
          type: 'warning'
        })
      }
    },

    /**
     * desc 获取模板列表
     */
    async getTemplateObj() {
      
      try {
        const res = ({ data: { data: { total: this.totalTemplate, records: this.TemplateSelectData } } } = await getRateListObj(this.listQueryTemplate))
        this.listTempLoading = false
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }

    },
    handleTemplateSizeChange(val) {
      this.listQueryTemplate.limit = val
      this.getTemplateObj()
    },
    handleTemplateCurrentChange(val) {
      this.listQueryTemplate.page = val
      this.getTemplateObj()
    },

    /**
     * desc 更新充电模板
     */
    async handleBindCode() {

      const { multipleBindSelection, multipleSelection } = this;
      
      if (!multipleBindSelection.length) {
        this.$notify({  title: '警告',  message: '请先选择要充电的模板',  type: 'warning' })
        return;
      }

      if (multipleBindSelection.length !== 1) {
        this.$notify({  title: '警告',  message: '只能选择一条模板',  type: 'warning' })
        return;
      }

      try {
        let codes = ''
        multipleSelection.forEach(item => {  codes += item.code + ','  })
        const obj = { codes,  rateId: multipleBindSelection[0].id }
        const res = await bindChargingRate(obj)
        await filterError(res, 'notify', 8)

        this.getList()
        this.TemplateDialogVisible = false
      }catch(err) {
        console.log(err)
      }
      
    },

    /**
     * desc 初始化二维码
     */
    initQrcode() {
      this.qrcode = new QRCode('qrcode', {
        width: 240,  
        height: 240,
        text: 'https://www.baidu.com', // 二维码地址
        colorDark : "#000",
        colorLight : "#fff",
      })
    },

    /**
     * desc 打印
     */
    printDetail({ code }) {
      try {
        this.qrcode.makeCode(`http://www.ujiasmart.com/download.html?code=${code}`)
        this.printCode = code
        this.$nextTick(() => { 
          printJS({ printable: ['demo'], type: 'html', targetStyles: ['*'] })
        })
      }catch(err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.box {
    width: 320px;

    >h4 {
      width: 100%;
      height: 34px;
      line-height: 34px;
      font-size: 20px;
      font-weight:normal;
      margin-bottom: 5px;
      margin-top: -10px;
      position: flex;

      img {
        width: 28px;
        height: 34px;
        margin-right: 10px;
        vertical-align: middle;
        margin-left: 10px;
      }

      >span {
        position: absolute;
        left:10px;
        top: 34px;
        width: 200px;
        height: 100%;
        line-height: 34px;
        display:inline-block;
        vertical-align: middle;
      }
    }

    >p {
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 30px;
      text-align:center;
      text-indent: 10px;
    }

    .tel {
      width: 100%;
      height: 48px;
      font-size: 20px;
      margin-bottom:6px;
      >p {
        width: 100%;
        height: 24px;
        line-height: 24px;
        font-size: 20px;
      }
    }


    .qrcode {
      width: 240px;
      height: 240px;
      margin-left: 32px;
    }
    
    >span {
      display:block;
      height: 40px;
      line-height: 40px;
      font-size: 24px;
      text-indent: 20px;
    }
}  
</style>

