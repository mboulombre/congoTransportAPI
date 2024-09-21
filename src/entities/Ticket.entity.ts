import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Passenger } from './Passenger.entity';
import { Booking } from './Booking.entity';

@Index('fk_Ticket_Booking1_idx', ['booking'], {})
@Entity('ticket', { schema: 'mydb' })
export class Ticket {
  @PrimaryGeneratedColumn({ type: 'int', name: 'idTicket' })
  idTicket: number;

  @Column('enum', { name: 'type', enum: ['adulte', 'enfant'] })
  type: 'adulte' | 'enfant';

  @Column('enum', { name: 'Statut', enum: ['success', 'cancel'] })
  statut: 'success' | 'cancel';

  @Column('int', { primary: true, name: 'booking' })
  booking: number;

  @OneToMany(() => Passenger, (passenger) => passenger.ticket)
  passengers: Passenger[];

  @ManyToOne(() => Booking, (booking) => booking.tickets, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'booking', referencedColumnName: 'idBooking' }])
  booking2: Booking;
}
