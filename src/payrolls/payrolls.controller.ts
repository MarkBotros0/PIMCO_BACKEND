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

@Controller('payrolls')
export class PayrollsController {
  constructor(private readonly payrollsService: PayrollsService) {}

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Post('submit')
  async submitPayrolls() {
    return this.payrollsService.submitPayrolls();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Get('past')
  async findAllPast(@Query() query: PayrollQueryDto) {
    return this.payrollsService.findAllPast(query);
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Get('current')
  async findAll(@Query() query: PayrollQueryDto) {
    return this.payrollsService.findAllCurrent(query);
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.payrollsService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePayrollDto: UpdatePayrollDto
  ) {
    return this.payrollsService.update(+id, updatePayrollDto);
  }
}
