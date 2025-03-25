export default class EmailBuilder {
    private static _instance: EmailBuilder | null = null
    private email: string | null = null
    private constructor() { }
    static get Instance(): EmailBuilder {
        if (EmailBuilder._instance === null) {
            EmailBuilder._instance = new EmailBuilder()
        }
        return EmailBuilder._instance
    }
    getEmail(): string | null {
        return this.email
    }
    setEmail(email: string | null): this {
        this.email = email
        return this
    }

    build(): string | null {
        return this.email
    }



}