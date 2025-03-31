import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { PayrollsService } from './payrolls.service';
import { UpdatePayrollDto } from './dto/update-payroll.dto';

@Controller('payrolls')
export class PayrollsController {
  constructor(private readonly payrollsService: PayrollsService) {}

  @Get('past')
  async findAllPast() {
    return this.payrollsService.findAllPast();
  }

  @Get('current')
  async findAll() {
    return this.payrollsService.findAllCurrent();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.payrollsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePayrollDto: UpdatePayrollDto
  ) {
    return this.payrollsService.update(+id, updatePayrollDto);
  }
}
