export class ProfilePage {
    constructor (page) {
        this.page = page;
        this.myArticlesLink = page.getByRole('link', { name: 'My Articles' });
        this.favoritedArticlesLink = page.getByRole('link', { name: 'Favorited Articles' });
        this.iconHeartEmpty = page.getByRole('button', {  name: ' ( 0 )' });
        this.iconHeart1 =page.getByRole('button', {  name: ' ( 1 )' });
    
    }

    async clickAddFavorite() {
        console.log('Помечаем избранным')
        await this.iconHeartEmpty.click();
    }
     async clickRemoveFavorite() {
        console.log('Удаляем из избранного')
        await this.iconHeart1.click();
    }
    async goToFavoritedArticles() {
        console.log('Переходим на вкладку Favorites')
        await this.favoritedArticlesLink.click();
    }
}
