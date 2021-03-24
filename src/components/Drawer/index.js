import {ref, computed, watchEffect} from 'vue'
import Localstorage from 'localstorage'
import linkifyHtml from 'linkifyjs/html'
import {getjiraIdText} from '../jira'

export const jiraIdText = ref('')

export const jiraLocalStorage = new Localstorage('JIRA')

export const drawerVisible = ref(false)
export const showDrawer = ({isGlobal}) => {
  jiraIdText.value = isGlobal ? '' : getjiraIdText()
  getTableDataFromLocalStorage()
  drawerVisible.value = true
}
export const closeDrawer = () => {
  drawerVisible.value = false
}

export const detailDrawerVisible = ref(false)
export const showDetailDrawer = () => {
  detailDrawerVisible.value = true
}
export const closeDetailDrawer= () => {
  detailDrawerVisible.value = false
}

export const textarea = ref('')

export const setTextArea = (event) => {
  textarea.value = event.target.value
}

export const isAddToListButtonDisabled = computed(()=> {
  return textarea.value.trim() === ''
})

export const drawerTitle = computed(() => {
  return jiraIdText.value ? `Jira: ${jiraIdText.value}` : '备忘录'
})

export const tableData = ref([])

export const setTableData = (value) => {
  tableData.value = value
}

export const addToList = () => {
  const time = new Date().valueOf()
  const text = textarea.value.trim()
  tableData.value.push({
    text,
    updateTime: time,
    id: time
  })
  jiraLocalStorage.put(jiraIdText.value, tableData.value)
  textarea.value = ''
}

export const deleteItem = (id) => {
  tableData.value = tableData.value.filter(item => item.id !== id)
  jiraLocalStorage.put(jiraIdText.value, tableData.value)
}

export const getTableDataFromLocalStorage = () => {
  const [error, value] = jiraLocalStorage.get(jiraIdText.value)
  if(value === undefined){
    setTableData([])
    return
  }
  let data =
    value instanceof Array
      ? value
      : [
        {
          text: value,
        },
      ]
  data.forEach((item,index) => {
    if(item.id === undefined) {
      item.id = index
    }
    if(item.updateTime === undefined) {
      item.updateTime = 0
    }
  })
  setTableData(data)
}

export const detailInfo = ref({})

export const detailInfoHTMLText = computed(() => {
  if(detailInfo.value.text === undefined){
    return ''
  }
  return linkifyHtml(detailInfo.value.text, {
    target: {
      url: '_blank'
    }
  })
})

export const goToDetail = (id) => {
  detailInfo.value = tableData.value.find(item => item.id === id)
  showDetailDrawer()
}