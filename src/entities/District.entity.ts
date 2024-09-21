import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Arrondissement } from './Arrondissement.entity';
import { Point } from './Point.entity';

@Index('fk_District_Arrondissement1_idx', ['arrondissement'], {})
@Entity('district', { schema: 'mydb' })
export class District {
  @PrimaryGeneratedColumn({ type: 'int', name: 'idDistrict' })
  idDistrict: number;

  @Column('varchar', { name: 'name', length: 45 })
  name: string;

  @Column('varchar', { name: 'description', nullable: true, length: 45 })
  description: string | null;

  @Column('date', { name: 'createdAt', nullable: true })
  createdAt: string | null;

  @Column('date', { name: 'updatedAt', nullable: true })
  updatedAt: string | null;

  @Column('int', { primary: true, name: 'Arrondissement' })
  arrondissement: number;

  @ManyToOne(
    () => Arrondissement,
    (arrondissement) => arrondissement.districts,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'Arrondissement', referencedColumnName: 'city' }])
  arrondissement2: Arrondissement;

  @OneToMany(() => Point, (point) => point.district2)
  points: Point[];
}
