import { EmployeeTypeEntity } from '../entities/employee-type.entity';

export class EmployeeTypeView {
  constructor(private readonly data: EmployeeTypeEntity | EmployeeTypeEntity[]) {}

  render(): any {
    if (Array.isArray(this.data)) {
      return this.data.map((type) => this.renderEmployeeType(type));
    }
    return this.renderEmployeeType(this.data);
  }

  private renderEmployeeType(typeEntity: EmployeeTypeEntity): any {
    if (!typeEntity) return;

    const employeeTypeData: Partial<EmployeeTypeEntity> = {
      id: typeEntity.id,
      name_ar: typeEntity.name_ar,
      name_en: typeEntity.name_en
    };

    return {
      ...employeeTypeData
    };
  }
}
