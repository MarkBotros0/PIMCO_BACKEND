import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({name:'user_documents'})
export class UserDocuments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text",name:'birth_certificate', nullable: true })
  birthCertificate: string;

  @Column({ type: "text",name:'military_certificate', nullable: true })
  militaryCertificate: string;

  @Column({ type: "date",name:'military_certificate_expiration', nullable: true })
  militaryCertificateExpiration: Date;

  @Column({ type: "text", nullable: true })
  fish: string;

  @Column({ type: "text",name:'personal_id', nullable: true })
  personalId: string;

  @Column({ type: "date",name:'personal_id_expiration', nullable: true })
  personalIdExpiration: Date;

  @Column({ type: "text",name:'graduation_certificate', nullable: true })
  graduationCertificate: string;

  @Column({ type: "text",name:'personal_photo', nullable: true })
  personalPhoto: string;

  @Column({ type: "text",name:'driver_license' ,nullable: true })
  driverLicense: string;

  @Column({ type: "date",name:'driver_license_expiration', nullable: true })
  driverLicenseExpiration: Date;

  @Column({ type: "text", nullable: true })
  insurance: string;

  @Column({ type: "text",name:'certificate_111', nullable: true })
  certificate_111: string;

  @Column({ type: "text", name:'toxicity_report',nullable: true })
  toxicityReport: string;

  @Column({ type: "text", name:'kaab_alaamal',nullable: true })
  kaabAlaamal: string;

  @Column({ type: "text",name:'skill_measurement', nullable: true })
  skillMeasurement: string;

  @OneToOne(() => User, (user) => user.documents, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;
}

