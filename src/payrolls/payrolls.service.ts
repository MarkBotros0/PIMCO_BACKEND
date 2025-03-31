import { Injectable } from '@nestjs/common';
import { UpdatePayrollDto } from './dto/update-payroll.dto';

@Injectable()
export class PayrollsService {
  async submitPayrolls() {
    return 'This action adds a new payroll';
  }

  async findAllPast() {
    return `This action returns all payrolls`;
  }

  async findAllCurrent() {
    return `This action returns all payrolls`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} payroll`;
  }

  async update(id: number, updatePayrollDto: UpdatePayrollDto) {
    return `This action updates a #${id} payroll`;
  }
}
