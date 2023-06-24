import axios from "axios";
import { type IToken } from "./interfaces"
import { BASE_URL } from './constant';

function get_token(): IToken | null {
    let temp_token = localStorage.getItem('token');
    if (temp_token == null)
        return null;
    else {
        let token_value = JSON.parse(temp_token) as IToken;
        return token_value;
    }
}

function is_token_needto_refresh(token: IToken) {
    let refresh_time = new Date(token.active_time * 1000 + 1000 * 60 * 30);
    let d1 = new Date(Date.now());
    let date_utc_now = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds());
    return date_utc_now.getTime() >= refresh_time.getTime();
}

function update_token(token: IToken, success_callback: () => void = () => { }, fail_callback: () => void = () => { }) {
    axios({
        method: 'post',
        url: `${BASE_URL}/token/refresh`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `${token.token_type} ${token.access_token}`
        },
        withCredentials: true,
    }).then((res) => {
        token = res.data as IToken;
        localStorage.setItem("token", JSON.stringify(token));
        success_callback();
    }).catch(function (error) {
        if (error.response.status == 401) {
            localStorage.removeItem('token');
        }
        fail_callback();
    });
}

export {
    is_token_needto_refresh,
    update_token,
    get_token
}