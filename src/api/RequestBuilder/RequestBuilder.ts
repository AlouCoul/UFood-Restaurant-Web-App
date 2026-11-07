import { Methods } from "./Methods";
import Request from "./Request";
import { Header } from "./Headers";

export default class RequestBuilder {
    private BASE_URL: string = "https://ufoodapi.herokuapp.com/";
    private url: string;
    private method: Methods;
    private headers: Headers;
    private requestBody?: any;
    private isUnsecure: boolean; 

    constructor() {
        this.url = '';
        this.method = Methods.Get;
        this.headers = new Headers();
        this.requestBody = undefined;
        this.isUnsecure = false;
    }

    public header(header: Header): RequestBuilder {
        this.headers.append(header.getKey(), header.getValue());
        return this;
    }

    public get(url: string): RequestBuilder {
        this.url = url;
        this.method = Methods.Get;
        return this;
    }

    public post(url: string): RequestBuilder {
        this.url = url;
        this.method = Methods.Post;
        return this;
    }

    public put(url: string): RequestBuilder {
        this.url = url;
        this.method = Methods.Put;
        return this;
    }

    public delete(url: string): RequestBuilder {
        this.url = url;
        this.method = Methods.Delete;
        return this;
    }

    public body(body: any): RequestBuilder {
        this.requestBody = body;
        return this;
    }

    public unsecure(unsecure: boolean): RequestBuilder {
        this.isUnsecure = unsecure;
        return this;
    }

    public async send(): Promise<any> {

        const request = new Request(
            this.buildUrl(),
            this.method,
            this.headers,
            this.requestBody,
            this.isUnsecure
        );

        const response = await request.send();

        let result;

        try {
            result = await response?.json()
        }
        catch(e) {
            result = response;
        }

        if(response?.status === 500) {
            throw new Error(`Erreur serveur`)
        }

        return result;
    }

    private buildUrl(): string {
        if(this.isUnsecure)
            return this.BASE_URL + 'unsecure/' + this.url;

        return this.BASE_URL + this.url;
    }
}