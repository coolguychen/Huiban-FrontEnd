import { createStore, combineReducers, applyMiddleware } from 'redux'
import { userLoginReducer, userRegisterReducer } from './userReducer'
import { thunk } from 'redux-thunk'; // 导入中间件


const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

const userRegisterInfoFromStorage = localStorage.getItem('userRegisterInfo')
    ? JSON.parse(localStorage.getItem('userRegisterInfo'))
    : null

const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
    userRegister: { userRegisterInfo: userRegisterInfoFromStorage },
}
const middleware = [thunk]; // 定义中间件数组，包含 thunk


const store = createStore(
    reducer,
    initialState,
    applyMiddleware(...middleware) // 应用中间件
)

export default store;