import { Projekt, ProjekteService } from './projekte.service';
import { Netzplan, NetzplaeneService } from './netzplaene.service';
import { Vorgang, VorgaengeService } from './vorgaenge.service';

export interface NetzplanMitVorgaenge extends Netzplan {
  vorgaenge: Vorgang[];
}

export interface ProjektStruktur extends Projekt {
  netzplaene: NetzplanMitVorgaenge[];
}

export class ProjektStrukturService {
  private projekteService = new ProjekteService();
  private netzplaeneService = new NetzplaeneService();
  private vorgaengeService = new VorgaengeService();

  async getByProjektId(projektId: number): Promise<ProjektStruktur | null> {
    const projekt = await this.projekteService.getById(projektId);

    if (!projekt) return null;

    const netzplaene = await this.netzplaeneService.getByProjektId(projektId);

    const netzplaeneMitVorgaenge: NetzplanMitVorgaenge[] = await Promise.all(
      netzplaene.map(async (netzplan) => {
        const vorgaenge = await this.vorgaengeService.getByNetzplanId(netzplan.id!);
        return {
          ...netzplan,
          vorgaenge
        };
      })
    );

    return {
      ...projekt,
      netzplaene: netzplaeneMitVorgaenge
    };
  }

  async getByProjektCode(projektCode: string): Promise<ProjektStruktur | null> {
    const projekt = await this.projekteService.getByCode(projektCode);

    if (!projekt) return null;

    return this.getByProjektId(projekt.id!);
  }

  async getAll(): Promise<ProjektStruktur[]> {
    const projekte = await this.projekteService.getAll();

    return Promise.all(
      projekte.map(projekt => this.getByProjektId(projekt.id!))
    ).then(results => results.filter((p): p is ProjektStruktur => p !== null));
  }
}
