import data from '../data/FertObjekt.json';

export interface FertObjekt {
  id: number;
  bezeichnung: string;
  typ: string;
  parentFertObjektId: number;
  zieltermin: number;
  dauer: number;
  start: number;
  ende: number;
}

export const fertObjektService = {
  getAll: async (): Promise<FertObjekt[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data as FertObjekt[]), 100);
    });
  },

  getById: async (id: number): Promise<FertObjekt | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = data.find((item) => item.id === id);
        resolve(item as FertObjekt | undefined);
      }, 100);
    });
  },
};
