/**
 * My Vehicles Page
 * * Purpose:
 * - Displays a list of vehicles registered by the user.
 * - Provides functionality to add a new vehicle or edit an existing one via a modal.
 * * Why it's needed:
 * - Serves as the central hub for a user's vehicle management.
 * - This page is shown when a user with at least one registered vehicle navigates from the main My Page.
 */
import React, { useState, useEffect, useCallback } from 'react';
import UserApiService, { UserCarResDTO, UserCarReqDTO } from '../../../services/user.api';
import PageContainer from '../../../shared/components/layout/PageContainer';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { VehicleRegisterModal } from '../modals/VehicleRegisterModal';
import { useToast } from '../../../hooks/use-toast';

export default function MyVehiclesPage() {
  const [vehicles, setVehicles] = useState<UserCarResDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<UserCarResDTO | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetches the list of vehicles from the server.
  const fetchVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await UserApiService.getMyVehicles();
      setVehicles(data);
    } catch (error) {
      toast({
        title: "오류",
        description: "차량 목록을 불러오는 데 실패했습니다.",
        variant: "destructive",
      });
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetches vehicles on initial component mount.
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Handler for opening the modal to edit a vehicle.
  const handleEditClick = (vehicle: UserCarResDTO) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  // Handler for opening the modal to add a new vehicle.
  const handleAddNewClick = () => {
    setSelectedVehicle(undefined);
    setIsModalOpen(true);
  };
  
  // Handler for submitting new or updated vehicle data.
  const handleFormSubmit = async (vehicleData: UserCarReqDTO) => {
    try {
      if (selectedVehicle) {
        // Update existing vehicle
        await UserApiService.updateMyVehicle(selectedVehicle.userCarId, vehicleData);
        toast({ title: "성공", description: "차량 정보가 수정되었습니다." });
      } else {
        // Create new vehicle
        await UserApiService.createMyVehicle(vehicleData);
        toast({ title: "성공", description: "새로운 차량이 등록되었습니다." });
      }
      setIsModalOpen(false);
      fetchVehicles(); // Refresh the list after submission
    } catch (error) {
       toast({
        title: "오류",
        description: "차량 등록/수정에 실패했습니다.",
        variant: "destructive",
      });
      console.error("Failed to submit vehicle form:", error);
    }
  };

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">내 차량 관리</h1>
          <Button onClick={handleAddNewClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            새 차량 등록
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-4 text-muted-foreground">차량 목록을 불러오는 중...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.length > 0 ? (
              vehicles.map(vehicle => (
                <Card key={vehicle.userCarId} className="transition-shadow hover:shadow-lg">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold text-gray-900">{vehicle.carModel}</p>
                      <p className="text-md text-gray-600">{vehicle.carNumber} ({vehicle.modelYear}년)</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(vehicle)}>
                      수정
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center p-12 border-2 border-dashed">
                <h3 className="text-lg font-medium text-muted-foreground">등록된 차량이 없습니다.</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-4">첫 차량을 등록하여 견적 요청을 시작해보세요.</p>
                <Button onClick={handleAddNewClick}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  지금 바로 차량 등록하기
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Modal for registering and editing vehicles */}
      <VehicleRegisterModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={selectedVehicle}
        onSubmit={handleFormSubmit}
      />
    </PageContainer>
  );
}

