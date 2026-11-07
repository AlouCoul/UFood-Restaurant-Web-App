export class Header {
    private key: string;
    private value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    getKey(): string {
        return this.key;
    }

    getValue(): string {
        return this.value;
    }
}

export const APPLICATION_JSON = () => new Header("Content-Type", "Application/json");
export const AUTHORIZATION = (token: string) => new Header("Authorization", token);