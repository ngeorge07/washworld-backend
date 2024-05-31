import * as dotenv from 'dotenv';
import { Car } from 'src/car/entities/car.entity';
import { Benefit } from 'src/enums/benefit.enum';
import { CreatePackageDto } from 'src/package/dto/create-package.dto';
import { Package } from 'src/package/entities/package.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';

dotenv.config();

const packageSeeds: CreatePackageDto[] = [
  {
    name: 'Basic',
    price: 99,
    washCoinsAwarded: 50,
    benefits: [Benefit.Shampoo, Benefit.Drying, Benefit.BrushWashing],
  },
  {
    name: 'Gold',
    price: 139,
    washCoinsAwarded: 110,
    benefits: [
      Benefit.Shampoo,
      Benefit.Drying,
      Benefit.BrushWashing,
      Benefit.Polishing,
      Benefit.RinseWax,
    ],
  },
  {
    name: 'Premium',
    price: 169,
    washCoinsAwarded: 200,
    benefits: [
      Benefit.Shampoo,
      Benefit.Drying,
      Benefit.BrushWashing,
      Benefit.Polishing,
      Benefit.RinseWax,
      Benefit.FoamSplash,
      Benefit.Degreasing,
    ],
  },
];

async function seed() {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Subscription, Car, User, Package],
  });

  const connection = await AppDataSource.initialize();
  if (connection.isInitialized) {
    console.log('Seeding packages');

    const packageRepository = connection.getRepository<Package>('Package');

    for (const [index, packageSeed] of packageSeeds.entries()) {
      const packageFound = await packageRepository.findOne({
        where: { name: packageSeed.name },
      });
      if (!packageFound) {
        const newPackage = packageRepository.create(packageSeed);
        const savedPackage = await packageRepository.save(newPackage);
        console.log(
          'Package',
          index + 1,
          JSON.stringify(savedPackage, null, 2),
        );
      }
    }
  }
  await connection.destroy();
}

seed();
