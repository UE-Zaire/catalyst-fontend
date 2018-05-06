import * as React from 'react';
import ForceGraph from "./dataVizComponents/BasicForce";
import { miserables } from "./testData/leMis";


export default class App extends React.Component {

  public render() {
    return (
      <div>
        <ForceGraph width={2200} height={1500} data={miserables}/>
      </div>
    );
  }
}