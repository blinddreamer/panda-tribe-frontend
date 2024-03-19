import { FaGithub } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function Footer() {
  return (
    <>
      <Card className="text-center cardh">
        <Card.Body>
          <Card.Text>
            &copy; {new Date().getFullYear()}. Made with ❤️ by{" "}
            <a href="https://evewho.com/character/92997815">Gnomcho Kraitan</a>
          </Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted">
          <a href="https://github.com/blinddreamer/eve-helper-frontend">
            <FaGithub />
          </a>{" "}
          <a href="">
            <MdEmail />
          </a>
        </Card.Footer>
      </Card>
    </>
  );
}

export default Footer;
