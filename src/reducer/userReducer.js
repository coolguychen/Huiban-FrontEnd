// reducer函数1.处理用户的登录
export const userLoginReducer = ( state ={}, action) => {
    switch (action.type) {
        case 'USER_LOGIN_REQUEST':
            return {loading: true}
        case 'USER_LOGIN_SUCCESS':
            return {loading: false, userInfo: action.payload }
        case 'USER_LOGIN_FAIL':
            return {loading: false, error: action.payload}
        case 'USER_LOGIN_OUT':
            return {}
        default:
            return state
    }
}

// reducer函数2.处理用户的注册
export const userRegisterReducer = ( state ={}, action) => {
    switch (action.type) {
        case 'USER_REGISTER_REQUEST':
            return {loading: true}
        case 'USER_REGISTER_SUCCESS':
            return {loading: false, userRegisterInfo: action.payload }
        case 'USER_REGISTER_FAIL':
            return {loading: false, error: action.payload}
        case 'USER_REGISTER_OUT':
            return {}
        default:
            return state
    }
}