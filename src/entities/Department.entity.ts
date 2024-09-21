import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from './City.entity';
import { Country } from './Country.entity';

@Index('fk_department_Country1_idx', ['country'], {})
@Entity('department', { schema: 'mydb' })
export class Department {
  @PrimaryGeneratedColumn({ type: 'int', name: 'idDepartment' })
  idDepartment: number;

  @Column('varchar', { name: 'name', length: 45 })
  name: string;

  @Column('varchar', { name: 'description', nullable: true, length: 45 })
  description: string | null;

  @Column('date', { name: 'createdAt', nullable: true })
  createdAt: string | null;

  @Column('date', { name: 'updatedAt', nullable: true })
  updatedAt: string | null;

  @Column('int', { primary: true, name: 'country' })
  country: number;

  @OneToMany(() => City, (city) => city.department2)
  cities: City[];

  @ManyToOne(() => Country, (country) => country.departments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'country', referencedColumnName: 'idCountry' }])
  country2: Country;
}
