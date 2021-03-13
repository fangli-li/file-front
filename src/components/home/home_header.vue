<template>
	<div id="header" align="center" style="line-height:60px;padding: 0 0;">
		<div style="width:1000px;margin:0 auto;">
			<div style="width: 600px;float: left;">
				<el-form ref="form" :model="searchForm">
					<el-input v-model="searchForm.keyword" style="width:350px;"></el-input>
					<el-button type="primary" @click="search" style="background-color: #4F6EF2;">搜索</el-button>
					
				</el-form>
			</div>
			<div style="width: 200px;float: right;">
				<el-dropdown trigger="click">
					<span class="el-dropdown-link el-icon-user-solid">
						系统管理员<i class="el-icon-caret-bottom el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item class="clearfix"><a>我的主页</a></el-dropdown-item>
						<el-dropdown-item class="clearfix">退出</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				searchForm: {
					keyword: ""
				},
				pageObj: {
					total: 0,
					pages: 1,
					pageSize: 10
				}
			}
		},
		methods: {
			search() {
				this.$router.push("/home/searchresult");
				/*
				this.$axios.get('/search', {
					params: {
						keyword: this.searchForm.keyword,
						from: this.pageObj.pages,
						pageSize: this.pageObj.pageSize
					}
				}).then(response => {
					let res = response.data; //获取请求到的数据中的data，即json的内容
					var total = res.total; //获取json中的data数组
					this.pageObj.total = res.total;
					//document.getElementById("result_total").innerText = "共找到" + total + "条相关记录";
					if (total == 0) {
						return;
					}
				});
				*/
			}
		}
	}
</script>

<style>
</style>
