import data from '../data/Arbeitsgang.json';

export interface Arbeitsgang {
  id: number;
  bezeichnung: string;
  ressourceId: number;
  ressourceBedarf: number;
  parentFertObjId: number;
  dauer: number;
  start: number;
  ende: number;
  fruehesterStart: number;
  spaetesterStart: number;
  fruehestesEnde: number;
  spaetestesEnde: number;
}

export const arbeitsgangService = {
  getAll: async (): Promise<Arbeitsgang[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data as Arbeitsgang[]), 100);
    });
  },

  getById: async (id: number): Promise<Arbeitsgang | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = data.find((item) => item.id === id);
        resolve(item as Arbeitsgang | undefined);
      }, 100);
    });
  },

  getByRessource: async (ressourceId: number): Promise<Arbeitsgang[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = data.filter((item) => item.ressourceId === ressourceId);
        resolve(items as Arbeitsgang[]);
      }, 100);
    });
  },
};
