import apiClient from './apiClient';

export interface PackageItem {
  name: string;
  type: 'PRODUCT' | 'EVENT';
  defDimensions?: string;
  defPages?: number;
  defQuantity?: number;
  description?: string;
}

export interface CreatePackageData {
  category: string;
  name: string;
  description?: string;
  basePrice: number;
  items: PackageItem[];
}

export interface Package {
  id: string;
  category: string;
  name: string;
  description?: string;
  basePrice: number;
  isActive: boolean;
  items: PackageItem[];
  createdAt: string;
  updatedAt: string;
}

export const packagesApi = {
  /**
   * Create a new package
   */
  async createPackage(data: CreatePackageData): Promise<Package> {
    const response = await apiClient.post<Package>('/packages', data);
    return response.data;
  },

  /**
   * Get all packages
   */
  async getPackages(): Promise<Package[]> {
    const response = await apiClient.get<Package[]>('/packages');
    return response.data;
  },

  /**
   * Get a single package by ID
   */
  async getPackage(id: string): Promise<Package> {
    const response = await apiClient.get<Package>(`/packages/${id}`);
    return response.data;
  },

  /**
   * Delete a package
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/packages/${id}`);
  },

  /**
   * Update a package
   */
  async update(id: string, data: Partial<CreatePackageData>): Promise<Package> {
    const response = await apiClient.put<Package>(`/packages/${id}`, data);
    return response.data;
  },
};
