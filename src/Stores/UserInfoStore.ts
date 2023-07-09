import { defineStore } from 'pinia'
import { type IToken } from '@/Utils/Interfaces/IToken'
import { BASE_URL } from '@/Utils/constant';
import axios from 'axios';

interface State {
    token: IToken | null
}

function init_token(): IToken | null {
    let temp_token = localStorage.getItem('token');
    if (temp_token == null)
        return null;
    else {
        let token_value = JSON.parse(temp_token) as IToken;
        return token_value;
    }
}

export const useUserInfoStore = defineStore('userInfo', {
    state: (): State => {
        return {
            token: init_token()
        }
    },
    getters: {

    },
    actions: {
        is_token_needto_refresh() {
            if (this.token == null)
                return false;
            let refresh_time = new Date(this.token.active_time * 1000 / 2 + this.token.expire_time * 1000 / 2);
            let d = new Date(Date.now());
            let date_utc_now = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
            return date_utc_now.getTime() >= refresh_time.getTime();
        },
        update_token(success_callback: () => void = () => { }, fail_callback: () => void = () => { }) {
            if (this.token == null) {
                console.log('update token: token is null!');
                fail_callback();
                return;
            }
            axios({
                method: 'post',
                url: `${BASE_URL}/token/refresh`,
                headers: {
                    'Authorization': `${this.token.token_type} ${this.token.access_token}`
                },
                withCredentials: true,
            }).then((res) => {
                this.token = res.data as IToken;
                localStorage.setItem("token", JSON.stringify(this.token));
                success_callback();
            }).catch(function (error) {
                if (error.response.status == 401) {
                    localStorage.removeItem('token');
                }
                fail_callback();
            });
        },
        remove_token() {
            this.token = null;
            localStorage.removeItem('token');
        }
    }
})