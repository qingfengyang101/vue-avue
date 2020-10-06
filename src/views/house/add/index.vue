<template> 
  <home-advertise-detail :isEdit="isEdit"></home-advertise-detail>
</template>
<script>
  import HomeAdvertiseDetail from './components/HomeAdvertiseDetail'
  export default {
    name: 'addHomeAdvertise',
    components: { HomeAdvertiseDetail },
    data() {
        return {
            isEdit: false
        }
    },
    created() {
        const { $route: { query: { id } } } = this;
        if (id) {
            this.isEdit = true
        }else {
            this.isEdit = false
        }
    }
  }
</script>
<style></style>


