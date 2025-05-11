import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-roles.enum';
import { DocumentsView } from './document.view';
import { SalaryDetailsView } from './salary-details.view';
import { SiteView } from '../../sites/views/site.view';

export class AllUserDataView {
  constructor(private readonly data: User | User[]) {}

  render(): any {
    if (Array.isArray(this.data)) {
      return this.data.map((user) => this.renderUser(user));
    }
    return this.renderUser(this.data);
  }

  private renderUser(user: User): any {
    if (!user) return;

    const rolePriority: UserRole[] = [
      UserRole.ADMIN,
      UserRole.HUMAN_RESOURCES,
      UserRole.NORMAL
    ];

    const highestRole: UserRole = rolePriority.find((role) =>
      user.roles.includes(role)
    );

    const userData: Partial<User> = {
      id: user.id,
      phoneNumber: user.phoneNumber,
      fullname: user.fullname,
      dateOfBirth: user.dateOfBirth,
      createdAt: user.createdAt,
      employeeType: user.employeeType
    };

    return {
      ...userData,
      highestRole,
      documents: user.documents
        ? new DocumentsView(user.documents).render()
        : {},
      salaryDetails: user.salaryDetails
        ? new SalaryDetailsView(user.salaryDetails).render()
        : {},
      site: user.site ? new SiteView(user.site).render() : {}
    };
  }
}
