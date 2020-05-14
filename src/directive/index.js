/*
 * @Author: CaseeLee
 * @Date: 2018-12-04 9:53:09
 * @Last Modified by: CaseeLee
 * @Last Modified time: 2018-12-04 15:52:52
 */
import debounce from 'throttle-debounce/debounce';

/**
 * 全局动态添加属性指令
 * @param {*} el :指定dom
 * @param {*} binding :绑定对象
 */
export const bindingProp = function (el, binding) {
    if (!binding.value) return;
    Object.keys(binding.value).forEach(item => {
        el.setAttribute(item, binding.value[item]);
    });
};

export const ellipsis = {
    inserted (el, binding) {
        // const fontSize = 14; // 默认14
        let [...strArr] = el.innerHTML;
        const eleStyle = window.getComputedStyle(el, null);
        const lineHeight = parseInt(eleStyle.lineHeight, 10);
        const row = Math.ceil(parseInt(eleStyle.height) / lineHeight);
        const width = parseInt(eleStyle.width);
        const fontSize = parseInt(eleStyle.fontSize) || 14;
        if (row > binding.value) {
            let showLength = parseInt(width / fontSize);
            strArr.splice(showLength * binding.value - 2, strArr.length, '...');
        }
        el.innerHTML = strArr.join('');
    }
};

/***
 * 下拉模糊搜索
 * @type {number}
 */
let remoteTime = 500;
export const filter = function (el, binding) {
    let debounceFn;
    if (el.getElementsByClassName('el-input__inner')) {
        const tag = el.getElementsByClassName('el-input__inner')[0]
        tag.oninput = (e) => {
            if (!debounceFn) {
                debounceFn = debounce(remoteTime, () => {
                    const keycode = 13;
                    e.target.pressKey(keycode);
                })
            }
            debounceFn()
        }
    }
}

/**
 * 数字，包含小数点
 */
const floatNumber = {
    inserted(el, binding, vnode) {
        //获取节点
        const regSumEl = binding.value === 'dbselect' ? el.querySelectorAll('.el-input__inner')[1] : el.querySelector('.el-input__inner');

        regSumEl.addEventListener('change', (event) => {
            const {value} = event.target;
            const {exValue = ''} = event.target.dataset;
            const regExp = /^(\d+|\d+\.(\d+))?$/;

            if (!regExp.test(value)) {
                setTimeout(() => {
                    vnode.data.model.callback(exValue);
                }, 0);
            }
            //错误返回上一个正确的值
            // else{
            //     if(value) {
            //         event.target.dataset.exValue = value;
            //     }else{
            //         return;
            //     }
            // }
        })
    }
}

/**
 * 仅数字
 */
const number = {
    inserted(el, binding, vnode) {
        //获取节点
        const regSumEl = binding.value === 'dbselect' ? el.querySelectorAll('.el-input__inner')[1] : el.querySelector('.el-input__inner');

        regSumEl.addEventListener('change', (event) => {
            const {value} = event.target;
            const {exValue = ''} = event.target.dataset;
            const regExp = /^[\d]+$/;

            if (!regExp.test(value)) {
                setTimeout(() => {
                    vnode.data.model.callback(exValue);
                }, 0);
            }
            //错误返回上一个正确的值
            // else{
            //     if(value) {
            //         event.target.dataset.exValue = value;
            //     }else{
            //         return;
            //     }
            // }
        })
    }
}

export default {
    bindingProp,
    ellipsis,
    filter,
    floatNumber,
    number
};

