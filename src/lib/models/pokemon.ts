export interface Pokemon {
  id: number;
  name: string;
  color: string;
  types: { name: string; url: string }[];
  species: string;
  evolutions: Pokemon[];
  description: string;
  image: string;
  cries: string;
  height: number;
  weight: number;
  area: string;
}
