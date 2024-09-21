import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Booking } from './Booking.entity';
import { Stop } from './Stop.entity';
import { Agency } from './Agency.entity';
import { Point } from './Point.entity';
import { Typetransport } from './Typetransport.entity';

@Index('fk_Trajet_Point1_idx', ['embarquement'], {})
@Index('fk_Trajet_PointEmbarquement_idx', ['debarquement'], {})
@Index('fk_Trajet_Agency1_idx', ['agency'], {})
@Entity('trajet', { schema: 'mydb' })
export class Trajet {
  @Column('int', { primary: true, name: 'IdTrajet' })
  idTrajet: number;

  @Column('date', { name: 'DateDepart' })
  dateDepart: string;

  @Column('varchar', { name: 'HourDepart', length: 45 })
  hourDepart: string;

  @Column('date', { name: 'DateArrived' })
  dateArrived: string;

  @Column('varchar', { name: 'HourArrived', length: 45 })
  hourArrived: string;

  @Column('varchar', { name: 'Duration', length: 45 })
  duration: string;

  @Column('varchar', { name: 'PriceAdulte', length: 45 })
  priceAdulte: string;

  @Column('varchar', { name: 'PriceChild', length: 45 })
  priceChild: string;

  @Column('int', { name: 'Nbr_places' })
  nbrPlaces: number;

  @Column('int', { primary: true, name: 'embarquement' })
  embarquement: number;

  @Column('int', { primary: true, name: 'debarquement' })
  debarquement: number;

  @Column('int', { primary: true, name: 'Agency' })
  agency: number;

  @Column('varchar', { name: 'createdAt', length: 45 })
  createdAt: string;

  @Column('varchar', { name: 'updatedAt', nullable: true, length: 45 })
  updatedAt: string | null;

  @OneToMany(() => Booking, (booking) => booking.trajet)
  bookings: Booking[];

  @OneToMany(() => Stop, (stop) => stop.trajet)
  stops: Stop[];

  @ManyToOne(() => Agency, (agency) => agency.trajets, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'Agency', referencedColumnName: 'idAgency' }])
  agency2: Agency;

  @ManyToOne(() => Point, (point) => point.trajets, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'debarquement', referencedColumnName: 'idPoint' }])
  debarquement2: Point;

  @ManyToOne(() => Point, (point) => point.trajets2, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'embarquement', referencedColumnName: 'idPoint' }])
  embarquement2: Point;

  @ManyToMany(() => Typetransport, (typetransport) => typetransport.trajets)
  @JoinTable({
    name: 'typetransport_has_trajet',
    joinColumns: [{ name: 'Trajet', referencedColumnName: 'idTrajet' }],
    inverseJoinColumns: [
      { name: 'TypeTransport', referencedColumnName: 'idTypeTransport' },
    ],
    schema: 'mydb',
  })
  typetransports: Typetransport[];
}
