import { UserDocuments } from '../entities/user-documents.entity';

export class DocumentsView {
  constructor(private readonly data: UserDocuments | UserDocuments[]) {}

  render(): any {
    if (Array.isArray(this.data)) {
      return this.data.map((user) => this.renderUserDocuments(user));
    }
    return this.renderUserDocuments(this.data);
  }

  private renderUserDocuments(documents: UserDocuments): any {
    if (!documents) return;

    const documentsData: Partial<UserDocuments> = {
      id: documents.id,
      birthCertificate: documents.birthCertificate,
      certificate_111: documents.certificate_111,
      graduationCertificate: documents.graduationCertificate,
      insurance: documents.insurance,
      fish: documents.fish,
      toxicityReport: documents.toxicityReport,
      personalPhoto: documents.personalPhoto,
      kaabAlaamal: documents.kaabAlaamal,
      driverLicense: documents.driverLicense,
      driverLicenseExpiration: documents.driverLicenseExpiration,
      militaryCertificate: documents.militaryCertificate,
      militaryCertificateExpiration: documents.militaryCertificateExpiration,
      personalId: documents.personalId,
      personalIdExpiration: documents.personalIdExpiration
    };

    return {
      ...documentsData,
    };
  }
}
