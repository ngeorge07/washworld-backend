import { Subscription } from 'src/subscription/entities/subscription.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  registrationNumber: string;

  @ManyToOne(() => User, (user) => user.cars, { nullable: false })
  user: User;

  @OneToOne(() => Subscription, (subscription) => subscription.car)
  subscription: Subscription;
}
