import { Subscription } from 'src/subscription/entities/subscription.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @OneToMany(() => Subscription, (subscription) => subscription.package)
  subscriptions: Subscription[];

  @Column()
  washCoinsAwarded: number;

  @Column('text', { array: true, default: () => "ARRAY['package']::text[]" })
  benefits: string[];
}
