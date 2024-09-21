import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { District } from './District.entity';
import { Trajet } from './Trajet.entity';

@Index('fk_Point_District1_idx', ['district'], {})
@Entity('point', { schema: 'mydb' })
export class Point {
  @Column('int', { primary: true, name: 'idPoint' })
  idPoint: number;

  @Column('varchar', { name: 'Name', length: 45 })
  name: string;

  @Column('varchar', { name: 'CreatedAt', nullable: true, length: 45 })
  createdAt: string | null;

  @Column('varchar', { name: 'UpdatedAt', nullable: true, length: 45 })
  updatedAt: string | null;

  @Column('int', { primary: true, name: 'district' })
  district: number;

  @Column('enum', {
    name: 'type',
    nullable: true,
    enum: ['embarquement', 'debarquement'],
  })
  type: 'embarquement' | 'debarquement' | null;

  @ManyToOne(() => District, (district) => district.points, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'district', referencedColumnName: 'idDistrict' }])
  district2: District;

  @OneToMany(() => Trajet, (trajet) => trajet.debarquement2)
  trajets: Trajet[];

  @OneToMany(() => Trajet, (trajet) => trajet.embarquement2)
  trajets2: Trajet[];
}
