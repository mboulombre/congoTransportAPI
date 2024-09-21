import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from './Ticket.entity';

@Index('fk_Passenger_Ticket1', ['ticket'], {})
@Entity('passenger', { schema: 'mydb' })
export class Passenger {
  @PrimaryGeneratedColumn({ type: 'int', name: 'idPassenger' })
  idPassenger: number;

  @Column('varchar', { name: 'lastname', length: 45 })
  lastname: string;

  @Column('varchar', { name: 'firstname', length: 45 })
  firstname: string;

  @Column('enum', { name: 'typePassenger', enum: ['enfant', 'adulte'] })
  typePassenger: 'enfant' | 'adulte';

  @Column('date', { name: 'date', nullable: true })
  date: string | null;

  @Column('int', { primary: true, name: 'ticket' })
  ticket: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.passengers, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'ticket', referencedColumnName: 'idTicket' }])
  ticket2: Ticket;
}
