import Vue from 'vue'

const  noMoreClick=Vue.directive('noMoreClick', {
        inserted(el, binding) {
            el.addEventListener('click', e => {
            el.classList.add('is-disabled');
            el.disabled = true;
            setTimeout(() => {
                el.disabled = false;
                el.classList.remove('is-disabled');
            }, 3000)
            })
        }
    })

    //文本框只能输数字
function onInput(el, ele, binding, vnode) {
    function handle() {
      // 只保留数字
      ele.value = ele.value.replace(/[^\d]/g, '')
    } 
  
    return handle
  }
  const numberInput= {
    bind(el, binding, vnode) {
      const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
      ele.addEventListener('input', onInput(el, ele, binding, vnode), false)
    },
  }
  Vue.directive('numberInput', numberInput)
export {noMoreClick,numberInput}


