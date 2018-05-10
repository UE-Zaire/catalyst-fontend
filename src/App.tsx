/* tslint:disable:no-console jsx-no-lambda */
import { Layout, Spin } from "antd";
import Axios from 'axios';
import * as React from 'react';
import '../node_modules/antd/es/input/style/index.css';
import Head from "./components/Head";
import Nav from "./components/Nav";
// import Tweets from "./components/Tweets";
import ForceGraph from "./dataViz/BasicForce";
import Embed from "./dataViz/Embed";
import { IData } from "./testData/leMis";

const { Content } = Layout;

interface IGlobalState {
  collapsed: boolean;
  currentFetch: string;
  data: IData | null;
  distance: number;
  embed: object[] | null;
  height: number;
  renderChild: boolean;
  search: string[];
  selectedFetch: string;
  value1: string;
  value2: string;
  width: number;

}

export default class App extends React.Component {
  
  public state: IGlobalState = {
    collapsed: false,
    currentFetch: 'surroundings',
    data: null,
    distance: 1,
    embed: null,
    height: 0,
    renderChild: false,
    search: [],
    selectedFetch: 'paths',
    value1: 'Mammal',
    value2: '',
    width: 0
  };
  
  public divElement: any = {};
  
  
  public componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize)
    console.log('initial window width: ', window.innerWidth)
    
    const height = window.innerHeight > 1300 ? window.innerHeight * .90 : window.innerHeight * .82;
    const width = window.innerWidth > 2500 ? window.innerWidth * .90 : window.innerWidth * .816;
    
    Axios.post('http://localhost:3005/api/surroundings', { source: this.state.value1, distance: 1 })
    .then(({ data }) => {
      const graphData: IData = data;
      
      Axios.get('http://localhost:3005/api/nodesList')
      // tslint:disable-next-line:no-shadowed-variable
      .then(( { data } ) => {
        const searchOpts: string[] = data;

        Axios.get('http://localhost:3005/api/embedding')
          // tslint:disable-next-line:no-shadowed-variable
          .then(({ data }) => {
            
            console.log('incoming data from csv ', data);

            this.setState({
              data: graphData,
              embed: data,
              height,
              search: searchOpts,
              width,
            });
          })
          .catch((err) => console.error(err));
        
      })
      .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  
  public render() {
    const { data, embed, height, width, search } = this.state;

    return (
      <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
        <Nav collapsed={this.state.collapsed} select={this.handleSelect} view={this.state.currentFetch} />
        <Layout>
          <Head
            collapsed={this.state.collapsed}
            toggleSider={this.toggle}
            suggestions={search}
            input1={this.state.value1}
            input2={this.state.value2}
            ctrlInput={this.controlledInput}
            ctrlSelect1={this.controlledSelect1}
            ctrlSelect2={this.controlledSelect2}
            view={this.state.currentFetch}
            chgView={this.handleChange}
            postPaths={this.postPaths}
            postPath={this.postPath}
            postSurroundings={this.postSurroundings}
          />
          {data !== null ?
            (
              <Content
                style={{ margin: '2rem', padding: '2rem', background: '#fff'}}
              >
                <div ref={divElement => { this.divElement = divElement }} style={{ height: this.state.height, width: `${!this.state.collapsed ? this.state.width : this.state.width * .9}` }}>
                  <ForceGraph width={this.state.width} height={this.state.height} data={data} condRender={this.condRender}/>
                </div>
              </Content>) :
            (<Content>
              <div ref={divElement => { this.divElement = divElement }} style={{ height: '100vh', width: '90vw' }}>
                <Spin size="large" />
              </div>
            </Content>)
          }
          {this.state.renderChild ? 
            ( 
              embed !== null ? 
                (<Content
                    style={{ margin: '2rem', padding: '2rem', background: '#fff'}}
                  >
                    <div ref={divElement => { this.divElement = divElement }} style={{ height: this.state.height, width: `${!this.state.collapsed ? this.state.width : this.state.width * .9}` }}>
                      <Embed height={height} width={width} data={embed} />
                    </div>
                  </Content>) :
                (<Content>
                  <div ref={divElement => { this.divElement = divElement }} style={{ height: '100vh', width: '90vw' }}>
                    <Spin size="large" />
                  </div>
                </Content>)) :
            null
          }
        </Layout>
      </Layout>
    );
  }

  private condRender = () => {
    this.setState({
      renderChild: !this.state.renderChild
    });
  }
    
  private postPaths = () => {
    Axios.post('http://localhost:3005/api/paths', { source: this.state.value1, target: this.state.value2 })
    // tslint:disable-next-line:no-shadowed-variable
    .then(({ data }) => {
      const graphData: IData = data;
      this.setState({
        data: graphData,
      })
    })
    .catch((err) => console.error(err));
  }

  private postPath = () => {
    Axios.post('http://localhost:3005/api/path', { source: this.state.value1, target: this.state.value2 })
    // tslint:disable-next-line:no-shadowed-variable
    .then(({ data }) => {
      const graphData: IData = data;
      this.setState({
        data: graphData,
      })
    })
    .catch((err) => console.error(err));
  }

  private postSurroundings = () => {
    Axios.post('http://localhost:3005/api/surroundings', { source: this.state.value1, distance: this.state.distance })
    // tslint:disable-next-line:no-shadowed-variable
    .then(({ data }) => {
      const graphData: IData = data;
      this.setState({
        data: graphData,
      })
    })
    .catch((err) => console.error(err));
  }

  private handleResize = () => this.setState({
    height : window.innerHeight > 1100 ? window.innerHeight * .88 : window.innerHeight * .82,
    width : window.innerWidth > 2500 ? window.innerWidth * .888 : window.innerWidth * .80
  })

  private toggle = () => {
    const width = this.state.collapsed === true ? ( window.innerWidth > 2500 ? window.innerWidth * .90 : window.innerWidth * .83 ) : window.innerWidth * .93;

    this.setState({
      collapsed: !this.state.collapsed,
      width,
    });
  }

  private handleSelect = (e: any) => {
    this.setState({
      currentFetch: e.key,
    });
  }

  private handleChange = (e: any) => {
    console.log('hangling change', e);
    this.setState({
      // tslint:disable-next-line:radix
      distance: parseInt(e)
    });
  }

  private controlledInput = (e: any) => {
    
    const inputId = e.target.id;

    if (inputId === "value1") {
      this.setState({ value1: e.target.value })
    } else {
      this.setState({ value2: e.target.value })
    }
  }

  private controlledSelect1 = ( value1: string) => {
    this.setState({
      value1
    });
  }

  private controlledSelect2 = (value2: string) => {
    this.setState({
      value2
    });
  }

}