export interface Vehicle {
  _id: string;
  vehicleName: string;
  vehicleNumber: string;
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleRequest {
  vehicleName: string;
  vehicleNumber: string;
}

export interface UpdateVehicleRequest {
  vehicleName: string;
  vehicleNumber: string;
}

export interface AllVehiclesResponse {
  vehicles: Vehicle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VehicleDetailsResponse {
  vehicle: Vehicle;
}
