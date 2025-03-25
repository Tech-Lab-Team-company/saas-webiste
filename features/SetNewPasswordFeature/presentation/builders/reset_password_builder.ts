export default class ResetPasswordBuilder {
    private static _instance: ResetPasswordBuilder | null = null;

    private email: string | null = null;

    private constructor() {}

    public static get Instance(): ResetPasswordBuilder {
        if (!ResetPasswordBuilder._instance) {
            ResetPasswordBuilder._instance = new ResetPasswordBuilder();
        }
        return ResetPasswordBuilder._instance;
    }


    // Setters
    public setEmail(email: string): this {
        this.email = email;
        return this;
    }

    //build
    public build(): this {
        return this;
    }
}