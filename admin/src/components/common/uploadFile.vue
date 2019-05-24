<template>
  <div>
    <el-upload :action="action" class="upload" :class="{'disabled-upload-list':disabled}" :disabled="disabled" :data="uploadParams" :before-upload="beforeAvatarUpload" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleUploaded" :file-list="fileArray">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>
<script>
export default {
  name: 'upload-file',
  props: {
    fileList: {
      type: Array,
      required: true
    },
    params: {
      type: Object,
      required: false
    },
    tokenData: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: 'https://up.qbox.me/'
    }
  },
  data () {
    return {
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  computed: {
    uploadParams () {
      return this.params || { token: this.tokenData.token }
    },
    fileBaseUrl () {
      return this.tokenData.baseUrl || ''
    },
    fileArray () {
      return this.fileList.map(item => {
        return { url: item.url, name: item.name }
      })
    }
  },
  created () {
  },
  methods: {
    beforeAvatarUpload (file) {
      if (!this.uploadParams.token && !this.params) {
        this.$message.error('上传token缺失！')
        return false
      }
      return true
    },
    handleRemove (file, fileList) {
      setTimeout(() => {
        this.fileList.forEach((item, index) => {
          if (item.url === file.url.split('?')[0]) {
            this.fileList.splice(index, 1)
          }
        })
      }, 100)
    },
    handlePictureCardPreview (file) {
      if (this.params) {
        return
      }
      window.open(file.url)
    },
    handleUploaded (response, file, fileList) {
      if (this.params && response.metadata.err) {
        this.$message.error(response.metadata.err.message)
        this.fileList = this.fileList.filter((item, index) => {
          return item.url !== file.url
        })
        return
      }
      let url = this.fileBaseUrl + '/' + response.key
      this.fileList.push({
        url,
        name: file.name
      })
    },
    getImg () {
      return []
    }
  }
}
</script>
<style scoped>
.upload {
  width: 360px;
}
</style>

<style>
.disabled-upload-list .el-upload-list__item:after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 99;
}
</style>
