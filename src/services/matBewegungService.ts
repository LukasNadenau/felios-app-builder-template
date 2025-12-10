import data from '../data/MatBewegung.json';

export interface MatBewegung {
  id: number;
  matBewegungArt: string;
  materialId: number;
  menge: number;
  upoTyp: string;
  upoId: number;
  tag: number;
  fix: boolean;
}

export const matBewegungService = {
  getAll: async (): Promise<MatBewegung[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data as MatBewegung[]), 100);
    });
  },

  getById: async (id: number): Promise<MatBewegung | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = data.find((item) => item.id === id);
        resolve(item as MatBewegung | undefined);
      }, 100);
    });
  },

  getByMaterial: async (materialId: number): Promise<MatBewegung[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = data.filter((item) => item.materialId === materialId);
        resolve(items as MatBewegung[]);
      }, 100);
    });
  },
};
