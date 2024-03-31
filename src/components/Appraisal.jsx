import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";

function Appraisal() {
  const [onStart, setOnstart] = useState(true);
  const [regions, setRegions] = useState([{}]);
   // const backend = "https://api.eve-helper.com/api/v1/";
   const backend = "http://thunder:8080/api/v1/";
  useEffect(() => {
    onStart && getRegions();
    setOnstart(false);
  });

  async function getRegions() {
    const response = await axios.get(backend + "regions");
    if (response.status === 200) {
      setRegions(response.data);
    }
  }

  return (
    <>
      <div>
      <Form>
      <Form.Group controlId="appraisal">
        <Form.Label>Appraisal:</Form.Label>
        <Form.Control
          type="textarea"
          name="appraisal"
          placeholder="Paste a list of items from ingame"
        />
      </Form.Group>
      <Form.Group controlId="marketRegion">
        <Form.Label>Market Region:</Form.Label>
        <Form.Select aria-label="Default select example">
          {regions.map((region) => {
            return (
              <option
                selected={region.regionId == 10000002}
                value={region.regionId}
              >
                {region.regionName}
              </option>
            );
          })}
        </Form.Select>
      </Form.Group>
      </Form>

      </div>
    </>
  );
}
export default Appraisal;
