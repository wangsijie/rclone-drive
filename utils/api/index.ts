import axios, { AxiosResponse } from 'axios';
import { NextPageContext } from 'next';
import absoluteUrl from 'next-absolute-url';
import config from '../config';

export interface IRequestConfig {
    query?: any;
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT' | 'DELETE';
    withCredentials?: boolean;
};

const request = async (endpoint: string, data: any, config: IRequestConfig) => {
    let requestUrl: string = endpoint;
    if (config.query) {
        Object.keys(config.query).forEach((key: string, index: number) => {
            const value = config.query[key];
            if (value === undefined) {
                return;
            }
            requestUrl += (index === 0 ? '?' : '&') + `${key}=${value}`;
        });
    }
    delete config.query;
    const finalConfig: IRequestConfig = {
        ...config,
        withCredentials: true,
    }
    let response: AxiosResponse;
    try {
        if (config.method === 'GET') {
            response = await axios.get(requestUrl, finalConfig);
        } else if (config.method === 'POST') {
            response = await axios.post(requestUrl, data, finalConfig);
        } else if (config.method === 'DELETE') {
            response = await axios.delete(requestUrl, finalConfig);
        }
        return response.data;
    } catch (e) {
        if (typeof window !== 'undefined' && e.response && e.response.status === 401) {
            window.location.href = '/login';
        } else {
            throw e;
        }
    }
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

export const getSelfUrl = (ctx: NextPageContext) => {
    if (config.listen) {
        return config.listen;
    }
    const { protocol, host } = absoluteUrl(ctx.req);
    return `${protocol}//${host}`;
}
