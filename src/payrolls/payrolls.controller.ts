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
import { HRGuard } from '../auth/guards/hrGuard';

@Controller('payrolls')
export class PayrollsController {
  constructor(private readonly payrollsService: PayrollsService) {}

  @UseGuards(AccessTokenGuard, HRGuard)
  @Post('submit')
  async submitPayrolls() {
    return this.payrollsService.submitPayrolls();
  }

  @UseGuards(AccessTokenGuard, HRGuard)
  @Get('past')
  async findAllPast(@Query() query: PayrollQueryDto) {
    return this.payrollsService.findAllPast(query);
  }

  @UseGuards(AccessTokenGuard, HRGuard)
  @Get('current')
  async findAll(@Query() query: PayrollQueryDto) {
    return this.payrollsService.findAllCurrent(query);
  }

  @UseGuards(AccessTokenGuard, HRGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.payrollsService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard, HRGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePayrollDto: UpdatePayrollDto
  ) {
    return this.payrollsService.update(+id, updatePayrollDto);
  }
}
