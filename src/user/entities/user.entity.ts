import * as bcrypt from 'bcrypt';
import { Car } from 'src/car/entities/car.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('text', { array: true, default: () => "ARRAY['user']::text[]" })
  roles: string[];

  @OneToMany(() => Car, (car) => car.user)
  cars: Car[];

  @Column({ default: 100 })
  washCoins: number;

  @BeforeUpdate()
  @BeforeInsert()
  hashPassword(): void {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }
}
