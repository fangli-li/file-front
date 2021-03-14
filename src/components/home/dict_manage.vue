<template>
    <div style="width: 1200px;height: auto;margin: 0 auto;max-width: 90%">
        <h1>分词管理</h1>
        <el-form class="searchForm" :inline="true" :model="searchParams" size="small" style="margin-top: 24px">
            <el-row>
                <el-col :xl="6" :ls="6" :md="6" :sm="12" :xs="24">
                    <el-form-item label="类型">
                        <el-select v-model="searchParams.type" placeholder="类型" clearable>
                            <el-option
                                    v-for="item in typeList"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xl="6" :ls="6" :md="6" :sm="12" :xs="24">
                    <el-form-item label="关键词">
                        <el-input v-model="searchParams.keyWord" placeholder="关键词" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xl="6" :ls="6" :md="6" :sm="12" :xs="24">
                    <el-form-item>
                        <el-button type="primary" @click="searchData">查询</el-button>
                        <el-button type="primary" @click="resetData">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
        <div style="height: 30px;">
            <div style="float: left;line-height: 30px;">
                <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="showAdd">新增</el-button>
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
                <el-table-column prop="filename" label="关键词列表" align="center">
                    <template slot-scope="scope">
                        <el-tag v-for="item in scope.row.keyWordList">{{item.value}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" width="100"></el-table-column>
                <el-table-column prop="oper" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showEdit(scope.row)">编辑</el-button>
                        <el-popconfirm
                                style="margin-left: 12px"
                                icon-color="red"
                                title="确定要删除该分词吗？"
                                confirm-button-type="danger"
                                @confirm="deleteDict(scope.row.id)">
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

        <dict-modal ref="dictModal" @ok="searchData(1)"></dict-modal>
    </div>
</template>

<script>
    import dictModal from './modules/dictModal'
    export default {
        name: "dict_manage",
        components: {
            dictModal,
        },
        data() {
            return {
                searchWord: '',
                tableData: [{
                    type: '近义词',
                    keyWordList: [{
                        key: '1',
                        value: '飞机'
                    },{
                        key: '2',
                        value: '飞行器'
                    },{
                        key: '3',
                        value: '战斗机'
                    },{
                        key: '4',
                        value: 'f15战斗机'
                    }]
                }],
                pageObj: {
                    total: 0,
                    pages: 1,
                    pageSize: 10
                },
                searchParams: {},
                toggleSearchStatus: false,
                loading: false,
                typeList: ['关联词','近义词','不可分词'],
            }
        },
        mounted(){
            // this.searchData(1)
        },
        methods: {
            showAdd(){
                this.$refs.dictModal.showAdd()
            },
            showEdit(row){
                this.$refs.dictModal.showEdit(row)
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
            deleteDict(id){
                this.loading = true
                this.$axios.delete('/api/delete/' + id).then(res => {
                    this.$message.success('删除成功')
                    this.searchData()
                })
            }
        }
    }
</script>

<style scoped lang="less">
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
    .el-tag +.el-tag{
        margin-left: 12px;
    }
</style>