export interface Activite {
  type: string;
  date: string;
  titre: string;
  description: string;
  horaire_debut: string;
  horaire_fin: string;
  horaire_date_debut: string;
  horaire_date_fin: string;
  id?: string;
  NP_max: number;
  NP_inscrit: number;
  prix: number;
  imgURL: string;
  status: string;
  rating: number;
}
