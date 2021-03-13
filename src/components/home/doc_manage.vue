<template>
	<div style="width: 1200px;height: auto;margin: 0 auto;">
		<el-form class="searchForm" :inline="true" :model="searchParams" size="small" style="margin-top: 24px">
			<el-row>
				<el-col :span="6">
					<el-form-item label="主题">
						<el-select v-model="searchParams.topic" placeholder="主题">
							<el-option
									v-for="item in topicList"
									:key="item"
									:label="item"
									:value="item">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="作者">
						<el-input v-model="searchParams.author" placeholder="作者"></el-input>
					</el-form-item>
				</el-col>
				<template v-if="toggleSearchStatus">
					<el-col :span="6">
						<el-form-item label="密级">
							<el-select v-model="searchParams.level" placeholder="密级">
								<el-option
									v-for="item in levelList"
									:key="item"
									:label="item"
									:value="item">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<!--<el-col :span="6">-->
						<!--<el-form-item label="发文日期">-->
							<!--<el-input v-model="searchParams.user" placeholder="发文日期"></el-input>-->
						<!--</el-form-item>-->
					<!--</el-col>-->
				</template>
				<el-col :span="6">
					<el-form-item>
						<el-button type="primary" @click="searchData">查询</el-button>
						<el-button type="primary" @click="toggleSearchStatus = !toggleSearchStatus" style="margin-left: 8px">
						{{ toggleSearchStatus ? '收起' : '展开' }}
						<el-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
						</el-button>
					</el-form-item>
				</el-col>
			</el-row>

		</el-form>
		<div style="height: 30px;">
			<div style="float: left;line-height: 30px;">
				<el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="dialogVisible = true">新建</el-button>
			</div>
		</div>

		<div style="margin-top: 15px;">
			<el-table :data="tableData" stripe border size="small" v-loading="loading">
				<el-table-column
						label="#"
						type="index"
						width="40"
						align="center">
					<template slot-scope="scope">
						<span>{{(pageObj.pages - 1) * pageObj.pageSize + scope.$index + 1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="filename" label="文件名称"></el-table-column>
				<el-table-column prop="topic" label="主题" width="80"></el-table-column>
				<el-table-column prop="author" label="作者" width="100"></el-table-column>
				<el-table-column prop="level" label="密级" width="80"></el-table-column>
				<el-table-column prop="date" label="发文日期" width="100"></el-table-column>
				<el-table-column prop="oper" label="操作" width="180">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="downloadFile(scope.row.id, scope.row.filename)">下载</el-button>
						<el-popconfirm
								style="margin-left: 12px"
								icon-color="red"
								title="确定要删除该文件吗？"
								confirm-button-type="danger"
								@confirm="deleteFile(scope.row.id)">
							<el-button slot="reference" type="text" size="small" style="color: red">删除</el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div id="pagination">
			<el-pagination
					@current-change="currentChange"
					background
					:total="pageObj.total"
					layout="total, prev, pager, next"
					:page-size="pageObj.pageSize"></el-pagination>
		</div>

		<el-dialog width="40%" title="新建" :visible.sync="dialogVisible" :before-close="addDiolagClose">
			<div style="width: 500px;margin: 0 auto" v-loading="fileUploadLoading">
				<el-form ref="docForm" :model="docForm" label-width="80px" size="small" :rules="docFormRules">
					<el-form-item label="标题" prop="title">
						<el-input v-model="docForm.title"></el-input>
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
						<el-select v-model="docForm.department" placeholder="密级">
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
					<el-form-item label="附件">
						<el-upload
								class="upload-demo"
								action="#"
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
	</div>
</template>

<script>
	export default {
		data() {
			return {
				searchWord: '',
				dialogVisible: false,
				docForm: {
				    title: '',
					topic: '',
					level: '',
                    department: '',
					date: ''
				},
				tableData: [],
                pageObj: {
                    total: 0,
                    pages: 1,
                    pageSize: 10
                },
                fileList: [],
                file: {},
				searchParams: {},
                toggleSearchStatus: false,
                loading: false,
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
		mounted(){
		    this.searchData(1)
		},
		methods: {
            searchData(arg) {
                this.loading = true
                if(arg === 1){
                    this.pageObj.pages = 1
                }
                let params = Object.assign(this.searchParams, {
                    from: (this.pageObj.pages - 1) * this.pageObj.pageSize,
                    pageSize: this.pageObj.pageSize
				})
                this.$axios.get('/api/list', {
                    params: params
                }).then(response => {
                    console.log(response)
                    let res = response.data; //获取请求到的数据中的data，即json的内容
                    var total = res.total; //获取json中的data数组
                    this.pageObj.total = res.total;
                    this.tableData = res.data;
                    this.loading = false
                });
            },
            currentChange(val){
                this.pageObj.pages = val
                this.searchData()
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
                            // formData.append('topic', this.docForm.topic);
                            // formData.append('level', this.docForm.level);
                            // formData.append('title', this.docForm.title)
                            // formData.append('department', this.docForm.department)
                            // formData.append('date', this.docForm.date)
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
                                that.searchData(1)
                                that.fileUploadLoading = false
							}, 1000)
                        }).catch(res => {
                            that.$message.error('上传失败')
                            that.addDiolagClose()
                        }).finally(() => {

						})
					}
				})
			},
            addPredictFile(file){
                console.log(file)
			},
            downloadFile(id, fileName){
                this.loading = true
                this.$axios({
                    method: 'get',
                    url: '/api/download/' + id,
                    responseType: 'blob'
                }).then(res => {
                    console.log(res)
                    let url = window.URL.createObjectURL(new Blob([res.data]))
                    let link = document.createElement('a')
                    link.style.display = 'none'
                    link.href = url
                    link.setAttribute('download', fileName)
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link); //下载完成移除元素
                    window.URL.revokeObjectURL(url); //释放掉blob对象
                    this.loading = false
                })
            },
            deleteFile(id){
                this.loading = true
                this.$axios.delete('/api/delete/' + id).then(res => {
				    this.$message.success('删除成功')
				    this.searchData()
				})
			}
		}
	}
</script>

<style lang="less">
	.searchForm{
		.el-form-item{
			width: 100%;
		}
		.el-form-item__content{
			width: calc(100% - 70px);
		}
	}
	.el-popconfirm__main{
		margin: 12px 0;
	}
</style>
