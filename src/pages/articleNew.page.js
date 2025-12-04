export class NewArticlePage {
    constructor (page) {
        this.page = page;
        this.acricleTitleInput = page.getByRole('textbox', { name: 'Article Title' });
        this.articleDescriptionInput = page.getByRole('textbox', { name: 'What\'s this article about?' });
        this.articleBodyInput = page.getByRole('textbox', { name: 'Write your article (in markdown)' });
        this.articleTagInput = page.getByRole('textbox', { name: 'Enter tags' });
        this.publishArticleButton = page.getByRole('button', { name: 'Publish Article' })
    }

    async createNewArticle(title, topic, content, tag) {
        console.log('Создаем новую статью');
        await this.acricleTitleInput.click();
        await this.acricleTitleInput.fill(title);
        await this.articleDescriptionInput.click();
        await this.articleDescriptionInput.fill(topic);
        await this.articleBodyInput.click();
        await this.articleBodyInput.fill(content);  
        await this.articleTagInput.click();
        await this.articleTagInput.fill(tag); 
        await this.publishArticleButton.click();  
    }

}