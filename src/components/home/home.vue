<template>
	<el-container id="home_container">
		<el-header id="home_header" height="60px">
			<div id="header" align="center" style="line-height:60px;padding: 0 0;">
				<div style="width:1000px;margin:0 auto;">
					<div style="width: 100px;float: left;cursor: pointer" @click="goHome">
						<span style="font-family:微软雅黑;">档案文献管理</span>
					</div>
					<div style="width: 600px;float: left;">
						<el-form class="search_form" ref="form" :model="searchForm" @submit.native.prevent>
							<el-input
									placeholder="请输入搜索内容"
									v-model="searchForm.keyword"
									style="width:350px;">
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
					keyword: ''
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
		.el-input-group__append{
			color: white;
			border: 1px solid #4F6EF2;
		}
		.el-button{
			border-radius: 0;
		}
	}
</style>
