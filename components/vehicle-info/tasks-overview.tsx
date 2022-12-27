import { Button, Progress } from "antd";
import { useVehicleCheckpoints } from "hooks/useVehicles";
import { useEffect } from "react";
import { solveCheckpointsByStep } from "services/checkpoints.service";
import { updateVehicleStatus } from "services/vehicles.service";

const TasksOverview = ({
  areas,
  totalProgress,
  switchToForm,
  filter,
  vehicleId,
  refetchCheckpoints,
  getAreaData,
}) => {
  const solveAllPreparation = async () => {
    const resp = await solveCheckpointsByStep(filter, vehicleId);
    if (resp.ok) {
      refetchCheckpoints();
      getAreaData();
    }
  };

  return (
    <div className="flex w-full ml-8">
      <div className="flex flex-col w-2/3">
        <div className="grid grid-cols-2 gap-4">
          {areas &&
            areas.map((area) => {
              if (area.type === filter)
                return (
                  <div className="flex flex-col">
                    <div
                      key={area.title}
                      className="flex flex-col items-center p-2 rounded-md cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        switchToForm(area.id);
                      }}
                    >
                      <Progress
                        percent={
                          0 | ((area.solvedPoints / area.totalPoints) * 100)
                        }
                        type="circle"
                      />
                      <h3 className="mt-2 font-bold text-gray-700">
                        {area.title}
                      </h3>
                      {
                        <p className="m-0 text-gray-700">
                          {area.solvedPoints | 0} / {area.totalPoints | 0} Aufgaben
                          erledigen

                        </p>
                      }
                    </div>
                  </div>
                );
            })}
        </div>
        <div className="flex justify-center mt-8">
          <Button onClick={solveAllPreparation} type="primary">
            Alles auf grün setzen
          </Button>
        </div>
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => {
              let new_status = "";

              if (filter == 0) {
                new_status = "MAX_FINISHED";
              } else if (filter == 1) {
                new_status = "CHECKED";
              } else if (filter == 2) {
                new_status = "SALE";
              }
              updateVehicleStatus(vehicleId, new_status);
            }}
            type="primary"
          >
            Status ändern
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-1/3">
        <Progress
          width={150}
          strokeColor={{
            "0%": "#108ee9",
            "100%": "#87d068",
          }}
          percent={0 | ((totalProgress.solved / totalProgress.total) * 100)}
          type="circle"
        />
        <h3 className="mt-2 font-bold text-gray-700">Overall Progress</h3>
        <p>
          {totalProgress.solved} / {totalProgress.total}
        </p>
      </div>
    </div>
  );
};

export default TasksOverview;
