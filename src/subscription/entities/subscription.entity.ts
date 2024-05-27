import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  expiresAt: Date;

  @Column({ type: 'int' })
  washCoinsAwarded: number;

  @BeforeInsert()
  setExpiresAt() {
    this.expiresAt.setMonth(this.createdAt.getMonth() + 1);
  }
}
