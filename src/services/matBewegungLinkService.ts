import data from '../data/MatBewegungLink.json';

export interface MatBewegungLink {
  id: number;
  matBewegungZugangId: number;
  matBewegungAbgangId: number;
  menge: number;
  fix: boolean;
}

export const matBewegungLinkService = {
  getAll: async (): Promise<MatBewegungLink[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data as MatBewegungLink[]), 100);
    });
  },

  getById: async (id: number): Promise<MatBewegungLink | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = data.find((item) => item.id === id);
        resolve(item as MatBewegungLink | undefined);
      }, 100);
    });
  },

  getByZugang: async (matBewegungZugangId: number): Promise<MatBewegungLink[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = data.filter((item) => item.matBewegungZugangId === matBewegungZugangId);
        resolve(items as MatBewegungLink[]);
      }, 100);
    });
  },

  getByAbgang: async (matBewegungAbgangId: number): Promise<MatBewegungLink[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = data.filter((item) => item.matBewegungAbgangId === matBewegungAbgangId);
        resolve(items as MatBewegungLink[]);
      }, 100);
    });
  },
};
