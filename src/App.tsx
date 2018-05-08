/* tslint:disable:no-console jsx-no-lambda */
import { Button, Col, Icon, Layout, Menu, Row, Select, Spin } from "antd";
import Axios from 'axios';
import * as React from 'react';
import * as Autocomplete from "react-autocomplete";
import '../node_modules/antd/es/input/style/index.css';
import * as Logo from "./assets/zaire.logo.png"
import ForceGraph from "./dataViz/BasicForce";
import { IData } from "./testData/leMis";

const { Header, Content, Sider } = Layout;
const { Option, OptGroup } = Select;

export default class App extends React.Component<{}, {}> {
  
  public state = {
    collapsed: false,
    currentFetch: 'paths',
    data: null,
    depth: 1,
    height: 0,
    search: [],
    selectedFetch: 'paths',
    value1: '',
    value2: '',
    width: 0
  };

  public divElement: any = {};

  
  public componentDidMount() {

    const height = this.divElement.clientHeight;
    const width = this.divElement.clientWidth;

    Axios.post('http://localhost:3005/api/surroundings', { source: 'Mammal', distance: 1 })
      .then(({ data }) => {
        const graphData: IData = data;

        Axios.get('http://localhost:3005/api/nodesList')
          // tslint:disable-next-line:no-shadowed-variable
          .then(( { data } ) => {
            const searchOpts: string[] = data;

            this.setState({
              data: graphData,
              height,
              search: searchOpts,
              width,
            })
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }


  public render() {
    const { data, search } = this.state;

      return (
        <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
          <Sider
            trigger={null}
            collapsible={true}
            collapsed={this.state.collapsed}
          >
            {
              this.state.collapsed ?
                <img src={Logo} style={{ width: '60%', marginLeft: '20%', marginRight: '20%', marginTop: '4px', marginBottom: '4px' }} /> :
                <Row align={"middle"}>
                  <Col span={18} push={6} >
                    <h1 style={{ color: 'silver', paddingLeft: '10%', fontSize: 40, letterSpacing: '.03em', fontWeight: 400 }}>
                      ZAIRE
                </h1>
                  </Col>
                  <Col span={6} pull={18}>
                    <img src={Logo} style={{ width: '80%', marginLeft: '30%', marginRight: '30%', marginTop: '4px', marginBottom: '4px' }} />
                  </Col>
                </Row>
            }
            <Menu 
              theme="dark" 
              defaultSelectedKeys={['paths']} 
              mode="inline"
              onSelect={this.handleSelect}
              selectedKeys={[this.state.currentFetch]}
            >
              <Menu.Item key="paths">
                <Icon type="pie-chart" />
                <span>Paths</span>
              </Menu.Item>
              <Menu.Item key="path">
                <Icon type="desktop" />
                <span>Shortest Path</span>
              </Menu.Item>
              <Menu.Item key="surroundings">
                <Icon type="desktop" />
                <span>Surrounding</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Row align="middle" gutter={16} style={{ paddingTop: 4, paddingBottom: 4}}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                  style={{ width: '6rem' }}
                />
                <Autocomplete
                  className="ant-input"
                  items={search}
                  shouldItemRender={(item: any, value: any) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                  getItemValue={(item: any) => item.label}
                  renderItem={(item: any, highlighted: any) =>
                    <div
                      key={item.id}
                      style={{ backgroundColor: highlighted ? '#eee' : 'transparent' }}
                    >
                      {item.label}
                    </div>
                  }
                  value={this.state.value1}
                  onChange={(e: any) => this.setState({ value1: e.target.value })}
                  onSelect={(value1: any) => this.setState({ value1 })}
                  style={{}}
                />
                {
                  this.state.currentFetch === 'surroundings' ?
                    (<Select
                      defaultValue="1"
                      style={{ width: 200 }}
                      onChange={this.handleChange}
                    >
                      <OptGroup label="Depth">
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                      </OptGroup>
                    </Select>) :
                    (<Autocomplete
                      items={search}
                      shouldItemRender={(item: any, value: any) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                      getItemValue={(item: any) => item.label}
                      renderItem={(item: any, highlighted: any) =>
                        <div
                          key={item.id}
                          style={{ backgroundColor: highlighted ? '#eee' : 'transparent' }}
                        >
                          {item.label}
                        </div>
                      }
                      value={this.state.value2}
                      onChange={(e: any) => this.setState({ value2: e.target.value })}
                      onSelect={(value2: any) => this.setState({ value2 })}
                    />)
                }
                <Button
                  onClick={ 
                    this.state.currentFetch === 'paths' ?
                      this.postPaths :
                      this.state.currentFetch === 'path' ?
                      this.postPath :
                      this.postSurroundings
                  }
                  type={"primary"}
                >
                  Submit
              </Button>
              </Row>
            </Header>
              {data !== null ? 
                (
                <Content
                  style={{ margin: '24px 24px', padding: 24, background: '#fff', width: '92vw', height: '100vh'}}
                  >
                    <div ref={ divElement => {this.divElement = divElement}} style={{ height: '100vh', width: `${!this.state.collapsed ? '94vw' : '90vw'}` }}>
                      <ForceGraph width={this.state.width} height={this.state.height} data={data}/>
                    </div>
                  </Content>) :
                (<Content>  
                  <div ref={ divElement => {this.divElement = divElement}} style={{ height: '100vh', width: '90vw' }}>
                    <Spin size="large" />
                  </div>
                </Content>)
              }
          </Layout>
        </Layout>
      );
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
    Axios.post('http://localhost:3005/api/surroundings', { source: this.state.value1, distance: this.state.depth })
    // tslint:disable-next-line:no-shadowed-variable
    .then(({ data }) => {
      const graphData: IData = data;
      this.setState({
        data: graphData,
      })
    })
    .catch((err) => console.error(err));
  }

  private toggle = () => {

    const height = this.divElement.clientHeight;
    const width = this.divElement.clientWidth;

    this.setState({
      collapsed: !this.state.collapsed,
      height,
      width,
    });
  }

  private handleSelect = (e: any) => {
    this.setState({
      currentFetch: e.key,
    });
  }

  private handleChange = (e: any) => {
    this.setState({
      // tslint:disable-next-line:radix
      depth: parseInt(e)
    });
  }

}