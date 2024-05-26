import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserModule } from 'src/user/user.module';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { dbConfig_test } from '../data.source';

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
        'Password1',
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

  describe('Create User', () => {
    it('should successfully create a new user with valid data', async () => {
      const validEntry = new CreateUserDto(
        'John Doe',
        'john@email.com',
        'Password1',
      );

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(validEntry);

      expect(response.body.fullName).toEqual('John Doe');
      expect(response.body.id).toBeDefined();
    });

    it('should fail to create a new invoice with invalid data', async () => {
      const invalidEntry = new CreateUserDto('John Doe', 'john', 'password');

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(invalidEntry)
        .expect(400);

      expect(response.body.message).toContain(
        'Invalid email format. Please provide a valid email address.',
      );
      expect(response.body.message).toContain(
        'Password must be at least 6 characters long and contain at least one uppercase letter and one number.',
      );
    });
  });

  describe('Update User', () => {
    it('should successfully update an existing user', async () => {
      const response = await request(app.getHttpServer()).get('/users');

      const userId = response.body[0].id;
      const updateDto = {
        ...response.body[0],
        email: 'doe@email.com',
        password: 'Password2',
        role: 'admin',
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(updateDto)
        .expect(200);

      expect(updateResponse.body.id).toEqual(2);
      expect(updateResponse.body.email).toEqual('doe@email.com');
      expect(updateResponse.body.role).toEqual('admin');
    });

    it('should fail to update an existing user with invalid data', async () => {
      const response = await request(app.getHttpServer()).get('/users');

      const userId = response.body[0].id;
      const updateDto = {
        ...response.body[0],
        email: 'doe',
        password: 'Password',
        role: 'root',
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(updateDto)
        .expect(400);

      expect(updateResponse.body.message).toContain(
        'Invalid email format. Please provide a valid email address.',
      );
      expect(updateResponse.body.message).toContain(
        'Password must be at least 6 characters long and contain at least one uppercase letter and one number.',
      );
      expect(updateResponse.body.message).toContain(
        'role must be one of the following values: user, admin',
      );
    });

    it('should fail to update a non-existent user', async () => {
      const updateDto = {
        email: 'doe@email.com',
        password: 'Password2',
        role: 'admin',
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/users/999`)
        .send(updateDto)
        .expect(404);

      expect(updateResponse.body.message).toEqual('User with id 999 not found');
    });
  });

  describe('Get All Users', () => {
    it('should successfully retrieve all users', async () => {
      const validEntry1 = new CreateUserDto(
        'Jane Doe',
        'jane@yahoo.com',
        'Password123',
      );
      const validEntry2 = new CreateUserDto(
        'George',
        'admin@email.dk',
        'SuperPassword1',
      );

      await request(app.getHttpServer()).post('/users').send(validEntry1);
      await request(app.getHttpServer()).post('/users').send(validEntry2);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body.length).toEqual(3);
      expect(response.body[1].fullName).toEqual('Jane Doe');
      expect(response.body[2].fullName).toEqual('George');
      expect(response.body[2].email).toEqual('admin@email.dk');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
