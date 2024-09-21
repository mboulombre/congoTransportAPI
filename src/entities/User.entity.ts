import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Booking } from './Booking.entity';

@Index('email_UNIQUE', ['email'], { unique: true })
@Entity('user', { schema: 'mydb' })
export class User {
  @Column('int', { primary: true, name: 'idUser' })
  idUser: number;

  @Column('varchar', { name: 'LastName', length: 45 })
  lastName: string;

  @Column('varchar', { name: 'FirstName', length: 45 })
  firstName: string;

  @Column('varchar', { name: 'Email', unique: true, length: 45 })
  email: string;

  @Column('varchar', { name: 'Password', length: 45 })
  password: string;

  @Column('varchar', { name: 'Adress1', length: 45 })
  adress1: string;

  @Column('varchar', { name: 'Adress2', nullable: true, length: 45 })
  adress2: string | null;

  @Column('varchar', { name: 'Tel1', length: 45 })
  tel1: string;

  @Column('varchar', { name: 'Tel2', nullable: true, length: 45 })
  tel2: string | null;

  @Column('date', { name: 'CreatedAt', nullable: true })
  createdAt: string | null;

  @Column('varchar', { name: 'UpdatetAt', nullable: true, length: 45 })
  updatetAt: string | null;

  @Column('varchar', { name: 'DeletedAt', nullable: true, length: 45 })
  deletedAt: string | null;

  @OneToMany(() => Booking, (booking) => booking.user2)
  bookings: Booking[];
}
