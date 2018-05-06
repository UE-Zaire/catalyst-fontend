import Axios from 'axios';
import * as React from 'react';
import ForceGraph from "./dataViz/BasicForce";
import { IData } from "./testData/leMis";
// import { miserables } from "./testData/leMis";


export default class App extends React.Component <{}, {}> {
  public state = {
    data: null
  };

  public componentDidMount() {
    Axios.post('http://localhost:3005/api/paths', { source: '0', target: 'Paris' })
      .then(({ data }) => {
        // tslint:disable-next-line:no-console
        console.log('response recieved: ', data);

        const graphData: IData = data;
        this.setState({
          data: graphData
        })
      })
      // tslint:disable-next-line:no-console
      .catch((err) => console.error(err));
  }



  public render() {
    const { data } = this.state;

    if (data !== null) {

      return (
        <div>
          <ForceGraph width={2200} height={1500} data={ data }/>
        </div>
      );
    } else {
      return (
        <div>
          Loading!
        </div>
      )
    }
  }
}