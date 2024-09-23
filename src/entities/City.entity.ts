import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Arrondissement } from './Arrondissement.entity';
import { Department } from './Department.entity';

@Index('fk_City_department1_idx', ['department'], {})
@Entity('city', { schema: 'mydb' })
export class City {
  @Column('int', { primary: true, name: 'idCity' })
  idCity: number;

  @Column('varchar', { name: 'name', length: 45 })
  name: string;

  @Column('varchar', { name: 'description', nullable: true, length: 45 })
  description: string | null;

  @Column('varchar', { name: 'CreatedAt', nullable: true, length: 45 })
  createdAt: string | null;

  @Column('varchar', { name: 'updatedAt', nullable: true, length: 45 })
  updatedAt: string | null;

  @Column('int', { primary: true, name: 'department' })
  department: number;

  @OneToMany(() => Arrondissement, (arrondissement) => arrondissement.city2)
  arrondissements: Arrondissement[];

  @ManyToOne(() => Department, (department) => department.cities, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'department', referencedColumnName: 'idDepartment' }])
  department2: Department;
}
