import { App } from "./App";
import { Mfe, MfeContext } from "./Mfe";
import "./index.css";

function MfeServer(props: { context: MfeContext }) {
  return (
    <Mfe context={props.context}>
      <App />
    </Mfe>
  );
}

export default MfeServer;
