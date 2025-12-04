export class HomePage {
    constructor (page) {
        this.page = page;
        this.profileName = page.locator('.dropdown-toggle');
        this.profileLink = page.getByRole('link', { name: 'Profile' });
        this.settingsLink = page.getByRole('link', { name: 'Settings' });
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.newArticleLink = page.getByRole('link', { name: 'New Article' });
    }

    getProfileNameLocator() {
        return this.profileName;
    }
    async goToProfile() {
        console.log('Открываем профайл пользователя');
        await this.profileName.click();
        await this.profileLink.click();
    }

    async gotoSettings() {
        await this.profileName.click();
        await this.settingsLink.click();
    }

    async logOut() {
        await this.profileName.click();
        await this.logoutLink.click();
    }

    async gotoNewArticle() {
        await this.newArticleLink.click();
    }
}