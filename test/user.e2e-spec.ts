import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/enums/role.enum';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { dbConfig_test } from '../data.source';

describe('Invoices (e2e)', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let authService: AuthService;
  let admin_token: string;
  let user_token: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [UserModule, TypeOrmModule.forRoot(dbConfig_test)],
    }).compile();

    entityManager = moduleRef.get<EntityManager>(EntityManager);
    authService = moduleRef.get(AuthService);

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    // Clear the table and reset the id PK to start from 1
    await entityManager.query('DELETE FROM users');
    await entityManager.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');

    // create admin user
    await entityManager.save(User, {
      fullName: 'Admin User',
      email: 'admin@email.com',
      password: bcrypt.hashSync('Password1', 10),
      roles: [Role.ADMIN],
    });

    // create user
    await entityManager.save(User, {
      fullName: 'Average User',
      email: 'user@email.com',
      password: bcrypt.hashSync('Password2', 10),
    });

    // sign in admin and store its token
    await authService
      .signIn({
        email: 'admin@email.com',
        password: 'Password1',
      })
      .then((res) => (admin_token = res.access_token));

    // sign in user and store its token
    await authService
      .signIn({
        email: 'user@email.com',
        password: 'Password2',
      })
      .then((res) => (user_token = res.access_token));

    await app.init();
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
      await request(app.getHttpServer()).get('/users/4');

      // ASSERT
      // Send a DELETE request to delete the invoice and check if it was deleted
      await request(app.getHttpServer())
        .delete('/users/4')
        .auth(admin_token, { type: 'bearer' })
        .expect(200);

      const response = await request(app.getHttpServer())
        .get('/users/4')
        .auth(user_token, { type: 'bearer' })
        .expect(404);
      expect(response.body.message).toEqual('User with id 4 not found');
    });

    it('should fail to delete a user without admin role', async () => {
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/users/1`)
        .auth(user_token, { type: 'bearer' })
        .expect(403);

      expect(deleteResponse.body.message).toEqual(
        'You do not have permission to perform this action',
      );
    });

    it('should fail to delete a non-existent user', async () => {
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/users/999`)
        .auth(admin_token, { type: 'bearer' })
        .expect(404);

      expect(deleteResponse.body.message).toEqual('User with id 999 not found');
    });
  });

  describe('Update User', () => {
    it('Admin should successfully update any existing user', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .auth(user_token, { type: 'bearer' });

      const userId = response.body[2].id;

      const updateDto = {
        ...response.body[2],
        fullName: 'Updated User',
        email: 'update@email.com',
        password: 'Password123',
        roles: ['admin'],
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .auth(admin_token, { type: 'bearer' })
        .send(updateDto)
        .expect(200);

      expect(updateResponse.body.id).toEqual(3);
      expect(updateResponse.body.email).toEqual('update@email.com');
      expect(updateResponse.body.fullName).toEqual('Updated User');
      expect(bcrypt.compareSync('Password123', updateResponse.body.password));
      expect(updateResponse.body.roles).toEqual(['admin']);
    });

    it('should successfully update own user', async () => {
      const response = await request(app.getHttpServer()).get('/users');

      const updateDto = {
        ...response.body[1],
        email: 'selfupdate@email.com',
        password: 'Password123',
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/users/2`)
        .auth(user_token, { type: 'bearer' })
        .send(updateDto)
        .expect(200);

      expect(updateResponse.body.id).toEqual(2);
      expect(updateResponse.body.email).toEqual('selfupdate@email.com');
      expect(bcrypt.compareSync('Password123', updateResponse.body.password));
    });

    it('should fail to assign admin role to a user without admin permission', async () => {
      const response = await request(app.getHttpServer()).get('/users');

      const updateDto = {
        ...response.body[1],
        roles: ['admin'],
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/users/2`)
        .auth(user_token, { type: 'bearer' })
        .send(updateDto)
        .expect(403);

      expect(updateResponse.body.message).toEqual(
        'You do not have permission to perform this action',
      );
    });

    it('should fail to update a different user without admin permission', async () => {
      const response = await request(app.getHttpServer()).get('/users');

      const updateDto = {
        ...response.body[0],
        fullname: 'Updated User',
        email: 'update@email.com',
        password: 'Password123',
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/users/1`)
        .auth(user_token, { type: 'bearer' })
        .send(updateDto)
        .expect(403);

      expect(updateResponse.body.message).toEqual(
        'You do not have permission to perform this action',
      );
    });

    it('should fail to update an existing user with invalid data', async () => {
      const response = await request(app.getHttpServer()).get('/users');

      const updateDto = {
        ...response.body[2],
        email: 'doe',
        password: 'Password',
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/users/2`)
        .auth(user_token, { type: 'bearer' })
        .send(updateDto)
        .expect(400);

      expect(updateResponse.body.message).toContain(
        'Invalid email format. Please provide a valid email address.',
      );
      expect(updateResponse.body.message).toContain(
        'Password must be at least 6 characters long and contain at least one uppercase letter and one number.',
      );
    });

    it('should fail to update a non-existent user', async () => {
      const updateDto = {
        email: 'doe@email.com',
        password: 'Password2',
        roles: ['admin'],
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/users/999`)
        .auth(admin_token, { type: 'bearer' })
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
        'george@email.dk',
        'SuperPassword1',
      );

      await request(app.getHttpServer()).post('/users').send(validEntry1);
      await request(app.getHttpServer()).post('/users').send(validEntry2);

      const response = await request(app.getHttpServer())
        .get('/users')
        .auth(user_token, { type: 'bearer' })
        .expect(200);

      expect(response.body.length).toEqual(5);
      expect(response.body[3].fullName).toEqual('Jane Doe');
      expect(response.body[4].fullName).toEqual('George');
      expect(response.body[4].email).toEqual('george@email.dk');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
