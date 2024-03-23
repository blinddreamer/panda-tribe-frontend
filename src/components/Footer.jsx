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
            &copy; {new Date().getFullYear()}. Made with ❤️ by{" "}
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
            <a href="mailto:contact@eve-helper.com">
              <MdEmail />
            </a>{" "}
          </span>
          <span id="icons">
            <a href="https://hub.docker.com/repository/docker/blinddreamer/eve-helper-frontend/">
              <FaDocker />
            </a>
          </span>
        </Card.Footer>
        <p />
        <div id="legal">
          EVE Online and the EVE logo are the registered trademarks of CCP hf.
          All rights are reserved worldwide. All other trademarks are the
          property of their respective owners. EVE Online, the EVE logo, EVE and
          all associated logos and designs are the intellectual property of CCP
          hf. All artwork, screenshots, characters, vehicles, storylines, world
          facts or other recognizable features of the intellectual property
          relating to these trademarks are likewise the intellectual property of
          CCP hf. CCP hf. has granted permission to EVE Tycoon to use EVE Online
          and all associated logos and designs for promotional and information
          purposes on its website but does not endorse, and is not in any way
          affiliated with, EVE Tycoon. CCP is in no way responsible for the
          content on or functioning of this website, nor can it be liable for
          any damage arising from the use of this website.
        </div>
      </Card>
    </>
  );
}

export default Footer;
