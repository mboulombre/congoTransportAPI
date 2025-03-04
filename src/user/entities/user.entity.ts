import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from 'src/enum/user_role.enum';

@Entity('user')
export class User {
  @Column('int', { primary: true, name: 'idUser' })
  @PrimaryGeneratedColumn()
  idUser: number;

  @Column('varchar', { name: 'LastName', length: 45 })
  lastName: string;

  @Column('varchar', { name: 'FirstName', length: 45 })
  firstName: string;

  @Column('varchar', { name: 'Email', unique: true, length: 45 })
  email: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Column({ default: false })
  isVerified: boolean;

  @Column('varchar', { name: 'Password', length: 225 })
  password: string;

  @Column('varchar', { name: 'Adress1', length: 45 })
  adress1: string;

  @Column('varchar', { name: 'Adress2', nullable: true, length: 45 })
  adress2: string | null;

  @Column('varchar', { name: 'Tel1', length: 45 })
  tel1: string;

  @Column('varchar', { name: 'Tel2', nullable: true, length: 45 })
  tel2: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatetAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  userImage: string;

  // @OneToMany(() => Booking, (booking) => booking.user)
  // bookings: Booking[];
}
