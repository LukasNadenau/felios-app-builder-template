import data from '../data/MaterialVerbrauch.json';

export interface MaterialVerbrauch {
  arbeitsgangId: number;
  materialId: number;
  menge: number;
}

export const materialVerbrauchService = {
  getAll: async (): Promise<MaterialVerbrauch[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data as MaterialVerbrauch[]), 100);
    });
  },

  getByArbeitsgang: async (arbeitsgangId: number): Promise<MaterialVerbrauch[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = data.filter((item) => item.arbeitsgangId === arbeitsgangId);
        resolve(items as MaterialVerbrauch[]);
      }, 100);
    });
  },

  getByMaterial: async (materialId: number): Promise<MaterialVerbrauch[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = data.filter((item) => item.materialId === materialId);
        resolve(items as MaterialVerbrauch[]);
      }, 100);
    });
  },
};
