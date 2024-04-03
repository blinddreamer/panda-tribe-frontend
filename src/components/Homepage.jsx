import { React } from "react";
import Alert from "react-bootstrap/Alert";

function Homepage() {
  return (
    <>
      <div>
        <div>
          <Alert variant="danger">UNDER CONSTRUCTION</Alert>
        </div>
        <main>
          <p>
            eve-helper is an advanced industrial calculator aiming to help with
            your industrial costs.
          </p>
          <p>
            Whether you're a seasoned industrialist or just starting out,{" "}
            eve-helper provides comprehensive tools and features to streamline
            your industrial operations in EVE.
          </p>
          <p>
            With eve-helper, you can calculate material requirements, production
            costs, profit margins, and more for a wide range of industrial
            activities.{" "}
          </p>
          <p>
            Our user-friendly interface and customizable settings make it easy
            to optimize your industry and maximize your profits.
          </p>
        </main>
      </div>
    </>
  );
}
export default Homepage;
