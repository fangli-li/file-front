<template>
	<el-container id="home_container">
		<el-header id="home_header" height="60px">
			<div id="header" align="center" style="line-height:60px;padding: 0 0;">
				<div style="width:1000px;margin:0 auto;">
					<div style="width: 80px;float: left;cursor: pointer" @click="goHome">
						<img src="../../assets/logo.png" style="height: 60px">
					</div>
					<div style="width: 600px;float: left;">
						<el-form ref="form" :model="searchForm" class="search_form" @submit.native.prevent>
							<el-input v-model="searchForm.keyword" style="width:450px;">
								<template #prepend>
									<el-popover placement="bottom-start" :width="395" trigger="click">
										<template #reference>
											<el-button style="background-color:#FFFFFF;">高级搜索</el-button>
										</template>
										<el-form label-position="right" label-width="120px" size="mini">
											<el-form-item label="全部检索词">
												<el-input v-model="searchForm.keyword" style="width:200px;"></el-input>
											</el-form-item>
											<el-form-item label="主题">
												<el-select v-model="searchForm.topic" placeholder="请选择主题" style="width:200px;">
													<el-option label="政治" value="政治"></el-option>
													<el-option label="经济" value="经济"></el-option>
													<el-option label="文化" value="文化"></el-option>
													<el-option label="军事" value="军事"></el-option>
												</el-select>
											</el-form-item>
											<el-form-item label="作者">
												<el-input v-model="searchForm.author" style="width:200px;"></el-input>
											</el-form-item>
											<el-form-item label="发文机关">
												<el-select v-model="searchForm.topic" placeholder="请选择发文机关" style="width:200px;">
													<el-option label="一局" value="一局"></el-option>
													<el-option label="二局" value="二局"></el-option>
													<el-option label="三局" value="三局"></el-option>
												</el-select>
											</el-form-item>
											<el-form-item label="密级">
												<el-select v-model="searchForm.level" placeholder="请选择密级" style="width:200px;">
													<el-option label="公开" value="公开"></el-option>
													<el-option label="秘密" value="秘密"></el-option>
													<el-option label="机密" value="机密"></el-option>
													<el-option label="绝密" value="绝密"></el-option>
												</el-select>
											</el-form-item>
											<el-form-item label="发文日期">
												<el-input v-model="searchForm.date" placeholder="请输入年份" style="width:200px;"></el-input>
											</el-form-item>
											<el-form-item>
												<el-button type="primary" @click="doAdvanceSearch()">搜索</el-button>
											</el-form-item>
										</el-form>

									</el-popover>
								</template>
								<template #append>
									<el-button type="primary" native-type="submit" @click="search" style="background-color: #4F6EF2;">搜索</el-button>
								</template>
							</el-input>

						</el-form>
					</div>
					<div style="width: 200px;float: right;">
						<el-dropdown trigger="click" style="cursor: pointer">
							<span class="el-dropdown-link el-icon-user-solid">
								系统管理员<i class="el-icon-caret-bottom el-icon--right"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item class="clearfix"><a @click="goMyPage">我的主页</a></el-dropdown-item>
								<el-dropdown-item class="clearfix"><a @click="goDocManage">文档管理</a></el-dropdown-item>
								<el-dropdown-item class="clearfix"><a @click="goDictManage">分词管理</a></el-dropdown-item>
								<el-dropdown-item class="clearfix">退出</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
				</div>
			</div>
		</el-header>
		<router-view :key="$route.fullPath"></router-view>
	</el-container>
</template>

<script>
	export default {
		data() {
			return {
				searchForm: {
                    keyword: '',
                    author: '',
                    topic: '',
                    dept: '',
                    level: '',
                    date: ''
				}
			}
		},
		methods: {
			search() {
			    console.log(this.searchForm.keyword)
				this.$router.push({
					path: '/searchresult',
                    query: {
						keyword: this.searchForm.keyword
					}
				});
			},
			goMyPage() {
				this.$router.push({name:'MyPage'});
			},
			goDocManage() {
				this.$router.push({name:'DocManage'});
			},
            goHome(){
			    this.$router.push({path: '/'})
			},
            goDictManage(){
			    this.$router.push({name: 'DictManage'})
			},
            doAdvanceSearch() {
                this.$router.push({
                    name: 'SearchResult',
                    params: {
                        keyword: this.searchForm.keyword,
                        topic: this.searchForm.topic,
                        author: this.searchForm.author,
                        dept: this.searchForm.dept,
                        level: this.searchForm.level,
                        date: this.searchForm.date
                    }
                });
            }
		}
	}
</script>

<style lang="less">
	.el-container {
		height: 100%;
	}

	.el-header {
		background-color: #002147;
		color: white;
	}

	.search_form {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60px;
		padding-left: 60px;

		.el-input-group__append{
			color: white;
			border: 1px solid #4F6EF2;
		}
		.el-button{
			border-radius: 0;
		}
	}
</style>
