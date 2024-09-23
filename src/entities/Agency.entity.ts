import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Trajet } from './Trajet.entity';

@Index('Email_UNIQUE', ['email'], { unique: true })
@Entity('agency', { schema: 'mydb' })
export class Agency {
  @Column('int', { primary: true, name: 'idAgency' })
  idAgency: number;

  @Column('varchar', { name: 'Name', length: 45 })
  name: string;

  @Column('varchar', { name: 'Adress', length: 45 })
  adress: string;

  @Column('varchar', { name: 'Email', unique: true, length: 45 })
  email: string;

  @Column('varchar', { name: 'Tel', length: 45 })
  tel: string;

  @Column('varchar', { name: 'Description', nullable: true, length: 45 })
  description: string | null;

  @Column('date', { name: 'CreatedAt', nullable: true })
  createdAt: string | null;

  @Column('date', { name: 'UpdatedAt', nullable: true })
  updatedAt: string | null;

  @Column('date', { name: 'DeletedAt', nullable: true })
  deletedAt: string | null;

  @OneToMany(() => Trajet, (trajet) => trajet.agency2)
  trajets: Trajet[];
}
