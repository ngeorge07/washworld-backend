import { Car } from 'src/car/entities/car.entity';
import { Package } from 'src/package/entities/package.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('scubscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  expiresAt: Date;

  @OneToOne(() => Car, { nullable: false })
  @JoinColumn({ name: 'carId' })
  car: Car;

  @ManyToOne(() => Package, { nullable: false })
  @JoinColumn({ name: 'packageId' })
  package: Package;

  @BeforeInsert()
  setExpiresAt() {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);
    this.expiresAt = currentDate;
  }
}
