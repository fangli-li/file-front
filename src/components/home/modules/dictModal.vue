<template>
    <el-dialog width="40%" :title="title" :visible.sync="dialogVisible" :before-close="addDiolagClose">
        <div style="max-width:500px;margin: 0 auto" v-loading="loading">
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
                    <el-input type="textarea" :rows="3" v-model="dictForm.words"></el-input>
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
                loading: false,
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
                    words: row.list.replace(/,/g, ' ')
                }
                this.oldSynonym = row.list
                this.dialogVisible = true
            },
            addDiolagClose(){
                this.dialogVisible = false
            },
            submitForm(){
                if(this.dictForm.type === '近义词'){
                    if(this.title === '新建')
                        this.simAdd()
                    else this.simEdit()
                } else if(this.dictForm.type === '关联词'){
                    if(this.title === '新建')
                        this.corAdd()
                    else this.corEdit()
                }
            },
            corAdd(){
                this.loading = true
                this.$axios.post('/api/correlation', {
                    correlation: this.dictForm.words.replace(/ /g, ',')
                }).then(res => {
                    console.log(res)
                    this.loading = false
                    this.$message.success('添加成功')
                    this.$emit('ok')
                    this.addDiolagClose()
                })
            },
            corEdit(){
                if(this.oldSynonym === this.dictForm.words.replace(/ /g, ',')){
                    this.$message.success('编辑成功')
                    this.$emit('ok')
                    this.addDiolagClose()
                }
                this.loading = true
                this.$axios.put('/api/correlation', {
                    oldCorrelation: this.oldSynonym,
                    newCorrelation: this.dictForm.words.replace(/ /g, ','),
                }).then(res => {
                    console.log(res)
                    this.loading = false
                    this.$message.success('编辑成功')
                    this.$emit('ok')
                    this.addDiolagClose()
                })
            },
            submitEditForm(){
                console.log('编辑')
            },
            simAdd(){
                this.loading = true
                this.$axios.post('/api/synonym', {
                    synonym: this.dictForm.words.replace(/ /g, ',')
                }).then(res => {
                    console.log(res)
                    this.loading = false
                    this.$message.success('添加成功')
                    this.$emit('ok')
                    this.addDiolagClose()
                })
            },
            simEdit(){
                if(this.oldSynonym === this.dictForm.words.replace(/ /g, ',')){
                    this.$message.success('编辑成功')
                    this.$emit('ok')
                    this.addDiolagClose()
                }
                this.loading = true
                this.$axios.put('/api/synonym', {
                    oldSynonym: this.oldSynonym,
                    newSynonym: this.dictForm.words.replace(/ /g, ','),
                }).then(res => {
                    console.log(res)
                    this.loading = false
                    this.$message.success('编辑成功')
                    this.$emit('ok')
                    this.addDiolagClose()
                })
            }
        }
    }
</script>

<style scoped>

</style>