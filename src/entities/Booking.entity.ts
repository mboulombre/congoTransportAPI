import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trajet } from './Trajet.entity';
import { User } from './User.entity';
import { Payment } from './Payment.entity';
import { Ticket } from './Ticket.entity';

@Index('fk_Booking_User1_idx', ['user'], {})
@Index('fk_Booking_Trajet1_idx', ['trajet'], {})
@Entity('booking', { schema: 'mydb' })
export class Booking {
  @PrimaryGeneratedColumn({ type: 'int', name: 'idBooking' })
  idBooking: number;

  @Column('int', { name: 'nbreBilletAdult' })
  nbreBilletAdult: number;

  @Column('int', { name: 'nbreBilletChild' })
  nbreBilletChild: number;

  @Column('int', { name: 'priceTotal' })
  priceTotal: number;

  @Column('datetime', { name: 'date' })
  date: Date;

  @Column('enum', { name: 'status', enum: ['success', 'cancel'] })
  status: 'success' | 'cancel';

  @Column('int', { primary: true, name: 'user' })
  user: number;

  @Column('int', { primary: true, name: 'trajet' })
  trajet: number;

  @ManyToOne(() => Trajet, (trajet) => trajet.bookings, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'trajet', referencedColumnName: 'idTrajet' }])
  trajet2: Trajet;

  @ManyToOne(() => User, (user) => user.bookings, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user', referencedColumnName: 'idUser' }])
  user2: User;

  @OneToMany(() => Payment, (payment) => payment.booking2)
  payments: Payment[];

  @OneToMany(() => Ticket, (ticket) => ticket.booking2)
  tickets: Ticket[];
}
