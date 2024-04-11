import { IoLogoGithub } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import Card from "react-bootstrap/Card";
import { FaDocker } from "react-icons/fa";

function Footer() {
  return (
    <>
      <Card className="text-center cardh">
        <Card.Body>
          <Card.Text>
            Made with ❤️ by{" "}
            <a href="https://evewho.com/character/92997815">
              <span id="linkz">Gnomcho Kraitan</span>
            </a>
          </Card.Text>
        </Card.Body>

        <Card.Footer className="text-muted">
          <span id="icons">
            <a href="https://github.com/blinddreamer/eve-helper-frontend">
              <IoLogoGithub />
            </a>{" "}
          </span>
          <span id="icons">
            <a href="https://hub.docker.com/r/blinddreamer/eve-helper-frontend">
              <FaDocker />
            </a>{" "}
          </span>
          <span id="icons">
            <a href="mailto:contact@eve-helper.com">
              <MdEmail />
            </a>
          </span>
        </Card.Footer>
        <p />
        <div id="legal">
          © 2014 CCP hf. All rights reserved. "EVE", "EVE Online", "CCP", and
          all related logos and images are trademarks or registered trademarks
          of CCP hf.
        </div>
      </Card>
    </>
  );
}

export default Footer;
