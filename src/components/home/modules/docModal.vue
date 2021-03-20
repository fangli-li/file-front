<template>
    <el-dialog width="40%" :title="title" :visible.sync="dialogVisible" :before-close="addDiolagClose">
        <div style="max-width: 500px;margin: 0 auto" v-loading="fileUploadLoading">
            <el-form ref="docForm" :model="docForm" label-width="80px" size="small" :rules="docFormRules">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="docForm.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item label="主题" prop="topic">
                    <el-select v-model="docForm.topic" placeholder="主题">
                        <el-option
                                v-for="item in topicList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发文机关" prop="department">
                    <el-select v-model="docForm.department" placeholder="发文机关">
                        <el-option
                                v-for="item in unitList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发文日期" prop="date">
                    <el-date-picker
                            v-model="docForm.date"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="timestamp"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="密级" prop="level">
                    <el-select v-model="docForm.level" placeholder="密级">
                        <el-option
                                v-for="item in levelList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="附件" v-if="title === '新建'">
                    <el-upload
                            class="upload-demo"
                            action="#"
                            multiple
                            :http-request="addPredictFile"
                            accept=".dox,.docx,.pdf"
                            :on-change="fileChange"
                            :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传doc/docx/pdf文件</div>
                    </el-upload>
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
    import Moment from 'moment'
    export default {
        name: "docModal",
        data(){
            return{
                title: '',
                dialogVisible: false,
                docForm: {
                    title: '',
                    topic: '',
                    level: '',
                    department: '',
                    date: ''
                },
                fileList: [],
                levelList: ['公开', '秘密', '机密', '绝密'],
                topicList: ['政治','经济','文化','军事'],
                unitList: ['一局', '二局', '三局'],
                fileUploadLoading: false,
                docFormRules: {
                    title: [{required: true, message: '请输入标题', trigger: 'blur'}],
                    topic: [{required: true, message: '请选择主题', trigger: 'blur'}],
                    level: [{required: true, message: '请选择密级', trigger: 'blur'}],
                    department: [{required: true, message: '请选择发文机关', trigger: 'blur'}],
                    date: [{required: true, message: '请选择日期', trigger: 'blur'}]
                }
            }
        },
        methods:{
            showAdd(){
                this.title = '新建'
                this.dialogVisible = true
            },
            showEdit(row){
                this.title = '编辑'
                this.docForm = {
                    id: row.id,
                    title: row.title,
                    topic: row.topic,
                    level: row.level,
                    department: row.department,
                    date: Moment(row.date).unix() * 1000
                }
                this.dialogVisible = true
            },
            addDiolagClose(){
                this.dialogVisible = false
                this.docForm = {
                    title: '',
                    topic: '',
                    level: '',
                    department: '',
                    date: ''
                }
                this.fileList = []
                this.file = {}
            },
            fileChange(file, fileList){
                console.log(file, fileList)
                this.fileList = fileList
            },
            submitForm(){
                if(this.title === '新建')
                    this.submitAddForm()
                else
                    this.submitEditForm()
            },
            submitAddForm(){
                let that = this, missionList = []
                this.$refs.docForm.validate((val) => {
                    if (val) {
                        if(this.fileList.length === 0){
                            this.$message.error('请上传文件')
                            return;
                        }
                        this.fileUploadLoading = true
                        for(let i in this.fileList){
                            let formData = new FormData()
                            formData.append('file',this.fileList[i].raw);
                            for(let key in this.docForm){
                                formData.append(key, this.docForm[key])
                            }
                            let p = new Promise((resolve, reject) => {
                                this.$axios.post('/api/uploadFile', formData).then(res => {
                                    if(res.status === 200){
                                        resolve(res)
                                    } else {
                                        reject(res)
                                    }
                                })
                            })
                            missionList.push(p)
                        }
                        Promise.all(missionList).then(res => {
                            that.$message.success('上传成功')
                            setTimeout(() => {
                                that.addDiolagClose()
                                that.$emit('ok')
                                that.fileUploadLoading = false
                            }, 1000)
                        }).catch(res => {
                            that.$message.error('上传失败')
                            that.addDiolagClose()
                        })
                    }
                })
            },
            submitEditForm(){
                console.log('编辑')
                let that = this
                this.$refs.docForm.validate((val) => {
                    if (val) {
                        this.fileUploadLoading = true
                        let url = '/api/update?'
                        for(let [key, value] of Object.entries(that.docForm)){
                            console.log(key, value)
                            url = url + key + '=' + value + '&'
                        }
                        this.$axios.put(url).then(res => {
                            console.log(res)
                            this.fileUploadLoading = false
                            that.$message.success('修改成功')
                            that.addDiolagClose()
                            that.$emit('ok')
                        })
                    }
                })
            },
            addPredictFile(file){
                console.log(file)
            },
        }
    }
</script>

<style scoped>

</style>