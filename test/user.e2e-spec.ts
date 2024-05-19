import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig_test } from '../data.source';
import { EntityManager } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserModule } from 'src/user/user.module';

describe('Invoices (e2e)', () => {
  let app: INestApplication;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [UserModule, TypeOrmModule.forRoot(dbConfig_test)],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    entityManager = moduleRef.get<EntityManager>(EntityManager);

    // Clear the table and reset the id PK to start from 1
    await entityManager.query('DELETE FROM users');
    await entityManager.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
  });

  describe('Find and delete user', () => {
    it('should delete an existing user', async () => {
      // ARRANGE
      // Create a new user
      const validEntry = new CreateUserDto(
        'Jane Doe',
        'jane@email.com',
        'password',
      );

      // ACT
      // Send a POST request to create a new invoice and check if it was created
      await request(app.getHttpServer()).post('/users').send(validEntry);
      await request(app.getHttpServer()).get('/users/1');

      // ASSERT
      // Send a DELETE request to delete the invoice and check if it was deleted
      await request(app.getHttpServer()).delete('/users/1').expect(200);

      const response = await request(app.getHttpServer())
        .get('/users/1')
        .expect(404);
      expect(response.body.message).toEqual('User with id 1 not found');
    });

    it('should fail to delete a non-existent user', async () => {
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/users/999`)
        .expect(404);

      expect(deleteResponse.body.message).toEqual('User with id 999 not found');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
