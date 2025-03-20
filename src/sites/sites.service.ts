import { Injectable } from '@nestjs/common';
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
    return this.siteRepository.save({ ...createSiteDto });
  }

  async findAll(): Promise<Site[]> {
    return this.siteRepository.find();
  }

  async findOne(id: number): Promise<Site> {
    return this.siteRepository.findOne({ where: { id } });
  }

  async update(id: number, updateSiteDto: UpdateSiteDto): Promise<Site> {
    const site: Site = await this.siteRepository.findOne({ where: { id } });
    Object.assign(site, updateSiteDto);
    console.log(site);
    await this.siteRepository.update(site.id, site);
    return this.findOne(site.id);
  }

  async remove(id: number): Promise<void> {
    await this.siteRepository.delete(id);
  }
}
