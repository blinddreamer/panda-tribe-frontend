import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
function AppraisalForm(props) {
  return (
    <div id="appraisalForm">
      {props.errorMessage && <Alert>{props.errorMessage}</Alert>}
      <Form>
        <Form.Group controlId="appraisalText">
          <Form.Label>Appraisal:</Form.Label>
          <Form.Control
            key="appraisal"
            as="textarea"
            name="appraisal"
            placeholder="List of items..."
          />
        </Form.Group>
        <Form.Group controlId="marketRegion">
          <Form.Label>Market Region:</Form.Label>
          <Form.Select
            key="appraisal-select"
            aria-label="Default select example"
          >
            {props.regions.map((region, index) => {
              return (
                <option
                  key={index}
                  selected={region.regionId == 10000002}
                  value={region.regionId}
                >
                  {region.regionName}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
        <p></p>
        <Button variant="secondary" onClick={props.calculateAppraisal}>
          {props.isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </Form>
    </div>
  );
}
export default AppraisalForm;
