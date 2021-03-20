<template>
	<div style="width: 1200px;height: auto;margin: 0 auto;max-width: 90%">
		<h1>文献管理</h1>
		<el-form class="searchForm" :inline="true" :model="searchParams" size="small" style="margin-top: 24px">
			<el-row>
				<el-col :xl="6" :ls="6" :md="6" :sm="12" :xs="24">
					<el-form-item label="主题">
						<el-select v-model="searchParams.topic" placeholder="主题" clearable>
							<el-option
									v-for="item in topicList"
									:key="item"
									:label="item"
									:value="item">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :xl="6" :ls="6" :md="6" :sm="12" :xs="24">
					<el-form-item label="作者">
						<el-input v-model="searchParams.author" placeholder="作者" clearable></el-input>
					</el-form-item>
				</el-col>
				<template v-if="toggleSearchStatus">
					<el-col :xl="6" :ls="6" :md="6" :sm="12" :xs="24">
						<el-form-item label="密级">
							<el-select v-model="searchParams.level" placeholder="密级" clearable>
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
				<el-col :xl="6" :ls="6" :md="6" :sm="12" :xs="24">
					<el-form-item>
						<el-button type="primary" @click="searchData">查询</el-button>
						<el-button type="primary" @click="resetData">重置</el-button>
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
				<el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="showAdd">新建</el-button>
				<el-button type="primary" size="mini" @click="showFileAllImport">批量导入</el-button>
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
				<el-table-column prop="title" label="标题"></el-table-column>
				<!--<el-table-column prop="filename" label="文件名称"></el-table-column>-->
				<el-table-column prop="topic" label="主题" width="80"></el-table-column>
				<el-table-column prop="author" label="作者" width="100"></el-table-column>
				<el-table-column prop="department" label="发文机关" width="100"></el-table-column>
				<el-table-column prop="level" label="密级" width="80"></el-table-column>
				<el-table-column prop="date" label="发文日期" width="100"></el-table-column>
				<el-table-column prop="oper" label="操作" width="180">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="showEdit(scope.row)">编辑</el-button>
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

		<doc-modal ref="docModal" @ok="searchData(1)"></doc-modal>
		<file-import-modal ref="fileImportModal" @ok="searchData(1)"></file-import-modal>
	</div>
</template>

<script>
	import docModal from './modules/docModal'
	import fileImportModal from './modules/fileImportModal'
	export default {
	    components: {
            docModal,
            fileImportModal
		},
		data() {
			return {
				searchWord: '',
				tableData: [],
                pageObj: {
                    total: 0,
                    pages: 1,
                    pageSize: 10
                },
				searchParams: {},
                toggleSearchStatus: false,
                loading: false,
                levelList: ['公开', '秘密', '机密', '绝密'],
				topicList: ['政治','经济','文化','军事'],
				unitList: ['一局', '二局', '三局'],
			}
		},
		mounted(){
		    this.searchData(1)
		},
		methods: {
            showAdd(){
                this.$refs.docModal.showAdd()
			},
            showEdit(row){
                this.$refs.docModal.showEdit(row)
			},
            showFileAllImport(){
                this.$refs.fileImportModal.show()
			},
            resetData() {
                this.searchParams = {}
                this.searchData(1)
			},
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
		.el-select{
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
