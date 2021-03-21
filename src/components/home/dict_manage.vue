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
                <el-table-column label="关键词列表" align="center">
                    <template slot-scope="scope">
                        <el-tag v-for="item in scope.row.list.split(',')">{{item}}</el-tag>
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
                                @confirm="deleteDict(scope.row)">
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
                tableData: [],
                pageObj: {
                    total: 0,
                    pages: 1,
                    pageSize: 10
                },
                searchParams: {},
                toggleSearchStatus: false,
                loading: false,
                typeList: ['关联词','近义词','不可分词'],
                simList: [],
                corList: [],
                resultList: []
            }
        },
        mounted(){
            this.searchData(1)
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
                let that = this
                let p1 = new Promise((resolve, reject) => {
                    this.$axios.get('/api/synonym').then(res => {
                        console.log(res)
                        that.simList = res.data.data
                        resolve()
                    });
                })
                let p2 = new Promise((resolve, reject) => {
                    this.$axios.get('/api/correlation').then(res => {
                        console.log(res)
                        that.corList = res.data.data
                        resolve()
                    });
                })
                let pList = [p1, p2]
                Promise.all(pList).then(() => {
                    that.resultList = []
                    that.pageObj.pages = 1
                    for(const item of that.simList){
                        that.resultList.push({
                            type: '近义词',
                            list: item
                        })
                    }
                    for(const item of that.corList){
                        that.resultList.push({
                            type: '关联词',
                            list: item
                        })
                    }
                    if(that.searchParams.type){
                        that.resultList = that.resultList.filter((item) => {
                            return item.type === that.searchParams.type
                        })
                    }
                    if(that.searchParams.keyWord){
                        that.resultList = that.resultList.filter((item) => {
                            console.log(item.list.indexOf(that.searchParams.keyWord) > -1)
                            return item.list.indexOf(that.searchParams.keyWord) > -1
                        })
                    }
                    that.pageObj.total = that.resultList.length
                    if(arg === 1){
                        that.tableData = that.resultList.slice(0, 10)
                    } else {
                        that.tableData = that.resultList.slice((that.pageObj.pages - 1) * 10, that.pageObj.pages * 10)
                    }
                    that.loading = false
                })
            },
            currentChange(val){
                this.pageObj.pages = val
                this.tableData = this.resultList.slice((val - 1) * 10, val * 10)
            },
            deleteDict(row){
                if(row.type === '近义词'){
                    this.deleteSim(row.list)
                } else if(row.type === '关联词') {
                    this.deleteCor(row.list)
                } else {
                    this.deleteNone(row.list)
                }
            },
            deleteSim(list){
                this.loading = true
                this.$axios.delete('/api/synonym', {
                    data: {
                        synonym: list
                    }
                }).then(res => {
                    this.$message.success('删除成功')
                    this.searchData()
                })
            },
            deleteNone(list){

            },
            deleteCor(list){
                this.loading = true
                this.$axios.delete('/api/correlation', {
                    data: {
                        correlation: list
                    }
                }).then(res => {
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