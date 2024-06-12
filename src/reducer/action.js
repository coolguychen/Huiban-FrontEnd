import axios from "axios"

export const login = (username, password) => async (dispatch) => {
    try {
        dispatch({
            type: 'USER_LOGIN_REQUEST'
        })

        const config = {
            headers: {
                'content-Type': 'application/json'
            }
        }

        // 使用 POST 方法，除非你的 API 设计要求使用 PATCH
        const response = await axios.post(
            'http://124.220.14.106:9001/auth/login',
            { username, password },
            config
        );

        dispatch({
            type: 'USER_LOGIN_SUCCESS',
            payload: response.data,
        })
        console.log(response.data); // 打印数据部分
        localStorage.setItem('userInfo', JSON.stringify(response.data))
    } catch (error) {
        dispatch({
            type: 'USER_LOGIN_FAIL',
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        })
    }
}


// 退出登录的函数
export const logout = () => (dispatch) => {
    const response = axios.get('http://124.220.14.106:9001/auth/logout')
    console.log("退出登录")
    localStorage.removeItem('userInfo')
    localStorage.removeItem('userRegisterInfo')
    dispatch({ type: 'USER_LOGIN_OUT' })
    
}

// 注册的函数
export const register = (userName, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: 'USER_REGISTER_REQUEST'
        })

        const config = {
            headers: {
                'content-Type': 'application/json'
            }
        }

        // 注册
        const { data } = await axios.post(
            'http://124.220.14.106:9001/auth/register', // 调用注册的api
            { userName, email, password },
            config
        )

        console.log(data)
        if (data.code === 200) {
            dispatch({
                type: 'USER_REGISTER_SUCCESS',
                payload: data,
            })
            localStorage.setItem('userRegisterInfo', JSON.stringify(data))
        } 
        if (data.code === 405) {
            dispatch({
                type: 'USER_REGISTER_FAIL',
                payload: data
            })
            localStorage.setItem('userRegisterInfo', JSON.stringify(data))
        }
        
    } catch (error) {
        // 注册失败！
        console.log(error)
        dispatch({
            type: 'USER_REGISTER_FAIL',
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        })
        
    }
}

export const registerout = () => (dispatch) => {
    localStorage.removeItem('userRegisterInfo')
    dispatch({ type: 'USER_REGISTER_OUT' })
}