import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity';
import { SiteView } from './views/site.view';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { AdminOrHRGuard } from '../auth/guards/admin-or-hr.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('sites')
@ApiBearerAuth()
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Post()
  async create(@Body() createSiteDto: CreateSiteDto) {
    const site: Site = await this.sitesService.create(createSiteDto);
    return new SiteView(site).render();
  }
  
  @Get()
  async findAll() {
    const sites: Site[] = await this.sitesService.findAll();
    return new SiteView(sites).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const site: Site = await this.sitesService.findOne(+id);
    return new SiteView(site).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    const site: Site = await this.sitesService.update(+id, updateSiteDto);
    return new SiteView(site).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.sitesService.remove(+id);
    return { message: 'Site deleted successfully' };
  }
}
