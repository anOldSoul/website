<template>
  <transition-group tag="ul" :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]" name="el-list">
    <li v-for="file in files" :class="['el-upload-list__item-2', 'is-' + file.status, focusing ? 'focusing' : '']" :key="file.url" tabindex="0" @keydown.delete="!disabled && $emit('remove', file)" @focus="focusing = true" @blur="focusing = false" @click="focusing = false" style="display: inline-block;margin: 0 8px 8px 0;">
      <div class="el-upload-list__item" style="margin: 0;">
        <img class="el-upload-list__item-thumbnail" v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1" :src="file.url" alt="">
        <a class="el-upload-list__item-name" @click="handleClick(file)">
          <i class="el-icon-document"></i>{{file.name}}
        </a>
        <label class="el-upload-list__item-status-label">
          <i :class="{
          'el-icon-upload-success': true,
          'el-icon-circle-check': listType === 'text',
          'el-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
        }"></i>
        </label>
        <i class="el-icon-close" v-if="!disabled" @click="$emit('remove', file)"></i>
        <i class="el-icon-close-tip" v-if="!disabled">{{ t('el.upload.deleteTip') }}</i>
        <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
        <el-progress v-if="file.status === 'uploading'" :type="listType === 'picture-card' ? 'circle' : 'line'" :stroke-width="listType === 'picture-card' ? 6 : 2" :percentage="parsePercentage(file.percentage)">
        </el-progress>
        <span class="el-upload-list__item-actions" v-if="listType === 'picture-card'">
          <span class="el-upload-list__item-preview" v-if="handlePreview && listType === 'picture-card'" @click="handlePreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="$emit('remove', file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <div class="upload-custom" v-if="handleCustom">
        <el-popover placement="bottom" width="220" trigger="click">
          <div>
            <el-button type="text" @click="handleCustom(file, 'passport')">识别护照号</el-button>
            <el-button type="text" @click="handleCustom(file, 'idCard-1')">识别身份证-正面</el-button>
          </div>
          <div>
            <el-button type="text" @click="handleCustom(file, 'bankCard')">识别银行卡</el-button>
            <el-button type="text" @click="handleCustom(file, 'idCard-2')">识别身份证-背面</el-button>
          </div>
          <el-button type="text" slot="reference">识别</el-button>
        </el-popover>
      </div>
    </li>
  </transition-group>
</template>
<script>
import Locale from 'element-ui/src/mixins/locale'
import ElProgress from 'element-ui/packages/progress'

export default {
  mixins: [Locale],

  data () {
    return {
      focusing: false
    }
  },
  components: { ElProgress },

  props: {
    files: {
      type: Array,
      default () {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handlePreview: Function,
    handleCustom: Function,
    listType: String
  },
  methods: {
    parsePercentage (val) {
      return parseInt(val, 10)
    },
    handleClick (file) {
      this.handlePreview && this.handlePreview(file)
    }
  }
}
</script>
