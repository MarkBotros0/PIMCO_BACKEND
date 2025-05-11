import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>
  ) {}

  async create(createSiteDto: CreateSiteDto): Promise<Site> {
    if (!createSiteDto.contractedDays) {
      createSiteDto.contractedDays = 15;
    }
    if (!createSiteDto.workingHrsPerDay) {
      createSiteDto.workingHrsPerDay = 8;
    }

    return this.siteRepository.save({ ...createSiteDto });
  }

  async findAll(): Promise<Site[]> {
    return this.siteRepository.find();
  }

  async findOne(id: number): Promise<Site> {
    const site: Site = await this.siteRepository.findOne({ where: { id } });
    if (!site) {
      throw new NotFoundException('Site Id is not found');
    }
    return site;
  }

  async update(id: number, updateSiteDto: UpdateSiteDto): Promise<Site> {
    const site: Site = await this.siteRepository.findOne({ where: { id } });
    Object.assign(site, updateSiteDto);
    await this.siteRepository.update(site.id, site);
    return this.findOne(site.id);
  }

  async remove(id: number): Promise<void> {
    await this.siteRepository.delete(id);
  }
}
