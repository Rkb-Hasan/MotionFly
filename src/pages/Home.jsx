import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1>Welcome to Motion Fly.</h1>
      <Link to="/tryon">
        <p>Go to Virtual Try On</p>
      </Link>
    </>
  );
}
