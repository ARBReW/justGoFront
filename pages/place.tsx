import { useRecoilState, useRecoilValue } from "recoil";
import teststate from "../states/teststate";

export default function place() {
  const [test, setTest]= useRecoilState(teststate)
  //setTest('hi')
  return <div>WELCOME TO PLACE {test}</div>;
}
