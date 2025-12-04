export class ViewArticlePage {
    constructor (page) {
        this.page = page;
        this.commentInput = page.getByRole('textbox', { name: 'Write a comment...' });
        this.commentButton = page.getByRole('button', { name: 'Post Comment' });
        this.editArticleButton = page.getByRole('link', { name: 'Edit Article' }).nth(1);
        this.commentDeleteButton = page.getByRole('button')
  .filter({ has: page.locator('.btn.btn-sm.btn-outline-secondary.pull-xs-right') })
  
    }

    async createNewComment(text) {
        console.log('Создаем комментарий')
        await this.commentInput.click();
        await this.commentInput.fill(text);
        await this.commentButton.click();
    }

    async getCommentContent() {
        const commentContent = await this.page.locator('.card .card-block .card-text').textContent();
        return commentContent;
    }

    async getArticleContent() {
        const content = await this.page.locator('.row.article-content .col-md-12 p').first().textContent();
        return content; 
    }

    async gotoEditArticle() {
        await this.editArticleButton.click();
    }
}