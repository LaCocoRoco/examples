import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: true, type: 'varchar' })
  public googleId!: string;

  @Column({ nullable: true, type: 'varchar' })
  public facebookId!: string;

  @Column({ nullable: true, type: 'varchar' })
  public githubId!: string;

  @Column({ nullable: true, type: 'varchar' })
  public name!: string;
}
