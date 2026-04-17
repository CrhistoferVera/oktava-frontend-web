export interface Address {
  id: string;
  label: string;
  direction: string;
  latitude: number;
  longitude: number;
  placeId?: string | null;
  departament: string;
  reference?: string | null;
  contact?: string | null;
}

export interface AddressPayload {
  label: string;
  direction: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  departament: string;
  reference?: string;
  contact?: string;
}
