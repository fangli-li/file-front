<template>
    <el-dialog :visible.sync="dialogVisible" :title="title">
        <div id="wordView" v-html="wordHtml" />
    </el-dialog>
</template>

<script>
    import mammoth from "mammoth";

    export default {
        name: "fileVueModal",
        data(){
            return{
                wordHtml: '',
                dialogVisible: false,
                title: ''
            }
        },
        methods:{
            showWord(url, filename) {
                let that = this
                that.title = 'word文件预览:' + filename
                this.$axios({
                    method: 'get',
                    url: url,
                    responseType: 'arraybuffer'
                }).then(res => {
                    mammoth.convertToHtml({arrayBuffer: res.data})
                        .then(result => {
                            this.wordHtml = result.value
                        })
                        .done()
                    that.dialogVisible = true
                })
            }
        }
    }
</script>

<style scoped>
    #wordView{
        padding: 0 24px;
    }
</style>