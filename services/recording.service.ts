import axios from "axios";

export async function updatePhysicalRecording(data) {
  const result = await axios
    .put(process.env.API_URL + "/api/physicalRecording", data)
    .catch((err) => console.log(err));
}
