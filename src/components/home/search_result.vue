<template>
	<el-container>
		<el-main id="main">
			<el-container style="height:100%;text-align: left;width:1200px;margin:0 auto;">
				<el-aside style="width:200px;">
					<div style="min-height: 23px;"></div>
					<!--<el-tree-->
						<!--:data="treeData"-->
						<!--@node-click="nodeClick"-->
						<!--default-expand-all-->
						<!--:props="defaultProps"></el-tree>-->
					<el-collapse v-model="activeNames" @change="handleChange" class="myCollapse">
						<el-collapse-item v-for="(item, index) in argList" :title="item.label" :name="index">
							<div style="display: flex;flex-direction: column;align-items: flex-start">
								<el-button
										style="width: 100%"
										v-for="(child, cIndex) in item.children"
										:class="child.active ? 'button-active' : ''"
										type="text"
										@click="changeSearch(child, index, cIndex)">{{child.label}}</el-button>
							</div>
						</el-collapse-item>
					</el-collapse>
				</el-aside>
				<el-main id="search_result_layout" v-loading="loading">
					<div v-if="pageObj.total == 0">
						没有查询到结果数据
					</div>
					<div v-else>
						<div id="result_list">
							<div id="toolbar">
								<span id="result_total" class="result_total">共找到{{pageObj.total}}条相关记录</span>
								<div class="sort_container">
									<el-dropdown @command="sortChange">
										<span class="el-dropdown-link" style="cursor: pointer">
										    {{sort.label}}<i class="el-icon-arrow-down el-icon--right"></i>
										</span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item command="0">按相关性</el-dropdown-item>
											<el-dropdown-item command="1">按时间倒序</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</div>
							</div>
							<div id="content_list">
								<div v-for="item in this.data.dataList" v-bind:id="item.id">
									<div id="item.id" class="result sc_default_result xpath-log">
										<div class="sc_content">
											<h3 class="t c_font">
												<el-button type="text" @click="download(item.id, item.filename)"><span style="font-size: 18px" v-html="item.title"></span></el-button>
												<div class="c_abstract"><span v-html="item.content"></span></div>
												<div class="sc_info">
                                                    <span v-html="item.filename"></span><br>
													<span v-html="item.author"></span>&nbsp;&nbsp;-&nbsp;&nbsp;
													<!--《<span v-html="item.filename"></span>》<br>-->
													<span v-html="item.type"></span>&nbsp;&nbsp;-&nbsp;&nbsp;
													<span v-html="item.department"></span>&nbsp;&nbsp;-&nbsp;&nbsp;
													<span v-html="item.level"></span>&nbsp;&nbsp;-&nbsp;&nbsp;
													<span v-html="item.date"></span>
												</div>
											</h3>
											<div class="sc_ext">
												<div class="sc_other" style="cursor: pointer">
													<a class="el-icon-download" @click="downloadFile(item.id, item.filename)">下载</a>
												</div>
											</div>
										</div>

									</div>

								</div>
							</div>
						</div>
						<div id="pagination">
							<el-pagination
									@current-change="currentChange"
									background
									layout="prev, pager, next"
									:page-size="pageObj.pageSize"
									:total="pageObj.total"></el-pagination>
						</div>

                        <file-view-modal ref="fileViewModal"></file-view-modal>
					</div>
				</el-main>
			</el-container>
		</el-main>
	</el-container>
</template>

<script>
    import fileViewModal from './modules/fileViewModal'
	export default {
        components:{
            fileViewModal
        },
		data() {
			return {
                searchParams: {
                    keyword: this.$route.query.keyword,
                    author: this.$route.query.author,
                    type: this.$route.query.type,
                    department: this.$route.query.department,
                    level: this.$route.query.level,
                    date: this.$route.query.date
                },
				pageObj: {
					total: 0,
					pages: 1,
					pageSize: 10
				},
				sort: {
				    label: '按相关性',
					value: 'correlation'
				},
				sortList: [{
                    label: '按相关性',
                    value: 'correlation'
				}, {
                    label: '按时间倒序',
                    value: 'time'
				}],
                activeNames: [0, 1, 2, 3, 4],
				collapseList: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				data: {
					dataList: []
				},
				loading: true,
                argList: []
			}
		},
		created() {
			this.searchData(1);
		},
		methods: {
			searchData(arg) {
			    this.loading = true
				if(arg === 1){
                    this.pageObj.pages = 1
				}
				let params = Object.assign(this.searchParams, {
                    from: (this.pageObj.pages - 1) * this.pageObj.pageSize,
                    pageSize: this.pageObj.pageSize,
                    sort: this.sort.value
				})
				this.$axios.get('/api/highSearch', {
					params: params
				}).then(response => {
				    console.log(response)
					let res = response.data; //获取请求到的数据中的data，即json的内容
					var total = res.total; //获取json中的data数组
					this.pageObj.total = res.total;
					this.data.dataList = res.data;
					if(this.argList.length === 0){
                        for(let key in res.agg){
                            console.log(key)
                            let obj = {
                                children: []
                            }
                            switch (key){
                                case 'department': {
                                    obj.label = '发文机关';
                                    break;
                                }
                                case 'level': {
                                    obj.label = '密级'
                                    break;
                                }
                                case 'topic': {
                                    obj.label = '主题'
                                    break;
                                }
								case 'year': {
                                    obj.label = '年份'
                                    break;
								}
								case 'type': {
                                    obj.label = '文件类型'
                                    break;
								}
                            }
                            let undi = {}
                            for(let sKey in res.agg[key]){
                                if(sKey === 'undifed' || sKey === 'undefined'){
                                    undi = {
                                        label: '其他' + '(' + res.agg[key][sKey] + ')',
                                        value: key + ':' + sKey
                                    }
								}
								else
                                obj.children.push({
                                    label: sKey + '(' + res.agg[key][sKey] + ')',
                                    value: key + ':' + sKey
                                })
                            }
                            if(undi !== {})
                            	obj.children.push(undi)
                            this.argList.push(obj)
                        }
					}
					this.loading = false
				});
			},
            currentChange(val){
			    this.pageObj.pages = val
				this.searchData()
			},
			sortChange(num){
			    console.log('xx')
			    if(this.sort !== this.sortList[num]) {
					this.sort = this.sortList[num]
					this.searchData(1)
                }
			},
            downloadFile(id, fileName){
			    this.loading = true
				fileName = fileName.replace(new RegExp('<em>', "gm"), '').replace(new RegExp('</em>', "gm"), '')
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
            download(id, filename){
			    if(filename.indexOf('pdf') > -1){
                    window.open("/api/download/" + id, "_blank")
				} else {
			        this.$refs.fileViewModal.showWord('/api/download/' + id, filename)
				}
			},
            handleChange(){

			},
            changeSearch(item, index, cIndex){
				for(const [index, value] of this.argList[index].children.entries()){
			        value.active = index === cIndex ? !value.active : false
				}
                console.log(this.argList)
                this.argList[index].value = item
				let [key, value] = item.value.split(':')
				if(this.searchParams[key] === value){
                    this.searchParams[key] = ''
				} else {
                    this.searchParams[key] = value
				}
				this.searchData(1)
			},
            // cancelLeftSearch(index){
			//     let item = this.collapseList[index].value
             //    this.collapseList[index].value = ''
             //    let [key, value] = item.value.split(':')
             //    this.searchParams[key] = ''
             //    this.searchData(1)
			// }
		}
	}
</script>

<style lang="less">
	.myCollapse{
		.el-button{
			margin: 0;
			padding: 4px 0 4px 4px;
			text-align: left;
		}
		.el-button:hover{
			background-color: #f8f8f8;
		}
		.button-active{
			background-color: #f1f1f1;
			position: relative;
		}
		.button-active:after{
			width: 7px;
			height: 18px;
			line-height: 18px;
			font-size: 8px;
			position: absolute;
			right: 4px;
			top: 2px;
			content: "x";
		}
		.el-collapse-item__content{
			padding-bottom: 4px;
		}
		.el-collapse-item__header{
			height: 36px;
			line-height: 36px;
		}
	}
	.el-container {
			height: 100%;
		}
		.el-header {
		  background-color: #002147;
		  color: white;
		}
		.el-footer {
		  background-color: #FFFFFF;
		  color: black;
		  text-align: center;
		}
		.el-aside {
		  background-color: #FFFFFF;
		  width: 400px;
		}
		.el-main {
		  background-color: FFFFFF;
		}
		#toolbar .sort_container {
		    width: 90px;
		    float: right;
		}
		.s_form_wr {
		    position: relative;
		    z-index: 297;
		    width: 643px;
		    margin-left: 192px;
		    _float: left;
		    *margin-left: 192px;
		    _margin-left: 80px;
		    text-align: left;
		}
		#head_wr.gj #head.gj .s_form_wr {
		    margin-left: 120px;
		}
		#toolbar .sortwr {
		    float: right;
		    position: relative;
		    display: inline-block;
		    *zoom: 1;
		    color: #666;
		}
		.sort_select_default {
		    float: right;
		    display: inline-block;
		    font-size: 12px;
		    width: 67px;
		    cursor: pointer;
		}
		.iconfont {
		    font-family: iconfont!important;
		    font-size: 16px;
		    font-style: normal;
		    -webkit-font-smoothing: antialiased;
		    -moz-osx-font-smoothing: grayscale;
		}
		#top_hint .sort_list, #toolbar .sort_list {
		    font-size: 12px;
		}
		.sort_list {
		    display: none;
		    border: 1px solid #dfdede;
		    position: absolute;
		    background: #fff;
		    left: 0;
		    top: 22px;
		    z-index: 20;
		    width: 94px;
		    padding: 5px 0;
		}
		em {
			font-style: normal;
			color: #d00000;
		}
		.gj {
		    height: 57px;
		    border-bottom: 0;
			background-color: #002147;
			    padding: 10px 0;
			    padding-left: calc(100vw - 100%);
			    position: fixed;
			    left: 0;
			    top: 0;
			    right: 0;
			    border-bottom: 0;
			    height: 36px;
		}
		.s_form_wr {
		    position: relative;
		}
		.s_ipt_wr {
		    position: relative;
		    overflow: hidden;
		    background: #fff;
		    width: 540px;
		    height: 34px;
		    display: inline-block;
		    margin-right: 0;
		    border: 1px solid #fff;
		    border-right-width: 0;
		    vertical-align: top;
		}
		.s_ipt_wr .gj {
		    width: 405px;
		    background: #fff;
		    height: 38px;
		    display: inline-block;
		    margin-right: 0;
		    vertical-align: top;
		    border: 0;
		    border-radius: 6px;
		}
		.s_form_wr .s_ipt_wr {
		    width: 481px;
		    border: 1px solid #ddd;
		    border-right-width: 1px;
		}
		.sc_adv_search_btn input {
		    -webkit-user-select: none;
		    -moz-user-select: none;
		    -ms-user-select: none;
		    user-select: none;
		    width: 100px;
		    height: 38px;
		    cursor: pointer;
		    color: #999;
		    background: #4F6EF2;
		    text-align: center;
		    font-family: PingFangSC-Medium;
		    font-size: 14px;
		    color: #FFF;
		    letter-spacing: 0;
		    line-height: 38px;
		    border-radius: 0 6px 6px 0;
		    display: block;
		    outline: 0;
		}
		#toolbar {
			width: 570px;
			    box-sizing: content-box;
			    color: #666;
			    font-size: 13px;
			    margin-bottom: 5px;
			    line-height: 23px;
			    min-height: 23px;
		}
		#pagination {
			margin-top: 25px;
		}
		.t {
		    font-size: 18px;
		    font-weight: 400;
		    margin-bottom: 6px;
		}
		p, form, ol, ul, li, h3, h4, th, td {
		    margin: 0;
		    margin-top: 0px;
		    margin-right: 0px;
		    margin-bottom: 0px;
		    margin-left: 0px;
		    padding: 0;
		    padding-top: 0px;
		    padding-right: 0px;
		    padding-bottom: 0px;
		    padding-left: 0px;
		    list-style: none;
		    list-style-position: initial;
		    list-style-image: initial;
		    list-style-type: none;
		}
		h3 {
		    display: block;
		    font-size: 1.17em;
		    margin-block-start: 1em;
		    margin-block-end: 1em;
		    margin-inline-start: 0px;
		    margin-inline-end: 0px;
		    font-weight: bold;
		}
		.result {
		    margin-bottom: 12px;
		    overflow: hidden;
			/*width: 570px;*/
			border-bottom: 1px solid #efefef;
		}
	
		.sc_default_result .sc_content {
		    margin-top: 5px;
		}
		.t {
		    font-size: 18px; 
		    font-weight: 400;
		    margin-bottom: 6px;
		}
		.c_font {
		    font-family: "Helvetica Neue",Helvetica,Arial,"Microsoft YaHei","微软雅黑";
		}
		.c_abstract {
		    line-height: 24px;
		}
		.c_abstract, .c_abstract a {
		    color: #666;
		}
		.sc_default_result .sc_info {
		    color: #333;
		    margin-top: 4px;
		}
		.sc_default_result .sc_ext {
		    height: 24px;
		    line-height: 24px;
		    margin: 11px 10px 20px 0;
		}
		.sc_default_result .sc_other {
		    float: left;
		    white-space: nowrap;
		    /*word-wrap: normal; */
		    text-align: right;
		}
		.sc_default_result .sc_other a {
		    display: inline-block;
		    height: 26px;
		    margin-right: 15px;
		    padding: 0 15px;
		    line-height: 27px;
		    background: #f1f1f1;
		    font-size: 12px;
		    color: #333;
		    -webkit-border-radius: 13px;
		    -moz-border-radius: 13px;
		    -ms-border-radius: 13px;
		    border-radius: 13px;
		}
</style>
