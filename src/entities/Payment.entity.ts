import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './Booking.entity';

@Index('fk_Payment_Booking1_idx', ['booking'], {})
@Entity('payment', { schema: 'mydb' })
export class Payment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'idPayment' })
  idPayment: number;

  @Column('date', { name: 'date' })
  date: string;

  @Column('enum', { name: 'modePayment', enum: ['MTN', 'AIRTEL', 'VISA'] })
  modePayment: 'MTN' | 'AIRTEL' | 'VISA';

  @Column('int', { name: 'montant' })
  montant: number;

  @Column('int', { primary: true, name: 'booking' })
  booking: number;

  @ManyToOne(() => Booking, (booking) => booking.payments, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'booking', referencedColumnName: 'idBooking' }])
  booking2: Booking;
}
