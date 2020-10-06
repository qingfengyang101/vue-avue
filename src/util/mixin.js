import Vue from 'vue'

Vue.mixin({
    methods: {
        handleFilter() {
            this.listQuery.page = 1
            this.getList()
        },
        handleSizeChange(val) {
            this.listQuery.limit = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.listQuery.page = val
            this.getList()
        },
        handleSelectionChange(val){
            this.multipleSelection = val;
        }
    }
})