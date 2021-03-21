<template>
    <el-dialog width="40%" :title="title" :visible.sync="dialogVisible" :before-close="addDiolagClose">
        <div style="max-width:500px;margin: 0 auto" v-loading="fileUploadLoading">
            <el-form ref="dictForm" :model="dictForm" label-width="80px" size="small" :rules="dictFormRules">
                <el-form-item label="类型" prop="type">
                    <el-select v-model="dictForm.type" placeholder="类型">
                        <el-option
                                v-for="item in typeList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        label="关键词"
                        :rules="{required: true, message: '关键词不能为空', trigger: 'blur'}">
                    <el-input type="textarea" v-model="dictForm.words"></el-input>
                </el-form-item>
            </el-form>
        </div>

        <span></span>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "dictModal",
        data(){
            return{
                title: '',
                dialogVisible: false,
                dictForm: {
                    type: '',
                    words: ''
                },
                typeList: ['关联词','近义词','不可分词'],
                fileUploadLoading: false,
                dictFormRules: {
                    type: [{required: true, message: '请输入标题', trigger: 'blur'}]
                }
            }
        },
        methods:{
            showAdd(){
                this.title = '新建'
                this.dialogVisible = true
                this.dictForm = {
                    type: '',
                    words: ''
                }
            },
            showEdit(row){
                this.title = '编辑'
                this.dictForm = {
                    type: row.type,
                    words: row.words
                }
                this.dialogVisible = true
            },
            addDiolagClose(){
                this.dialogVisible = false
            },
            submitForm(){
                if(this.title === '新建')
                    this.submitAddForm()
                else
                    this.submitEditForm()
            },
            submitEditForm(){
                console.log('编辑')
            },
            addKeyWord(){
                this.dictForm.keyWordList.push({
                    value: '',
                    key: (new Date()).valueOf()
                })
            },
            removeKeyWord(item){
                var index = this.dictForm.keyWordList.indexOf(item)
                if (index !== -1) {
                    this.dictForm.keyWordList.splice(index, 1)
                }
            }
        }
    }
</script>

<style scoped>

</style>