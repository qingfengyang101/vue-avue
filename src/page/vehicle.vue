<template>
    <div ref="mapPosition" class="map-position"></div>
</template>
<script>
// const option = {
//     title: {
//         text: '停车统计',
//         top: 25,
//         left: 30,
//         textStyle: {
//             fontSize: 16,
//             fontWeight: '100',
//             color:'#585858'
//         }
//     },
//     backgroundColor: '#fff',
//     series : [
//         {
//             name:'访问来源',
//             type:'pie',
//             radius : [70, 130],
//             center: ['50%', '50%'],
//             hoverAnimation:true,
//             hoverOffset:10,
//             data:[
//                 { value:235, name:'24%' },
//                 { value:235, name:'16%' },
//                 { value:235, name:'8%' },
//                 { value:235, name:'20%' },
//                 { value:500, name:'32%' }
//             ].sort(function (a, b) { return a.value - b.value; }),
//             roseType: 'radius',
            
//             itemStyle: {
//                 normal: {
//                     borderWidth: 6,
//                     borderColor: '#fff'
//                 },
//                 emphasis: {
//                     borderWidth: 0,
//                     borderColor: '#fff'
//                 }
//             },
//             animationType: 'scale',
//             animationEasing: 'elasticOut',
//             animationDelay: function (idx) {
//                 return Math.random() * 200;
//             }
//         }
//     ]
// };


const dataName = ['16%', '8%', '20%', '24%', '32%'];

const dataName2 = ['16', '8', '20', '24', '32'];
const value = [16, 8, 20, 24, 32]
const dataarr = []
const dataarr2 = []
value.forEach(function(ele,index){
	
	dataarr.push({
		value:ele,
		name:dataName[index]
	})
	dataarr2.push({
		value:ele,
		name:dataName2[index]
	})
})


const option = {
    backgroundColor: '#fff',
    grid: {
        top: 70
    },
    title: {
        text: '停车统计',
        top: 25,
        left: 30,
        textStyle: {
            fontSize: 16,
            fontWeight: '100',
            color:'#585858'
        }
    },
    // legend: {
    //     orient: 'vertical',
    //     x: 'right',
    //     y:'bottom',
    //     itemWidth: 24,
    //     itemGap:15,
    //     itemHeight: 14,
    //     align: 'left',

    //     data: dataName,
    //     textStyle: {
    //         color: '#585858',
    //         fontSize: 12
    //     }
    // },
    series: [{
        name: '访问来源',
        type: 'pie',
        radius: ['30%', '65%'],
        center: ['50%', '60%'],
        color: [
            '#e59c4d',
            '#86e54d',
            '#4d8de5',
            '#a64de5',
            '#e54d6d',
        ],
        itemStyle: {
          normal: {
              borderWidth: 8,
              borderColor: '#fff'
          }  
        },
        
        labelLine: {
            normal: {
                show: true,
                length: 30,
                length2: 24
            }
        },
        data: dataarr
    },{
        name: '访问来源',
        type: 'pie',
        radius: ['30%', '74%'],
        center: ['50%', '60%'],
        color: [
            'transparent',
            'transparent',
            'transparent',
            'transparent',
            '#e54d6d'
        ],
        label: {
            normal: {
                show: false
            }
        },
        labelLine: {
            normal: {
                show: false,
            }
        },
        data: dataarr2,
        zlevel:2
    }]
};


export default {
    data() {
        return {

        }
    },
    mounted() {
        this.setOption()
    },
    methods: {
        /**
         * desc 
         */
        setOption() {
          // 基于准备好的dom，初始化echarts实例
          var myChart = this.$echarts.init(this.$refs.mapPosition);
          myChart.setOption(option);
        },
    }
}
</script>
<style lang="scss" scoped>
.map-position {
    width: 100%;
    height: 380px;
    background:#fff;
    border-radius:15px;
    overflow:hidden;
}
</style>