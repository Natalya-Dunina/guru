import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import {MainPage} from '../src/pages/main.page.js';
import {RegisterPage} from '../src/pages/register.page.js'; 
import {HomePage} from '../src/pages/home.page.js'; 
import { NewArticlePage } from '../src/pages/articleNew.page.js'; 
import { ViewArticlePage } from '../src/pages/articleView.page.js';
import { EditArticlePage } from '../src/pages/articleEdit.page.js';
import { ProfilePage } from '../src/pages/profie.page.js';

const url = 'https://realworld.qa.guru/';

const generateNewUser = () => ({
  email: faker.internet.email({ provider: 'qa.guru' }),
  name: faker.person.fullName(),
  password: faker.internet.password({ length: 10 }),
});

const getReadableDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('ru-RU');
    const time = now.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
    });
    return `${date} ${time}`;
  };

const generateTestArticle = () => {
  const timestamp = getReadableDateTime();
  
  return {
    title: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 10),
    topic: `Тестовая тема ${timestamp}`,
    content: `Тестовое содержание ${timestamp}`,
    tag: `тестовый_тег`,
  };
};

async function registerUser(page, user) {
    const mainPage = new MainPage(page);    
    const registerPage = new RegisterPage(page);
    await mainPage.open(url);
    await mainPage.gotoRegister();
    await registerPage.register(user.name, user.email, user.password);
}

async function createArticle(page, article) {
  const homePage = new HomePage(page);
  const newArticlePage = new NewArticlePage(page);
  const viewArticlePage = new ViewArticlePage(page);
  
  await homePage.gotoNewArticle();
  await newArticlePage.createNewArticle(
    article.title, 
    article.topic, 
    article.content, 
    article.tag
  );
  
  return { homePage, newArticlePage, viewArticlePage };
}

async function addArticleToFavorites(page, homePage) {
    await homePage.goToProfile();
    const profilePage = new ProfilePage(page);
    await profilePage.clickAddFavorite();
    await profilePage.goToFavoritedArticles();
    return profilePage;
    
}

test.describe('Article tests', () => {
  let user, article;

test.beforeEach(() => { 
    user = generateNewUser();
    article = generateTestArticle();
    
});

test('User can create new article', async ({ page }) => {
 // Регистрация и создание статьи
 await registerUser(page, user);
 const { viewArticlePage } = await createArticle(page, article);

 expect(await viewArticlePage.getArticleContent()).toContain(article.content);
});

test('User can create new comment on the article', async ({ page }) => {

  // Регистрация и создание статьи
  await registerUser(page, user);
  const { viewArticlePage } = await createArticle(page, article);
  const commentText = `Это тестовый комментарий ${getReadableDateTime()}`;
  await viewArticlePage.createNewComment(commentText);

  expect(await viewArticlePage.getCommentContent()).toContain(commentText);
});

test('User can edit his article', async ({ page }) => {
  const editArticlePage = new EditArticlePage(page);
  const newArticle = generateTestArticle();
  // Регистрация и создание статьи
  await registerUser(page, user);
  const { viewArticlePage } = await createArticle(page, article);
  //Открываем статью на редактирование
  await viewArticlePage.gotoEditArticle();
  await editArticlePage.updateArticle(newArticle.title, newArticle.topic, newArticle.content, newArticle.tag);

  expect(await viewArticlePage.getArticleContent()).toContain(newArticle.content);
});

test('User can add his article to favorite ', async ({ page }) => {
    const commentText = `Это тестовый комментарий ${getReadableDateTime()}`;
    // Регистрация и создание статьи
    await registerUser(page, user);
    const { homePage, viewArticlePage } = await createArticle(page, article);
    expect(await viewArticlePage.getArticleContent()).toContain(article.content);
    await addArticleToFavorites(page, homePage);
    // Ждем появления кнопки с правильным счетчиком
    const buttonHeart = page.getByRole('button', { name: ' ( 1 )' });
    await expect(buttonHeart).toBeVisible({ timeout: 10000 });
    //Проверяем, что текст содержит "1"
    const buttonText = await buttonHeart.textContent();
    expect(buttonText).toContain('( 1 )');
});

test('User can remove his article from favorite ', async ({ page }) => {

    const commentText = `Это тестовый комментарий ${getReadableDateTime()}`;
    // Регистрация и создание статьи
    await registerUser(page, user);
    const { viewArticlePage, homePage } = await createArticle(page, article);
    expect(await viewArticlePage.getArticleContent()).toContain(article.content);
    // Добавляем статью в избранное
    const profilePage = await addArticleToFavorites(page, homePage);
    const buttonHeartAdd = page.getByRole('button', { name: ' ( 1 )' });
    await buttonHeartAdd.waitFor({ state: 'visible', timeout: 10000 });
    // Убираем статью из избранного
    await profilePage.clickRemoveFavorite();
    const buttonHeartRemove = page.getByRole('button', { name: ' ( 0 )' });
    await buttonHeartRemove.waitFor({ state: 'visible', timeout: 10000 });
    // Статья пропадает из списка избранного после перезагрузки страницы
    await page.reload();
    await expect(page.getByText("doesn't have")).toBeVisible();
});
});