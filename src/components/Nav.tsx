import { Col, Icon, Layout, Menu, Row } from "antd";
import * as React from "react";
// import { Icon as FA } from "react-fa";
import * as Logo from "../assets/zaire.logo.png"


const { Sider } = Layout;

interface INavProps {
  collapsed: boolean;
  select: (e: any) => void;
  view: string;
}

const Nav = (props: INavProps) => (
  <Sider
    trigger={null}
    collapsible={true}
    collapsed={props.collapsed}
  >
    <div style={{ paddingTop: 8 }}>
      {
        props.collapsed ?
          <img src={Logo} style={{ width: '60%', marginLeft: '20%', marginRight: '20%', marginBottom: '4px' }} /> :
          <Row align={"middle"}>
            <Col span={18} push={6} >
              <h1 style={{ color: '#E6F7FF', paddingLeft: '14%', fontSize: 40, letterSpacing: '.04em', fontWeight: 400, fontFamily: 'Avenir', verticalAlign: 'middle' }}>
                ZAIRE
            </h1>
            </Col>
            <Col span={6} pull={18}>
              <img src={Logo} style={{ width: '80%', marginLeft: '30%', marginRight: '30%', marginTop: '4px', marginBottom: '4px' }} />
            </Col>
          </Row>
      }
    </div>
    <Menu
      theme="dark"
      defaultSelectedKeys={["surroundings"]}
      mode="inline"
      onSelect={props.select}
      selectedKeys={[props.view]}
    >
      <Menu.Item key="surroundings">
        <Icon type="global" style={{ fontSize: 20 }} />
        {/* <FA name="asterisk" style={{ paddingRight: 12 }}/> */}
        <span>Surroundings</span>
      </Menu.Item>
      <Menu.Item key="paths">
        {/* <FA name="exchange" style={{ paddingRight: 12 }}/> */}
        <Icon type="verticle-left" style={{ paddingLeft: -2, marginLeft: -2, paddingRight: -6, marginRight: -6, fontSize: 20 }} />
        <Icon type="verticle-right" style={{ paddingLeft: -6, marginLeft: -6, fontSize: 20 }} />
        <span>Paths</span>
      </Menu.Item>
      <Menu.Item key="path">
        <Icon type="swap" style={{ fontSize: 20 }}/>
        {/* <FA name="genderless" style={{ paddingRight: 12 }}/> */}
        <span>Shortest Path</span>
      </Menu.Item>
    </Menu>
  </Sider>
)

export default Nav;