<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="addHouse"
             :rules="rules"
             ref="addHouseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="店长：" prop="stageMan">
        <el-input style="width: 30%" v-model="addHouse.stageMan" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="电话：" prop="stagePhone">
        <el-input style="width: 50%" v-model="addHouse.stagePhone" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="名称：" prop="stageName">
        <el-input v-model="addHouse.stageName" class="input-width"></el-input>
      </el-form-item>
      <el-form-item  label="经度：" prop="lon">
        <el-input v-model="addHouse.lon" @focus="handleOpenMapDialog" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="纬度：" prop="lat">
        <el-input v-model="addHouse.lat" @focus="handleOpenMapDialog" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="addHouse.address" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="addHouse.remark">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('addHouseFrom')">提交</el-button>

        <el-button v-if="!isEdit" @click="resetForm('addHouseFrom')">重置</el-button>
      </el-form-item>
    </el-form>

     <!-- 根据地图选点 -->
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
  </el-card>
</template>
<script>

  import { createHouse, getaddHouse, updateaddHouse } from '@/api/house/add'
  
  const defaultaddHouse = {
    stageName: null,
    stageMan: null,
    stagePhone: null,
    lon: null,
    lat: null,
    address: null,
    remark: null
  };

  export default {
    name: 'addHouseDetail',
    props: {
      id: {
        type: String,
        default: ''
      },
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const self = this
      return {
        addHouse: null,
        rules: {
          stageName: [
            {required: true, message: '请输入店铺名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          stageMan: [
            {required: true, message: '请输入店长姓名', trigger: 'blur'}
          ],
          stagePhone: [
            {required: true, message: '请输入店长联系方式', trigger: 'blur'}
          ],
          // lon: [
          //   {required: true, message: '请输入经度', trigger: 'blur'}
          // ],
          // lat: [
          //   {required: true, message: '请输入纬度', trigger: 'blur'}
          // ],
          address: [
            {required: true, message: '请输入地址', trigger: 'blur'}
          ]
        },
        mapDialogVisible: false,
        zoom: 16,
        center: [114.01669, 33.580473],
        reqPosition: {
          click(e) {
            const { lng, lat } = e.lnglat
            self.addHouse.lon = lng
            self.addHouse.lat = lat
            self.mapDialogVisible = false
          }
        }
      }
    },
    async created(){
      try {
        if (this.isEdit) {
          ({ data: { data: this.addHouse } } = await getaddHouse({ id: this.$route.query.id }))
        }else{
          this.addHouse = Object.assign({},defaultaddHouse);
        }
      }catch(err) {
        console.log(err)
      }
    },
    methods: {
      async onSubmit(formName) {

        try {

          if (!this.addHouse.lon) {
            await this.$message({ message: '请输入经纬度', type: 'error', duration:1000 });
            return
          }

          await this.$refs[formName].validate()

          if (this.isEdit) {
            await this.$confirm('是否更新数据', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
            await updateaddHouse({ ...this.addHouse, id: this.$route.query.id })
            this.$message({ message: '修改成功', type: 'success', duration:1000 });
            this.$router.back();
          } else {
            await this.$confirm('是否提交数据', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
            await createHouse(this.addHouse);
            this.$message({ message: '提交成功', type: 'success', duration:1000 });
            this.$router.replace('/house/list')
          }

        }catch(err) {
          this.$message({ message: '验证失败', type: 'error', duration:1000 });
          console.log(err)
        }



        // this.$refs[formName].validate((valid) => {
        //   if (valid) {
        //     this.$confirm('是否提交数据', '提示', {
        //       confirmButtonText: '确定',
        //       cancelButtonText: '取消',
        //       type: 'warning'
        //     }).then(() => {
        //       if (this.isEdit) {
        //         updateaddHouse(this.$route.query.id, this.addHouse).then(response => {
        //           this.$message({ message: '修改成功', type: 'success', duration:1000 });
        //           this.$router.back();
        //         });
        //       } else {
        //         createHouse(this.addHouse).then(response => {
        //           // this.$refs[formName].resetFields();
        //           //this.addHouse = Object.assign({},defaultaddHouse);
        //           this.$message({
        //             message: '提交成功',
        //             type: 'success',
        //             duration:1000
        //           });

        //           this.$router.replace('/house/list')
        //         });
        //       }
        //     });

        //   } else {
        //     this.$message({
        //       message: '验证失败',
        //       type: 'error',
        //       duration:1000
        //     });
        //     return false;
        //   }
        // });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.addHouse = Object.assign({},defaultaddHouse);
      },

      handleOpenMapDialog() {
        this.mapDialogVisible = true
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>


