import data from '../data/KundenAufPos.json';

export interface KundenAufPos {
  id: number;
  materialId: number;
  menge: number;
  zieltermin: number;
}

export const kundenAufPosService = {
  getAll: async (): Promise<KundenAufPos[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data as KundenAufPos[]), 100);
    });
  },

  getById: async (id: number): Promise<KundenAufPos | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = data.find((item) => item.id === id);
        resolve(item as KundenAufPos | undefined);
      }, 100);
    });
  },
};
