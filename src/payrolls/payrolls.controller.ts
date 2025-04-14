import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Post
} from '@nestjs/common';
import { PayrollsService } from './payrolls.service';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PayrollQueryDto } from './dto/payroll-query.dto';
import { AdminOrHRGuard } from '../auth/guards/admin-or-hr.guard';
import { Payroll } from './entities/payroll.entity';
import { PayrollView } from './views/payroll.view';

@Controller('payrolls')
export class PayrollsController {
  constructor(private readonly payrollsService: PayrollsService) {}

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Post('submit')
  async submitPayrolls() {
    await this.payrollsService.submitPayrolls();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Get('past')
  async findAllPast(@Query() query: PayrollQueryDto) {
    const payrolls: Payroll[] = await this.payrollsService.findAllPast(query);
    return new PayrollView(payrolls).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Get('current')
  async findAll(@Query() query: PayrollQueryDto) {
    const payrolls: Payroll[] =
      await this.payrollsService.findAllCurrent(query);
    return new PayrollView(payrolls).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const payroll: Payroll = await this.payrollsService.findOne(+id);
    return new PayrollView(payroll).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePayrollDto: UpdatePayrollDto
  ) {
    const payroll: Payroll = await this.payrollsService.update(
      +id,
      updatePayrollDto
    );
    return new PayrollView(payroll).render();
  }
}
