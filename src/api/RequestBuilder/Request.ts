import { Methods } from "./Methods";

export default class Request {
    url: string;
    method: Methods;
    headers: Headers;
    body: any;
    unsecure: boolean

    constructor(url: string, method: Methods, headers: Headers, body: any | undefined, unsecure: boolean) {
        this.url = url;
        this.method = method;
        this.headers = headers;
        this.body = body;
        this.unsecure = unsecure;
    }

    async send() {
        const method = this.method.toLowerCase();

        let result;

        switch(method) {
            case 'get':
                result = await this.sendGet();
                break;
            case 'post':
                result = await this.sendPost();
                break;
            case 'put': 
                result = await this.sendPut();
                break;
            case 'delete': 
                result = await this.sendDelete();
                break;
        }

        return result;
    }

    private async sendPost(): Promise<Response> {
        if(!this.body)
            throw new Error("Body cannot be empty on post");
        
        const response = await fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: this.body,
        });

        return response;
    }

    private async sendGet(): Promise<Response> {
        const response = await fetch(this.url, {
            method: 'GET', 
            headers: this.headers
        });

        return response;
    }

    private async sendPut(): Promise<Response> {
        const response = await fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: this.body,
        });

        return await response;
    }

    private async sendDelete(): Promise<Response> {
        const response = await fetch(this.url, {
            method: 'DELETE'
        })

        return response;
    }
}