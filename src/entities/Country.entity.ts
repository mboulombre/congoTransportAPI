import { Column, Entity, OneToMany } from 'typeorm';
import { Department } from './Department.entity';

@Entity('country', { schema: 'mydb' })
export class Country {
  @Column('int', { primary: true, name: 'idCountry' })
  idCountry: number;

  @Column('varchar', { name: 'name', length: 45 })
  name: string;

  @Column('date', { name: 'createdAt', nullable: true })
  createdAt: string | null;

  @Column('date', { name: 'updatedAt', nullable: true })
  updatedAt: string | null;

  @OneToMany(() => Department, (department) => department.country2)
  departments: Department[];
}
