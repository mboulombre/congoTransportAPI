import { Column, Entity, ManyToMany } from 'typeorm';
import { Trajet } from './Trajet.entity';

@Entity('typetransport', { schema: 'mydb' })
export class Typetransport {
  @Column('int', { primary: true, name: 'idTypeTransport' })
  idTypeTransport: number;

  @Column('varchar', { name: 'Name', length: 45 })
  name: string;

  @Column('varchar', { name: 'Description', nullable: true, length: 45 })
  description: string | null;

  @Column('date', { name: 'CreatedAt', nullable: true })
  createdAt: string | null;

  @Column('date', { name: 'UpdatedAt', nullable: true })
  updatedAt: string | null;

  @Column('date', { name: 'DeletedAt', nullable: true })
  deletedAt: string | null;

  @ManyToMany(() => Trajet, (trajet) => trajet.typetransports)
  trajets: Trajet[];
}
