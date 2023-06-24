interface IToken {
    access_token: string;
    token_type: string;
    username: string;
    active_time: number;
    expire_time: number;
}

interface IUserInfo {
    username: string;
}

export type {
    IToken,
    IUserInfo
}