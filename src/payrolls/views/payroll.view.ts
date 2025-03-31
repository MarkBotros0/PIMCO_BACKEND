import { Payroll } from '../entities/payroll.entity';
import { UserWithSiteView } from '../../users/views/user-with-site.view';

export class PayrollView {
  constructor(private readonly data: Payroll | Payroll[]) {}

  render(): any {
    if (Array.isArray(this.data)) {
      return this.data.map((payroll) => this.renderPayroll(payroll));
    }
    return this.renderPayroll(this.data);
  }

  private renderPayroll(payroll: Payroll): any {
    if (!payroll) return;

    const payrollData: Partial<Payroll> = {
      id: payroll.id,
      month: payroll.month,
      year: payroll.year,
      approvalStatus: payroll.approvalStatus,
      attendance: payroll.attendance,
      overtimeInHours: payroll.overtimeInHours,
      totalAttendance: payroll.totalAttendance,
      incomeTax: payroll.incomeTax,
      penalties: payroll.penalties,
      advances: payroll.advances,
      socialInsurance: payroll.socialInsurance,
      totalDeductions: payroll.totalDeductions,
      medical: payroll.medical,
      bonusesAndAllowances: payroll.bonusesAndAllowances,
      transportationAllowance: payroll.transportationAllowance,
      foodAllowance: payroll.foodAllowance,
      dailyDifference: payroll.dailyDifference,
      currencyDifference: payroll.currencyDifference,
      netSalary: payroll.netSalary,
      totalSalary: payroll.totalSalary
    };

    return {
      ...payrollData,
      user: new UserWithSiteView(payroll.user)
    };
  }
}
