import type { CarType } from '../cars/cars.types';

export interface MarketplaceCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  city: string;
  carType: CarType;
  createdAt: Date;
}

export interface MarketplaceDriver {
  id: string;
  name: string;
  city: string | null;
  experience: number | null;
  carTypes: CarType[];
  createdAt: Date;
}

export interface MarketplaceListQuery {
  page: number;
  limit: number;
  radiusKm?: number;
  latitude?: number;
  longitude?: number;
  referenceCity?: string;
  carType?: CarType;
}

export interface MarketplaceCarFilter {
  radiusKm?: number;
  latitude?: number;
  longitude?: number;
  referenceCity?: string;
  carType?: CarType;
}

export interface MarketplaceDriverFilter {
  radiusKm?: number;
  latitude?: number;
  longitude?: number;
  referenceCity?: string;
  carType?: CarType;
}

export interface MarketplaceCarDocument {
  _id: { toString(): string };
  brand: string;
  model: string;
  year: number;
  city: string;
  carType: CarType;
  createdAt: Date;
}

export interface MarketplaceDriverDocument {
  _id: { toString(): string };
  name: string;
  city: string | null;
  experience: number | null;
  carTypes: CarType[];
  createdAt: Date;
}
