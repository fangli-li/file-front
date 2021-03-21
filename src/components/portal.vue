<template>
	<div style="height:100%;width:100%;">
		<div style="height:50px;">
			
			
		</div>
		<div style="height:100%;margin-top: 50px;">
			<div style="width:180px;margin:0 auto;margin-bottom:10px;">
				<img src="../assets/logo_portal2.png" width="200" >
			</div>
			<div style="width:600px;margin:0 auto;border:2px solid #4F6EF2;border-radius:7px">
				<el-form ref="form" :model="searchForm" class="big_search_form" @submit.native.prevent>
					<el-input v-model="searchForm.keyword" style="width:500px;">
						<template #prepend>
							<el-popover placement="bottom-start" :width="475" trigger="click">
								<template #reference>
									<el-button style="background-color:#FFFFFF;">高级搜索</el-button>
								</template>
								<el-form label-position="right" label-width="120px" size="mini">
									<el-form-item label="全部检索词">
										<el-input clearable v-model="searchForm.keyword" style="width:200px;"></el-input>
									</el-form-item>
									<el-form-item label="主题">
										<el-select clearable v-model="searchForm.topic" placeholder="请选择主题" style="width:200px;">
											<el-option label="政治" value="政治"></el-option>
											<el-option label="经济" value="经济"></el-option>
											<el-option label="文化" value="文化"></el-option>
											<el-option label="军事" value="军事"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="作者">
										<el-input clearable v-model="searchForm.author" style="width:200px;"></el-input>
									</el-form-item>
									<el-form-item label="发文机关">
										<el-select clearable v-model="searchForm.department" placeholder="请选择发文机关" style="width:200px;">
											<el-option label="一局" value="一局"></el-option>
											<el-option label="二局" value="二局"></el-option>
											<el-option label="三局" value="三局"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="密级">
										<el-select clearable v-model="searchForm.level" placeholder="请选择密级" style="width:200px;">
											<el-option label="公开" value="公开"></el-option>
											<el-option label="秘密" value="秘密"></el-option>
											<el-option label="机密" value="机密"></el-option>
											<el-option label="绝密" value="绝密"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="发文日期">
										<el-input clearable v-model="searchForm.date" placeholder="请输入年份" style="width:200px;"></el-input>
									</el-form-item>
									<el-form-item>
									    <el-button type="primary" @click="doAdvanceSearch">搜索</el-button>
									</el-form-item>
								</el-form>
			
							</el-popover>
						</template>
						<template #append>

						</template>
					</el-input>
					<el-button type="primary" native-type="submit" @click="search" style="background-color:#4F6EF2;width:100px;border-radius: 0 6px 6px 0">搜索</el-button>
			
				</el-form>
			</div>
		</div>
		<div style="margin:0 auto;width:600px;margin-top: 100px;">
			<el-row :gutter="30">
			  <el-col :span="8">
			    <el-card class="box-card" shadow="always" style="height:80px;text-align: center;">
					<el-link type="primary" class="el-icon-document" style="font-size: larger;line-height:40px;">文档统计</el-link>
			    </el-card>
			  </el-col>
			  <el-col :span="8">
			    <el-card class="box-card" shadow="always" style="height:80px;text-align: center;">
			      <el-link type="primary" class="el-icon-info" style="font-size: larger;line-height:40px;">敬请期待</el-link>
			    </el-card>
			  </el-col>
			  <el-col :span="8">
			    <el-card class="box-card" shadow="always" style="height:80px;text-align: center;">
			      <el-link type="primary" class="el-icon-info" style="font-size: larger;line-height:40px;">敬请期待</el-link>
			    </el-card>
			  </el-col>
			</el-row>
			
		</div>
	</div>
	
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
				this.$router.push({
                    path: '/searchresult',
					query: {
						keyword: this.searchForm.keyword
					}
				});
			},
			doAdvanceSearch() {
                this.$router.push({
                    path: '/searchresult',
                    query: {
                        keyword: this.searchForm.keyword,
                        topic: this.searchForm.topic,
                        author: this.searchForm.author,
                        department: this.searchForm.department,
                        level: this.searchForm.level,
                        date: this.searchForm.date
                    }
                });
			}
		}
	}
</script>

<style lang="less">
	.big_search_form {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40px;

		.el-input-group__append{
			color: white;
			border: 1px solid #4F6EF2;
		}
		.el-button{
			border-radius: 0;
		}
	}
</style>
