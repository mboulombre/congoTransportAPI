import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trajet } from './Trajet.entity';

@Index('fk_Stop_Trajet1_idx', ['trajet'], {})
@Entity('stop', { schema: 'mydb' })
export class Stop {
  @PrimaryGeneratedColumn({ type: 'int', name: 'idStop' })
  idStop: number;

  @Column('varchar', { name: 'name', length: 45 })
  name: string;

  @Column('int', { name: 'ordre' })
  ordre: number;

  @Column('time', { name: 'hourDepart', nullable: true })
  hourDepart: string | null;

  @Column('time', { name: 'hourArrived', nullable: true })
  hourArrived: string | null;

  @Column('date', { name: 'createdAt', nullable: true })
  createdAt: string | null;

  @Column('date', { name: 'updatedAt', nullable: true })
  updatedAt: string | null;

  @Column('int', { primary: true, name: 'Trajet' })
  trajet: number;

  @ManyToOne(() => Trajet, (trajet) => trajet.stops, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'Trajet', referencedColumnName: 'idTrajet' }])
  trajet2: Trajet;
}
