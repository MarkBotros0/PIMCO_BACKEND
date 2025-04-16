import { Site } from '../entities/site.entity';

export class SiteView {
  constructor(private readonly data: Site | Site[]) {}

  render(): any {
    if (Array.isArray(this.data)) {
      return this.data.map((user) => this.renderSite(user));
    }
    return this.renderSite(this.data);
  }

  private renderSite(site: Site): any {
    if (!site) return;

    const siteData: Partial<Site> = {
      id: site.id,
      name: site.name,
      workingHrsPerDay: site.workingHrsPerDay,
      contractedDays: site.contractedDays,
      createdAt: site.createdAt
    };

    return {
      ...siteData
    };
  }
}
