import { SalaryDetails } from '../entities/salary-details.entity';

export class SalaryDetailsView {
  constructor(private readonly data: SalaryDetails | SalaryDetails[]) {}

  render(): any {
    if (Array.isArray(this.data)) {
      return this.data.map((user) => this.renderSalaryDetails(user));
    }
    return this.renderSalaryDetails(this.data);
  }

  private renderSalaryDetails(salaryDetails: SalaryDetails): any {
    if (!salaryDetails) return;

    const salaryDetailsData: Partial<SalaryDetails> = {
      id: salaryDetails.id,
      dailySalary: salaryDetails.dailySalary,
      medical: salaryDetails.medical,
      incomeTax: salaryDetails.incomeTax,
      foodAllowance: salaryDetails.foodAllowance,
      socialInsurance: salaryDetails.socialInsurance,
      transportationAllowance: salaryDetails.transportationAllowance
    };

    return {
      ...salaryDetailsData
    };
  }
}
