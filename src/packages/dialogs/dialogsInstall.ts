// @interface
import {
  MbDialogsClass,
  DefaultOptions,
  ShowOptions,
  MbDialogsObj
} from '../../../types/dialogs'

import Vue, { PluginFunction } from 'vue'
import MbDialogsVue from './dialogs.vue'

// @implement
// instance
const defaultOptions: DefaultOptions = {
  title: '提示',
  confirm: '確定',
  cancel: '取消',
  callback: null,
  slot: null,
  hideCancel: true
}
const merge = function (source: any, ...target: any[]): any {
  for (var i = 1; i < target.length; i++) {
    const mergeObj = target[i]
    for (let prop in mergeObj) {
      if (mergeObj.hasOwnProperty(prop)) {
        if (mergeObj[prop] !== undefined) {
          source[prop] = mergeObj[prop]
        }
      }
    }
  }
  return source
}
interface PromiseStack {
  resolve: Function
  reject: Function | null | undefined
}
let showingStack: MbDialogsClass[] = []
let promiseStack: PromiseStack[] = []

const setDialogsOptions = function(dialog: MbDialogsClass, options?: ShowOptions) {
  let mergeOption: DefaultOptions = defaultOptions
  if (typeof options === 'object') {
    mergeOption = merge(defaultOptions, options)
    for (let opt in mergeOption) {
      if (opt !== 'callback') {
        dialog[opt] = mergeOption[opt]
      }
    }
  }
  dialog.callback = function(action: string) {
    if (action === 'close') {
      setTimeout(function() {
        document.body.removeChild(dialog.$el)
      }, 300)
    } else if (action === 'cancel' || action === 'confirm') {
      let popDialogs: MbDialogsClass | null
      let popPromise: PromiseStack | null
      for (var i = 0; i < showingStack.length; i++) {
        popDialogs = showingStack.splice(i, 1)[0]
        popDialogs && popDialogs.close()
        if (typeof Promise !== 'undefined') {
          popPromise = promiseStack.splice(i, 1)[0]
          popPromise.resolve(action)
        }
        break
      }
    }
    if (typeof mergeOption.callback === 'function') {
      mergeOption.callback!(action)
    }
  }
}
const install: PluginFunction<any> = function (vue: typeof Vue, options?: any): void {
  const $mbDialogs: MbDialogsObj = {
    show (options?: ShowOptions): Promise<any> | void {
      const dialog = new MbDialogsVue({
        el: document.createElement('div')
      })
      document.body.appendChild(dialog.$el)
      setDialogsOptions(dialog as MbDialogsClass, options)
      showingStack.push(dialog as MbDialogsClass)
      if (typeof Promise !== 'undefined') {
        return new Promise(function(resolve, reject) {
          promiseStack.push({
            resolve,
            reject
          })
        })
      }
    },
    close (): void {
      if (showingStack.length >= 1) {
        const dialog = showingStack.pop() as MbDialogsClass
        dialog.close()
        if (typeof Promise !== 'undefined') {
          const promise = promiseStack.pop()
          promise!.resolve('close')
        }
      }
    },
    setDefault(options: ShowOptions): void {
      for (let opt in options) {
        if (Object.hasOwnProperty.call(options, opt)) {
          defaultOptions[opt] = options[opt]
        }
      }
    }
  }
  if (!Vue.prototype.$mbDialogs) {
    Vue.prototype.$mbDialogs = $mbDialogs
  }
}

export default install
