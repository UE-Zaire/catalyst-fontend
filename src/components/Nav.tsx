import { Col, Icon, Layout, Menu, Row } from "antd";
import * as React from "react";
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
    {
      props.collapsed ?
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
      defaultSelectedKeys={["surroundings"]}
      mode="inline"
      onSelect={props.select}
      selectedKeys={[props.view]}
    >
      <Menu.Item key="surroundings">
        <Icon type="desktop" />
        <span>Surroundings</span>
      </Menu.Item>
      <Menu.Item key="paths">
        <Icon type="pie-chart" />
        <span>Paths</span>
      </Menu.Item>
      <Menu.Item key="path">
        <Icon type="desktop" />
        <span>Shortest Path</span>
      </Menu.Item>
    </Menu>
  </Sider>
)

export default Nav;