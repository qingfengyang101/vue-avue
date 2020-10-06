import Vue from 'vue'

const tipsObj = {
    1: '新增成功',
    2: '编辑成功',
    3: '更新成功',
    4: '删除成功',
    5: '销权成功',
    6: '授权成功',
    7: '解绑成功',
    8: '绑定成功',
    9: '发送查询设备参数成功',
    10: '发送过温保护参数成功',
    11: '设置设备IP成功',
    12: '获取成功'
}

/**
 * @desc code为0以外的处理方式
 * @params 
 * @params [String] type 提醒方式： 'notify' 'message' 'none'
 * @params [tips] tips   成功种类   1 => 新增成功     2 => 编辑成功  3 => 更新成功  4 => 删除成功   5 => 销权成功  6 => 授权成功 7 => 解绑成功 8 => 绑定成功
 */
export const filterError = function({ data: { code = 0, msg = '失败' } }, type = 'none', tips = 0) {
    return new Promise((resolve, reject) => {

        if (type === 'none') {
            resolve(true)
            return ;
        }

        if (code === 0) {
            if (tipsObj[tips]) {
                Vue.prototype['$' + type]({
                    title: '成功',
                    message: tipsObj[tips],
                    type: 'success'
                })
            }
            resolve(true)
        } else {
            Vue.prototype['$' + type]({
                title: '失败',
                message: msg,
                type: 'error'
              })
            reject(false)
        }
    })
}