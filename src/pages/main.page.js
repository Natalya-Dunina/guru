export class MainPage {
    constructor(page) {
        this.page = page;
        this.signupLink = page.getByRole('link', { name: 'Sign up' }).describe('Кнопка//cсылка зарегистрироваться');
        this.loginLink = page.getByRole('link', { name: 'Login' }).describe('Кнопка//cсылка авторизоваться');
    }

    async gotoRegister() {
        console.log('Переходим на страницу регистрации');
        this.signupLink.click();
    }
 
    async gotoAutorization() {
        console.log('Переходим на страницу авторизации');
        await this.loginLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async open(url) {
        console.log(`Открываем страницу ${url}`);
        await this.page.goto(url);
    }
}