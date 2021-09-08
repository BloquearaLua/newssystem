import { combineReducers, createStore } from "redux"
import CollapsedReducer from "./reducer/CollapsedReducer"
import LoadingReducer from "./reducer/LoadingReducer"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// 左导航栏持久化处理(redux-persist)
const persistConfig = {
  key: 'persist',
  storage,
   blacklist: ['LoadingReducer'] 
}

const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})
const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer);
let persistor = persistStore(store)
export { store,persistor };