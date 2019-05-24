<template>
  <div>
    <el-upload action="https://up.qbox.me/" :before-upload='beforeUpload' :data="uploadParams" :on-success='handleUploaded' ref="upload" style="display:none">
      <el-button size="small" type="primary" ref="imgInput" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="插入中,请稍候">点击上传</el-button>
    </el-upload>
    <quill-editor v-model="content" ref="quillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)" @change="onEditorChange($event)" :style="{height: height}">
    </quill-editor>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// import Quill from 'quill'
import { quillEditor, Quill } from 'vue-quill-editor'
var Link = Quill.import('formats/link')
class FileBlot extends Link {  // 继承Link Blot
  static create (value) {
    let node
    if (value && !value.href) {  // 适应原本的Link Blot
      node = super.create(value)
    } else {  // 自定义Link Blot
      node = super.create(value.href)
      // node.setAttribute('download', value.innerText);  // 左键点击即下载
      node.innerText = value.innerText
      node.download = value.innerText
    }
    return node
  }
}
FileBlot.blotName = 'link'
FileBlot.tagName = 'A'
Quill.register(FileBlot)
export default {
  name: 'edito',
  components: { quillEditor },
  props: {
    tokenData: {
      type: Object,
      required: true
    },
    uuid: [String, Number],
    content: {
      type: String,
      default: () => {
        return ''
      }
    },
    height: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data () {
    return {
      fullscreenLoading: false,
      form: {},
      editorOption: {
        modules: {
          toolbar: {
            container: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }, 'clean'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }, { 'indent': '-1' }, { 'indent': '+1' }],
              ['blockquote'],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              ['link', 'image', 'video', 'upload']
            ],
            handlers: {
              'upload': (value) => {
                if (value) {
                  this.addRange = this.editor.selection.savedRange
                  if (value) {
                    let fileInput = this.$refs.imgInput.$el
                    fileInput.click()
                  }
                  this.uploadType = 'upload'
                }
              }
            }
          },
          syntax: {
            highlight: text => window.ljs.highlightAuto(text).value
          }
        }
      },
      uploadType: ''
    }
  },
  computed: {
    uploadParams () {
      return { token: this.tokenData.token }
    },
    imgBaseUrl () {
      return this.tokenData.baseUrl || ''
    },
    editor () {
      return this.$refs.quillEditor.quill
    }
  },
  created () { },
  methods: {
    onEditorBlur (quill) {
      this.$emit('onBlur', quill, this.uuid)
    },
    onEditorFocus (quill) {
      this.$emit('onFocusr', quill, this.uuid)
    },
    onEditorReady (quill) {
      this.$emit('onReady', quill, this.uuid)
    },
    onEditorChange ({ quill, html, text }) {
      this.$emit('onChange', quill, html, text, this.uuid)
    },
    imgHandler (state) {
      this.addRange = this.editor.getSelection()
      if (state) {
        let fileInput = this.$refs.imgInput.$el
        fileInput.click()
      }
      this.uploadType = 'image'
    },
    beforeUpload (file) {
      if (!this.uploadParams.token) {
        this.$message.error('上传token缺失！')
        return false
      }
      return true
    },
    handleUploaded (response, file, fileList) {
      let url = this.imgBaseUrl + '' + response.key
      if (this.uploadType === 'upload') {
        let length = this.addRange !== null ? this.addRange.index : 0
        this.editor.insertEmbed(length, 'link', { href: url, innerText: file.name }, 'api')
      } else {
        this.editor.insertEmbed(this.addRange !== null ? this.addRange.index : 0, this.uploadType, url, Quill.sources.USER)
      }
    },
    videoHandler (state) {
      this.addRange = this.editor.getSelection()
      console.log(this.addRange)
      if (state) {
        let fileInput = this.$refs.imgInput.$el
        fileInput.click()
      }
      this.uploadType = 'video'
    },
    uploadHandler (state) {
      this.addRange = this.editor.selection.savedRange
      if (state) {
        let fileInput = this.$refs.imgInput.$el
        fileInput.click()
      }
      this.uploadType = 'upload'
    }
  },
  mounted () {
    this.editor.getModule('toolbar').addHandler('image', this.imgHandler)
    this.editor.getModule('toolbar').addHandler('video', this.videoHandler)
  }
}
</script>
<style>
.quill-editor {
  height: 645px;
  line-height: 1;
  margin-bottom: 0;
}
.quill-editor .ql-container {
  /* height: 580px; */
  height: calc(100% - 90px);
}
.limit {
  height: 30px;
  border: 1px solid #ccc;
  line-height: 30px;
  text-align: right;
}
.limit span {
  color: #ee2a7b;
}
.ql-snow .ql-editor img {
  max-width: 480px;
}

.ql-editor .ql-video {
  max-width: 480px;
}
.ql-snow.ql-toolbar .ql-upload {
  font-family: element-icons !important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.ql-snow.ql-toolbar .ql-upload:before {
  content: "\E60D";
}
</style>
