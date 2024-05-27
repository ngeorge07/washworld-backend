import 'dotenv/config';
import { Role } from 'src/enums/role.enum';
import { DataSource } from 'typeorm';

const adminSeed = {
  fullName: 'Admin',
  email: 'admin@email.com',
  password: 'admin',
  roles: [Role.ADMIN],
};

async function seed() {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: ['dist/**/*.entity{.ts,.js}'],
  });

  const connection = await AppDataSource.initialize();
  if (connection.isInitialized) {
    console.log('Seeding admin user');
    const userRepository = connection.getRepository('User');

    const user = await userRepository.findOneBy({ email: adminSeed.email });
    if (!user) {
      const adminUser = userRepository.create(adminSeed);
      const savedAdminUser = await userRepository.save(adminUser);
      console.log('Admin user seeded', savedAdminUser);
    } else {
      console.log('Admin user ALREADY seeded');
    }
  }
  await connection.destroy();
}

seed();
