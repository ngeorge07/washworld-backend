import * as bcrypt from 'bcrypt';
import { Role } from 'src/enums/role.enum';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
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

  @BeforeUpdate()
  @BeforeInsert()
  hashPassword(): void {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  @BeforeUpdate()
  convertRoles(): Role[] {
    if (this.roles) {
      const convertedRoles = this.roles.map(
        (role) => Role[role as keyof typeof Role],
      );
      return convertedRoles;
    }
  }
}
