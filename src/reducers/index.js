import cookie from 'tiny-cookie'
import Immutable from 'immutable'

var initialState = Immutable.fromJS({ })
//这种写法是不是对性能也有提升，用对象key而不是switch
export default function(state = initialState, action) {
  // 保存触发的 Action 的 type，在 Container 的 componentWillReceiveProps 中使用
  state = state.set('actionType', action.type)
  var map = {
    UPDATE_CONTENT: () => state
        .set('content', Immutable.fromJS(action.content))
        .set('contentTags', Immutable.fromJS({
          syncTag: action.syncTag,
          syncIgnoreTag: action.syncIgnoreTag
        })),

    UPDATE_THREAD_ID: () => state.set('threadId', action.threadId),

    UPDATE_MESSAGE: () => state
        .set('message', Immutable.fromJS(action.message))
        .set('threadTags', Immutable.fromJS({
          syncTag: action.syncTag,
          syncThreadTag: action.syncThreadTag
        })),

    UPDATE_PAGINATION: () => state
        .set('pagination', Immutable.fromJS(action.message))
        .set('activeContact', Immutable.fromJS(action.activeContact))
        .set('paginationTags', Immutable.fromJS(action.paginationTags)),

    CLEAR_PAGINATION: () => state
        .set('pagination', Immutable.List())
        .set('paginationTags', Immutable.Map())
        .set('activeContact', Immutable.Map()),

    UPDATE_DELETE_ITEM: () => {
      let deleteItem = state.get('deleteItem')
      if (deleteItem.get(action.tag) === undefined) {
        deleteItem = deleteItem.set(action.tag, action.index)
      } else {
        deleteItem = deleteItem.delete(action.tag)
      }
      return state
        .set('deleteItem', deleteItem)
    },

    RESET_DELETE_ITEM: () => state.set('deleteItem', Immutable.Map()),

    SELECT_ALL_ITEM: () => {
      let deleteItem = Immutable.Map()
      state.get('message').forEach((el, index) => deleteItem = deleteItem.set(el.toJS().entry.tag, index))
      return state
        .set('deleteItem', deleteItem)
    },

    REMOVE_ITEM: () => {
      let index = state.get('deleteItem').get(action.tag),
          message = state.get('message').set(index, undefined),
          deleteItem = state.get('deleteItem').delete(action.tag)
      return state
        .set('message', message)
        .set('deleteItem', deleteItem)
    },

    UPDATE_DELETE_MESSAGE: () => {
      let deleteMessage = state.get('deleteMessage')
      if (deleteMessage.get(action.id) === undefined) {
        deleteMessage = deleteMessage.setIn([action.id, 'tag'], action.tag);
        deleteMessage = deleteMessage.setIn([action.id, 'index'], action.index);
      } else {
        deleteMessage = deleteMessage.delete(action.id)
      }
      return state
        .set('deleteMessage', deleteMessage)
    },

    RESET_DELETE_MESSAGE: () => state.set('deleteMessage', Immutable.Map()),

    SELECT_ALL_MESSAGE: () => {
      let deleteMessage = Immutable.Map()
      state.get('pagination').forEach((el, index) => {
        deleteMessage = deleteMessage.setIn([el.toJS().id, 'tag'], el.toJS().tag)
        deleteMessage = deleteMessage.setIn([el.toJS().id, 'index'], index)
      })
      return state
        .set('deleteMessage', deleteMessage)
    },

    REMOVE_MESSAGE: () => {
      let pagination, deleteMessage 
      state.get('pagination').forEach((el, index) => {
        if(el.toJS().id === action.id){
          pagination = state.get('pagination').delete(index),
          deleteMessage = state.get('deleteMessage').delete(action.id)  
        }
      })
      return state
        .set('pagination', pagination)
        .set('deleteMessage', deleteMessage)
    },

    STORE_TAG: () => state
        .setIn(['delInfo', 'delTag'], action.delTag)
        .setIn(['delInfo', 'delIndex'], action.delIndex)

  }
  if (map[action.type]) {
    return map[action.type]()
  } else {
    return state
  }
}
