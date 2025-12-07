import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateShoppingItemDto } from '../src/shopping-list/dto/create-shopping-item.dto';

describe('ShoppingListController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  const testUser = {
    username: `user_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    jwtToken = registerResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/shopping-list (GET) - should return empty array initially', () => {
    return request(app.getHttpServer())
      .get('/shopping-list')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect((res: request.Response) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
      });
  });

  let createdItemId: string;

  it('/shopping-list (POST) - should create a new item', async () => {
    const newItem: CreateShoppingItemDto = {
      name: 'Integration Test Milk',
      quantity: 2,
      unit: 'л',
    };

    const response = await request(app.getHttpServer())
      .post('/shopping-list')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(newItem)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newItem.name);

    createdItemId = response.body.id;
  });

  it('/shopping-list (GET) - should return list with 1 item', () => {
    return request(app.getHttpServer())
      .get('/shopping-list')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect((res: request.Response) => {
        expect(res.body.length).toBe(1);
        expect(res.body[0].id).toBe(createdItemId);
      });
  });

  it('/shopping-list/:id (DELETE) - should remove the item', () => {
    return request(app.getHttpServer())
      .delete(`/shopping-list/${createdItemId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });

  it('/shopping-list (GET) - should be empty again', () => {
    return request(app.getHttpServer())
      .get('/shopping-list')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect((res: request.Response) => {
        expect(res.body.length).toBe(0);
      });
  });
});
