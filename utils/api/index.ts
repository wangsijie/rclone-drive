import axios, { AxiosResponse } from 'axios';

export interface IRequestConfig {
    query?: any;
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT' | 'DELETE';
};

export const API_ROOT: string = 'http://localhost:3000';

const request = async (endpoint: string, data: any, config: IRequestConfig) => {
    let requestUrl: string = API_ROOT + endpoint;
    if (config.query) {
        Object.keys(config.query).forEach((key: string, index: number) => {
            const value = config.query[key];
            if (value === undefined) {
                return;
            }
            requestUrl += (index === 0 ? '?' : '&') + `${key}=${value}`;
        });
    }
    let response: AxiosResponse;
    if (config.method === 'GET') {
        response = await axios.get(requestUrl);
    } else if (config.method === 'POST') {
        response = await axios.post(requestUrl, data);
    } else if (config.method === 'DELETE') {
        response = await axios.delete(requestUrl, data);
    }
    return response.data;
}

export const get = (endpoint: string, query?: any, config: IRequestConfig = {}) => {
    return request(endpoint, null, { ...config, query, method: 'GET' })
}

export const post = (endpoint: string, data?: any, config: IRequestConfig = {}) => {
    return request(endpoint, data, { ...config, method: 'POST' })
}

export const upload = (endpoint: string, payload: any, config: IRequestConfig = {}) => {
    const formData = new FormData();
    Object.keys(payload).forEach(key => formData.append(key, payload[key]));
    return post(endpoint, formData, config);
}

export const deleteRequest = (endpoint: string, data?: any, config: IRequestConfig = {}) => {
    return request(endpoint, data, { ...config, method: 'DELETE' })
}
