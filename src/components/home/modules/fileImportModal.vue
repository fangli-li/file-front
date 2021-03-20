<template>
    <el-dialog width="40%" :visible.sync="dialogVisible" title="批量导入" :before-close="fileImportModal">
        <div style="display: flex;align-items: center;justify-content: center">
            <el-upload
                    class="upload-demo"
                    drag
                    action="/api/uploadFile"
                    multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传doc/docx/pdf文件</div>
            </el-upload>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">关闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "fileImportModal",
        data(){
            return{
                dialogVisible: false
            }
        },
        methods:{
            show(){
                this.dialogVisible = true
            },
            fileImportModal(){
                this.dialogVisible = false
                this.$emit('ok')
            }
        }
    }
</script>

<style scoped>

</style>