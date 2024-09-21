import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { City } from './City.entity';
import { District } from './District.entity';

@Index('fk_arrondissement_City1_idx', ['city'], {})
@Entity('arrondissement', { schema: 'mydb' })
export class Arrondissement {
  @Column('int', { primary: true, name: 'idArrondissement' })
  idArrondissement: number;

  @Column('varchar', { name: 'name', length: 45 })
  name: string;

  @Column('varchar', { name: 'description', nullable: true, length: 45 })
  description: string | null;

  @Column('date', { name: 'createdAt', nullable: true })
  createdAt: string | null;

  @Column('date', { name: 'updatedAt', nullable: true })
  updatedAt: string | null;

  @Column('int', { primary: true, name: 'City' })
  city: number;

  @ManyToOne(() => City, (city) => city.arrondissements, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'City', referencedColumnName: 'idCity' }])
  city2: City;

  @OneToMany(() => District, (district) => district.arrondissement2)
  districts: District[];
}
