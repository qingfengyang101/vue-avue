<template>
<div>
<el-upload
    v-show="false"
    class="avatar-uploader avatar-uploader1"
    :action="serverUrl"
    :on-success="handSuccess"
    :on-error="handError"
    :before-upload="beforeUpload">
        <i class="el-icon-plus"></i>
</el-upload>

<quillEditor 
    v-model="descStr" 
    ref="myQuillEditor" 
    :options="editorOption" 
    :disabled="dialogStatus === 'detail'"
>

</quillEditor>
</div>
</template>

<script>

import { quillEditor } from 'vue-quill-editor'

// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{'header': 1}, {'header': 2}],               // custom button values
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
  [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
  [{'direction': 'rtl'}],                         // text direction

  [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
  [{'header': [1, 2, 3, 4, 5, 6, false]}],

  [{'color': []}, {'background': []}],          // dropdown with defaults from theme
  [{'font': []}],
  [{'align': []}],
  ['link', 'image'],
  ['clean']                                         // remove formatting button
];

export default {
    name: 'quill',
    props: {
        dialogStatus: {
            type: String,
            default: ''
        },
        parentDesc: {
            type: String,
            default: ''
        }
    },
    created() {
        const { parentDesc } = this;
        this.setDesc(parentDesc)
    },
    components: {
        quillEditor
    },
    data() {
        return {
            descStr: '', // 详情
            serverUrl: '/api/admin/goods/goodsImgUpload', // 图片上传地址
            editorOption: {
                placeholder: '',
                theme: 'snow',  // or 'bubble'
                modules: {
                    toolbar: {
                        container: toolbarOptions,  // 工具栏
                        handlers: {
                            'image': function (value) {
                                if (value) {
                                    document.querySelector('.avatar-uploader1 input').click();        
                                } else {
                                    this.quill.format('image', false);
                                }
                            }
                        }
                    }
                }
            },
        }
    },
    watch: {
        descStr(to, from) {
            this.$emit('changeDesc', { desc: to })
        },
        parentDesc(to, from) {
            this.setDesc(to)
        }
    },
    methods: {

        /**
            初始化 desc 
        
        */

        setDesc(parent) {
            const { descStr } = this;

            if (descStr !== parent) {
                this.descStr = parent;
            }
        },

        // 商品详情上传--成功
        handSuccess(res, file) {
            console.log('商品详情上传')
            let quill = this.$refs.myQuillEditor.quill

            console.log(quill)

            const { data: { url } } = res;

            if (url) {
                console.log('商品详情上传')
                // 获取光标所在位置
                let length = quill.getSelection().index;
                quill.insertEmbed(length, 'image', url)

                // 调整光标到最后
                quill.setSelection(length + 1)
            }

        },
        // 商品详情上传--失败
        handError(res, file) {
            console.log('上传失败')
        },

        // 商品详情上传--在什么前
        beforeUpload(res, file) {

        }
    }
}

</script>

<style>

</style>