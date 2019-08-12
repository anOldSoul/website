<template>
  <div>
    <upload-com action="https://up.qbox.me/" :class="{'disabled-upload-list':disabled}" accept="image/png,image/jpeg,image/jpg,image/gif" :data="uploadParams" :before-upload="beforeAvatarUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleUploaded" :file-list="picsArray" :on-custom="onCustom" multiple>
      <i class="el-icon-plus"></i>
    </upload-com>
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="600px" custom-class="img-preview" @open="handleOnOpen" @close="handleOnClose">
      <el-carousel v-if="dialogVisible" ref="carousel" :autoplay="false" :initial-index="initialIndex" height="560px" arrow="always" indicator-position="outside" trigger="click">
        <el-carousel-item v-for="(item, index) in imgList" :key="item">
          <div class="img-box">
            <img :src="item" alt="">
            <i class="el-icon-delete delete" v-if="!disabled" @click="handleOnDelete(item, index)" title="删除"></i>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>
<script>
import UploadCom from '../upload'
export default {
  name: 'upload-img',
  model: {
    prop: 'imgList',
    event: 'change'
  },
  components: {
    UploadCom
  },
  props: {
    imgList: {
      type: Array,
      required: true
    },
    tokenData: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    onCustom: {
      type: Function
    }
  },
  data () {
    return {
      uploadedList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      initialIndex: 0
    }
  },
  computed: {
    uploadParams () {
      return { token: this.tokenData.token }
    },
    imgBaseUrl () {
      return this.tokenData.baseUrl || ''
    },
    picsArray () {
      return this.imgList.map(item => {
        return { url: item + '?imageView2/2/w/300' }
      })
    }
  },
  created () {
  },
  methods: {
    beforeAvatarUpload (file) {
      if (!this.uploadParams.token) {
        this.$message.error('上传token缺失！')
        return false
      }
      return true
    },
    handleRemove (file, fileList) {
      let imgList = JSON.parse(JSON.stringify(this.imgList))
      this.imgList = fileList.map(item => {
        return item.url.split('?')[0]
      })
      this.$emit('change', this.imgList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url.split('?')[0]
      this.dialogVisible = true
      this.imgList.forEach((item, index) => {
        if (item === this.dialogImageUrl) {
          this.initialIndex = index
        }
      })
      this.$nextTick(_ => {
        if (this.$refs['carousel']) {
          this.$refs['carousel'].setActiveItem(this.initialIndex)
        }
      })
    },
    handleUploaded (response, file, fileList) {
      this.uploadedList.push(this.imgBaseUrl + '/' + response.key)
      if ((this.imgList.length + this.uploadedList.length) === fileList.length) {
        let list = [].concat([], this.imgList, this.uploadedList)
        this.$emit('change', list)
        this.uploadedList = []
      }
    },
    getImg () {
      return []
    },
    handleOnDelete (url, index) {
      setTimeout(() => {
        this.initialIndex = (index === (this.imgList.length - 1)) ? (index - 1) : index
        let imgList = this.imgList.filter(item => item !== url)
        this.$emit('change', imgList)
      }, 100)
    },
    setCarouselByKey (val) {
      if (val.key === 'ArrowRight') {
        this.$refs['carousel'].next()
      } else if (val.key === 'ArrowLeft') {
        this.$refs['carousel'].prev()
      }
    },
    handleOnOpen () {
      window.addEventListener('keydown', this.setCarouselByKey)
    },
    handleOnClose () {
      window.removeEventListener('keydown', this.setCarouselByKey)
    }
  }
}
</script>
<style scoped>
.disabled-upload-list >>> .el-upload-list__item .el-upload-list__item-delete,
.disabled-upload-list >>> .el-upload {
  display: none;
}
.imgUpload >>> .img-preview .el-carousel__arrow {
  background: rgba(31, 45, 61, 0.5);
}
.img-box {
  width: 560px;
  height: 560px;
  display: inline-block;
  position: relative;
}
.img-box img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.delete {
  position: absolute;
  bottom: 0;
  font-size: 30px;
  z-index: 99;
  cursor: pointer;
  left: 50%;
  transform: translate(-50%, 0);
  margin: 0 auto;
  color: #1ba19d;
}
</style>
